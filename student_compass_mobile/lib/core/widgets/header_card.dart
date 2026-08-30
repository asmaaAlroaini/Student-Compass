import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class HeaderCard extends StatelessWidget {
  const HeaderCard({super.key, required this.title, required this.subTitle});
  final String title;
  final String subTitle;
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.s20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [const Color(0xff820005), AppColors.primaryColor(context)],
        ),
        borderRadius: BorderRadius.circular(AppSpacing.radius16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryColor(context).withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.s12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(AppSpacing.radius12),
            ),
            child: SvgPicture.asset(
              Assets.assetsIconsLampCharge,
              width: 28,
              height: 28,
              colorFilter: const ColorFilter.mode(
                Colors.white,
                BlendMode.srcIn,
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.s16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyles.bold18.copyWith(color: Colors.white),
                ),
                const SizedBox(height: AppSpacing.s4),
                Text(
                  subTitle,
                  style: TextStyles.regular14.copyWith(
                    color: Colors.white.withOpacity(0.85),
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
