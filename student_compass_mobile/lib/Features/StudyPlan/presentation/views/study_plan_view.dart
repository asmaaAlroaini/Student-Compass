import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/StudyPlan/data/models/study_plan_model.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_cubit.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';

class StudyPlanView extends StatefulWidget {
  const StudyPlanView({super.key});

  @override
  State<StudyPlanView> createState() => _StudyPlanViewState();
}

class _StudyPlanViewState extends State<StudyPlanView> {
  @override
  void initState() {
    super.initState();
    context.read<StudyPlanCubit>().fetchTodayPlan();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(
        title: 'خطتي الدراسية اليومية',
        onBackTap: () {
          if (context.canPop()) {
            context.pop();
          } else {
            context.go(RouteNames.dashboard);
          }
        },
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_suggest_rounded),
            tooltip: 'تهيئة الخطة',
            onPressed: () {
              context.push(RouteNames.studyPlanOnboarding);
            },
          ),
        ],
      ),
      body: BlocConsumer<StudyPlanCubit, StudyPlanState>(
        listener: (context, state) {
          if (state is StudyPlanRecalculated) {
            customToastBar(
              context: context,
              message: state.message,
              backgroundColor: AppColors.customGreen(),
              icon: Icons.auto_awesome_rounded,
              textColor: AppColors.white(),
            );
          }
        },
        builder: (context, state) {
          if (state is StudyPlanLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is StudyPlanFailure) {
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
                        context.read<StudyPlanCubit>().fetchTodayPlan();
                      },
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state is StudyPlanSuccess || state is StudyPlanRecalculated) {
            final plan = state is StudyPlanSuccess ? state.plan : (state as StudyPlanRecalculated).plan;

            if (plan.tasks.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.s24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.event_note_rounded,
                        size: 64,
                        color: AppColors.primaryColor(context).withValues(alpha: 0.4),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'لم تقم بتهيئة خطتك الدراسية بعد',
                        style: TextStyles.bold16.copyWith(
                          color: AppColors.textBoldColor(context),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'قم باختيار المواد وتاريخ الاختبارات لبناء جدول يومي ذكي يناسب وقتك.',
                        textAlign: TextAlign.center,
                        style: TextStyles.regular14.copyWith(
                          color: AppColors.textSecondaryColor(context),
                        ),
                      ),
                      const SizedBox(height: 24),
                      CustomButton(
                        title: 'ابدأ تهيئة الخطة الآن 🚀',
                        onPressed: () {
                          context.push(RouteNames.studyPlanOnboarding);
                        },
                      ),
                    ],
                  ),
                ),
              );
            }

            return RefreshIndicator(
              onRefresh: () async {
                context.read<StudyPlanCubit>().fetchTodayPlan();
              },
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(AppSpacing.s16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header Progress Card
                    _buildPlanHeaderCard(context, plan),
                    const SizedBox(height: AppSpacing.s16),

                    // Smart Recalculate Banner
                    _buildRecalculateBanner(context),
                    const SizedBox(height: AppSpacing.s20),

                    // Tasks Title
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'مهام اليوم (${plan.completedTasks} من ${plan.totalTasks} مكتملة)',
                          style: TextStyles.bold14.copyWith(
                            color: AppColors.textBoldColor(context),
                          ),
                        ),
                        Text(
                          plan.planDate,
                          style: TextStyles.regular12.copyWith(
                            color: AppColors.textSecondaryColor(context),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.s12),

                    // Task Items
                    ...List.generate(plan.tasks.length, (index) {
                      final task = plan.tasks[index];
                      return _buildTaskCard(context, task);
                    }),

                    const SizedBox(height: AppSpacing.s24),
                  ],
                ),
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildPlanHeaderCard(BuildContext context, StudyPlanModel plan) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.s18),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryColor(context),
            AppColors.primaryColor(context).withValues(alpha: 0.8),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryColor(context).withValues(alpha: 0.25),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'إنجاز اليوم',
                  style: TextStyles.regular12.copyWith(
                    color: AppColors.white().withValues(alpha: 0.85),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${plan.completedTasks} / ${plan.totalTasks} مهام منجزة',
                  style: TextStyles.bold18.copyWith(
                    color: AppColors.white(),
                  ),
                ),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: (plan.progressPercentage / 100).clamp(0.0, 1.0),
                    minHeight: 8,
                    backgroundColor: AppColors.white().withValues(alpha: 0.25),
                    valueColor: AlwaysStoppedAnimation<Color>(
                      plan.progressPercentage >= 100
                          ? AppColors.customGreen()
                          : AppColors.white(),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(
              color: AppColors.white().withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                '${plan.progressPercentage.toInt()}%',
                style: TextStyles.bold16.copyWith(
                  color: AppColors.white(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecalculateBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.s14),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF3C7),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDE68A)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: Color(0xFFF59E0B),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'تحديث الخطة الذكي',
                  style: TextStyles.bold12.copyWith(color: const Color(0xFF92400E)),
                ),
                Text(
                  'فاتتك مهام من الأمس؟ أعد ترتيب خطتك بضغطة زر.',
                  style: TextStyles.regular10.copyWith(color: const Color(0xFF78350F)),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: () {
              context.read<StudyPlanCubit>().recalculatePlan();
            },
            style: TextButton.styleFrom(
              backgroundColor: const Color(0xFFF59E0B),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('تحديث الخطة'),
          ),
        ],
      ),
    );
  }

  Widget _buildTaskCard(BuildContext context, StudyTaskModel task) {
    final isDone = task.isCompleted;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.s10),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDone
              ? AppColors.customGreen().withValues(alpha: 0.4)
              : AppColors.borderColor(context),
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s14, vertical: AppSpacing.s12),
        child: Row(
          children: [
            // Checkbox
            Checkbox(
              value: isDone,
              activeColor: AppColors.customGreen(),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
              onChanged: (checked) {
                final newStatus = (checked == true) ? 'completed' : 'not_started';
                context.read<StudyPlanCubit>().updateTaskStatus(
                      taskId: task.id,
                      status: newStatus,
                    );
              },
            ),
            const SizedBox(width: 8),

            // Task Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    task.taskName,
                    style: TextStyles.bold14.copyWith(
                      color: isDone
                          ? AppColors.textSecondaryColor(context)
                          : AppColors.textBoldColor(context),
                      decoration: isDone ? TextDecoration.lineThrough : null,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      if (task.subjectName != null) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primaryColor(context).withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            task.subjectName!,
                            style: TextStyles.semiBold10.copyWith(
                              color: AppColors.primaryColor(context),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                      ],
                      Icon(
                        Icons.access_time_rounded,
                        size: 12,
                        color: AppColors.textSecondaryColor(context),
                      ),
                      const SizedBox(width: 3),
                      Text(
                        '${task.estimatedMinutes} دقيقة',
                        style: TextStyles.regular10.copyWith(
                          color: AppColors.textSecondaryColor(context),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
