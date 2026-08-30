<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\Competition;
use App\Infrastructure\Persistence\Eloquent\Models\Exam;
use App\Infrastructure\Persistence\Eloquent\Models\Lesson;
use App\Infrastructure\Persistence\Eloquent\Models\Question;
use App\Infrastructure\Persistence\Eloquent\Models\QuestionReport;
use App\Infrastructure\Persistence\Eloquent\Models\StudentProgress;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use App\Infrastructure\Persistence\Eloquent\Models\Unit;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * لوحة إحصائيات المنصة الشاملة للإدارة العليا
     */
    public function index(Request $request)
    {
        $totalStudents = User::where('role', 'student')->count();
        $totalTeachers = User::whereIn('role', ['teacher', 'supervisor'])->count();
        $activeStudentsToday = User::where('role', 'student')->where('updated_at', '>=', now()->startOfDay())->count();

        $totalSubjects = Subject::count();
        $totalUnits = Unit::count();
        $totalLessons = Lesson::count();
        $totalQuestions = Question::count();
        $totalExams = Exam::count();
        $totalCompetitions = Competition::count();

        $totalExamAttempts = StudentProgress::count();
        $averagePlatformScore = $totalExamAttempts > 0 ? round(StudentProgress::avg('percentage'), 1) : 0;
        $pendingReports = QuestionReport::where('status', 'pending')->count();

        // أحدث الطلاب المسجلين
        $latestStudents = User::where('role', 'student')
            ->latest()
            ->take(5)
            ->select(['id', 'name', 'email', 'grade_level', 'track', 'is_active', 'created_at'])
            ->get();

        // أحدث محاولات الاختبارات
        $recentAttempts = StudentProgress::with(['user:id,name,avatar', 'exam:id,title'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'users_metrics' => [
                    'total_students' => $totalStudents,
                    'total_teachers' => $totalTeachers,
                    'active_students_today' => $activeStudentsToday,
                ],
                'curriculum_metrics' => [
                    'total_subjects' => $totalSubjects,
                    'total_units' => $totalUnits,
                    'total_lessons' => $totalLessons,
                    'total_questions' => $totalQuestions,
                    'total_exams' => $totalExams,
                    'total_competitions' => $totalCompetitions,
                ],
                'exams_metrics' => [
                    'total_exam_attempts' => $totalExamAttempts,
                    'average_score_percentage' => $averagePlatformScore,
                    'pending_reports_count' => $pendingReports,
                ],
                'latest_students' => $latestStudents,
                'recent_attempts' => $recentAttempts,
            ]
        ]);
    }
}
