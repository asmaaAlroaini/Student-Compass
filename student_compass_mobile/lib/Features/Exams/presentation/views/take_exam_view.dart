import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/take_exam_cubit/take_exam_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/take_exam_cubit/take_exam_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class TakeExamView extends StatefulWidget {
  final ExamModel exam;

  const TakeExamView({super.key, required this.exam});

  @override
  State<TakeExamView> createState() => _TakeExamViewState();
}

class _TakeExamViewState extends State<TakeExamView> {
  @override
  void initState() {
    super.initState();
    if (widget.exam.questions.isEmpty) {
      context.read<TakeExamCubit>().loadExamAndStart(widget.exam.id);
    } else {
      context.read<TakeExamCubit>().initializeExam(widget.exam);
    }
  }

  String _formatTime(int totalSeconds) {
    final minutes = totalSeconds ~/ 60;
    final seconds = totalSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  void _showSubmitConfirmationDialog() {
    final s = S.of(context);

    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        backgroundColor: AppColors.itemsColor(context),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          s.SubmitExam,
          style: TextStyles.bold18.copyWith(
            color: AppColors.textBoldColor(context),
          ),
        ),
        content: Text(
          s.SubmitExamConfirmation,
          style: TextStyles.regular14.copyWith(
            color: AppColors.textPrimaryColor(context),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: Text(
              s.ContinueSolving,
              style: TextStyles.semiBold14.copyWith(
                color: AppColors.textSecondaryColor(context),
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(dialogCtx);
              context.read<TakeExamCubit>().submitExam();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryColor(context),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: Text(
              s.SubmitAndCorrect,
              style: TextStyles.bold14.copyWith(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final shouldExit = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            backgroundColor: AppColors.itemsColor(context),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: Text(
              s.ExitExam,
              style: TextStyles.bold16.copyWith(
                color: AppColors.textBoldColor(context),
              ),
            ),
            content: Text(
              s.ExitExamConfirmation,
              style: TextStyles.regular14.copyWith(
                color: AppColors.textPrimaryColor(context),
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx, false),
                child: Text(s.Cancel),
              ),
              ElevatedButton(
                onPressed: () => Navigator.pop(ctx, true),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.red(context),
                ),
                child: Text(s.Exit),
              ),
            ],
          ),
        );
        if (shouldExit == true && mounted) {
          context.pop();
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
        body: BlocConsumer<TakeExamCubit, TakeExamState>(
          listener: (context, state) {
            if (state is TakeExamSubmitSuccess) {
              context.pushReplacement(
                RouteNames.examResult,
                extra: state.result,
              );
            } else if (state is TakeExamFailure) {
              customToastBar(
                context: context,
                message: state.errorMessage,
                backgroundColor: AppColors.red(context),
                icon: Icons.close,
                textColor: Colors.white,
              );
            }
          },
          builder: (context, state) {
            if (state is TakeExamLoading) {
              return const Center(child: CustomLoadingIndicator());
            }

            if (state is! TakeExamActive) {
              return const SizedBox.shrink();
            }

            final active = state;
            final questions = active.exam.questions;
            if (questions.isEmpty) {
              return Center(
                child: Text(
                  s.NoQuestionsInExam,
                  style: TextStyles.bold16.copyWith(
                    color: AppColors.textPrimaryColor(context),
                  ),
                ),
              );
            }

            final currentIndex = active.currentQuestionIndex;
            final currentQ = questions[currentIndex];
            final selectedAnswer = active.selectedAnswers[currentQ.id];
            final isLastQuestion = currentIndex == questions.length - 1;
            final progressVal = (currentIndex + 1) / questions.length;
            final isUrgentTime = active.remainingSeconds < 300;

            return SafeArea(
              child: Column(
                children: [
                  // 1. Top Header Bar (Timer & Exit)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.s16,
                      vertical: AppSpacing.s12,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.itemsColor(context),
                      border: Border(
                        bottom: BorderSide(
                          color: AppColors.borderColor(context),
                          width: 1,
                        ),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.close_rounded),
                          onPressed: () {
                            Navigator.maybePop(context);
                          },
                        ),
                        Expanded(
                          child: Text(
                            active.exam.title,
                            style: TextStyles.bold14.copyWith(
                              color: AppColors.textBoldColor(context),
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        // Countdown Timer Badge
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: isUrgentTime
                                ? AppColors.red(context).withValues(alpha: 0.15)
                                : AppColors.primaryColor(context)
                                    .withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: isUrgentTime
                                  ? AppColors.red(context)
                                  : AppColors.primaryColor(context),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.timer_outlined,
                                size: 16,
                                color: isUrgentTime
                                    ? AppColors.red(context)
                                    : AppColors.primaryColor(context),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                _formatTime(active.remainingSeconds),
                                style: TextStyles.bold14.copyWith(
                                  color: isUrgentTime
                                      ? AppColors.red(context)
                                      : AppColors.primaryColor(context),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // 2. Progress Indicator & Question Counter
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.s16,
                      vertical: AppSpacing.s12,
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${s.Question} ${currentIndex + 1} / ${questions.length}',
                              style: TextStyles.bold14.copyWith(
                                color: AppColors.textBoldColor(context),
                              ),
                            ),
                            Text(
                              '${currentQ.points} ${s.Marks}',
                              style: TextStyles.semiBold12.copyWith(
                                color: AppColors.textSecondaryColor(context),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progressVal,
                            minHeight: 6,
                            backgroundColor: AppColors.borderColor(context),
                            valueColor: AlwaysStoppedAnimation<Color>(
                              AppColors.primaryColor(context),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // 3. Question Text & Options (Scrollable)
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.s16,
                        vertical: AppSpacing.s8,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Question Box
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(AppSpacing.s20),
                            decoration: BoxDecoration(
                              color: AppColors.itemsColor(context),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: AppColors.borderColor(context),
                              ),
                            ),
                            child: Text(
                              currentQ.questionText,
                              style: TextStyles.bold16.copyWith(
                                color: AppColors.textBoldColor(context),
                                height: 1.5,
                              ),
                            ),
                          ),

                          const SizedBox(height: AppSpacing.s20),

                          // Options List
                          ...currentQ.options.map((option) {
                            final isSelected = selectedAnswer == option;

                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: InkWell(
                                onTap: () {
                                  context.read<TakeExamCubit>().selectAnswer(
                                        currentQ.id,
                                        option,
                                      );
                                },
                                borderRadius: BorderRadius.circular(14),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  padding: const EdgeInsets.all(AppSpacing.s16),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? AppColors.primaryColor(context)
                                            .withValues(alpha: 0.08)
                                        : AppColors.itemsColor(context),
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(
                                      color: isSelected
                                          ? AppColors.primaryColor(context)
                                          : AppColors.borderColor(context),
                                      width: isSelected ? 2 : 1,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 24,
                                        height: 24,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: isSelected
                                              ? AppColors.primaryColor(context)
                                              : Colors.transparent,
                                          border: Border.all(
                                            color: isSelected
                                                ? AppColors.primaryColor(context)
                                                : AppColors.textSecondaryColor(
                                                    context,
                                                  ),
                                            width: 2,
                                          ),
                                        ),
                                        child: isSelected
                                            ? const Icon(
                                                Icons.check,
                                                size: 14,
                                                color: Colors.white,
                                              )
                                            : null,
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Text(
                                          option,
                                          style: TextStyles.semiBold14.copyWith(
                                            color: isSelected
                                                ? AppColors.primaryColor(context)
                                                : AppColors.textPrimaryColor(
                                                    context,
                                                  ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                  ),

                  // 4. Bottom Navigation Bar (Previous / Next / Submit)
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.s16),
                    decoration: BoxDecoration(
                      color: AppColors.itemsColor(context),
                      border: Border(
                        top: BorderSide(
                          color: AppColors.borderColor(context),
                          width: 1,
                        ),
                      ),
                    ),
                    child: Row(
                      children: [
                        if (currentIndex > 0)
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                context
                                    .read<TakeExamCubit>()
                                    .previousQuestion();
                              },
                              style: OutlinedButton.styleFrom(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: Text(s.Previous),
                            ),
                          ),
                        if (currentIndex > 0) const SizedBox(width: 12),
                        Expanded(
                          flex: 2,
                          child: ElevatedButton(
                            onPressed: active.isSubmitting
                                ? null
                                : () {
                                    if (isLastQuestion) {
                                      _showSubmitConfirmationDialog();
                                    } else {
                                      context
                                          .read<TakeExamCubit>()
                                          .nextQuestion();
                                    }
                                  },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isLastQuestion
                                  ? AppColors.customGreen(context)
                                  : AppColors.primaryColor(context),
                              foregroundColor: Colors.white,
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 0,
                            ),
                            child: active.isSubmitting
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2,
                                    ),
                                  )
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        isLastQuestion
                                            ? s.SubmitExam
                                            : s.Next,
                                        style: TextStyles.bold14.copyWith(
                                          color: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(width: 6),
                                      Icon(
                                        isLastQuestion
                                            ? Icons.check_circle_outline
                                            : Icons.arrow_forward_ios_rounded,
                                        size: 16,
                                      ),
                                    ],
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
