<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\Unit;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UnitController extends Controller
{
    public function index(Request $request)
    {
        $query = Unit::with('subject:id,name')->withCount(['lessons', 'questions']);

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        $units = $query->orderBy('subject_id')->orderBy('order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $units,
        ]);
    }

    public function show(int $id)
    {
        $unit = Unit::with('subject:id,name')->withCount(['lessons', 'questions'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $unit,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|integer|exists:subjects,id',
            'title' => 'required|string|max:255',
            'unit_number' => 'nullable|integer|min:1',
            'order' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $unit = Unit::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الوحـدة الدراسية بنجاح.',
            'data' => $unit->load('subject:id,name'),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, int $id)
    {
        $unit = Unit::findOrFail($id);

        $validated = $request->validate([
            'subject_id' => 'sometimes|required|integer|exists:subjects,id',
            'title' => 'sometimes|required|string|max:255',
            'unit_number' => 'nullable|integer|min:1',
            'order' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $unit->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات الوحدة الدراسية بنجاح.',
            'data' => $unit->load('subject:id,name'),
        ]);
    }

    public function destroy(int $id)
    {
        $unit = Unit::findOrFail($id);
        $unit->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الوحدة الدراسية بنجاح.',
        ]);
    }
}
