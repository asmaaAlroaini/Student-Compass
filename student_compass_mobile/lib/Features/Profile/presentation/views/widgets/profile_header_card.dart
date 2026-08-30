import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/cashed_networ_image.dart';

class ProfileHeaderCard extends StatelessWidget {
  final User user;

  const ProfileHeaderCard({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.s20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryColor(context),
            AppColors.primaryColor(context).withValues(alpha: 0.8),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryColor(context).withValues(alpha: 0.25),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          // Avatar
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.25),
              shape: BoxShape.circle,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(42),
              child: SizedBox(
                width: 84,
                height: 84,
                child: CustomImageWidget(
                  image: user.avatar,
                  width: 84,
                  height: 84,
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          // User Full Name
          Text(
            user.name,
            style: TextStyles.bold20.copyWith(
              color: AppColors.white(),
            ),
          ),
          const SizedBox(height: 4),
          // Username / Email
          Text(
            user.email,
            style: TextStyles.regular14.copyWith(
              color: AppColors.white().withValues(alpha: 0.85),
            ),
          ),
          if (user.gradeLevel != null && user.gradeLevel!.isNotEmpty) ...[
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 5,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    user.gradeLevel!,
                    style: TextStyles.regular12.copyWith(
                      color: AppColors.white(),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                if (user.track != null && user.track!.isNotEmpty) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      user.track!,
                      style: TextStyles.regular12.copyWith(
                        color: AppColors.white(),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ],
      ),
    );
  }
}
