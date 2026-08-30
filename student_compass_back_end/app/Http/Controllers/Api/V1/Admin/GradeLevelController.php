<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\GradeLevel;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GradeLevelController extends Controller
{
    /**
     * عرض جميع الصفوف والمراحل الدراسية مع إحصائيات المواد والطلاب
     */
    public function index(Request $request): JsonResponse
    {
        $gradeLevels = GradeLevel::query()
            ->ordered()
            ->withCount(['subjects', 'students'])
            ->with(['subjects' => function ($query) {
                $query->select(['id', 'name', 'code', 'grade_level', 'track', 'is_active'])
                    ->withCount('units');
            }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $gradeLevels,
        ]);
    }

    /**
     * إضافة صف / مرحلة دراسية جديدة
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:grade_levels,name',
            'code' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
            'tracks' => 'nullable|array',
            'tracks.*' => 'string|max:50',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'nullable|boolean',
        ]);

        if (empty($validated['tracks'])) {
            $validated['tracks'] = ['عام'];
        }

        if (!isset($validated['order'])) {
            $maxOrder = GradeLevel::max('order') ?? 0;
            $validated['order'] = $maxOrder + 1;
        }

        $validated['is_active'] = $validated['is_active'] ?? true;

        $gradeLevel = GradeLevel::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الصف الدراسي بنجاح.',
            'data' => $gradeLevel,
        ], Response::HTTP_CREATED);
    }

    /**
     * تحديث بيانات الصف الدراسي
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $gradeLevel = GradeLevel::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:grade_levels,name,' . $id,
            'code' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
            'tracks' => 'nullable|array',
            'tracks.*' => 'string|max:50',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'nullable|boolean',
        ]);

        $oldName = $gradeLevel->name;
        $gradeLevel->update($validated);

        // إذا تم تغيير اسم الصف الدراسي، نحدث السجلات المرتبطة بالمواد والطلاب تلقائياً
        if (isset($validated['name']) && $validated['name'] !== $oldName) {
            Subject::where('grade_level', $oldName)->update(['grade_level' => $validated['name']]);
            User::where('grade_level', $oldName)->update(['grade_level' => $validated['name']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات الصف الدراسي بنجاح.',
            'data' => $gradeLevel->fresh(['subjects']),
        ]);
    }

    /**
     * حذف صف دراسي مع فحص الحماية
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $gradeLevel = GradeLevel::findOrFail($id);
        $force = $request->boolean('force', false);

        $subjectsCount = Subject::where('grade_level', $gradeLevel->name)->count();
        $studentsCount = User::where('role', 'student')->where('grade_level', $gradeLevel->name)->count();

        if (($subjectsCount > 0 || $studentsCount > 0) && !$force) {
            return response()->json([
                'success' => false,
                'message' => "لا يمكن حذف الصف الدراسي لوجود ({$subjectsCount}) مواد و ({$studentsCount}) طلاب مرتبطين به. قم بإعادة تعيينهم أولاً أو تأكيد الحذف الإجباري.",
                'requires_force' => true,
                'subjects_count' => $subjectsCount,
                'students_count' => $studentsCount,
            ], Response::HTTP_CONFLICT);
        }

        if ($force) {
            // فك ارتباط المواد بهذا الصف
            Subject::where('grade_level', $gradeLevel->name)->update(['grade_level' => null]);
        }

        $gradeLevel->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الصف الدراسي بنجاح.',
        ]);
    }

    /**
     * جلب المواد التابعة لصف دراسي محدد
     */
    public function getSubjects(int $id): JsonResponse
    {
        $gradeLevel = GradeLevel::findOrFail($id);

        $subjects = Subject::where('grade_level', $gradeLevel->name)
            ->withCount(['units', 'lessons', 'questions'])
            ->get();

        return response()->json([
            'success' => true,
            'grade_level' => $gradeLevel,
            'data' => $subjects,
        ]);
    }

    /**
     * تعيين / مزامنة المواد لصف دراسي وتحديد المسارات
     */
    public function assignSubjects(Request $request, int $id): JsonResponse
    {
        $gradeLevel = GradeLevel::findOrFail($id);

        $validated = $request->validate([
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'integer|exists:subjects,id',
            'track' => 'nullable|string|max:50',
            'assignments' => 'nullable|array',
            'assignments.*.subject_id' => 'required|integer|exists:subjects,id',
            'assignments.*.track' => 'nullable|string|max:50',
        ]);

        if (!empty($validated['assignments'])) {
            foreach ($validated['assignments'] as $assignment) {
                Subject::where('id', $assignment['subject_id'])->update([
                    'grade_level' => $gradeLevel->name,
                    'track' => $assignment['track'] ?? null,
                ]);
            }
        } elseif (isset($validated['subject_ids'])) {
            // تعيين المواد المحددة
            if (!empty($validated['subject_ids'])) {
                Subject::whereIn('id', $validated['subject_ids'])->update([
                    'grade_level' => $gradeLevel->name,
                    'track' => $validated['track'] ?? null,
                ]);
            }
        }

        $updatedSubjects = Subject::where('grade_level', $gradeLevel->name)->get();

        return response()->json([
            'success' => true,
            'message' => "تم تحديث وتعيين المواد للصف الدراسي ({$gradeLevel->name}) بنجاح.",
            'data' => $updatedSubjects,
        ]);
    }
}
