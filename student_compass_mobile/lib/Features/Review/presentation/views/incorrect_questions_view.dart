import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Review/presentation/logic/incorrect_questions_cubit/incorrect_questions_cubit.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/core/widgets/report_question_dialog.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_question_model.dart';

class IncorrectQuestionsView extends StatefulWidget {
  const IncorrectQuestionsView({super.key});

  @override
  State<IncorrectQuestionsView> createState() => _IncorrectQuestionsViewState();
}

class _IncorrectQuestionsViewState extends State<IncorrectQuestionsView> {
  final Map<int, bool> _showExplanation = {};
  final Map<int, String?> _retryAnswers = {};

  @override
  void initState() {
    super.initState();
    context.read<IncorrectQuestionsCubit>().fetchIncorrectQuestions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: const CustomAppBar(title: 'مراجعة أخطائي'),
      body: BlocBuilder<IncorrectQuestionsCubit, IncorrectQuestionsState>(
        builder: (context, state) {
          if (state is IncorrectQuestionsLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is IncorrectQuestionsFailure) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.s24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.error_outline_rounded, size: 56, color: AppColors.red().withValues(alpha: 0.6)),
                    const SizedBox(height: 16),
                    Text(
                      Failure.localizedMessage(context, errorMessage: state.errorMessage, errorKey: state.errorKey),
                      textAlign: TextAlign.center,
                      style: TextStyles.semiBold14.copyWith(color: AppColors.textSecondaryColor(context)),
                    ),
                    const SizedBox(height: 20),
                    TextButton.icon(
                      onPressed: () => context.read<IncorrectQuestionsCubit>().fetchIncorrectQuestions(),
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state is IncorrectQuestionsSuccess) {
            final questions = state.questions;

            if (questions.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('🎉', style: TextStyle(fontSize: 56)),
                    const SizedBox(height: 16),
                    Text(
                      'ممتاز! لا توجد أسئلة خاطئة لديك حتى الآن',
                      style: TextStyles.bold16.copyWith(color: AppColors.textBoldColor(context)),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'استمر في حل الاختبارات لتقوية مستواك.',
                      style: TextStyles.regular14.copyWith(color: AppColors.textSecondaryColor(context)),
                    ),
                  ],
                ),
              );
            }

            return RefreshIndicator(
              onRefresh: () async => context.read<IncorrectQuestionsCubit>().fetchIncorrectQuestions(),
              child: Column(
                children: [
                  // Header Summary
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s16, vertical: AppSpacing.s12),
                    color: AppColors.red().withValues(alpha: 0.08),
                    child: Row(
                      children: [
                        Icon(Icons.close_rounded, color: AppColors.red(), size: 20),
                        const SizedBox(width: 8),
                        Text(
                          'يوجد ${questions.length} سؤال بحاجة لمراجعة',
                          style: TextStyles.bold14.copyWith(color: AppColors.red()),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(AppSpacing.s16),
                      itemCount: questions.length,
                      itemBuilder: (context, index) {
                        final q = questions[index];
                        return _buildIncorrectQuestionCard(context, q, index);
                      },
                    ),
                  ),
                ],
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildIncorrectQuestionCard(BuildContext context, ExamQuestionModel q, int index) {
    final showExp = _showExplanation[index] ?? false;
    final retryAnswer = _retryAnswers[index];

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.s16),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.borderColor(context)),
        boxShadow: [BoxShadow(color: AppColors.shadowColor(context), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.s16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Question Number + Report Button + Difficulty Badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('سؤال ${index + 1}', style: TextStyles.bold12.copyWith(color: AppColors.primaryColor(context))),
                Row(
                  children: [
                    InkWell(
                      onTap: () {
                        ReportQuestionDialog.show(context, questionId: q.id);
                      },
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        child: Row(
                          children: [
                            Icon(Icons.flag_outlined, size: 14, color: AppColors.textSecondaryColor(context)),
                            const SizedBox(width: 3),
                            Text('إبلاغ', style: TextStyles.regular10.copyWith(color: AppColors.textSecondaryColor(context))),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.red().withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(q.difficulty, style: TextStyles.bold10.copyWith(color: AppColors.red())),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 10),
            // Question Text
            Text(q.questionText, style: TextStyles.bold14.copyWith(color: AppColors.textBoldColor(context), height: 1.5)),
            const SizedBox(height: 14),

            // Retry Options
            if (q.options.isNotEmpty)
              ...q.options.map((option) {
                final isCorrectOption = option.trim().toLowerCase() == (q.correctAnswer ?? '').trim().toLowerCase();
                final isRetrySelected = retryAnswer == option;
                final hasRetried = retryAnswer != null;

                Color borderColor = AppColors.borderColor(context);
                Color bgColor = AppColors.scaffoldBackgroundColor(null, context);

                if (hasRetried) {
                  if (isCorrectOption) {
                    borderColor = AppColors.customGreen();
                    bgColor = AppColors.customGreen().withValues(alpha: 0.08);
                  } else if (isRetrySelected) {
                    borderColor = AppColors.red();
                    bgColor = AppColors.red().withValues(alpha: 0.08);
                  }
                }

                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _retryAnswers[index] = option;
                      _showExplanation[index] = true;
                    });
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: bgColor,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: borderColor, width: 1.5),
                    ),
                    child: Row(
                      children: [
                        Expanded(child: Text(option, style: TextStyles.regular13.copyWith(color: AppColors.textPrimaryColor(context)))),
                        if (hasRetried && isCorrectOption)
                          Icon(Icons.check_circle_rounded, color: AppColors.customGreen(), size: 18),
                        if (hasRetried && isRetrySelected && !isCorrectOption)
                          Icon(Icons.cancel_rounded, color: AppColors.red(), size: 18),
                      ],
                    ),
                  ),
                );
              }),

            // Your Previous Wrong Answer
            if (q.studentAnswer != null) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.red().withValues(alpha: 0.07),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.red().withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.history_rounded, size: 16, color: AppColors.red()),
                    const SizedBox(width: 8),
                    Text('إجابتك السابقة: ', style: TextStyles.bold12.copyWith(color: AppColors.red())),
                    Expanded(child: Text(q.studentAnswer!, style: TextStyles.regular12.copyWith(color: AppColors.red()))),
                  ],
                ),
              ),
            ],

            // Explanation toggle
            if (q.explanation != null && q.explanation!.isNotEmpty) ...[
              const SizedBox(height: 12),
              GestureDetector(
                onTap: () => setState(() => _showExplanation[index] = !showExp),
                child: Row(
                  children: [
                    Icon(showExp ? Icons.expand_less : Icons.expand_more, color: AppColors.primaryColor(context), size: 20),
                    const SizedBox(width: 4),
                    Text(showExp ? 'إخفاء الشرح' : 'عرض الشرح والتوضيح',
                        style: TextStyles.semiBold12.copyWith(color: AppColors.primaryColor(context))),
                  ],
                ),
              ),
              if (showExp) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor(context).withValues(alpha: 0.06),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(q.explanation!, style: TextStyles.regular13.copyWith(color: AppColors.textPrimaryColor(context), height: 1.5)),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }
}
