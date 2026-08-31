import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/models/on_boarding_model.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class OnBoardingPageItem extends StatelessWidget {
  final OnBoardingModel item;
  final String image;

  const OnBoardingPageItem({
    super.key,
    required this.item,
    required this.image,
  });

  @override
  Widget build(BuildContext context) {
    final accentColor = item.accentColor ?? AppColors.primaryColor(context);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Illustration Header with Glow Circle
          Stack(
            alignment: Alignment.center,
            children: [
              Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: accentColor.withValues(alpha: 0.12),
                  boxShadow: [
                    BoxShadow(
                      color: accentColor.withValues(alpha: 0.12),
                      blurRadius: 40,
                      spreadRadius: 10,
                    ),
                  ],
                ),
              ),
              Image.asset(image, height: 350, fit: BoxFit.fill),
            ],
          ),

          // Glassmorphic Badge Tag (if provided)
          if (item.badge != null) ...[
            ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: accentColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: accentColor.withValues(alpha: 0.3),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    item.badge!,
                    style: TextStyles.semiBold12.copyWith(color: accentColor),
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.s16),
          ],

          // Title
          Text(
            item.title,
            textAlign: TextAlign.center,
            style: TextStyles.bold24.copyWith(
              color: AppColors.textBoldColor(context),
              height: 1.3,
            ),
          ),
          const SizedBox(height: AppSpacing.s12),

          // SubTitle
          Text(
            item.subTitle,
            textAlign: TextAlign.center,
            style: TextStyles.regular14.copyWith(
              color: AppColors.textSecondaryColor(context),
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }
}
