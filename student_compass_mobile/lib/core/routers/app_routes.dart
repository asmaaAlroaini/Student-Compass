import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/login_cubit/login_cubit.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/register_cubit/register_cubit.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/reset_password_cubit/reset_password_cubit.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/forgot_password_view.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/login_view.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/reset_password_view.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/sign_up_view.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/verify_code_view.dart';
import 'package:student_compass_mobile/Features/Competitions/data/models/competition_model.dart';
import 'package:student_compass_mobile/Features/Competitions/data/repos/competitions_repo.dart';
import 'package:student_compass_mobile/Features/Competitions/presentation/logic/competitions_cubit.dart';
import 'package:student_compass_mobile/Features/Competitions/presentation/views/competitions_view.dart';
import 'package:student_compass_mobile/Features/Competitions/presentation/views/leaderboard_view.dart';
import 'package:student_compass_mobile/Features/DashBoard/presentation/views/dashboard.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_result_model.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/take_exam_cubit/take_exam_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/views/exam_result_view.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/views/exams_view.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/views/take_exam_view.dart';
import 'package:student_compass_mobile/Features/Home/presentation/views/home_view.dart';
import 'package:student_compass_mobile/Features/Notifications/presentation/views/notifications_view.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/views/on_boarding_view.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/change_password_cubit/change_password_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/update_profile_cubit/update_profile_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/views/change_password_view.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/views/edit_profile_view.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/views/profile_view.dart';
import 'package:student_compass_mobile/Features/Review/data/repos/review_repo.dart';
import 'package:student_compass_mobile/Features/Review/presentation/logic/bookmarks_cubit/bookmarks_cubit.dart';
import 'package:student_compass_mobile/Features/Review/presentation/logic/incorrect_questions_cubit/incorrect_questions_cubit.dart';
import 'package:student_compass_mobile/Features/Review/presentation/views/bookmarks_view.dart';
import 'package:student_compass_mobile/Features/Review/presentation/views/incorrect_questions_view.dart';
import 'package:student_compass_mobile/Features/Settings/presentation/views/settings_view.dart';
import 'package:student_compass_mobile/Features/Splash/presentation/views/splash_view.dart';
import 'package:student_compass_mobile/Features/StudyPlan/data/repos/study_plan_repo.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_cubit.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/views/study_plan_onboarding_view.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/views/study_plan_view.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/lesson_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/subject_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/unit_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/repos/subjects_repo.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/lesson_journey_cubit/lesson_journey_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/practice_questions_cubit/practice_questions_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subject_units_cubit/subject_units_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/unit_lessons_cubit/unit_lessons_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/views/lesson_journey_view.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/views/practice_questions_view.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/views/subject_details_view.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/views/subjects_view.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/views/unit_lessons_view.dart';
import 'package:student_compass_mobile/Features/init_view.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/services/service_locator.dart';

final GlobalKey<NavigatorState> rootNavigatorKey = GlobalKey<NavigatorState>();

