export const ROUTES = {
  PUBLIC: {
    LANDING: '/',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    UNAUTHORIZED: '/unauthorized',
  },
  DASHBOARD: {
    HOME: '/dashboard',
    OVERVIEW: '/dashboard/overview',

    // Academic Structure (Admin Only)
    ACADEMIC: '/dashboard/academic-structure',
    ACADEMIC_STAGES: '/dashboard/academic-structure/stages',
    ACADEMIC_TRACKS: '/dashboard/academic-structure/tracks',
    ACADEMIC_CLASSROOMS: '/dashboard/academic-structure/classrooms',

    // Subjects & Curriculum
    SUBJECTS: '/dashboard/subjects',
    SUBJECT_DETAILS: (id: string | number = ':subjectId') => `/dashboard/subjects/${id}`,
    CURRICULUM: (id: string | number = ':subjectId') => `/dashboard/subjects/${id}/curriculum`,
    LESSON_EDITOR: (
      subjectId: string | number = ':subjectId',
      unitId: string | number = ':unitId',
      lessonId: string | number = ':lessonId'
    ) => `/dashboard/subjects/${subjectId}/units/${unitId}/lessons/${lessonId}`,

    // Question Bank
    QUESTIONS: '/dashboard/question-bank',
    QUESTIONS_CREATE: '/dashboard/question-bank/create',
    QUESTIONS_EDIT: (id: string | number = ':questionId') => `/dashboard/question-bank/edit/${id}`,
    QUESTIONS_IMPORT: '/dashboard/question-bank/bulk-import',

    // Exams
    EXAMS: '/dashboard/exams',
    EXAMS_CREATE: '/dashboard/exams/create',
    EXAMS_EDIT: (id: string | number = ':examId') => `/dashboard/exams/edit/${id}`,
    EXAMS_RESULTS: (id: string | number = ':examId') => `/dashboard/exams/${id}/results`,

    // Teachers (Admin Only)
    TEACHERS: '/dashboard/teachers',
    TEACHER_DETAILS: (id: string | number = ':teacherId') => `/dashboard/teachers/${id}`,
    TEACHER_ASSIGN: (id: string | number = ':teacherId') => `/dashboard/teachers/${id}/assign-subjects`,

    // Students
    STUDENTS: '/dashboard/students',
    STUDENT_PROFILE: (id: string | number = ':studentId') => `/dashboard/students/${id}`,
    STUDENT_PERFORMANCE: (id: string | number = ':studentId') => `/dashboard/students/${id}/performance`,

    // Competitions
    COMPETITIONS: '/dashboard/competitions',
    COMPETITIONS_CREATE: '/dashboard/competitions/create',
    COMPETITIONS_LEADERBOARD: (id: string | number = ':competitionId') => `/dashboard/competitions/${id}/leaderboard`,
    LEADERBOARD: '/dashboard/leaderboard',

    // Notifications
    NOTIFICATIONS: '/dashboard/notifications',
    NOTIFICATIONS_CREATE: '/dashboard/notifications/create',

    // Reports
    REPORTS: '/dashboard/reports',

    // Settings
    SETTINGS: '/dashboard/settings',
    SETTINGS_PROFILE: '/dashboard/settings/profile',
    SETTINGS_SYSTEM: '/dashboard/settings/system',
    SETTINGS_BACKUP: '/dashboard/settings/backup',
  },
} as const;
