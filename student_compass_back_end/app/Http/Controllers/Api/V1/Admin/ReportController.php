<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\QuestionReport;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'pending');

        $reports = QuestionReport::query()
            ->byStatus($status)
            ->with(['user:id,name,email', 'question:id,question_text,subject_id'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'status_filter' => $status,
            'data' => $reports,
        ]);
    }

    /**
     * معالجة أو رفض بلاغ عن سؤال
     */
    public function resolve(Request $request, int $id)
    {
        $report = QuestionReport::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:resolved,dismissed',
            'admin_notes' => 'nullable|string',
        ]);

        $report->status = $validated['status'];
        if ($request->has('admin_notes')) {
            $report->admin_notes = $validated['admin_notes'];
        }
        $report->save();

        $statusArabic = $report->status === 'resolved' ? 'تمت معالجته' : 'تم رفضه';

        return response()->json([
            'success' => true,
            'message' => "تم تحديث حالة البلاغ ({$statusArabic}) بنجاح.",
            'data' => $report,
        ]);
    }
}
