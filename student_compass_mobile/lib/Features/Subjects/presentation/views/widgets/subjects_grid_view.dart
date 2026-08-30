import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/subject_model.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_state.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/views/widgets/subject_card.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/views/widgets/subjects_empty_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class SubjectsGridView extends StatelessWidget {
  const SubjectsGridView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<SubjectsCubit, SubjectsState>(
      builder: (context, state) {
        if (state is SubjectsLoading) {
          return const Center(child: CustomLoadingIndicator());
        }

        if (state is SubjectsFailure) {
          return _buildErrorState(context, state);
        }

        if (state is SubjectsSuccess) {
          if (state.subjects.isEmpty) {
            return const SubjectsEmptyState();
          }
          return _buildSubjectsGrid(context, state.subjects);
        }

        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildSubjectsGrid(
    BuildContext context,
    List<SubjectModel> subjects,
  ) {
    return GridView.builder(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.s16,
        vertical: AppSpacing.s8,
      ),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: AppSpacing.s16,
        crossAxisSpacing: AppSpacing.s16,
        childAspectRatio: 0.85,
      ),
      itemCount: subjects.length,
      itemBuilder: (context, index) {
        return SubjectCard(
          subject: subjects[index],
          onTap: () {
            context.push(
              RouteNames.subjectDetails,
              extra: subjects[index],
            );
          },
        );
      },
    );
  }

  Widget _buildErrorState(BuildContext context, SubjectsFailure state) {
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
                context.read<SubjectsCubit>().fetchSubjects();
              },
              icon: const Icon(Icons.refresh_rounded),
              label: Text(S.of(context).Retry),
            ),
          ],
        ),
      ),
    );
  }
}
