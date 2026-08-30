import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo_impl.dart';
import 'package:student_compass_mobile/Features/Competitions/data/repos/competitions_repo.dart';
import 'package:student_compass_mobile/Features/Competitions/presentation/logic/competitions_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/data/repos/exams_repo.dart';
import 'package:student_compass_mobile/Features/Exams/data/repos/exams_repo_impl.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/custom_exam_cubit/custom_exam_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/exams_cubit/exams_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/take_exam_cubit/take_exam_cubit.dart';
import 'package:student_compass_mobile/Features/Notifications/data/repos/notifications_repo.dart';
import 'package:student_compass_mobile/Features/Notifications/data/repos/notifications_repo_impl.dart';
import 'package:student_compass_mobile/Features/Notifications/presentation/logic/notifications_cubit/notifications_cubit.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/repos/on_boarding_repo.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/repos/on_boarding_repo_impl.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/logic/on_boarding_cubit/on_boarding_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/data/repos/profile_repo.dart';
import 'package:student_compass_mobile/Features/Profile/data/repos/profile_repo_impl.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/change_password_cubit/change_password_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/update_profile_cubit/update_profile_cubit.dart';
import 'package:student_compass_mobile/Features/Review/data/repos/review_repo.dart';
import 'package:student_compass_mobile/Features/Review/presentation/logic/bookmarks_cubit/bookmarks_cubit.dart';
import 'package:student_compass_mobile/Features/Review/presentation/logic/incorrect_questions_cubit/incorrect_questions_cubit.dart';
import 'package:student_compass_mobile/Features/StudyPlan/data/repos/study_plan_repo.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/data/repos/subjects_repo.dart';
import 'package:student_compass_mobile/Features/Subjects/data/repos/subjects_repo_impl.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/lesson_journey_cubit/lesson_journey_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/practice_questions_cubit/practice_questions_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subject_units_cubit/subject_units_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/unit_lessons_cubit/unit_lessons_cubit.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';

final getIt = GetIt.instance;

void setUpServiceLocator() {
  // ──────────────────────────────────────────
  // Core Services
  // ──────────────────────────────────────────
  getIt.registerSingleton<ApiService>(ApiService(Dio()));

  // ──────────────────────────────────────────
  // Auth Feature
  // ──────────────────────────────────────────
  getIt.registerSingleton<AuthRepo>(AuthRepoImpl(getIt<ApiService>()));

  // ──────────────────────────────────────────
  // OnBoarding Feature
  // ──────────────────────────────────────────
  getIt.registerSingleton<OnBoardingRepo>(OnBoardingRepoImpl());
  getIt.registerFactory<OnBoardingCubit>(() => OnBoardingCubit(getIt<OnBoardingRepo>()));

  // ──────────────────────────────────────────
  // Subjects / Units / Lessons Feature
  // ──────────────────────────────────────────
  getIt.registerSingleton<SubjectsRepo>(SubjectsRepoImpl(getIt<ApiService>()));
  getIt.registerFactory<SubjectsCubit>(() => SubjectsCubit(getIt<SubjectsRepo>()));
  getIt.registerFactory<SubjectUnitsCubit>(() => SubjectUnitsCubit(getIt<SubjectsRepo>()));
  getIt.registerFactory<UnitLessonsCubit>(() => UnitLessonsCubit(getIt<SubjectsRepo>()));
  getIt.registerFactory<LessonJourneyCubit>(() => LessonJourneyCubit(getIt<SubjectsRepo>()));
  getIt.registerFactory<PracticeQuestionsCubit>(() => PracticeQuestionsCubit(getIt<SubjectsRepo>()));

  // ──────────────────────────────────────────
  // Exams Feature
  // ──────────────────────────────────────────
  getIt.registerSingleton<ExamsRepo>(ExamsRepoImpl(getIt<ApiService>()));
  getIt.registerFactory<ExamsCubit>(() => ExamsCubit(getIt<ExamsRepo>()));
  getIt.registerFactory<CustomExamCubit>(() => CustomExamCubit(getIt<ExamsRepo>()));
  getIt.registerFactory<TakeExamCubit>(() => TakeExamCubit(getIt<ExamsRepo>()));

  // ──────────────────────────────────────────
  // Notifications Feature
  // ──────────────────────────────────────────
  getIt.registerSingleton<NotificationsRepo>(NotificationsRepoImpl(getIt<ApiService>()));
  getIt.registerFactory<NotificationsCubit>(() => NotificationsCubit(getIt<NotificationsRepo>()));

  // ──────────────────────────────────────────
  // Profile Feature
  // ──────────────────────────────────────────
  getIt.registerSingleton<ProfileRepo>(ProfileRepoImpl(getIt<ApiService>()));
  getIt.registerFactory<ProfileCubit>(() => ProfileCubit(getIt<ProfileRepo>()));
  getIt.registerFactory<UpdateProfileCubit>(() => UpdateProfileCubit(getIt<ProfileRepo>()));
  getIt.registerFactory<ChangePasswordCubit>(() => ChangePasswordCubit(getIt<ProfileRepo>()));

  // ──────────────────────────────────────────
  // Study Plan Feature
  // ──────────────────────────────────────────
  getIt.registerSingleton<StudyPlanRepo>(StudyPlanRepoImpl(getIt<ApiService>()));
  getIt.registerFactory<StudyPlanCubit>(() => StudyPlanCubit(getIt<StudyPlanRepo>()));

  // ──────────────────────────────────────────
  // Review Feature (Incorrect Questions & Bookmarks)
  // ──────────────────────────────────────────
  getIt.registerSingleton<ReviewRepo>(ReviewRepoImpl(getIt<ApiService>()));
  getIt.registerFactory<IncorrectQuestionsCubit>(() => IncorrectQuestionsCubit(getIt<ReviewRepo>()));
  getIt.registerFactory<BookmarksCubit>(() => BookmarksCubit(getIt<ReviewRepo>()));

  // ──────────────────────────────────────────
  // Competitions Feature
  // ──────────────────────────────────────────
  getIt.registerSingleton<CompetitionsRepo>(CompetitionsRepoImpl(getIt<ApiService>()));
  getIt.registerFactory<CompetitionsCubit>(() => CompetitionsCubit(getIt<CompetitionsRepo>()));
  getIt.registerFactory<TakeCompetitionCubit>(() => TakeCompetitionCubit(getIt<CompetitionsRepo>()));
  getIt.registerFactory<LeaderboardCubit>(() => LeaderboardCubit(getIt<CompetitionsRepo>()));
}
