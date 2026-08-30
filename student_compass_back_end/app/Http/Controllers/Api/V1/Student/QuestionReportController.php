<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Student\CreateQuestionReportRequest;
use App\Infrastructure\Persistence\Eloquent\Models\QuestionReport;
use Symfony\Component\HttpFoundation\Response;

class QuestionReportController extends Controller
{
    public function store(CreateQuestionReportRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'pending';

        $report = QuestionReport::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم استلام بلاغك حول السؤال وسيقوم الفريق العلمي بمراجعته.',
            'data' => $report,
        ], Response::HTTP_CREATED);
    }
}
