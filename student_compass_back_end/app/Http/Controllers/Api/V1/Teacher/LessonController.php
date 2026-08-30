<?php

namespace App\Http\Controllers\Api\V1\Teacher;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use App\Infrastructure\Services\FileStorageService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LessonController extends Controller
{
    public function __construct(
        private FileStorageService $fileStorageService
    ) {}

    public function store(Request $request)
    {
        $request->validate([
            'unit_id' => 'required|integer|exists:units,id',
            'subject_id' => 'required|integer|exists:subjects,id',
            'title' => 'required|string|max:255',
            'lesson_number' => 'nullable|integer',
            'order' => 'nullable|integer',
            'summary' => 'nullable|string',
            'video_url' => 'nullable|string|max:500',
            'pdf_file' => 'nullable|file|mimes:pdf|max:20480', // حتى 20 ميجابايت
        ]);

        $pdfPath = null;
        if ($request->hasFile('pdf_file')) {
            $pdfPath = $request->file('pdf_file')->store('lessons/pdfs', 'public');
        }

        $lesson = Lesson::create([
            'unit_id' => $request->input('unit_id'),
            'subject_id' => $request->input('subject_id'),
            'title' => $request->input('title'),
            'lesson_number' => $request->input('lesson_number', 1),
            'order' => $request->input('order', 0),
            'summary' => $request->input('summary'),
            'video_url' => $request->input('video_url'),
            'pdf_path' => $pdfPath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الدرس وإرفاق محتوياته بنجاح.',
            'data' => $lesson,
        ], Response::HTTP_CREATED);
    }

    /**
     * تحديث بيانات الدرس مع فحص الملفات:
     * - إذا تم رفع ملف PDF جديد: يتم استبدال القديم وحذفه من التخزين.
     * - إذا لم يتم رفع ملف PDF جديد: يتم الإبقاء على ملف الـ PDF القديم دون مساس.
     */
    public function update(Request $request, int $id)
    {
        $lesson = Lesson::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'lesson_number' => 'nullable|integer',
            'order' => 'nullable|integer',
            'summary' => 'nullable|string',
            'video_url' => 'nullable|string|max:500',
            'pdf_file' => 'nullable|file|mimes:pdf|max:20480',
        ]);

        // فحص الملف واستبداله أو الإبقاء عليه
        $pdfFile = $request->file('pdf_file');
        $updatedPdfPath = $this->fileStorageService->updateOrKeepFile($pdfFile, $lesson->pdf_path, 'lessons/pdfs');

        $lesson->update([
            'title' => $request->input('title', $lesson->title),
            'lesson_number' => $request->input('lesson_number', $lesson->lesson_number),
            'order' => $request->input('order', $lesson->order),
            'summary' => $request->input('summary', $lesson->summary),
            'video_url' => $request->input('video_url', $lesson->video_url),
            'pdf_path' => $updatedPdfPath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات الدرس والمحتويات بنجاح.',
            'data' => $lesson,
        ]);
    }
}
