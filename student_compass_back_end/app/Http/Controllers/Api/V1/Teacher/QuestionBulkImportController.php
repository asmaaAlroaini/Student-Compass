<?php

namespace App\Http\Controllers\Api\V1\Teacher;

use App\Http\Controllers\Controller;
use App\Infrastructure\Services\QuestionBulkImportService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class QuestionBulkImportController extends Controller
{
    public function __construct(
        private QuestionBulkImportService $importService
    ) {}

    /**
     * معايرة وفحص الأسئلة من ملف CSV أو من مصفوفة JSON
     */
    public function preview(Request $request)
    {
        $rows = [];

        if ($request->hasFile('csv_file')) {
            $file = $request->file('csv_file');
            $rows = $this->importService->parseCsvFile($file);
        } elseif ($request->filled('questions') && is_array($request->input('questions'))) {
            $rows = $request->input('questions');
        } else {
            return response()->json([
                'success' => false,
                'message' => 'يرجى إرفاق ملف CSV عبر حقل csv_file أو تمرير مصفوفة questions.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (empty($rows)) {
            return response()->json([
                'success' => false,
                'message' => 'الملف المرفوع فارغ أو تعذر قراءة الحقول المطلوبة.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $preview = $this->importService->previewAndValidate($rows);

        return response()->json([
            'success' => true,
            'message' => 'تم فحص ومعاينة ملف الأسئلة بنجاح.',
            'data' => $preview,
        ]);
    }

    /**
     * اعتماد وتأكيد استيراد الأسئلة بعد المعاينة والمراجعة
     */
    public function confirm(Request $request)
    {
        $request->validate([
            'questions' => 'required|array|min:1',
        ]);

        $userId = $request->user()->id;
        $importedCount = $this->importService->confirmImport($request->input('questions'), $userId);

        return response()->json([
            'success' => true,
            'message' => "تم استيراد واعتماد {$importedCount} سؤال بنجاح وإضافتها إلى بنك الأسئلة.",
            'imported_count' => $importedCount,
        ], Response::HTTP_CREATED);
    }

    /**
     * تنزيل قالب استيراد الأسئلة الموحد CSV/Excel
     */
    public function template()
    {
        $csvContent = $this->importService->generateTemplateCsv();

        return response($csvContent, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="student_compass_questions_template.csv"',
        ]);
    }
}
