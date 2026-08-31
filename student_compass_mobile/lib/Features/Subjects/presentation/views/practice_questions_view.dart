import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/practice_questions_cubit/practice_questions_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/practice_questions_cubit/practice_questions_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';
import 'package:student_compass_mobile/core/widgets/report_question_dialog.dart';

class PracticeQuestionsView extends StatefulWidget {
  final int lessonId;
  final String title;

  const PracticeQuestionsView({
    super.key,
    required this.lessonId,
    required this.title,
  });

  @override
  State<PracticeQuestionsView> createState() => _PracticeQuestionsViewState();
}

class _PracticeQuestionsViewState extends State<PracticeQuestionsView> {
  int _currentIndex = 0;
  final Map<int, String> _selectedAnswers = {};
  int _correctAnswersCount = 0;
  int _wrongAnswersCount = 0;

  @override
  void initState() {
    super.initState();
    context.read<PracticeQuestionsCubit>().fetchQuestions(
      lessonId: widget.lessonId,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(title: 'أسئلة التثبيت: ${widget.title}'),
      body: BlocBuilder<PracticeQuestionsCubit, PracticeQuestionsState>(
        builder: (context, state) {
          if (state is PracticeQuestionsLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is PracticeQuestionsFailure) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.s24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline_rounded,
                      size: 56,
                      color: AppColors.red().withValues(alpha: 0.6),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      Failure.localizedMessage(
                        context,
                        errorMessage: state.errorMessage,
                        errorKey: state.errorKey,
                      ),
                      textAlign: TextAlign.center,
                      style: TextStyles.semiBold14.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextButton.icon(
                      onPressed: () {
                        context.read<PracticeQuestionsCubit>().fetchQuestions(
                          lessonId: widget.lessonId,
                        );
                      },
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state is PracticeQuestionsSuccess) {
            final questions = state.questions;

            if (questions.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.quiz_outlined,
                      size: 56,
                      color: AppColors.primaryColor(
                        context,
                      ).withValues(alpha: 0.4),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'لا توجد أسئلة تثبيت مضافة لهذا الدرس حالياً',
                      style: TextStyles.semiBold16.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                  ],
                ),
              );
            }

            final currentQuestion = questions[_currentIndex];
            final selectedAnswer = _selectedAnswers[_currentIndex];
            final hasAnswered = selectedAnswer != null;
            final isAnswerCorrect =
                hasAnswered &&
                selectedAnswer.trim().toLowerCase() ==
                    (currentQuestion.correctAnswer ?? '').trim().toLowerCase();

            return Column(
              children: [
                // Top Progress & Stats Bar
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.s16,
                    vertical: AppSpacing.s12,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.itemsColor(context),
                    border: Border(
                      bottom: BorderSide(color: AppColors.borderColor(context)),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'السؤال ${_currentIndex + 1} من ${questions.length}',
                        style: TextStyles.bold14.copyWith(
                          color: AppColors.textBoldColor(context),
                        ),
                      ),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.customGreen().withValues(
                                alpha: 0.15,
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.check,
                                  size: 14,
                                  color: AppColors.customGreen(),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '$_correctAnswersCount',
                                  style: TextStyles.bold12.copyWith(
                                    color: AppColors.customGreen(),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.red().withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.close,
                                  size: 14,
                                  color: AppColors.red(),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '$_wrongAnswersCount',
                                  style: TextStyles.bold12.copyWith(
                                    color: AppColors.red(),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Question Content
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(AppSpacing.s16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Question Card
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(AppSpacing.s16),
                          decoration: BoxDecoration(
                            color: AppColors.itemsColor(context),
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: AppColors.borderColor(context),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  if (currentQuestion.source != null)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 8,
                                        vertical: 3,
                                      ),
                                      decoration: BoxDecoration(
                                        color: AppColors.primaryColor(
                                          context,
                                        ).withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        currentQuestion.source!,
                                        style: TextStyles.semiBold10.copyWith(
                                          color: AppColors.primaryColor(context),
                                        ),
                                      ),
                                    )
                                  else
                                    const SizedBox.shrink(),
                                  InkWell(
                                    onTap: () {
                                      ReportQuestionDialog.show(
                                        context,
                                        questionId: currentQuestion.id,
                                      );
                                    },
                                    borderRadius: BorderRadius.circular(8),
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(
                                            Icons.flag_outlined,
                                            size: 14,
                                            color: AppColors.textSecondaryColor(context),
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            'إبلاغ عن خطأ',
                                            style: TextStyles.regular10.copyWith(
                                              color: AppColors.textSecondaryColor(context),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                currentQuestion.questionText,
                                style: TextStyles.bold16.copyWith(
                                  color: AppColors.textBoldColor(context),
                                  height: 1.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: AppSpacing.s16),

                        // Options
                        ...List.generate(currentQuestion.options.length, (
                          optIdx,
                        ) {
                          final optionText = currentQuestion.options[optIdx];
                          return _buildOptionCard(
                            context: context,
                            optionText: optionText,
                            isSelected: selectedAnswer == optionText,
                            hasAnswered: hasAnswered,
                            isCorrectOption:
                                (currentQuestion.correctAnswer ?? '')
                                    .trim()
                                    .toLowerCase() ==
                                optionText.trim().toLowerCase(),
                            onTap: () {
                              if (!hasAnswered) {
                                setState(() {
                                  _selectedAnswers[_currentIndex] = optionText;
                                  if (optionText.trim().toLowerCase() ==
                                      (currentQuestion.correctAnswer ?? '')
                                          .trim()
                                          .toLowerCase()) {
                                    _correctAnswersCount++;
                                  } else {
                                    _wrongAnswersCount++;
                                  }
                                });
                              }
                            },
                          );
                        }),

                        // Explanation Box
                        if (hasAnswered &&
                            currentQuestion.explanation != null &&
                            currentQuestion.explanation!.isNotEmpty) ...[
                          const SizedBox(height: AppSpacing.s16),
                          Container(
                            padding: const EdgeInsets.all(AppSpacing.s14),
                            decoration: BoxDecoration(
                              color: isAnswerCorrect
                                  ? AppColors.customGreen().withValues(
                                      alpha: 0.08,
                                    )
                                  : AppColors.red().withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: isAnswerCorrect
                                    ? AppColors.customGreen().withValues(
                                        alpha: 0.3,
                                      )
                                    : AppColors.red().withValues(alpha: 0.3),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      isAnswerCorrect
                                          ? Icons.check_circle_rounded
                                          : Icons.info_outline_rounded,
                                      color: isAnswerCorrect
                                          ? AppColors.customGreen()
                                          : AppColors.red(),
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      isAnswerCorrect
                                          ? 'إجابة صحيحة! 👏'
                                          : 'إجابة غير صحيحة 💡',
                                      style: TextStyles.bold14.copyWith(
                                        color: isAnswerCorrect
                                            ? AppColors.customGreen()
                                            : AppColors.red(),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  currentQuestion.explanation!,
                                  style: TextStyles.regular12.copyWith(
                                    color: AppColors.textPrimaryColor(context),
                                    height: 1.5,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),

                // Bottom Navigation
                Container(
                  padding: const EdgeInsets.all(AppSpacing.s16),
                  decoration: BoxDecoration(
                    color: AppColors.itemsColor(context),
                    border: Border(
                      top: BorderSide(color: AppColors.borderColor(context)),
                    ),
                  ),
                  child: Row(
                    children: [
                      if (_currentIndex > 0)
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _currentIndex--;
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text('السابق'),
                          ),
                        ),
                      if (_currentIndex > 0) const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: CustomButton(
                          title: _currentIndex < questions.length - 1
                              ? 'السؤال التالي ➡️'
                              : 'إنهاء التدريب ✔️',
                          onPressed: () {
                            if (_currentIndex < questions.length - 1) {
                              setState(() {
                                _currentIndex++;
                              });
                            } else {
                              Navigator.pop(context);
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildOptionCard({
    required BuildContext context,
    required String optionText,
    required bool isSelected,
    required bool hasAnswered,
    required bool isCorrectOption,
    required VoidCallback onTap,
  }) {
    Color borderColor = AppColors.borderColor(context);
    Color bgColor = AppColors.itemsColor(context);
    Color textColor = AppColors.textPrimaryColor(context);
    IconData? trailingIcon;

    if (hasAnswered) {
      if (isCorrectOption) {
        borderColor = AppColors.customGreen();
        bgColor = AppColors.customGreen().withValues(alpha: 0.1);
        textColor = AppColors.customGreen();
        trailingIcon = Icons.check_circle_rounded;
      } else if (isSelected && !isCorrectOption) {
        borderColor = AppColors.red();
        bgColor = AppColors.red().withValues(alpha: 0.1);
        textColor = AppColors.red();
        trailingIcon = Icons.cancel_rounded;
      }
    } else if (isSelected) {
      borderColor = AppColors.primaryColor(context);
      bgColor = AppColors.primaryColor(context).withValues(alpha: 0.08);
      textColor = AppColors.primaryColor(context);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.s10),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1.5),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.s16,
              vertical: AppSpacing.s14,
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    optionText,
                    style: TextStyles.bold14.copyWith(color: textColor),
                  ),
                ),
                if (trailingIcon != null) ...[
                  const SizedBox(width: 8),
                  Icon(trailingIcon, color: textColor, size: 20),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
