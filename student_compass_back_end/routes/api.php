<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EducationalOptionsController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\Student\HomeDashboardController;
use App\Http\Controllers\Api\V1\Student\SubjectController;
use App\Http\Controllers\Api\V1\Student\QuestionBankController;
use App\Http\Controllers\Api\V1\Student\ExamController;
use App\Http\Controllers\Api\V1\Student\CustomExamController;
use App\Http\Controllers\Api\V1\Student\CompetitionController as StudentCompetitionController;
use App\Http\Controllers\Api\V1\Student\StudentProgressController;
use App\Http\Controllers\Api\V1\Student\StudyPlanController;
use App\Http\Controllers\Api\V1\Student\IncorrectQuestionsController;
use App\Http\Controllers\Api\V1\Student\BookmarkController;
use App\Http\Controllers\Api\V1\Student\QuestionReportController;
use App\Http\Controllers\Api\V1\Teacher\LessonController as TeacherLessonController;
use App\Http\Controllers\Api\V1\Teacher\QuestionController as TeacherQuestionController;
use App\Http\Controllers\Api\V1\Teacher\QuestionBulkImportController;
use App\Http\Controllers\Api\V1\Teacher\ExamController as TeacherExamController;
use App\Http\Controllers\Api\V1\Teacher\CompetitionController as TeacherCompetitionController;
use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\NotificationManagementController as AdminNotificationManagementController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Api\V1\Admin\SubjectController as AdminSubjectController;
use App\Http\Controllers\Api\V1\Admin\UnitController as AdminUnitController;

