<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\Bookmark;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Database\Seeder;

class BookmarkSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $questions = Question::with('subject', 'unit', 'lesson')->limit(10)->get();

        if ($questions->isEmpty() || $students->isEmpty()) {
            return;
        }

        $sampleNotes = [
            'سؤال وزاري متكرر وهام جداً في الامتحان النهائي.',
            'يحتاج مراجعة القانون الرياضي وخطوات التعويض.',
            'فكرة ذكية تعتمد على التناسب العكسي.',
            'ملاحظة: تذكر مراجعة شروط التجربة المعملية.',
            'سؤال تميز يحتاج تركيز عالي في استبعاد الخيارات.',
        ];

        foreach ($students as $student) {
            // حفظ 4-5 أسئلة لكل طالب
            $selectedQuestions = $questions->random(min(5, $questions->count()));

            foreach ($selectedQuestions as $index => $q) {
                Bookmark::updateOrCreate(
                    [
                        'user_id' => $student->id,
                        'question_id' => $q->id,
                    ],
                    [
                        'notes' => $sampleNotes[$index % count($sampleNotes)],
                    ]
                );
            }
        }
    }
}
