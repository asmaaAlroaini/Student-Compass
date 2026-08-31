import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

class AppConstants {
  static const String kIp = '192.168.43.11';
  static String get ip {
    final saved = Prefs.getString(kApiBaseUrl)?.trim();
    if (saved == null || saved.isEmpty) {
      return kIp;
    }
    return saved;
  }

  static String get kBaseUrl {
    final currentIp = ip.trim();
    if (currentIp.startsWith('http://') || currentIp.startsWith('https://')) {
      var cleaned = currentIp;
      while (cleaned.endsWith('/')) {
        cleaned = cleaned.substring(0, cleaned.length - 1);
      }
      if (cleaned.endsWith('/api/v1')) {
        return cleaned;
      }
      if (cleaned.endsWith('/api')) {
        return '$cleaned/v1';
      }
      return '$cleaned/api/v1';
    }
    if (currentIp.contains(':')) {
      return 'http://$currentIp/api/v1';
    }
    return 'http://$currentIp:8000/api/v1';
  }

  static const String kAppName = 'بوصلة الطالب';
  static const String kAppVersion = '1.0.0';
  static const String kSeenOnBoarding = 'seenOnBoarding';
  static const String kIsLogedIn = 'isLogedIn';
  static const String krememberMe = 'rememberMe';
  static const String kCurrentUser = 'currentUser';
  static const String kToken = 'token';
  static const String kCurrentFile = 'currentFile';
  static const String kApiBaseUrl = 'apiBaseUrl';
  static const String kNotificationsScheduled = 'notifications_scheduled';
  static const String kHasRequestPending = 'hasRequestPending';

  static const String kCurrentLanguageKey = 'selected_language';
  static const String kArabicLang = 'ar';
  static const String kEnglishLang = 'en';

  static const String kMessage = 'message';
  static const String kUserName = 'userName';
  static const String kCreatedAt = 'createdAt';
  static const String kUpdatedAt = 'updatedAt';
  static const String kLastMessage = 'lastMessage';
  static const String kUserId = 'userId';
  static const String kSenderType = 'senderType';
  static const String kSenderTypeUser = 'user';
  static const String kSenderTypeAdmin = 'admin';
  static const String kChatsCollection = 'chats';
  static const String kMessagesCollection = 'messages';

  static const String kCurrentThemeKey = 'selected_theme';
  static const String kDarkTheme = 'dark';
  static const String kLightTheme = 'light';
  static const String kSavedEmail = 'savedEmail';
  static const String kSavedPassword = 'savedPassword';
  static const String kResetPasswordUsername = 'resetPasswordUsername';

  // ==========================================
  // API Endpoints - Student Compass (بوصلة الطالب)
  // ==========================================

  // 1. Auth Endpoints
  static const String kLogin = 'auth/login';
  static const String kRegister = 'auth/register';
  static const String kEducationalOptions = 'auth/educational-options';
  static const String kProfile = 'auth/profile';
  static const String kUpdateProfile = 'auth/profile';
  static const String kChangePassword = 'auth/change-password';
  static const String kLogout = 'auth/logout';
  static const String kResetPasswordRequest = 'auth/reset-password-request';
  static const String kVerifyResetPasswordCode = 'auth/verify-reset-code';
  static const String kResetPassword = 'auth/reset-password';

  // 2. Notifications Endpoints
  static const String kNotifications = 'notifications';
  static const String kNotificationsReadAll = 'notifications/read-all';

  // 3. Student - Curriculum & Lessons
  static const String kStudentSubjects = 'student/subjects';
  static const String kStudentLessons = 'student/lessons';

  // 4. Student - Exams & Quizzes
  static const String kStudentExams = 'student/exams';
  static const String kStudentCustomExam = 'student/exams/custom';
  static const String kStudentSubmitExam = 'student/exams';

  // 5. Student - Competitions & Leaderboard
  static const String kStudentCompetitions = 'student/competitions';
  static const String kStudentLeaderboard = 'student/competitions/leaderboard';

  // 6. Student - Study Plan & Onboarding
  static const String kStudentStudyPlan = 'student/study-plan';
  static const String kStudentStudyPlanOnboarding =
      'student/study-plan/onboarding';
  static const String kStudentStudyPlanRecalculate =
      'student/study-plan/recalculate';
  static const String kStudentStudyTasks = 'student/study-tasks';

  // 7. Student - Incorrect Questions & Progress & Bookmarks & Reports
  static const String kStudentIncorrectQuestions =
      'student/incorrect-questions';
  static const String kStudentProgress = 'student/progress';
  static const String kStudentBookmarks = 'student/bookmarks';
  static const String kStudentToggleBookmark = 'student/bookmarks/toggle';
  static const String kStudentReports = 'student/reports';

  // 8. Teacher & CMS Endpoints
  static const String kTeacherLessons = 'teacher/lessons';
  static const String kTeacherQuestions = 'teacher/questions';
  static const String kTeacherImportPreview =
      'teacher/questions/import-preview';
  static const String kTeacherImportConfirm =
      'teacher/questions/import-confirm';
  static const String kTeacherExams = 'teacher/exams';
  static const String kTeacherCompetitions = 'teacher/competitions';

  // 9. Admin Endpoints
  static const String kAdminUsers = 'admin/users';
  static const String kAdminReports = 'admin/reports';
  static const String kAdminSubjects = 'admin/subjects';
  static const String kAdminUnits = 'admin/units';
}
