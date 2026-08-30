import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';

class OnBoardingPageIndicator extends StatelessWidget {
  const OnBoardingPageIndicator({
    super.key,
    required this.currentPage,
    required this.pageCount,
  });

  final int currentPage;
  final int pageCount;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(pageCount, (index) {
        final isActive = index == currentPage;

        return AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          margin: const EdgeInsets.symmetric(horizontal: AppSpacing.s4),
          width: isActive ? AppSpacing.s24 : AppSpacing.s8,
          height: AppSpacing.s8,
          decoration: BoxDecoration(
            color:
                isActive
                    ? AppColors.primaryColor(context)
                    : AppColors.textPrimaryColor(
                      context,
                    ).withValues(alpha: 0.35),
            borderRadius: BorderRadius.circular(AppSpacing.radius50),
          ),
        );
      }),
    );
  }
}
