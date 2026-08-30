import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import RoleGuard from './RoleGuard';

// ── Full-screen loader ──
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-muted-foreground text-sm font-medium">جاري التحميل...</span>
    </div>
  </div>
);

const s = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<PageLoader />}><Component /></Suspense>
);

// ── Lazy imports ──
// Landing
const HomePage = lazy(() => import('@/landing/pages/HomePage'));

// Auth pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const UnauthorizedPage = lazy(() => import('@/features/auth/pages/UnauthorizedPage'));

// Layouts
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));

// Dashboard Overview
const DashboardOverviewPage = lazy(() => import('@/features/dashboard/pages/DashboardOverviewPage'));

// Academic Structure
const AcademicStructurePage = lazy(() => import('@/features/academic-structure/pages/AcademicStructurePage'));

// Subjects & Curriculum
const SubjectsListPage = lazy(() => import('@/features/subjects/pages/SubjectsListPage'));
const SubjectDetailsPage = lazy(() => import('@/features/subjects/pages/SubjectDetailsPage'));
const CurriculumEditorPage = lazy(() => import('@/features/subjects/pages/CurriculumEditorPage'));

// Questions
const QuestionBankListPage = lazy(() => import('@/features/questions/pages/QuestionBankListPage'));
const QuestionCreatePage = lazy(() => import('@/features/questions/pages/QuestionCreatePage'));
const QuestionBulkImportPage = lazy(() => import('@/features/questions/pages/QuestionBulkImportPage'));

// Exams
const ExamsListPage = lazy(() => import('@/features/exams/pages/ExamsListPage'));
const ExamBuilderPage = lazy(() => import('@/features/exams/pages/ExamBuilderPage'));
const ExamResultsPage = lazy(() => import('@/features/exams/pages/ExamResultsPage'));

// Teachers
const TeachersListPage = lazy(() => import('@/features/teachers/pages/TeachersListPage'));
const TeacherDetailsPage = lazy(() => import('@/features/teachers/pages/TeacherDetailsPage'));

// Students
const StudentsListPage = lazy(() => import('@/features/students/pages/StudentsListPage'));
const StudentProfilePage = lazy(() => import('@/features/students/pages/StudentProfilePage'));

// Competitions
const CompetitionsListPage = lazy(() => import('@/features/competitions/pages/CompetitionsListPage'));
const CompetitionBuilderPage = lazy(() => import('@/features/competitions/pages/CompetitionBuilderPage'));
const LeaderboardPage = lazy(() => import('@/features/competitions/pages/LeaderboardPage'));

// Notifications
const NotificationsManagerPage = lazy(() => import('@/features/notifications/pages/NotificationsManagerPage'));
const CreateNotificationPage = lazy(() => import('@/features/notifications/pages/CreateNotificationPage'));

// Reports
const ReportsAnalyticsPage = lazy(() => import('@/features/reports/pages/ReportsAnalyticsPage'));

// Settings
const ProfileSettingsPage = lazy(() => import('@/features/settings/pages/ProfileSettingsPage'));
const SystemSettingsPage = lazy(() => import('@/features/settings/pages/SystemSettingsPage'));
const BackupManagerPage = lazy(() => import('@/features/settings/pages/BackupManagerPage'));

