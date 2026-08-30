import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';

class OnBoardingArrowButton extends StatelessWidget {
  const OnBoardingArrowButton({super.key, required this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: AppColors.primaryColor(context),
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryColor(context).withValues(alpha: 0.28),
            blurRadius: AppSpacing.s24,
            offset: const Offset(0, AppSpacing.s8),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(2),
        child: IconButton(
          onPressed: onPressed,
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints.tightFor(width: 56, height: 56),
          icon: SvgPicture.asset(
            Assets.assetsIconsArrowLeft,
            width: AppSpacing.s20,
            colorFilter: ColorFilter.mode(AppColors.white(), BlendMode.srcIn),
          ),
        ),
      ),
    );
  }
}
