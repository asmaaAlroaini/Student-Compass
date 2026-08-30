import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/custom_exam_cubit/custom_exam_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/exams_cubit/exams_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/exams_cubit/exams_state.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/views/widgets/custom_exam_builder_card.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/views/widgets/exam_card.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/services/service_locator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class ExamsView extends StatefulWidget {
  const ExamsView({super.key});

  @override
  State<ExamsView> createState() => _ExamsViewState();
}

class _ExamsViewState extends State<ExamsView> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    context.read<ExamsCubit>().fetchExams();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);

    return BlocProvider(
      create: (context) => getIt<CustomExamCubit>(),
      child: Scaffold(
        backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
        appBar: CustomAppBar(title: s.ExamsAndQuizzes),
        body: Column(
          children: [
            // Tab Bar
            Container(
              margin: const EdgeInsets.symmetric(
                horizontal: AppSpacing.s16,
                vertical: AppSpacing.s8,
              ),
              decoration: BoxDecoration(
                color: AppColors.itemsColor(context),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppColors.borderColor(context),
                  width: 1,
                ),
              ),
              child: TabBar(
                controller: _tabController,
                indicatorSize: TabBarIndicatorSize.tab,
                indicator: BoxDecoration(
                  color: AppColors.primaryColor(context),
                  borderRadius: BorderRadius.circular(10),
                ),
                labelColor: Colors.white,
                unselectedLabelColor: AppColors.textSecondaryColor(context),
                labelStyle: TextStyles.bold14,
                unselectedLabelStyle: TextStyles.semiBold14,
                tabs: [
                  Tab(text: s.AvailableExams),
                  Tab(text: s.SmartCustomExam),
                ],
              ),
            ),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  // 1. Available Exams Tab
                  _buildAvailableExamsTab(context),

                  // 2. Custom Exam Generator Tab
                  _buildCustomExamTab(context),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAvailableExamsTab(BuildContext context) {
    final s = S.of(context);

    return BlocBuilder<ExamsCubit, ExamsState>(
      builder: (context, state) {
        if (state is ExamsLoading) {
          return const Center(child: CustomLoadingIndicator());
        }

        if (state is ExamsFailure) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.error_outline_rounded,
                  size: 48,
                  color: AppColors.red(context),
                ),
                const SizedBox(height: 12),
                Text(
                  state.errorMessage,
                  style: TextStyles.semiBold14.copyWith(
                    color: AppColors.textPrimaryColor(context),
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    context.read<ExamsCubit>().fetchExams();
                  },
                  child: Text(s.Retry),
                ),
              ],
            ),
          );
        }

        if (state is ExamsSuccess) {
          final exams = state.exams;
          if (exams.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.assignment_late_outlined,
                    size: 64,
                    color: AppColors.textSecondaryColor(context),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    s.NoAvailableExams,
                    style: TextStyles.bold16.copyWith(
                      color: AppColors.textPrimaryColor(context),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    s.GenerateCustomExamHint,
                    style: TextStyles.regular12.copyWith(
                      color: AppColors.textSecondaryColor(context),
                    ),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              context.read<ExamsCubit>().fetchExams();
            },
            child: ListView.separated(
              padding: const EdgeInsets.all(AppSpacing.s16),
              itemCount: exams.length,
              separatorBuilder: (context, index) =>
                  const SizedBox(height: AppSpacing.s16),
              itemBuilder: (context, index) {
                return ExamCard(exam: exams[index]);
              },
            ),
          );
        }

        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildCustomExamTab(BuildContext context) {
    return const SingleChildScrollView(
      padding: EdgeInsets.all(AppSpacing.s16),
      child: Column(
        children: [
          CustomExamBuilderCard(),
        ],
      ),
    );
  }
}