class AppRoutes {
  static final GoRouter router = GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: RouteNames.splash,
    debugLogDiagnostics: true,
    errorBuilder: (context, state) {
      return const Scaffold(body: Center(child: Text('الصفحة غير موجودة')));
    },
    routes: [
      // ────────────────────────────────────────────────
      // Splash & Onboarding
      // ────────────────────────────────────────────────
      _buildRoute(
        path: RouteNames.splash,
        builder: (context, state) => const SplashView(),
        transition: TransitionType.fade,
      ),
      _buildRoute(
        path: RouteNames.onboarding,
        builder: (context, state) => const OnBoardingView(),
        transition: TransitionType.fade,
      ),
      _buildRoute(
        path: RouteNames.onBoarding1,
        builder: (context, state) => const OnBoardingView(),
        transition: TransitionType.fade,
      ),
      _buildRoute(
        path: RouteNames.initView,
        builder: (context, state) => const InitView(),
        transition: TransitionType.fade,
      ),

      // ────────────────────────────────────────────────
      // Auth Routes
      // ────────────────────────────────────────────────
      _buildRoute(
        path: RouteNames.login,
        builder: (context, state) => BlocProvider(
          create: (context) => LoginCubit(getIt<AuthRepo>()),
          child: const LoginView(),
        ),
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.register,
        builder: (context, state) => BlocProvider(
          create: (context) => RegisterCubit(getIt<AuthRepo>()),
          child: const SignUpView(),
        ),
        transition: TransitionType.slideFromLeft,
      ),
      _buildRoute(
        path: RouteNames.forgotPassword,
        builder: (context, state) => BlocProvider(
          create: (context) => ResetPasswordCubit(getIt<AuthRepo>()),
          child: const ForgotPasswordView(),
        ),
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.verifyCode,
        builder: (context, state) {
          final email = state.extra as String? ?? '';
          return BlocProvider(
            create: (context) => ResetPasswordCubit(getIt<AuthRepo>()),
            child: VerifyCodeView(email: email),
          );
        },
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.resetPassword,
        builder: (context, state) {
          final extras = state.extra as Map<String, dynamic>? ?? {};
          return BlocProvider(
            create: (context) => ResetPasswordCubit(getIt<AuthRepo>()),
            child: ResetPasswordView(
              email: extras['email'] as String? ?? '',
              code: extras['code'] as String? ?? '',
            ),
          );
        },
        transition: TransitionType.slideFromRight,
      ),

      // ────────────────────────────────────────────────
      // Dashboard & Home
      // ────────────────────────────────────────────────
      _buildRoute(
        path: RouteNames.dashboard,
        builder: (context, state) {
          final initialPage = state.extra is int ? state.extra as int : 0;
          return DashBoard(initialPage: initialPage);
        },
        transition: TransitionType.fade,
      ),
      _buildRoute(
        path: RouteNames.home,
        builder: (context, state) => const HomeView(),
        transition: TransitionType.fade,
      ),
      _buildRoute(
        path: RouteNames.notifications,
        builder: (context, state) => const NotificationsView(),
        transition: TransitionType.slideFromRight,
      ),

      // ────────────────────────────────────────────────
      // Subjects / Units / Lessons / Practice
      // ────────────────────────────────────────────────
      _buildRoute(
        path: RouteNames.subjects,
        builder: (context, state) => const SubjectsView(),
        transition: TransitionType.fade,
      ),
      _buildRoute(
        path: RouteNames.subjectDetails,
        builder: (context, state) {
          final subject = state.extra as SubjectModel;
          return BlocProvider(
            create: (context) => getIt<SubjectUnitsCubit>(),
            child: SubjectDetailsView(subject: subject),
          );
        },
        transition: TransitionType.slideFromRight,
      ),
      // Unit Lessons list
      _buildRoute(
        path: '/unit-lessons',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>;
          final subject = extra['subject'] as SubjectModel;
          final unit = extra['unit'] as UnitModel;
          return BlocProvider(
            create: (context) => UnitLessonsCubit(getIt<SubjectsRepo>()),
            child: UnitLessonsView(subject: subject, unit: unit),
          );
        },
        transition: TransitionType.slideFromRight,
      ),
      // Lesson 5-Stage Journey
      _buildRoute(
        path: '/lesson-journey',
        builder: (context, state) {
          final extra = state.extra is Map<String, dynamic>
              ? state.extra as Map<String, dynamic>
              : <String, dynamic>{};
          final lesson = extra['lesson'] is LessonModel
              ? extra['lesson'] as LessonModel
              : null;
          final lessonId =
              extra['lesson_id'] as int? ??
              (lesson?.id ?? (extra['id'] as int? ?? 0));
          final title =
              extra['title'] as String? ?? (lesson?.title ?? 'رحلة تعلم الدرس');
          return MultiBlocProvider(
            providers: [
              BlocProvider(
                create: (context) => LessonJourneyCubit(getIt<SubjectsRepo>()),
              ),
            ],
            child: LessonJourneyView(lessonId: lessonId, initialTitle: title),
          );
        },
        transition: TransitionType.slideFromRight,
      ),
      // Practice Questions (lesson-questions)
      _buildRoute(
        path: RouteNames.lessonQuestions,
        builder: (context, state) {
          final extra = state.extra is Map<String, dynamic>
              ? state.extra as Map<String, dynamic>
              : <String, dynamic>{};
          final lesson = extra['lesson'] is LessonModel
              ? extra['lesson'] as LessonModel
              : null;
          final lessonId =
              extra['lesson_id'] as int? ??
              (lesson?.id ?? (extra['id'] as int? ?? 0));
          final title =
              extra['title'] as String? ?? (lesson?.title ?? 'أسئلة التثبيت');
          return BlocProvider(
            create: (context) => PracticeQuestionsCubit(getIt<SubjectsRepo>()),
            child: PracticeQuestionsView(lessonId: lessonId, title: title),
          );
        },
        transition: TransitionType.slideFromRight,
      ),

      // ────────────────────────────────────────────────
      // Exams
      // ────────────────────────────────────────────────
      _buildRoute(
        path: RouteNames.exam,
        builder: (context, state) {
          if (state.extra is ExamModel) {
            final exam = state.extra as ExamModel;
            return BlocProvider(
              create: (context) => getIt<TakeExamCubit>(),
              child: TakeExamView(exam: exam),
            );
          }
          return const ExamsView();
        },
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.examResult,
        builder: (context, state) {
          final result = state.extra as ExamResultModel;
          return ExamResultView(result: result);
        },
        transition: TransitionType.slideFromBottom,
      ),

