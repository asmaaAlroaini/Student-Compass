import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/custom_exam_request_model.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/custom_exam_cubit/custom_exam_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/custom_exam_cubit/custom_exam_state.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/subject_model.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class CustomExamBuilderCard extends StatefulWidget {
  const CustomExamBuilderCard({super.key});

  @override
  State<CustomExamBuilderCard> createState() => _CustomExamBuilderCardState();
}

class _CustomExamBuilderCardState extends State<CustomExamBuilderCard> {
  int? selectedSubjectId;
  String? selectedDifficulty;
  int questionCount = 10;

  @override
  void initState() {
    super.initState();
    final subjectsState = context.read<SubjectsCubit>().state;
    if (subjectsState is SubjectsSuccess && subjectsState.subjects.isNotEmpty) {
      selectedSubjectId = subjectsState.subjects.first.id;
    } else {
      context.read<SubjectsCubit>().fetchSubjects();
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);

    return BlocConsumer<CustomExamCubit, CustomExamState>(
      listener: (context, state) {
        if (state is CustomExamSuccess) {
          customToastBar(
            context: context,
            message: s.ExamGeneratedSuccess,
            backgroundColor: AppColors.customGreen(context),
            icon: Icons.check,
            textColor: Colors.white,
          );
          context.push(RouteNames.exam, extra: state.exam);
        } else if (state is CustomExamFailure) {
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
        final isGenerating = state is CustomExamLoading;

        return Container(
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
                offset: const Offset(0, 6),
              ),
            ],
          ),
          padding: const EdgeInsets.all(AppSpacing.s20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.primaryColor(context).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      Icons.auto_awesome_rounded,
                      color: AppColors.primaryColor(context),
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          s.GenerateSmartExam,
                          style: TextStyles.bold16.copyWith(
                            color: AppColors.textBoldColor(context),
                          ),
                        ),
                        Text(
                          s.CustomizeSubjectAndDifficulty,
                          style: TextStyles.regular12.copyWith(
                            color: AppColors.textSecondaryColor(context),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: AppSpacing.s20),

              // 1. اختيار المادة
              Text(
                s.SelectSubject,
                style: TextStyles.semiBold14.copyWith(
                  color: AppColors.textPrimaryColor(context),
                ),
              ),
              const SizedBox(height: AppSpacing.s8),
              BlocBuilder<SubjectsCubit, SubjectsState>(
                builder: (context, subState) {
                  if (subState is SubjectsLoading) {
                    return const Center(
                      child: Padding(
                        padding: EdgeInsets.all(8.0),
                        child: CustomLoadingIndicator(),
                      ),
                    );
                  }

                  if (subState is SubjectsSuccess) {
                    final subjects = subState.subjects;
                    if (subjects.isEmpty) {
                      return Text(
                        s.NoSubjectsAvailable,
                        style: TextStyles.regular12.copyWith(
                          color: AppColors.textSecondaryColor(context),
                        ),
                      );
                    }

                    if (selectedSubjectId == null && subjects.isNotEmpty) {
                      selectedSubjectId = subjects.first.id;
                    }

                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: AppColors.textFeilColor(context),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AppColors.borderColor(context),
                          width: 1,
                        ),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<int>(
                          value: subjects.any((s) => s.id == selectedSubjectId)
                              ? selectedSubjectId
                              : subjects.first.id,
                          isExpanded: true,
                          dropdownColor: AppColors.itemsColor(context),
                          items: subjects.map((SubjectModel sItem) {
                            return DropdownMenuItem<int>(
                              value: sItem.id,
                              child: Text(
                                sItem.name,
                                style: TextStyles.semiBold14.copyWith(
                                  color: AppColors.textPrimaryColor(context),
                                ),
                              ),
                            );
                          }).toList(),
                          onChanged: (val) {
                            setState(() {
                              selectedSubjectId = val;
                            });
                          },
                        ),
                      ),
                    );
                  }

                  return const SizedBox.shrink();
                },
              ),

              const SizedBox(height: AppSpacing.s16),

              // 2. مستوى الصعوبة
              Text(
                s.DifficultyLevel,
                style: TextStyles.semiBold14.copyWith(
                  color: AppColors.textPrimaryColor(context),
                ),
              ),
              const SizedBox(height: AppSpacing.s8),
              Row(
                children: [
                  _buildDifficultyChip(s.AllLevels, null),
                  const SizedBox(width: 8),
                  _buildDifficultyChip(s.Easy, 'easy'),
                  const SizedBox(width: 8),
                  _buildDifficultyChip(s.Medium, 'medium'),
                  const SizedBox(width: 8),
                  _buildDifficultyChip(s.Hard, 'hard'),
                ],
              ),

              const SizedBox(height: AppSpacing.s16),

              // 3. عدد الأسئلة
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    s.QuestionsCount,
                    style: TextStyles.semiBold14.copyWith(
                      color: AppColors.textPrimaryColor(context),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primaryColor(context).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '$questionCount ${s.Question}',
                      style: TextStyles.bold14.copyWith(
                        color: AppColors.primaryColor(context),
                      ),
                    ),
                  ),
                ],
              ),
              Slider(
                value: questionCount.toDouble(),
                min: 5,
                max: 30,
                divisions: 5,
                activeColor: AppColors.primaryColor(context),
                inactiveColor: AppColors.borderColor(context),
                onChanged: (val) {
                  setState(() {
                    questionCount = val.toInt();
                  });
                },
              ),

              const SizedBox(height: AppSpacing.s16),

              // Generate & Start Button
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: isGenerating || selectedSubjectId == null
                      ? null
                      : () {
                          final request = CustomExamRequestModel(
                            subjectId: selectedSubjectId!,
                            difficulty: selectedDifficulty,
                            questionCount: questionCount,
                          );
                          context
                              .read<CustomExamCubit>()
                              .generateCustomExam(request: request);
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryColor(context),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  child: isGenerating
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2.5,
                          ),
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.flash_on_rounded, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              s.GenerateAndStartExam,
                              style: TextStyles.bold14.copyWith(color: Colors.white),
                            ),
                          ],
                        ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDifficultyChip(String label, String? value) {
    final isSelected = selectedDifficulty == value;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            selectedDifficulty = value;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primaryColor(context)
                : AppColors.textFeilColor(context),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected
                  ? AppColors.primaryColor(context)
                  : AppColors.borderColor(context),
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyles.semiBold12.copyWith(
                color: isSelected
                    ? Colors.white
                    : AppColors.textPrimaryColor(context),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
