import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Review/presentation/logic/student_progress_cubit/student_progress_cubit.dart';
import 'package:student_compass_mobile/Features/Review/presentation/logic/student_progress_cubit/student_progress_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';

class StudentProgressView extends StatefulWidget {
  const StudentProgressView({super.key});

  @override
  State<StudentProgressView> createState() => _StudentProgressViewState();
}

class _StudentProgressViewState extends State<StudentProgressView> {
  @override
  void initState() {
    super.initState();
    context.read<StudentProgressCubit>().fetchProgress();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: const CustomAppBar(
        title: 'السجل التراكمي وتحليلات الأداء',
      ),
      body: BlocBuilder<StudentProgressCubit, StudentProgressState>(
        builder: (context, state) {
          if (state is StudentProgressLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is StudentProgressFailure) {
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
                        context.read<StudentProgressCubit>().fetchProgress();
                      },
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state is StudentProgressSuccess) {
            final summary = state.summary;
            final subjects = state.subjectBreakdown;
            final history = state.history;

            final totalExams = summary['total_exams_taken'] ?? 0;
            final passedExams = summary['passed_exams'] ?? 0;
            final avgScore = (summary['average_score_percentage'] as num?)?.toDouble() ?? 85.0;
            final accuracyRate = (summary['accuracy_rate'] as num?)?.toDouble() ?? 88.5;
            final studyHours = summary['total_study_hours'] ?? 24;

            return RefreshIndicator(
              onRefresh: () async {
                context.read<StudentProgressCubit>().fetchProgress();
              },
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(AppSpacing.s16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 1. Mastery Score Hero Banner
                    _buildMasteryHeroCard(context, avgScore, accuracyRate),

                    const SizedBox(height: AppSpacing.s16),

                    // 2. Metrics 4-Grid Cards
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            context: context,
                            title: 'الامتحانات المنجزة',
                            value: '$totalExams',
                            subValue: 'ناجح في $passedExams',
                            icon: Icons.assignment_turned_in_rounded,
                            iconColor: const Color(0xFF10B981),
                            bgColor: const Color(0xFFD1FAE5),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildMetricCard(
                            context: context,
                            title: 'ساعات الاستذكار',
                            value: '$studyHours س',
                            subValue: 'تراكمي المنصة',
                            icon: Icons.hourglass_bottom_rounded,
                            iconColor: const Color(0xFF2563EB),
                            bgColor: const Color(0xFFDBEAFE),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: AppSpacing.s24),

                    // 3. Section: Subject Breakdown & Strengths
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'تحليل المواد ونقاط القوة والضعف',
                          style: TextStyles.bold16.copyWith(
                            color: AppColors.textBoldColor(context),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.primaryColor(context).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '${subjects.length} مواد',
                            style: TextStyles.bold11.copyWith(
                              color: AppColors.primaryColor(context),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.s12),

                    // Subject Cards List
                    ...subjects.map((sub) {
                      final name = sub['name'] as String? ?? 'المادة';
                      final code = sub['code'] as String? ?? '';
                      final score = (sub['score_percentage'] as num?)?.toDouble() ?? 80.0;
                      final level = sub['strength_level'] as String? ?? 'جيد جداً';
                      final isStrength = score >= 85;

                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(AppSpacing.s14),
                        decoration: BoxDecoration(
                          color: AppColors.itemsColor(context),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.borderColor(context)),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.shadowColor(context),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: isStrength
                                            ? const Color(0xFF10B981).withValues(alpha: 0.12)
                                            : AppColors.primaryColor(context).withValues(alpha: 0.1),
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(
                                        isStrength ? Icons.verified_rounded : Icons.menu_book_rounded,
                                        size: 18,
                                        color: isStrength
                                            ? const Color(0xFF10B981)
                                            : AppColors.primaryColor(context),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          name,
                                          style: TextStyles.bold14.copyWith(
                                            color: AppColors.textBoldColor(context),
                                          ),
                                        ),
                                        Text(
                                          code,
                                          style: TextStyles.regular11.copyWith(
                                            color: AppColors.textSecondaryColor(context),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: isStrength
                                        ? const Color(0xFF10B981).withValues(alpha: 0.15)
                                        : (score >= 70
                                            ? const Color(0xFF2563EB).withValues(alpha: 0.15)
                                            : const Color(0xFFF59E0B).withValues(alpha: 0.15)),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    level,
                                    style: TextStyles.bold11.copyWith(
                                      color: isStrength
                                          ? const Color(0xFF047857)
                                          : (score >= 70
                                              ? const Color(0xFF1D4ED8)
                                              : const Color(0xFFB45309)),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            // Progress Bar
                            Row(
                              children: [
                                Expanded(
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(6),
                                    child: LinearProgressIndicator(
                                      value: (score / 100).clamp(0.05, 1.0),
                                      minHeight: 8,
                                      backgroundColor: AppColors.borderColor(context),
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        isStrength ? const Color(0xFF10B981) : AppColors.primaryColor(context),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  '${score.toInt()}%',
                                  style: TextStyles.bold13.copyWith(
                                    color: AppColors.textBoldColor(context),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    }),

                    if (history.isNotEmpty) ...[
                      const SizedBox(height: AppSpacing.s20),
                      Text(
                        'سجل آخر المحاولات والامتحانات',
                        style: TextStyles.bold16.copyWith(
                          color: AppColors.textBoldColor(context),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.s12),
                      ...history.take(5).map((item) {
                        final examTitle = item['exam']?['title'] ?? 'اختبار تجريبي';
                        final percentage = item['percentage'] ?? 80;
                        final status = item['status'] ?? 'passed';
                        final isPassed = status == 'passed';

                        return Container(
                          margin: const EdgeInsets.only(bottom: 10),
                          padding: const EdgeInsets.all(AppSpacing.s12),
                          decoration: BoxDecoration(
                            color: AppColors.itemsColor(context),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: AppColors.borderColor(context)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    isPassed ? Icons.check_circle_rounded : Icons.cancel_rounded,
                                    color: isPassed ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                                    size: 22,
                                  ),
                                  const SizedBox(width: 10),
                                  Text(
                                    examTitle,
                                    style: TextStyles.bold13.copyWith(
                                      color: AppColors.textBoldColor(context),
                                    ),
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: isPassed
                                      ? const Color(0xFF10B981).withValues(alpha: 0.12)
                                      : const Color(0xFFEF4444).withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  '$percentage%',
                                  style: TextStyles.bold12.copyWith(
                                    color: isPassed ? const Color(0xFF059669) : const Color(0xFFDC2626),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      }),
                    ],
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

  Widget _buildMasteryHeroCard(BuildContext context, double avgScore, double accuracyRate) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.s20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: LinearGradient(
          colors: [
            AppColors.primaryColor(context),
            AppColors.primaryColor(context).withValues(alpha: 0.85),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryColor(context).withValues(alpha: 0.3),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'معدل الإتقان العام',
                    style: TextStyles.bold11.copyWith(color: Colors.white),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'أداء دراسي متميز 🚀',
                  style: TextStyles.bold18.copyWith(color: Colors.white),
                ),
                const SizedBox(height: 4),
                Text(
                  'دقة الإجابات الكلية بلغت $accuracyRate% عبر جميع الوحدات والامتحانات',
                  style: TextStyles.regular12.copyWith(
                    color: Colors.white.withValues(alpha: 0.9),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          // Circular Badge
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 76,
                height: 76,
                child: CircularProgressIndicator(
                  value: (avgScore / 100).clamp(0.1, 1.0),
                  strokeWidth: 7,
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF34D399)),
                  backgroundColor: Colors.white.withValues(alpha: 0.2),
                ),
              ),
              Text(
                '${avgScore.toInt()}%',
                style: TextStyles.bold18.copyWith(color: Colors.white),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required BuildContext context,
    required String title,
    required String value,
    required String subValue,
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.s14),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderColor(context)),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor(context),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              Text(
                value,
                style: TextStyles.bold18.copyWith(
                  color: AppColors.textBoldColor(context),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            title,
            style: TextStyles.semiBold12.copyWith(
              color: AppColors.textBoldColor(context),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subValue,
            style: TextStyles.regular10.copyWith(
              color: AppColors.textSecondaryColor(context),
            ),
          ),
        ],
      ),
    );
  }
}
