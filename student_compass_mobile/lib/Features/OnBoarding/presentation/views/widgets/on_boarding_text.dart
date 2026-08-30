import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/models/on_boarding_model.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class OnBoardingText extends StatelessWidget {
  const OnBoardingText({
    super.key,
    required this.currentPage,
    required this.pages,
  });

  final int currentPage;
  final List<OnBoardingModel> pages;

  @override
  Widget build(BuildContext context) {
    if (pages.isEmpty || currentPage >= pages.length) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s24),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 220),
        child: Column(
          key: ValueKey(currentPage),
          children: [
            Text(
              pages[currentPage].title,
              textAlign: TextAlign.center,
              style: TextStyles.bold24.copyWith(
                color: AppColors.textBoldColor(context),
              ),
            ),
            const SizedBox(height: AppSpacing.s16),
            Text(
              pages[currentPage].subTitle,
              textAlign: TextAlign.center,
              style: TextStyles.semiBold16.copyWith(
                height: 1.35,
                color: AppColors.textSecondaryColor(context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
