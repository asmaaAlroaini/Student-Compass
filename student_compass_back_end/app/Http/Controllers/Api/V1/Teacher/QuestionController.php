<?php

namespace App\Http\Controllers\Api\V1\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Teacher\StoreQuestionRequest;
use App\Domain\Repositories\QuestionRepositoryInterface;
use App\Infrastructure\Services\FileStorageService;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class QuestionController extends Controller
{
    public function __construct(
        private QuestionRepositoryInterface $questionRepository,
        private FileStorageService $fileStorageService
    ) {}

    /**
     * استعراض والبحث في بنك الأسئلة للوحة التحكم مع الفلترة الشاملة
     */
    public function index(Request $request)
    {
        $query = Question::with(['subject:id,name', 'unit:id,title', 'lesson:id,title']);

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }
        if ($request->filled('unit_id')) {
            $query->where('unit_id', $request->input('unit_id'));
        }
        if ($request->filled('lesson_id')) {
            $query->where('lesson_id', $request->input('lesson_id'));
        }
        if ($request->filled('year')) {
            $query->where('year', $request->input('year'));
        }
        if ($request->filled('source')) {
            $query->where('source', 'like', '%' . $request->input('source') . '%');
        }
        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->input('difficulty'));
        }
        if ($request->filled('search')) {
            $query->where('question_text', 'like', '%' . $request->input('search') . '%');
        }

        $questions = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $questions,
        ]);
    }

    /**
     * عرض تفاصيل سؤال محدد
     */
    public function show(int $id)
    {
        $question = Question::with(['subject:id,name', 'unit:id,title', 'lesson:id,title'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $question,
        ]);
    }

    public function store(StoreQuestionRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;

        // إسناد الدرس الأول من الوحدة في حال لم يتم تحديد درس معين
        if (empty($validated['lesson_id']) && !empty($validated['unit_id'])) {
            $firstLesson = Lesson::where('unit_id', $validated['unit_id'])->first();
            if ($firstLesson) {
                $validated['lesson_id'] = $firstLesson->id;
            }
        }

        // معالجة الخيارات
        if ($request->has('options') && is_array($request->input('options'))) {
            $validated['options'] = array_values($request->input('options'));
        }

        if ($request->hasFile('question_image_file')) {
            $validated['question_image'] = $request->file('question_image_file')->store('questions/images', 'public');
        }

        $question = $this->questionRepository->createQuestion($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة السؤال إلى بنك الأسئلة بنجاح.',
            'data' => $question->load(['subject:id,name', 'unit:id,title', 'lesson:id,title']),
        ], Response::HTTP_CREATED);
    }

    /**
     * تحديث بيانات السؤال مع الفحص الذكي للصور والتحقق من العلاقات
     */
    public function update(Request $request, int $id)
    {
        $question = Question::findOrFail($id);

        $validated = $request->validate([
            'subject_id' => 'sometimes|nullable|integer|exists:subjects,id',
            'unit_id' => 'sometimes|nullable|integer|exists:units,id',
            'lesson_id' => 'sometimes|nullable|integer|exists:lessons,id',
            'question_text' => 'sometimes|required|string|min:3',
            'type' => 'sometimes|required|string|in:mcq,true_false,essay',
            'options' => 'nullable',
            'correct_answer' => 'sometimes|required|string',
            'explanation' => 'nullable|string',
            'difficulty' => 'sometimes|required|string|in:easy,medium,hard',
            'year' => 'nullable|integer',
            'source' => 'nullable|string|max:255',
            'points' => 'sometimes|nullable|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ], [
            'subject_id.exists' => 'المادة الدراسية المحددة غير موجودة.',
            'unit_id.exists' => 'الوحدة الدراسية المحددة غير موجودة.',
            'lesson_id.exists' => 'الدرس المحدد غير موجود.',
            'question_text.required' => 'نص السؤال مطلوب ولا يمكن تركه فارغاً.',
            'question_text.min' => 'يجب أن يحتوي نص السؤال على 3 أحرف على الأقل.',
            'correct_answer.required' => 'يرجى تحديد الإجابة الصحيحة.',
        ]);

        $data = $validated;

        // تنظيف ومعالجة الحقول الصفرية أو غير الموجودة لمنع كسر قيود قاعدة البيانات
        if (isset($data['subject_id']) && (int) $data['subject_id'] === 0) {
            unset($data['subject_id']);
        }
        if (isset($data['unit_id']) && (int) $data['unit_id'] === 0) {
            unset($data['unit_id']);
        }
        if (isset($data['lesson_id']) && (int) $data['lesson_id'] === 0) {
            unset($data['lesson_id']);
        }

        // معالجة الخيارات
        if ($request->has('options')) {
            $rawOptions = $request->input('options');
            if (is_array($rawOptions)) {
                $data['options'] = array_values($rawOptions);
            }
        }

        // معالجة رفع واستبدال الصورة
        $imageFile = $request->file('question_image_file');
        if ($imageFile) {
            $data['question_image'] = $this->fileStorageService->updateOrKeepFile($imageFile, $question->question_image, 'questions/images');
        } elseif ($request->has('question_image') && $request->input('question_image') === '') {
            $data['question_image'] = null;
        }

        $updatedQuestion = $this->questionRepository->updateQuestion($id, $data);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات السؤال بنجاح.',
            'data' => $updatedQuestion->load(['subject:id,name', 'unit:id,title', 'lesson:id,title']),
        ]);
    }

    /**
     * حذف سؤال من بنك الأسئلة
     */
    public function destroy(int $id)
    {
        $question = Question::findOrFail($id);
        $question->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف السؤال من بنك الأسئلة بنجاح.',
        ]);
    }
}
