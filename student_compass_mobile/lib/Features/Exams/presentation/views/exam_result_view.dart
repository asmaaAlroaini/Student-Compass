import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_result_model.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class ExamResultView extends StatelessWidget {
  final ExamResultModel result;

  const ExamResultView({super.key, required this.result});

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    final isPassed = result.isPassed;
    final primaryColor = isPassed
        ? AppColors.customGreen(context)
        : AppColors.red(context);

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(
        title: s.ExamResultTitle,
        showBackButton: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.s16),
        child: Column(
          children: [
            // 1. Result Header Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.s24),
              decoration: BoxDecoration(
                color: AppColors.itemsColor(context),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: AppColors.borderColor(context),
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.shadowColor(context),
                    blurRadius: 15,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Text(
                    result.examTitle,
                    style: TextStyles.bold16.copyWith(
                      color: AppColors.textBoldColor(context),
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.s20),

                  // Circular Percentage Display
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      SizedBox(
                        width: 120,
                        height: 120,
                        child: CircularProgressIndicator(
                          value: (result.percentage / 100).clamp(0.0, 1.0),
                          strokeWidth: 10,
                          backgroundColor: AppColors.borderColor(context),
                          valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
                        ),
                      ),
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '${result.percentage.toStringAsFixed(1)}%',
                            style: TextStyles.bold24.copyWith(
                              color: AppColors.textBoldColor(context),
                            ),
                          ),
                          Text(
                            '${result.score} / ${result.totalPossibleScore}',
                            style: TextStyles.semiBold12.copyWith(
                              color: AppColors.textSecondaryColor(context),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: AppSpacing.s16),

                  // Passed / Failed Badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: primaryColor.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      isPassed ? s.ExamPassedSuccess : s.ExamNeedsReview,
                      style: TextStyles.bold14.copyWith(color: primaryColor),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.s16),

            // 2. Stats Grid
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    context: context,
                    icon: Icons.check_circle_outline,
                    color: AppColors.customGreen(context),
                    title: s.CorrectAnswers,
                    value: '${result.correctCount}',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    context: context,
                    icon: Icons.cancel_outlined,
                    color: AppColors.red(context),
                    title: s.WrongAnswers,
                    value: '${result.wrongCount}',
                  ),
                ),
              ],
            ),

            const SizedBox(height: AppSpacing.s24),

            // 3. Question-by-Question Review Section
            Row(
              children: [
                Icon(
                  Icons.rate_review_outlined,
                  color: AppColors.primaryColor(context),
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  s.ReviewQuestionsAndExplanations,
                  style: TextStyles.bold16.copyWith(
                    color: AppColors.textBoldColor(context),
                  ),
                ),
              ],
            ),

            const SizedBox(height: AppSpacing.s12),

            ...result.details.asMap().entries.map((entry) {
              final index = entry.key;
              final detail = entry.value;
              final isCorrect = detail.isCorrect;

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(AppSpacing.s16),
                decoration: BoxDecoration(
                  color: AppColors.itemsColor(context),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isCorrect
                        ? AppColors.customGreen(context).withValues(alpha: 0.5)
                        : AppColors.red(context).withValues(alpha: 0.5),
                    width: 1.2,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Question Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${s.Question} ${index + 1}',
                          style: TextStyles.bold14.copyWith(
                            color: AppColors.textBoldColor(context),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: isCorrect
                                ? AppColors.customGreen(context).withValues(alpha: 0.15)
                                : AppColors.red(context).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            isCorrect
                                ? '+${detail.marksAwarded} ${s.Marks}'
                                : '0 ${s.Marks}',
                            style: TextStyles.bold12.copyWith(
                              color: isCorrect
                                  ? AppColors.customGreen(context)
                                  : AppColors.red(context),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 8),

                    Text(
                      detail.questionText,
                      style: TextStyles.semiBold14.copyWith(
                        color: AppColors.textPrimaryColor(context),
                        height: 1.4,
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Student Answer
                    _buildAnswerRow(
                      label: s.YourAnswer,
                      text: detail.studentAnswer ?? s.NoAnswerProvided,
                      isCorrect: isCorrect,
                      context: context,
                    ),

                    if (!isCorrect) ...[
                      const SizedBox(height: 6),
                      // Correct Answer
                      _buildAnswerRow(
                        label: s.CorrectAnswerIs,
                        text: detail.correctAnswer,
                        isCorrect: true,
                        context: context,
                      ),
                    ],

                    // Explanation
                    if (detail.explanation != null &&
                        detail.explanation!.isNotEmpty) ...[
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.textFeilColor(context),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              Icons.lightbulb_outline,
                              size: 16,
                              color: AppColors.customOrange(context),
                            ),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                '${s.Explanation} ${detail.explanation}',
                                style: TextStyles.regular12.copyWith(
                                  color: AppColors.textSecondaryColor(context),
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              );
            }),

            const SizedBox(height: AppSpacing.s24),

            // Back to Dashboard / Exams Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  context.go(RouteNames.dashboard, extra: 2); // Tab 2 = Exams
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryColor(context),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  s.BackToExamsList,
                  style: TextStyles.bold14.copyWith(color: Colors.white),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.s20),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required BuildContext context,
    required IconData icon,
    required Color color,
    required String title,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.s16),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderColor(context)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyles.bold20.copyWith(color: color),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: TextStyles.regular12.copyWith(
              color: AppColors.textSecondaryColor(context),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnswerRow({
    required String label,
    required String text,
    required bool isCorrect,
    required BuildContext context,
  }) {
    return Row(
      children: [
        Text(
          label,
          style: TextStyles.semiBold12.copyWith(
            color: AppColors.textSecondaryColor(context),
          ),
        ),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            style: TextStyles.bold12.copyWith(
              color: isCorrect
                  ? AppColors.customGreen(context)
                  : AppColors.red(context),
            ),
          ),
        ),
      ],
    );
  }
}
