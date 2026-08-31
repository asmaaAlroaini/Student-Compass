import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/exams_cubit/exams_cubit.dart';
import 'package:student_compass_mobile/Features/Home/presentation/views/widgets/academic_progress_card.dart';
import 'package:student_compass_mobile/Features/Home/presentation/views/widgets/home_banner_widget.dart';
import 'package:student_compass_mobile/Features/Home/presentation/views/widgets/home_header_widget.dart';
import 'package:student_compass_mobile/Features/Home/presentation/views/widgets/home_today_plan_widget.dart';
import 'package:student_compass_mobile/Features/Home/presentation/views/widgets/home_study_plan_progress_widget.dart';
import 'package:student_compass_mobile/Features/Home/presentation/views/widgets/quick_actions_grid.dart';
import 'package:student_compass_mobile/Features/Notifications/presentation/logic/notifications_cubit/notifications_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_cubit.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class HomeView extends StatefulWidget {
  const HomeView({super.key});

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  @override
  void initState() {
    super.initState();
    _refreshData();
  }

  void _refreshData() {
    context.read<ProfileCubit>().fetchProfile();
    context.read<NotificationsCubit>().fetchNotifications();
    context.read<SubjectsCubit>().fetchSubjects();
    context.read<ExamsCubit>().fetchExams();
    context.read<StudyPlanCubit>().fetchTodayPlan();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            _refreshData();
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.s16,
              vertical: AppSpacing.s12,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Header (Matching the screenshot: Profile on right, Theme + Notifications on left)
                const HomeHeaderWidget(),

                const SizedBox(height: AppSpacing.s16),

                // 2. Smart Motivational / Study Banner
                const HomeBannerWidget(),

                const SizedBox(height: AppSpacing.s20),

                // 3. Today Study Plan Preview with 3 Tasks & View All
                const HomeTodayPlanWidget(),

                const SizedBox(height: AppSpacing.s20),

                // 4. Academic Progress Card (Matching the subscription info card with circular gauge)
                const AcademicProgressCard(),

                const SizedBox(height: AppSpacing.s20),

                // 5. Quick Actions Grid (Services & shortcuts)
                const QuickActionsGrid(),

                const SizedBox(height: AppSpacing.s24),

                // 5. Subjects Quick Preview Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'المواد الدراسية المقررة',
                      style: TextStyles.bold14.copyWith(
                        color: AppColors.textBoldColor(context),
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        context.go(
                          RouteNames.dashboard,
                          extra: 1,
                        ); // Tab 1 = Subjects
                      },
                      child: Text(
                        'عرض الكل',
                        style: TextStyles.semiBold12.copyWith(
                          color: AppColors.primaryColor(context),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.s8),

                // Horizontal List of Subjects
                BlocBuilder<SubjectsCubit, SubjectsState>(
                  builder: (context, state) {
                    if (state is SubjectsSuccess && state.subjects.isNotEmpty) {
                      final subjects = state.subjects;

                      return SizedBox(
                        height: 90,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: subjects.length,
                          separatorBuilder: (context, index) =>
                              const SizedBox(width: 10),
                          itemBuilder: (context, index) {
                            final subject = subjects[index];

                            return InkWell(
                              onTap: () {
                                context.push(
                                  RouteNames.subjectDetails,
                                  extra: subject,
                                );
                              },
                              borderRadius: BorderRadius.circular(14),
                              child: Container(
                                width: 140,
                                padding: const EdgeInsets.all(AppSpacing.s12),
                                decoration: BoxDecoration(
                                  color: AppColors.itemsColor(context),
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(
                                    color: AppColors.borderColor(context),
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          subject.code,
                                          style: TextStyles.bold10.copyWith(
                                            color: AppColors.primaryColor(
                                              context,
                                            ),
                                          ),
                                        ),
                                        Icon(
                                          Icons.menu_book_outlined,
                                          size: 16,
                                          color: AppColors.textSecondaryColor(
                                            context,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Text(
                                      subject.name,
                                      style: TextStyles.bold12.copyWith(
                                        color: AppColors.textBoldColor(context),
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      '${subject.unitsCount} وحدات',
                                      style: TextStyles.regular10.copyWith(
                                        color: AppColors.textSecondaryColor(
                                          context,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    }

                    return const SizedBox.shrink();
                  },
                ),

                const SizedBox(height: AppSpacing.s20),

                // 6. Study Plan Progress Section (Below Subjects)
                const HomeStudyPlanProgressWidget(),

                const SizedBox(height: AppSpacing.s20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
