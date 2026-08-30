import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/subject_model.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subject_units_cubit/subject_units_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subject_units_cubit/subject_units_state.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/views/widgets/unit_card.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class SubjectDetailsView extends StatefulWidget {
  final SubjectModel subject;

  const SubjectDetailsView({super.key, required this.subject});

  @override
  State<SubjectDetailsView> createState() => _SubjectDetailsViewState();
}

class _SubjectDetailsViewState extends State<SubjectDetailsView> {
  @override
  void initState() {
    super.initState();
    context
        .read<SubjectUnitsCubit>()
        .fetchSubjectUnits(subjectId: widget.subject.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(
        title: widget.subject.name,
      ),
      body: BlocBuilder<SubjectUnitsCubit, SubjectUnitsState>(
        builder: (context, state) {
          if (state is SubjectUnitsLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is SubjectUnitsFailure) {
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
                        context
                            .read<SubjectUnitsCubit>()
                            .fetchSubjectUnits(subjectId: widget.subject.id);
                      },
                      icon: const Icon(Icons.refresh_rounded),
                      label: Text(S.of(context).Retry),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state is SubjectUnitsSuccess) {
            if (state.units.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.folder_open_rounded,
                      size: 56,
                      color: AppColors.primaryColor(context)
                          .withValues(alpha: 0.4),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      S.of(context).NoUnitsFound,
                      style: TextStyles.semiBold16.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                  ],
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.s16,
                vertical: AppSpacing.s12,
              ),
              itemCount: state.units.length,
              itemBuilder: (context, index) {
                return UnitCard(
                  unit: state.units[index],
                  index: index,
                  onTap: () {
                    context.push(
                      '/unit-lessons',
                      extra: {
                        'subject': widget.subject,
                        'unit': state.units[index],
                      },
                    );
                  },
                );
              },
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }
}