// ── Router ──
export const router = createBrowserRouter([
  // Landing
  { path: ROUTES.PUBLIC.LANDING, element: s(HomePage) },

  // Auth (Public — redirect if already logged in)
  {
    element: <PublicRoute />,
    children: [
      { path: ROUTES.PUBLIC.LOGIN, element: s(LoginPage) },
      { path: ROUTES.PUBLIC.FORGOT_PASSWORD, element: s(ForgotPasswordPage) },
    ],
  },

  // Unauthorized
  { path: ROUTES.PUBLIC.UNAUTHORIZED, element: s(UnauthorizedPage) },

  // ── Dashboard (Protected) ──
  {
    path: ROUTES.DASHBOARD.HOME,
    element: <ProtectedRoute allowedRoles={['admin', 'teacher', 'supervisor']} />,
    children: [
      {
        element: s(DashboardLayout),
        children: [
          // Index → overview
          { index: true, element: <Navigate to={ROUTES.DASHBOARD.OVERVIEW} replace /> },

          // Overview
          { path: 'overview', element: s(DashboardOverviewPage) },

          // Academic Structure (Admin Only)
          {
            path: 'academic-structure',
            element: <RoleGuard allowedRoles={['admin']} />,
            children: [
              { index: true, element: s(AcademicStructurePage) },
              { path: 'stages', element: s(AcademicStructurePage) },
              { path: 'tracks', element: s(AcademicStructurePage) },
              { path: 'classrooms', element: s(AcademicStructurePage) },
            ],
          },

          // Subjects & Curriculum
          {
            path: 'subjects',
            children: [
              { index: true, element: s(SubjectsListPage) },
              { path: ':subjectId', element: s(SubjectDetailsPage) },
              { path: ':subjectId/curriculum', element: s(CurriculumEditorPage) },
              { path: ':subjectId/units/:unitId/lessons/:lessonId', element: s(CurriculumEditorPage) },
            ],
          },

          // Question Bank
          {
            path: 'question-bank',
            children: [
              { index: true, element: s(QuestionBankListPage) },
              { path: 'create', element: s(QuestionCreatePage) },
              { path: 'edit/:questionId', element: s(QuestionCreatePage) },
              { path: 'bulk-import', element: s(QuestionBulkImportPage) },
            ],
          },

          // Exams
          {
            path: 'exams',
            children: [
              { index: true, element: s(ExamsListPage) },
              { path: 'create', element: s(ExamBuilderPage) },
              { path: 'edit/:examId', element: s(ExamBuilderPage) },
              { path: ':examId/results', element: s(ExamResultsPage) },
            ],
          },

          // Teachers (Admin Only)
          {
            path: 'teachers',
            element: <RoleGuard allowedRoles={['admin']} />,
            children: [
              { index: true, element: s(TeachersListPage) },
              { path: ':teacherId', element: s(TeacherDetailsPage) },
              { path: ':teacherId/assign-subjects', element: s(TeacherDetailsPage) },
            ],
          },

          // Students
          {
            path: 'students',
            children: [
              { index: true, element: s(StudentsListPage) },
              { path: ':studentId', element: s(StudentProfilePage) },
              { path: ':studentId/performance', element: s(StudentProfilePage) },
            ],
          },

          // Competitions
          {
            path: 'competitions',
            children: [
              { index: true, element: s(CompetitionsListPage) },
              { path: 'create', element: s(CompetitionBuilderPage) },
              { path: ':competitionId/leaderboard', element: s(LeaderboardPage) },
            ],
          },

          // Notifications
          {
            path: 'notifications',
            children: [
              { index: true, element: s(NotificationsManagerPage) },
              { path: 'create', element: s(CreateNotificationPage) },
            ],
          },

          // Reports
          { path: 'reports', element: s(ReportsAnalyticsPage) },

          // Settings
          {
            path: 'settings',
            children: [
              { index: true, element: <Navigate to="profile" replace /> },
              { path: 'profile', element: s(ProfileSettingsPage) },
              {
                path: 'system',
                element: (
                  <RoleGuard allowedRoles={['admin']}>
                    {s(SystemSettingsPage)}
                  </RoleGuard>
                ),
              },
              {
                path: 'backup',
                element: (
                  <RoleGuard allowedRoles={['admin']}>
                    {s(BackupManagerPage)}
                  </RoleGuard>
                ),
              },
            ],
          },
        ],
      },
    ],
  },

  // 404 catch-all
  { path: '*', element: <Navigate to={ROUTES.PUBLIC.LANDING} replace /> },
]);

export default router;
