import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/exams_cubit/exams_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/exams_cubit/exams_state.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class AcademicProgressCard extends StatelessWidget {
  const AcademicProgressCard({super.key});

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header
        Text(
          s.AcademicProgressInfo,
          style: TextStyles.bold14.copyWith(
            color: AppColors.textBoldColor(context),
          ),
        ),
        const SizedBox(height: AppSpacing.s10),

        // Main Card
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: AppColors.itemsColor(context),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: AppColors.borderColor(context),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.shadowColor(context),
                blurRadius: 15,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Stack(
            children: [
              // Top-left soft primary decorative background patch
              Positioned(
                top: 0,
                left: 0,
                child: Container(
                  width: 70,
                  height: 70,
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor(context).withValues(alpha: 0.06),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(20),
                      bottomRight: Radius.circular(50),
                    ),
                  ),
                ),
              ),

              Padding(
                padding: const EdgeInsets.all(AppSpacing.s20),
                child: Column(
                  children: [
                    // Top Info Row: Text on the RIGHT, Circular Indicator on the LEFT
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Right in RTL: Title & Stats Text
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                s.AcademicComprehensivePlan,
                                style: TextStyles.bold16.copyWith(
                                  color: AppColors.textBoldColor(context),
                                ),
                              ),
                              const SizedBox(height: 8),

                              // 3 Stats in a Row (Aligning to the right in RTL)
                              Row(
                                children: [
                                  BlocBuilder<SubjectsCubit, SubjectsState>(
                                    builder: (context, subState) {
                                      int count = 6;
                                      if (subState is SubjectsSuccess) {
                                        count = subState.subjects.length;
                                      }
                                      return _buildStatColumn(
                                        context: context,
                                        label: s.ActiveSubjects,
                                        value: '$count',
                                        valueColor: AppColors.textBoldColor(context),
                                      );
                                    },
                                  ),
                                  const SizedBox(width: 14),
                                  BlocBuilder<ExamsCubit, ExamsState>(
                                    builder: (context, examState) {
                                      int count = 4;
                                      if (examState is ExamsSuccess) {
                                        count = examState.exams
                                            .where((e) => e.hasTaken)
                                            .length;
                                      }
                                      return _buildStatColumn(
                                        context: context,
                                        label: s.CompletedExams,
                                        value: '$count',
                                        valueColor: const Color(0xFF10B981),
                                      );
                                    },
                                  ),
                                  const SizedBox(width: 14),
                                  _buildStatColumn(
                                    context: context,
                                    label: s.SuccessRate,
                                    value: '88%',
                                    valueColor: const Color(0xFFE11D48),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(width: 12),

                        // Left in RTL: Circular Progress Gauge
                        BlocBuilder<ExamsCubit, ExamsState>(
                          builder: (context, examState) {
                            int completedExams = 0;
                            int totalExams = 0;
                            double percent = 75.0;

                            if (examState is ExamsSuccess) {
                              totalExams = examState.exams.length;
                              completedExams = examState.exams
                                  .where((e) => e.hasTaken)
                                  .length;
                              if (totalExams > 0) {
                                percent = (completedExams / totalExams) * 100;
                              }
                            }

                            return Stack(
                              alignment: Alignment.center,
                              children: [
                                SizedBox(
                                  width: 65,
                                  height: 65,
                                  child: CircularProgressIndicator(
                                    value: (percent / 100).clamp(0.1, 1.0),
                                    strokeWidth: 6.5,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      AppColors.primaryColor(context),
                                    ),
                                    backgroundColor: AppColors.primaryColor(context)
                                        .withValues(alpha: 0.12),
                                  ),
                                ),
                                Text(
                                  '${percent.toInt()}%',
                                  style: TextStyles.bold14.copyWith(
                                    color: AppColors.textBoldColor(context),
                                  ),
                                ),
                              ],
                            );
                          },
                        ),
                      ],
                    ),

                    const SizedBox(height: AppSpacing.s20),

                    // Full-width Green CTA Button
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () {
                          context.go(RouteNames.dashboard, extra: 2); // Tab 2 = Exams
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          s.ContinueStudyAndExams,
                          style: TextStyles.bold16.copyWith(
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatColumn({
    required BuildContext context,
    required String label,
    required String value,
    required Color valueColor,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyles.semiBold10.copyWith(
            color: AppColors.textSecondaryColor(context),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyles.bold13.copyWith(
            color: valueColor,
          ),
        ),
      ],
    );
  }
}
