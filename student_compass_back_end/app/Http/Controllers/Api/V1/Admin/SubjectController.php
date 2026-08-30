<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $subjects = Subject::withCount(['units', 'lessons', 'questions'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:subjects,code',
            'grade_level' => 'nullable|string|max:100',
            'track' => 'nullable|string|max:100',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $subject = Subject::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء المادة الدراسية بنجاح.',
            'data' => $subject,
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, int $id)
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'nullable|string|max:50|unique:subjects,code,' . $id,
            'grade_level' => 'nullable|string|max:100',
            'track' => 'nullable|string|max:100',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $subject->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات المادة الدراسية بنجاح.',
            'data' => $subject,
        ]);
    }

    public function destroy(int $id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المادة الدراسية بنجاح.',
        ]);
    }
}