      // ────────────────────────────────────────────────
      // Study Plan
      // ────────────────────────────────────────────────
      _buildRoute(
        path: RouteNames.studyPlan,
        builder: (context, state) => BlocProvider(
          create: (context) => StudyPlanCubit(getIt<StudyPlanRepo>()),
          child: const StudyPlanView(),
        ),
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.studyPlanOnboarding,
        builder: (context, state) => MultiBlocProvider(
          providers: [
            BlocProvider(
              create: (context) => StudyPlanCubit(getIt<StudyPlanRepo>()),
            ),
            BlocProvider(create: (context) => getIt<SubjectsCubit>()),
          ],
          child: const StudyPlanOnboardingView(),
        ),
        transition: TransitionType.slideFromBottom,
      ),

      // ────────────────────────────────────────────────
      // Review: Incorrect Questions & Bookmarks
      // ────────────────────────────────────────────────
      _buildRoute(
        path: RouteNames.incorrectQuestions,
        builder: (context, state) => BlocProvider(
          create: (context) => IncorrectQuestionsCubit(getIt<ReviewRepo>()),
          child: const IncorrectQuestionsView(),
        ),
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.bookmarks,
        builder: (context, state) => BlocProvider(
          create: (context) => BookmarksCubit(getIt<ReviewRepo>()),
          child: const BookmarksView(),
        ),
        transition: TransitionType.slideFromRight,
      ),

      // ────────────────────────────────────────────────
      // Competitions & Leaderboard
      // ────────────────────────────────────────────────
      _buildRoute(
        path: RouteNames.competitions,
        builder: (context, state) => BlocProvider(
          create: (context) => CompetitionsCubit(getIt<CompetitionsRepo>()),
          child: const CompetitionsView(),
        ),
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.competitionDetails,
        builder: (context, state) {
          final competition = state.extra as CompetitionModel;
          return MultiBlocProvider(
            providers: [
              BlocProvider(
                create: (context) =>
                    TakeCompetitionCubit(getIt<CompetitionsRepo>()),
              ),
              BlocProvider(
                create: (context) =>
                    LeaderboardCubit(getIt<CompetitionsRepo>()),
              ),
            ],
            child: LeaderboardView(competition: competition),
          );
        },
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.leaderboard,
        builder: (context, state) {
          final competition = state.extra as CompetitionModel;
          return BlocProvider(
            create: (context) => LeaderboardCubit(getIt<CompetitionsRepo>()),
            child: LeaderboardView(competition: competition),
          );
        },
        transition: TransitionType.slideFromBottom,
      ),

      // ────────────────────────────────────────────────
      // Profile & Settings
      // ────────────────────────────────────────────────
      _buildRoute(
        path: RouteNames.profile,
        builder: (context, state) => const ProfileView(),
        transition: TransitionType.fade,
      ),
      _buildRoute(
        path: RouteNames.editProfile,
        builder: (context, state) {
          final user = state.extra as User;
          return BlocProvider(
            create: (context) => getIt<UpdateProfileCubit>(),
            child: EditProfileView(user: user),
          );
        },
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.changePassword,
        builder: (context, state) => BlocProvider(
          create: (context) => getIt<ChangePasswordCubit>(),
          child: const ChangePasswordView(),
        ),
        transition: TransitionType.slideFromRight,
      ),
      _buildRoute(
        path: RouteNames.settings,
        builder: (context, state) => const SettingsView(),
        transition: TransitionType.slideFromRight,
      ),
    ],
  );

  static GoRoute _buildRoute({
    required String path,
    required Widget Function(BuildContext, GoRouterState) builder,
    required TransitionType transition,
  }) {
    return GoRoute(
      path: path,
      pageBuilder: (context, state) {
        return _buildTransitionPage(state, builder(context, state), transition);
      },
    );
  }

  static Page _buildTransitionPage(
    GoRouterState state,
    Widget child,
    TransitionType transition,
  ) {
    return CustomTransitionPage(
      key: state.pageKey,
      child: child,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        switch (transition) {
          case TransitionType.fade:
            return FadeTransition(opacity: animation, child: child);

          case TransitionType.slideFromRight:
            return SlideTransition(
              position:
                  Tween<Offset>(
                    begin: const Offset(1.0, 0.0),
                    end: Offset.zero,
                  ).animate(
                    CurvedAnimation(parent: animation, curve: Curves.easeOut),
                  ),
              child: child,
            );

          case TransitionType.slideFromLeft:
            return SlideTransition(
              position:
                  Tween<Offset>(
                    begin: const Offset(-1.0, 0.0),
                    end: Offset.zero,
                  ).animate(
                    CurvedAnimation(parent: animation, curve: Curves.easeOut),
                  ),
              child: child,
            );

          case TransitionType.slideFromBottom:
            return SlideTransition(
              position:
                  Tween<Offset>(
                    begin: const Offset(0.0, 1.0),
                    end: Offset.zero,
                  ).animate(
                    CurvedAnimation(parent: animation, curve: Curves.easeOut),
                  ),
              child: child,
            );

          case TransitionType.scale:
            return ScaleTransition(scale: animation, child: child);
        }
      },
    );
  }
}

enum TransitionType {
  fade,
  slideFromRight,
  slideFromLeft,
  slideFromBottom,
  scale,
}
