import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/unit_model.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class UnitCard extends StatelessWidget {
  final UnitModel unit;
  final int index;
  final VoidCallback onTap;

  const UnitCard({
    super.key,
    required this.unit,
    required this.index,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: AppSpacing.s12),
        padding: const EdgeInsets.all(AppSpacing.s16),
        decoration: BoxDecoration(
          color: AppColors.itemsColor(context),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppColors.borderColor(context),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryColor(context).withValues(alpha: 0.04),
              blurRadius: 12,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            // Unit number badge
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.primaryColor(context),
                    AppColors.primaryColor(context).withValues(alpha: 0.7),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(
                  '${index + 1}',
                  style: TextStyles.bold18.copyWith(
                    color: AppColors.white(),
                  ),
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.s16),
            // Unit info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    unit.title,
                    style: TextStyles.bold16.copyWith(
                      color: AppColors.textBoldColor(context),
                    ),
                  ),
                  if (unit.description != null && unit.description!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      unit.description!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyles.regular12.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                  ],
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(
                        Icons.article_outlined,
                        size: 14,
                        color: AppColors.primaryColor(context),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${unit.lessonsCount} ${S.of(context).Lessons}',
                        style: TextStyles.regular12.copyWith(
                          color: AppColors.primaryColor(context),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              color: AppColors.textSecondaryColor(context),
            ),
          ],
        ),
      ),
    );
  }
}
