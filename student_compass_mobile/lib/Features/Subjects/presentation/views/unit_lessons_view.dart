import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/lesson_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/subject_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/unit_model.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/unit_lessons_cubit/unit_lessons_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/unit_lessons_cubit/unit_lessons_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';

class UnitLessonsView extends StatefulWidget {
  final SubjectModel subject;
  final UnitModel unit;

  const UnitLessonsView({
    super.key,
    required this.subject,
    required this.unit,
  });

  @override
  State<UnitLessonsView> createState() => _UnitLessonsViewState();
}

class _UnitLessonsViewState extends State<UnitLessonsView> {
  @override
  void initState() {
    super.initState();
    _loadLessons();
  }

  void _loadLessons() {
    context.read<UnitLessonsCubit>().fetchUnitLessons(
          subjectId: widget.subject.id,
          unitId: widget.unit.id,
        );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(
        title: widget.unit.title,
      ),
      body: BlocBuilder<UnitLessonsCubit, UnitLessonsState>(
        builder: (context, state) {
          if (state is UnitLessonsLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is UnitLessonsFailure) {
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
                      onPressed: _loadLessons,
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state is UnitLessonsSuccess) {
            final lessons = state.lessons;

            if (lessons.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.menu_book_outlined,
                      size: 56,
                      color: AppColors.primaryColor(context).withValues(alpha: 0.4),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'لا توجد دروس متوفرة لهذه الوحدة حالياً',
                      style: TextStyles.semiBold16.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                  ],
                ),
              );
            }

            return RefreshIndicator(
              onRefresh: () async => _loadLessons(),
              child: ListView.builder(
                padding: const EdgeInsets.all(AppSpacing.s16),
                itemCount: lessons.length,
                itemBuilder: (context, index) {
                  final lesson = lessons[index];
                  return _buildLessonCard(context, lesson, index);
                },
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildLessonCard(BuildContext context, LessonModel lesson, int index) {
    final isCompleted = lesson.isCompleted;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.s12),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isCompleted
              ? AppColors.customGreen().withValues(alpha: 0.5)
              : AppColors.borderColor(context),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor(context),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            context.push(
              '/lesson-journey',
              extra: {
                'lesson_id': lesson.id,
                'title': lesson.title,
                'lesson': lesson,
                'subject': widget.subject,
                'unit': widget.unit,
              },
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.s16),
            child: Row(
              children: [
                // Lesson Order Circle Badge
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: isCompleted
                        ? AppColors.customGreen().withValues(alpha: 0.15)
                        : AppColors.primaryColor(context).withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: isCompleted
                        ? Icon(
                            Icons.check_circle_rounded,
                            color: AppColors.customGreen(),
                            size: 24,
                          )
                        : Text(
                            '${index + 1}',
                            style: TextStyles.bold16.copyWith(
                              color: AppColors.primaryColor(context),
                            ),
                          ),
                  ),
                ),
                const SizedBox(width: AppSpacing.s14),

                // Lesson Info & Progress
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        lesson.title,
                        style: TextStyles.bold14.copyWith(
                          color: AppColors.textBoldColor(context),
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(
                            Icons.quiz_outlined,
                            size: 14,
                            color: AppColors.textSecondaryColor(context),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${lesson.questionsCount} سؤال تثبيت',
                            style: TextStyles.regular12.copyWith(
                              color: AppColors.textSecondaryColor(context),
                            ),
                          ),
                          const Spacer(),
                          Text(
                            '${lesson.progressPercentage}%',
                            style: TextStyles.bold12.copyWith(
                              color: isCompleted
                                  ? AppColors.customGreen()
                                  : AppColors.primaryColor(context),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: (lesson.progressPercentage / 100).clamp(0.0, 1.0),
                          minHeight: 5,
                          backgroundColor: AppColors.borderColor(context),
                          valueColor: AlwaysStoppedAnimation<Color>(
                            isCompleted
                                ? AppColors.customGreen()
                                : AppColors.primaryColor(context),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: AppSpacing.s10),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 16,
                  color: AppColors.textSecondaryColor(context),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
