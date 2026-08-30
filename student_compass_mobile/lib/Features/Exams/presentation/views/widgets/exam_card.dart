import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class ExamCard extends StatelessWidget {
  final ExamModel exam;

  const ExamCard({super.key, required this.exam});

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    final isMinisterial = exam.type == 'ministerial';
    final hasTaken = exam.hasTaken;
    final isPassed = exam.progressStatus == 'passed';

    return Container(
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: hasTaken
              ? (isPassed
                  ? AppColors.customGreen(context).withValues(alpha: 0.5)
                  : AppColors.customOrange(context).withValues(alpha: 0.5))
              : AppColors.borderColor(context),
          width: hasTaken ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor(context),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.s16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Subject badge & type / status badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor(context).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    exam.subjectName ?? s.CurriculumSubjects,
                    style: TextStyles.bold12.copyWith(
                      color: AppColors.primaryColor(context),
                    ),
                  ),
                ),
                if (hasTaken)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isPassed
                          ? AppColors.customGreen(context).withValues(alpha: 0.15)
                          : AppColors.customOrange(context).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isPassed ? Icons.check_circle : Icons.history,
                          size: 14,
                          color: isPassed
                              ? AppColors.customGreen(context)
                              : AppColors.customOrange(context),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          isPassed ? s.PassedExamStatus : s.TakenExamStatus,
                          style: TextStyles.bold12.copyWith(
                            color: isPassed
                                ? AppColors.customGreen(context)
                                : AppColors.customOrange(context),
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isMinisterial
                          ? AppColors.customOrange(context).withValues(alpha: 0.15)
                          : AppColors.customGreen(context).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isMinisterial ? Icons.school_rounded : Icons.tune_rounded,
                          size: 14,
                          color: isMinisterial
                              ? AppColors.customOrange(context)
                              : AppColors.customGreen(context),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          isMinisterial ? s.OfficialExam : s.CustomExam,
                          style: TextStyles.bold12.copyWith(
                            color: isMinisterial
                                ? AppColors.customOrange(context)
                                : AppColors.customGreen(context),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),

            const SizedBox(height: AppSpacing.s12),

            // Exam Title
            Text(
              exam.title,
              style: TextStyles.bold16.copyWith(
                color: AppColors.textBoldColor(context),
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),

            if (exam.unitTitle != null && exam.unitTitle!.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                exam.unitTitle!,
                style: TextStyles.regular12.copyWith(
                  color: AppColors.textSecondaryColor(context),
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],

            const SizedBox(height: AppSpacing.s16),
            const Divider(height: 1),
            const SizedBox(height: AppSpacing.s12),

            // Info row: Duration, questions count, pass marks
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildInfoBadge(
                  context: context,
                  icon: Icons.timer_outlined,
                  text: '${exam.durationMinutes} ${s.Minutes}',
                ),
                _buildInfoBadge(
                  context: context,
                  icon: Icons.help_outline_rounded,
                  text: '${exam.questionsCount} ${s.Question}',
                ),
                _buildInfoBadge(
                  context: context,
                  icon: Icons.star_border_rounded,
                  text: hasTaken && exam.lastScore != null
                      ? '${exam.lastScore!.toInt()} / ${exam.totalMarks} ${s.Marks}'
                      : '${exam.totalMarks} ${s.Marks}',
                ),
              ],
            ),

            const SizedBox(height: AppSpacing.s16),

            // Action Button
            SizedBox(
              width: double.infinity,
              height: 44,
              child: ElevatedButton(
                onPressed: () {
                  if (hasTaken) {
                    if (exam.progressResult != null) {
                      context.push(
                        RouteNames.examResult,
                        extra: exam.progressResult,
                      );
                    }
                  } else {
                    context.push(RouteNames.exam, extra: exam);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: hasTaken
                      ? (isPassed
                          ? AppColors.customGreen(context)
                          : AppColors.primaryColor(context))
                      : AppColors.primaryColor(context),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      hasTaken ? Icons.visibility_rounded : Icons.play_arrow_rounded,
                      size: 20,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      hasTaken ? s.ViewResultAndReview : s.StartExamNow,
                      style: TextStyles.bold14.copyWith(color: Colors.white),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoBadge({
    required BuildContext context,
    required IconData icon,
    required String text,
  }) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 16,
          color: AppColors.textSecondaryColor(context),
        ),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyles.regular12.copyWith(
            color: AppColors.textSecondaryColor(context),
          ),
        ),
      ],
    );
  }
}
