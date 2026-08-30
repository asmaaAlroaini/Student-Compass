<?php

namespace App\Infrastructure\Services;

use App\Infrastructure\Persistence\Eloquent\Models\Question;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class QuestionBulkImportService
{
    /**
     * تحويل ملف CSV المرفوع إلى مصفوفة بيانات مهيكلة
     */
    public function parseCsvFile(UploadedFile $file): array
    {
        $content = file_get_contents($file->getRealPath());

        // إزالة الـ UTF-8 BOM إن وجد
        $bom = pack('H*', 'EFBBBF');
        $content = preg_replace("/^$bom/", '', $content);

        $lines = preg_split('/\r\n|\r|\n/', trim($content));
        if (empty($lines)) {
            return [];
        }

        // الكشف التلقائي عن الفاصل (Delimiter)
        $firstLine = $lines[0];
        $delimiter = ',';
        if (substr_count($firstLine, ';') > substr_count($firstLine, ',')) {
            $delimiter = ';';
        } elseif (substr_count($firstLine, "\t") > substr_count($firstLine, ',')) {
            $delimiter = "\t";
        }

        $headers = str_getcsv(array_shift($lines), $delimiter);
        $normalizedHeaders = array_map(function ($h) {
            $cleaned = trim(mb_strtolower($h));
            return match ($cleaned) {
                'subject_id', 'المادة', 'رقم_المادة' => 'subject_id',
                'unit_id', 'الوحدة', 'رقم_الوحدة' => 'unit_id',
                'lesson_id', 'الدرس', 'رقم_الدرس' => 'lesson_id',
                'question_text', 'السؤال', 'نص_السؤال' => 'question_text',
                'type', 'النوع' => 'type',
                'option_a', 'الخيار_أ', 'الخيار_1' => 'option_a',
                'option_b', 'الخيار_ب', 'الخيار_2' => 'option_b',
                'option_c', 'الخيار_ج', 'الخيار_3' => 'option_c',
                'option_d', 'الخيار_د', 'الخيار_4' => 'option_d',
                'options', 'الخيارات' => 'options',
                'correct_answer', 'الإجابة_الصحيحة', 'الاجابة_الصحيحة' => 'correct_answer',
                'explanation', 'التفسير', 'الشرح' => 'explanation',
                'difficulty', 'الصعوبة', 'مستوى_الصعوبة' => 'difficulty',
                'year', 'السنة', 'السنة_الوزارية' => 'year',
                'source', 'المصدر' => 'source',
                'points', 'الدرجة', 'النقاط' => 'points',
                default => $cleaned,
            };
        }, $headers);

        $rows = [];
        foreach ($lines as $line) {
            if (empty(trim($line))) continue;

            $data = str_getcsv($line, $delimiter);
            if (count($data) < count($normalizedHeaders)) {
                $data = array_pad($data, count($normalizedHeaders), null);
            }

            $row = array_combine($normalizedHeaders, array_slice($data, 0, count($normalizedHeaders)));

            // دمج الخيارات المنفصلة (option_a, option_b, option_c, option_d) في مصفوفة options إن لم تكن مجهزة
            if (empty($row['options']) && (isset($row['option_a']) || isset($row['option_b']))) {
                $optionsList = [];
                if (!empty($row['option_a'])) $optionsList['A'] = trim($row['option_a']);
                if (!empty($row['option_b'])) $optionsList['B'] = trim($row['option_b']);
                if (!empty($row['option_c'])) $optionsList['C'] = trim($row['option_c']);
                if (!empty($row['option_d'])) $optionsList['D'] = trim($row['option_d']);
                $row['options'] = $optionsList;
            }

            $rows[] = $row;
        }

        return $rows;
    }

    /**
     * معايرة وفحص ملف الأسئلة قبل الاستيراد (Preview & Validation & Duplicate Detection)
     */
    public function previewAndValidate(array $rows): array
    {
        $totalCount = count($rows);
        $validQuestions = [];
        $invalidQuestions = [];
        $duplicates = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 1;
            
            // 1. التحقق من وجود الحقول الأساسية (Validation)
            if (empty($row['question_text']) || empty($row['correct_answer']) || empty($row['subject_id']) || empty($row['lesson_id'])) {
                $invalidQuestions[] = [
                    'row' => $rowNumber,
                    'question_text' => $row['question_text'] ?? 'غير معرف',
                    'reason' => 'الحقول الأساسية ناقصة (نص السؤال، الإجابة الصحيحة، المادة، والدرس مطلوبة).',
                ];
                continue;
            }

            // 2. الكشف عن التكرار في قاعدة البيانات (Duplicate Detection)
            $isDuplicateInDb = Question::where('subject_id', (int) $row['subject_id'])
                ->where('lesson_id', (int) $row['lesson_id'])
                ->where('question_text', trim($row['question_text']))
                ->exists();

            if ($isDuplicateInDb) {
                $duplicates[] = [
                    'row' => $rowNumber,
                    'question_text' => $row['question_text'],
                    'reason' => 'السؤال موجود مسبقاً في بنك الأسئلة لنفس المادة والدرس.',
                ];
            }

            // معالجة الخيارات
            $options = $row['options'] ?? [];
            if (is_string($options)) {
                $decoded = json_decode($options, true);
                $options = is_array($decoded) ? $decoded : ['A' => $row['option_a'] ?? '', 'B' => $row['option_b'] ?? '', 'C' => $row['option_c'] ?? '', 'D' => $row['option_d'] ?? ''];
            }

            $validQuestions[] = [
                'row' => $rowNumber,
                'subject_id' => (int) $row['subject_id'],
                'unit_id' => (int) ($row['unit_id'] ?? 1),
                'lesson_id' => (int) $row['lesson_id'],
                'question_text' => trim($row['question_text']),
                'type' => $row['type'] ?? 'mcq',
                'options' => $options,
                'correct_answer' => trim($row['correct_answer']),
                'explanation' => $row['explanation'] ?? null,
                'difficulty' => in_array($row['difficulty'] ?? '', ['easy', 'medium', 'hard']) ? $row['difficulty'] : 'medium',
                'year' => !empty($row['year']) ? (int) $row['year'] : null,
                'source' => !empty($row['source']) ? trim($row['source']) : 'وزاري عام',
                'points' => (int) ($row['points'] ?? 1),
                'is_duplicate' => $isDuplicateInDb,
            ];
        }

        return [
            'summary' => [
                'total_found' => $totalCount,
                'valid_count' => count($validQuestions),
                'invalid_count' => count($invalidQuestions),
                'duplicate_count' => count($duplicates),
            ],
            'valid_items' => $validQuestions,
            'invalid_items' => $invalidQuestions,
            'duplicates' => $duplicates,
        ];
    }

    /**
     * اعتماد وتأكيد استيراد الأسئلة الجماعي دفعة واحدة (Chunked Bulk Insert لـ 50,000+ سؤال)
     */
    public function confirmImport(array $questionsData, int $userId): int
    {
        return DB::transaction(function () use ($questionsData, $userId) {
            $now = now();
            $chunks = array_chunk($questionsData, 500);
            $totalInserted = 0;

            foreach ($chunks as $chunk) {
                $insertData = [];
                foreach ($chunk as $item) {
                    $insertData[] = [
                        'subject_id' => $item['subject_id'],
                        'unit_id' => $item['unit_id'] ?? 1,
                        'lesson_id' => $item['lesson_id'],
                        'question_text' => $item['question_text'],
                        'type' => $item['type'] ?? 'mcq',
                        'options' => is_array($item['options']) ? json_encode($item['options'], JSON_UNESCAPED_UNICODE) : $item['options'],
                        'correct_answer' => $item['correct_answer'],
                        'explanation' => $item['explanation'] ?? null,
                        'difficulty' => $item['difficulty'] ?? 'medium',
                        'year' => $item['year'] ?? null,
                        'source' => $item['source'] ?? 'وزاري عام',
                        'points' => $item['points'] ?? 1,
                        'is_active' => true,
                        'created_by' => $userId,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                Question::insert($insertData);
                $totalInserted += count($insertData);
            }

            return $totalInserted;
        });
    }

    /**
     * إنشاء محتوى القالب القياسي للـ CSV
     */
    public function generateTemplateCsv(): string
    {
        $headers = [
            'subject_id',
            'unit_id',
            'lesson_id',
            'question_text',
            'option_a',
            'option_b',
            'option_c',
            'option_d',
            'correct_answer',
            'explanation',
            'difficulty',
            'year',
            'source',
            'points'
        ];

        $sampleRow = [
            '1',
            '1',
            '1',
            'ما هي الوحدة الأساسية لقياس شدة التيار الكهربائي؟',
            'الفولت',
            'الأمبير',
            'الأوم',
            'الواط',
            'الأمبير',
            'الأمبير هو وحدة قياس شدة التيار الكهربائي في النظام الدولي SI.',
            'medium',
            '2024',
            'وزاري صنعاء',
            '1'
        ];

        $output = fopen('php://temp', 'r+');
        // كتابة UTF-8 BOM للتوافق التام مع Excel
        fputs($output, "\xEF\xBB\xBF");
        fputcsv($output, $headers);
        fputcsv($output, $sampleRow);
        rewind($output);

        $csv = stream_get_contents($output);
        fclose($output);

        return $csv;
    }
}
