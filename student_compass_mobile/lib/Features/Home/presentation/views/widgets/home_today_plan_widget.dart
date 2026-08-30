import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/StudyPlan/data/models/study_plan_model.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_cubit.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class HomeTodayPlanWidget extends StatelessWidget {
  const HomeTodayPlanWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<StudyPlanCubit, StudyPlanState>(
      builder: (context, state) {
        StudyPlanModel? plan;
        if (state is StudyPlanSuccess) {
          plan = state.plan;
        } else if (state is StudyPlanRecalculated) {
          plan = state.plan;
        }

        if (plan == null || plan.tasks.isEmpty) {
          return _buildEmptyPlanCard(context);
        }

        final tasks = plan.tasks;
        final previewTasks = tasks.take(3).toList();
        final remainingCount = tasks.length - previewTasks.length;

        return Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppSpacing.s16),
          decoration: BoxDecoration(
            color: AppColors.itemsColor(context),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.borderColor(context)),
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
              // 1. Header Row
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primaryColor(context).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      Icons.event_note_rounded,
                      color: AppColors.primaryColor(context),
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'جدول ومهام اليوم',
                          style: TextStyles.bold14.copyWith(
                            color: AppColors.textBoldColor(context),
                          ),
                        ),
                        Text(
                          plan.planDate,
                          style: TextStyles.regular10.copyWith(
                            color: AppColors.textSecondaryColor(context),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: plan.completedTasks == plan.totalTasks && plan.totalTasks > 0
                          ? AppColors.customGreen().withValues(alpha: 0.15)
                          : AppColors.primaryColor(context).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${plan.completedTasks} من ${plan.totalTasks} مكتملة',
                      style: TextStyles.bold10.copyWith(
                        color: plan.completedTasks == plan.totalTasks && plan.totalTasks > 0
                            ? AppColors.customGreen()
                            : AppColors.primaryColor(context),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // 2. Progress Bar
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: LinearProgressIndicator(
                  value: (plan.progressPercentage / 100).clamp(0.0, 1.0),
                  minHeight: 6,
                  backgroundColor: AppColors.borderColor(context),
                  valueColor: AlwaysStoppedAnimation<Color>(
                    plan.progressPercentage >= 100
                        ? AppColors.customGreen()
                        : AppColors.primaryColor(context),
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // 3. First 3 Tasks List
              ...List.generate(previewTasks.length, (index) {
                final task = previewTasks[index];
                final isDone = task.isCompleted;

                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  decoration: BoxDecoration(
                    color: isDone
                        ? AppColors.customGreen().withValues(alpha: 0.05)
                        : AppColors.scaffoldBackgroundColor(null, context),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isDone
                          ? AppColors.customGreen().withValues(alpha: 0.25)
                          : AppColors.borderColor(context),
                    ),
                  ),
                  child: Row(
                    children: [
                      Checkbox(
                        value: isDone,
                        activeColor: AppColors.customGreen(),
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        visualDensity: VisualDensity.compact,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                        onChanged: (val) {
                          final newStatus = (val == true) ? 'completed' : 'not_started';
                          context.read<StudyPlanCubit>().updateTaskStatus(
                                taskId: task.id,
                                status: newStatus,
                              );
                        },
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              task.taskName,
                              style: TextStyles.bold12.copyWith(
                                color: isDone
                                    ? AppColors.textSecondaryColor(context)
                                    : AppColors.textBoldColor(context),
                                decoration: isDone ? TextDecoration.lineThrough : null,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            if (task.subjectName != null) ...[
                              const SizedBox(height: 2),
                              Text(
                                '${task.subjectName} • ${task.estimatedMinutes} دقيقة',
                                style: TextStyles.regular10.copyWith(
                                  color: AppColors.textSecondaryColor(context),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              }),

              const SizedBox(height: 6),

              // 4. View All Button
              InkWell(
                onTap: () {
                  context.push(RouteNames.studyPlan);
                },
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor(context).withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppColors.primaryColor(context).withValues(alpha: 0.2),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        remainingCount > 0
                            ? 'عرض الخطة كاملة ($remainingCount مهام إضافية) ⬅️'
                            : 'عرض تفاصيل الخطة الدراسية ⬅️',
                        style: TextStyles.bold12.copyWith(
                          color: AppColors.primaryColor(context),
                        ),
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

  Widget _buildEmptyPlanCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.s16),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderColor(context)),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor(context),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primaryColor(context).withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.auto_awesome_rounded,
              color: AppColors.primaryColor(context),
              size: 26,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'أنشئ جدولك الدراسي الذكي 🎯',
                  style: TextStyles.bold14.copyWith(
                    color: AppColors.textBoldColor(context),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'اختر موادك وحدد ساعات مذاكرتك ليتم جدولة دروسك تلقائياً.',
                  style: TextStyles.regular10.copyWith(
                    color: AppColors.textSecondaryColor(context),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          ElevatedButton(
            onPressed: () {
              context.push(RouteNames.studyPlanOnboarding);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryColor(context),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 0,
            ),
            child: const Text('ابدأ الآن', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
