import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class OnBoardingNavigationBar extends StatelessWidget {
  final int currentPage;
  final int pageCount;
  final VoidCallback onNext;
  final VoidCallback onSkip;

  const OnBoardingNavigationBar({
    super.key,
    required this.currentPage,
    required this.pageCount,
    required this.onNext,
    required this.onSkip,
  });

  @override
  Widget build(BuildContext context) {
    final isLastPage = currentPage == pageCount - 1;

    return Padding(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.s24,
        AppSpacing.s16,
        AppSpacing.s24,
        AppSpacing.s32,
      ),
      child: SizedBox(
        height: 56,
        child: isLastPage
            ? CustomButton(
                key: const ValueKey('start_now_button'),
                title: S.of(context).StartNow,
                onPressed: onNext,
              )
            : Row(
                children: [
                  TextButton(
                    onPressed: onSkip,
                    child: Text(
                      S.of(context).Skip,
                      style: TextStyles.semiBold16.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                  ),
                  const Spacer(),
                  ElevatedButton(
                    onPressed: onNext,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryColor(context),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 14,
                      ),
                      elevation: 0,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          S.of(context).Next,
                          style: TextStyles.bold16.copyWith(
                            color: AppColors.white(context),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Icon(
                          Icons.arrow_forward_rounded,
                          size: 18,
                          color: AppColors.white(context),
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
