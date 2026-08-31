import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_cubit.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class HomeStudyPlanProgressWidget extends StatelessWidget {
  const HomeStudyPlanProgressWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<StudyPlanCubit, StudyPlanState>(
      builder: (context, state) {
        int totalTasks = 5;
        int completedTasks = 3;
        double progress = 60.0;

        if (state is StudyPlanSuccess) {
          totalTasks = state.plan.totalTasks > 0 ? state.plan.totalTasks : 1;
          completedTasks = state.plan.completedTasks;
          progress = state.plan.progressPercentage;
        } else if (state is StudyPlanRecalculated) {
          totalTasks = state.plan.totalTasks > 0 ? state.plan.totalTasks : 1;
          completedTasks = state.plan.completedTasks;
          progress = state.plan.progressPercentage;
        }

        final double progressFraction = (progress / 100).clamp(0.0, 1.0);

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.primaryColor(context).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        Icons.track_changes_rounded,
                        size: 16,
                        color: AppColors.primaryColor(context),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'مستوى تقدم الخطة الدراسية',
                      style: TextStyles.bold14.copyWith(
                        color: AppColors.textBoldColor(context),
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () {
                    context.push(RouteNames.studyPlan);
                  },
                  child: Text(
                    'تفاصيل الخطة',
                    style: TextStyles.semiBold12.copyWith(
                      color: AppColors.primaryColor(context),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.s8),

            // Card Container
            InkWell(
              onTap: () {
                context.push(RouteNames.studyPlan);
              },
              borderRadius: BorderRadius.circular(18),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.s16),
                decoration: BoxDecoration(
                  color: AppColors.itemsColor(context),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: AppColors.borderColor(context),
                    width: 1.2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.shadowColor(context),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top row: Completion ratio + percentage
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Text(
                              'تم إنجاز ',
                              style: TextStyles.regular12.copyWith(
                                color: AppColors.textSecondaryColor(context),
                              ),
                            ),
                            Text(
                              '$completedTasks',
                              style: TextStyles.bold14.copyWith(
                                color: AppColors.primaryColor(context),
                              ),
                            ),
                            Text(
                              ' من أصل $totalTasks مهام',
                              style: TextStyles.bold12.copyWith(
                                color: AppColors.textBoldColor(context),
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: const Color(0xFF10B981).withValues(alpha: 0.3),
                            ),
                          ),
                          child: Text(
                            '${progress.toInt()}% مكتمل',
                            style: TextStyles.bold11.copyWith(
                              color: const Color(0xFF059669),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: AppSpacing.s12),

                    // Linear Progress Bar
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: SizedBox(
                        height: 10,
                        child: Stack(
                          children: [
                            // Background bar
                            Container(
                              color: AppColors.borderColor(context).withValues(alpha: 0.5),
                            ),
                            // Progress bar
                            FractionallySizedBox(
                              widthFactor: progressFraction,
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      AppColors.primaryColor(context),
                                      const Color(0xFF10B981),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: AppSpacing.s12),

                    // Motivational sub-text and arrow
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text('🔥 ', style: TextStyle(fontSize: 12)),
                            Text(
                              progress >= 100
                                  ? 'رائع جداً! أتممت خطتك لليوم بنجاح'
                                  : 'أنت تسير بخطى ممتازة نحو التفوق والوزاري',
                              style: TextStyles.regular11.copyWith(
                                color: AppColors.textSecondaryColor(context),
                              ),
                            ),
                          ],
                        ),
                        Icon(
                          Icons.arrow_forward_ios_rounded,
                          size: 12,
                          color: AppColors.textSecondaryColor(context),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
