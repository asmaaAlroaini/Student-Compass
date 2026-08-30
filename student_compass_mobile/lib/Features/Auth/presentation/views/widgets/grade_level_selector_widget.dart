import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/educational_options_model.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class GradeLevelSelectorWidget extends StatelessWidget {
  final String? selectedGradeLevel;
  final ValueChanged<String?> onChanged;
  final List<GradeLevelOption> gradeLevels;
  final bool isLoading;

  const GradeLevelSelectorWidget({
    super.key,
    required this.selectedGradeLevel,
    required this.onChanged,
    required this.gradeLevels,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          S.of(context).GradeLevel,
          style: TextStyles.semiBold14.copyWith(
            color: AppColors.textPrimaryColor(context),
          ),
        ),
        const SizedBox(height: AppSpacing.s8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: AppColors.textFeilColor(context),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: AppColors.borderColor(context),
              width: 1,
            ),
          ),
          child: isLoading
              ? const Padding(
                  padding: EdgeInsets.symmetric(vertical: 14),
                  child: Center(child: CustomLoadingIndicator()),
                )
              : DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: gradeLevels.any((g) => g.id == selectedGradeLevel)
                        ? selectedGradeLevel
                        : null,
                    hint: Text(
                      S.of(context).SelectGradeLevel,
                      style: TextStyles.regular14.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                    isExpanded: true,
                    icon: Icon(
                      Icons.keyboard_arrow_down_rounded,
                      color: AppColors.textSecondaryColor(context),
                    ),
                    dropdownColor: AppColors.itemsColor(context),
                    items: gradeLevels.map((grade) {
                      return DropdownMenuItem<String>(
                        value: grade.id,
                        child: Text(
                          grade.name,
                          style: TextStyles.semiBold14.copyWith(
                            color: AppColors.textBoldColor(context),
                          ),
                        ),
                      );
                    }).toList(),
                    onChanged: onChanged,
                  ),
                ),
        ),
      ],
    );
  }
}
