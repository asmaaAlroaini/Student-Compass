import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/logout_cubit/logout_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/exams_cubit/exams_cubit.dart';
import 'package:student_compass_mobile/Features/Notifications/presentation/logic/notifications_cubit/notifications_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_cubit.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_cubit.dart';
import 'package:student_compass_mobile/core/services/service_locator.dart';

class BlocProviders {
  const BlocProviders._();

  static Widget wrapWithProviders({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        // توفير LogoutCubit على مستوى التطبيق
        BlocProvider<LogoutCubit>(
          create: (context) => LogoutCubit(getIt<AuthRepo>()),
        ),

        // توفير ProfileCubit على مستوى التطبيق
        BlocProvider<ProfileCubit>(
          create: (context) => getIt<ProfileCubit>(),
        ),

        // توفير NotificationsCubit على مستوى التطبيق
        BlocProvider<NotificationsCubit>(
          create: (context) => getIt<NotificationsCubit>(),
        ),

        // توفير SubjectsCubit على مستوى التطبيق
        BlocProvider<SubjectsCubit>(
          create: (context) => getIt<SubjectsCubit>(),
        ),

        // توفير ExamsCubit على مستوى التطبيق
        BlocProvider<ExamsCubit>(
          create: (context) => getIt<ExamsCubit>(),
        ),

        // توفير StudyPlanCubit على مستوى التطبيق
        BlocProvider<StudyPlanCubit>(
          create: (context) => getIt<StudyPlanCubit>(),
        ),
      ],
      child: child,
    );
  }
}
