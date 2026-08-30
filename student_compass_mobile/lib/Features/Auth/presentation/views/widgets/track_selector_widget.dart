import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class TrackSelectorWidget extends StatelessWidget {
  final String? selectedTrack;
  final ValueChanged<String?> onChanged;
  final List<String> tracks;
  final bool isLoading;

  const TrackSelectorWidget({
    super.key,
    required this.selectedTrack,
    required this.onChanged,
    required this.tracks,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          S.of(context).Track,
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
                    value: tracks.contains(selectedTrack) ? selectedTrack : null,
                    hint: Text(
                      tracks.isEmpty
                          ? S.of(context).SelectGradeLevel
                          : S.of(context).SelectTrack,
                      style: TextStyles.regular14.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                    isExpanded: true,
                    icon: Icon(
                      Icons.school_rounded,
                      size: 20,
                      color: AppColors.textSecondaryColor(context),
                    ),
                    dropdownColor: AppColors.itemsColor(context),
                    items: tracks.isEmpty
                        ? null
                        : tracks.map((track) {
                            return DropdownMenuItem<String>(
                              value: track,
                              child: Text(
                                track,
                                style: TextStyles.semiBold14.copyWith(
                                  color: AppColors.textBoldColor(context),
                                ),
                              ),
                            );
                          }).toList(),
                    onChanged: tracks.isEmpty ? null : onChanged,
                  ),
                ),
        ),
      ],
    );
  }
}
