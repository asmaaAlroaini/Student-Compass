import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class SubjectsEmptyState extends StatelessWidget {
  const SubjectsEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              color: AppColors.primaryColor(context).withValues(alpha: 0.08),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.menu_book_rounded,
              size: 56,
              color: AppColors.primaryColor(context).withValues(alpha: 0.5),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            S.of(context).NoSubjectsFound,
            style: TextStyles.semiBold16.copyWith(
              color: AppColors.textSecondaryColor(context),
            ),
          ),
        ],
      ),
    );
  }
}
