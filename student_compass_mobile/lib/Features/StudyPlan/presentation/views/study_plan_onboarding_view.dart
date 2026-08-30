import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_cubit.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_state.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';

class StudyPlanOnboardingView extends StatefulWidget {
  const StudyPlanOnboardingView({super.key});

  @override
  State<StudyPlanOnboardingView> createState() =>
      _StudyPlanOnboardingViewState();
}

class _StudyPlanOnboardingViewState extends State<StudyPlanOnboardingView> {
  final Set<int> _selectedSubjectIds = {};
  int _daysUntilExam = 90;
  int _dailyStudyHours = 4;

  @override
  void initState() {
    super.initState();
    context.read<SubjectsCubit>().fetchSubjects();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: const CustomAppBar(title: 'تهيئة الخطة الدراسية'),
      body: BlocConsumer<StudyPlanCubit, StudyPlanState>(
        listener: (context, state) {
          if (state is StudyPlanSuccess) {
            customToastBar(
              context: context,
              message: 'تم تجهيز خطتك الدراسية بنجاح! 🎯',
              backgroundColor: AppColors.customGreen(),
              icon: Icons.check_circle_rounded,
              textColor: AppColors.white(),
            );
            context.pushReplacement(RouteNames.studyPlan);
          } else if (state is StudyPlanFailure) {
            customToastBar(
              context: context,
              message: state.errorMessage,
              backgroundColor: AppColors.red(),
              icon: Icons.error_outline_rounded,
              textColor: AppColors.white(),
            );
          }
        },
        builder: (context, state) {
          final isLoading = state is StudyPlanLoading;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.s18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Motivational Header
                Container(
                  padding: const EdgeInsets.all(AppSpacing.s16),
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor(
                      context,
                    ).withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: AppColors.primaryColor(
                        context,
                      ).withValues(alpha: 0.2),
                    ),
                  ),
                  child: Row(
                    children: [
                      const Text('🧭', style: TextStyle(fontSize: 32)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'أجب عن هذه الأسئلة البسيطة لنقوم ببناء جدول مذاكرة ذكي ومخصص لك.',
                          style: TextStyles.bold14.copyWith(
                            color: AppColors.primaryColor(context),
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.s24),

                // Question 1: Select Subjects
                Text(
                  '1. ما هي المواد التي تود التركيز عليها؟',
                  style: TextStyles.bold14.copyWith(
                    color: AppColors.textBoldColor(context),
                  ),
                ),
                const SizedBox(height: 10),

                BlocBuilder<SubjectsCubit, SubjectsState>(
                  builder: (context, subState) {
                    if (subState is SubjectsLoading) {
                      return const Center(child: CustomLoadingIndicator());
                    }

                    if (subState is SubjectsSuccess) {
                      final subjects = subState.subjects;

                      return Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: subjects.map((subject) {
                          final isSelected = _selectedSubjectIds.contains(
                            subject.id,
                          );

                          return FilterChip(
                            label: Text(subject.name),
                            selected: isSelected,
                            selectedColor: AppColors.primaryColor(context),
                            checkmarkColor: Colors.white,
                            labelStyle: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : AppColors.textPrimaryColor(context),
                              fontWeight: isSelected
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                            backgroundColor: AppColors.itemsColor(context),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: BorderSide(
                                color: isSelected
                                    ? AppColors.primaryColor(context)
                                    : AppColors.borderColor(context),
                              ),
                            ),
                            onSelected: (selected) {
                              setState(() {
                                if (selected) {
                                  _selectedSubjectIds.add(subject.id);
                                } else {
                                  _selectedSubjectIds.remove(subject.id);
                                }
                              });
                            },
                          );
                        }).toList(),
                      );
                    }

                    return const SizedBox.shrink();
                  },
                ),
                const SizedBox(height: AppSpacing.s24),

                // Question 2: Days until exam
                Text(
                  '2. كم يوماً متبقي حتى موعد الاختبارات الوزارية؟',
                  style: TextStyles.bold14.copyWith(
                    color: AppColors.textBoldColor(context),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: Slider(
                        value: _daysUntilExam.toDouble(),
                        min: 15,
                        max: 200,
                        divisions: 37,
                        activeColor: AppColors.primaryColor(context),
                        label: '$_daysUntilExam يوم',
                        onChanged: (val) {
                          setState(() {
                            _daysUntilExam = val.toInt();
                          });
                        },
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primaryColor(
                          context,
                        ).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '$_daysUntilExam يوم',
                        style: TextStyles.bold14.copyWith(
                          color: AppColors.primaryColor(context),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.s20),

                // Question 3: Daily study hours
                Text(
                  '3. كم ساعة يومياً يمكنك تخصيصها للمذاكرة؟',
                  style: TextStyles.bold14.copyWith(
                    color: AppColors.textBoldColor(context),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: Slider(
                        value: _dailyStudyHours.toDouble(),
                        min: 1,
                        max: 12,
                        divisions: 11,
                        activeColor: AppColors.customGreen(),
                        label: '$_dailyStudyHours ساعات',
                        onChanged: (val) {
                          setState(() {
                            _dailyStudyHours = val.toInt();
                          });
                        },
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.customGreen().withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '$_dailyStudyHours ساعات',
                        style: TextStyles.bold14.copyWith(
                          color: AppColors.customGreen(),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.s32),

                // Submit Button
                if (isLoading)
                  const Center(child: CustomLoadingIndicator())
                else
                  CustomButton(
                    title: 'إنشاء الجدول الدراسي الذكي 🎯',
                    onPressed: () {
                      if (_selectedSubjectIds.isEmpty) {
                        customToastBar(
                          context: context,
                          message:
                              'يرجى اختيار مادة واحدة على الأقل لبناء الخطة.',
                          backgroundColor: AppColors.red(),
                          icon: Icons.warning_amber_rounded,
                          textColor: AppColors.white(),
                        );
                        return;
                      }

                      context.read<StudyPlanCubit>().submitOnboarding(
                        subjectIds: _selectedSubjectIds.toList(),
                        daysUntilExam: _daysUntilExam,
                        dailyStudyHours: _dailyStudyHours,
                      );
                    },
                  ),
                const SizedBox(height: AppSpacing.s20),
              ],
            ),
          );
        },
      ),
    );
  }
}