/*
|--------------------------------------------------------------------------
| API Routes - Student Compass (بوصلة الطالب)
| Clean Architecture & Complete Production Endpoints
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // 1. المسارات العامة للتوثيق واستعادة الحساب (Public Auth & Password Reset)
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::get('/educational-options', [EducationalOptionsController::class, 'index']);
        
        // استعادة كلمة المرور عبر رمز التحقق (Password Reset Flow)
        Route::post('/reset-password-request', [AuthController::class, 'resetPasswordRequest']);
        Route::post('/verify-reset-code', [AuthController::class, 'verifyResetCode']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    // 2. المسارات المحمية التابعة للمستخدمين المسجلين (Authenticated Endpoints)
    Route::middleware(['auth:sanctum', 'active'])->group(function () {

        // مصادقة الحساب والملف الشخصي وتغيير كلمة المرور وتفضيلات النظام
        Route::prefix('auth')->group(function () {
            Route::get('/profile', [AuthController::class, 'profile']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/change-password', [AuthController::class, 'changePassword']);
            Route::get('/settings', [AuthController::class, 'getSettings']);
            Route::put('/settings', [AuthController::class, 'updateSettings']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });

        // الإشعارات والتنبيهات للطالب
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);

        // --- أ) مسارات الطلاب (Student Endpoints) ---
        Route::middleware(['role:student'])->prefix('student')->group(function () {
            // الشاشة الرئيسية المجمعة فائقة الأداء (Home Dashboard)
            Route::get('/home', [HomeDashboardController::class, 'index']);
            Route::get('/dashboard', [HomeDashboardController::class, 'index']);

            // المنهج والمواد والدروس ورحلة التعلم ذات الـ 5 مراحل
            Route::get('/subjects', [SubjectController::class, 'index']);
            Route::get('/subjects/{subject}/units', [SubjectController::class, 'units']);
            Route::get('/subjects/{subject}/units/{unit}/lessons', [SubjectController::class, 'lessons']);
            Route::get('/lessons/{lesson}', [SubjectController::class, 'lessonDetails']);
            Route::post('/lessons/{lesson}/progress', [SubjectController::class, 'updateLessonProgress']);
            Route::get('/lessons/{lesson}/questions', [QuestionBankController::class, 'getByLesson']);
            
            // الامتحانات والتصحيح والامتحان المخصص
            Route::get('/exams', [ExamController::class, 'index']);
            Route::get('/exams/{exam}', [ExamController::class, 'show']);
            Route::get('/exams/{exam}/results', [ExamController::class, 'results']);
            Route::post('/exams/custom', [CustomExamController::class, 'generate']);
            Route::post('/exams/{exam}/submit', [ExamController::class, 'submit']);
            
            // المسابقات ولوحة المتصدرين
            Route::get('/competitions', [StudentCompetitionController::class, 'index']);
            Route::get('/competitions/leaderboard/{competitionId?}', [StudentCompetitionController::class, 'leaderboard']);
            Route::get('/competitions/{id}/leaderboard', [StudentCompetitionController::class, 'leaderboard']);
            Route::get('/competitions/{id}/start', [StudentCompetitionController::class, 'show']);
            Route::get('/competitions/{id}', [StudentCompetitionController::class, 'show']);
            Route::post('/competitions/{id}/submit', [StudentCompetitionController::class, 'submit']);

            // خطتي والتهيئة الأولى (Study Plan, Onboarding & Dynamic Tasks)
            Route::get('/study-plan', [StudyPlanController::class, 'index']);
            Route::post('/study-plan/onboarding', [StudyPlanController::class, 'onboarding']);
            Route::post('/study-plan/recalculate', [StudyPlanController::class, 'recalculate']);
            Route::put('/study-tasks/{task}/status', [StudyPlanController::class, 'updateTaskStatus']);

            // أخطائي (Incorrect Questions Review & Re-solving)
            Route::get('/incorrect-questions', [IncorrectQuestionsController::class, 'index']);
            
            // التراكمي والمفضلات والبلاغات
            Route::get('/progress', [StudentProgressController::class, 'index']);
            Route::get('/bookmarks', [BookmarkController::class, 'index']);
            Route::post('/bookmarks/toggle', [BookmarkController::class, 'toggle']);
            Route::post('/reports', [QuestionReportController::class, 'store']);
        });

        // --- ب) مسارات المعلمين والمشرفين (Teacher & Supervisor Endpoints) ---
        Route::middleware(['role:teacher,supervisor,admin'])->prefix('teacher')->group(function () {
            // إدارة وتحديث الدروس والملفات والـ PDFs
            Route::post('/lessons', [TeacherLessonController::class, 'store']);
            Route::post('/lessons/{lesson}', [TeacherLessonController::class, 'update']);

            // إدارة الأسئلة الفردية والصور والفلترة والحذف
            Route::get('/questions', [TeacherQuestionController::class, 'index']);
            Route::get('/questions/template', [QuestionBulkImportController::class, 'template']);
            Route::get('/questions/{id}', [TeacherQuestionController::class, 'show']);
            Route::post('/questions', [TeacherQuestionController::class, 'store']);
            Route::post('/questions/{question}', [TeacherQuestionController::class, 'update']);
            Route::delete('/questions/{question}', [TeacherQuestionController::class, 'destroy']);
            
            // استيراد جماعي لـ 50 ألف سؤال (5-Stage Bulk Import + CSV Upload)
            Route::post('/questions/import-preview', [QuestionBulkImportController::class, 'preview']);
            Route::post('/questions/import-confirm', [QuestionBulkImportController::class, 'confirm']);

            // إدارة الامتحانات (CMS)
            Route::get('/exams', [TeacherExamController::class, 'index']);
            Route::get('/exams/{id}', [TeacherExamController::class, 'show']);
            Route::post('/exams', [TeacherExamController::class, 'store']);
            Route::put('/exams/{id}', [TeacherExamController::class, 'update']);
            Route::delete('/exams/{id}', [TeacherExamController::class, 'destroy']);

            // إدارة المسابقات (CMS)
            Route::get('/competitions', [TeacherCompetitionController::class, 'index']);
            Route::post('/competitions', [TeacherCompetitionController::class, 'store']);
            Route::put('/competitions/{id}', [TeacherCompetitionController::class, 'update']);
            Route::delete('/competitions/{id}', [TeacherCompetitionController::class, 'destroy']);
        });

        // --- ج) مسارات الأدمن والإدارة العليا (Admin Endpoints) ---
        Route::middleware(['role:admin'])->prefix('admin')->group(function () {
            // لوحة إحصائيات المنصة الشاملة
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);

            // إدارة المستخدمين والطلاب
            Route::get('/users', [AdminUserController::class, 'index']);
            Route::put('/users/{user}/status', [AdminUserController::class, 'updateStatus']);

            // إدارة ومعالجة البلاغات
            Route::get('/reports', [AdminReportController::class, 'index']);
            Route::put('/reports/{id}/resolve', [AdminReportController::class, 'resolve']);

            // بث وإدارة الإشعارات المركزية
            Route::get('/notifications', [AdminNotificationManagementController::class, 'index']);
            Route::post('/notifications', [AdminNotificationManagementController::class, 'store']);

            // إدارة المواد والوحدات (Subjects & Units CMS)
            Route::get('/subjects', [AdminSubjectController::class, 'index']);
            Route::post('/subjects', [AdminSubjectController::class, 'store']);
            Route::put('/subjects/{id}', [AdminSubjectController::class, 'update']);
            Route::delete('/subjects/{id}', [AdminSubjectController::class, 'destroy']);

            Route::get('/units', [AdminUnitController::class, 'index']);
            Route::post('/units', [AdminUnitController::class, 'store']);
            Route::put('/units/{id}', [AdminUnitController::class, 'update']);
            Route::delete('/units/{id}', [AdminUnitController::class, 'destroy']);
        });

    });
});
