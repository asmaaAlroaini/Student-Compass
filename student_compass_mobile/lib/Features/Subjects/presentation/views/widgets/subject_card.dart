import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/subject_model.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class SubjectCard extends StatelessWidget {
  final SubjectModel subject;
  final VoidCallback onTap;

  const SubjectCard({
    super.key,
    required this.subject,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = _getSubjectColors(subject.code, context);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(AppSpacing.s16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              colors.$1.withValues(alpha: 0.12),
              colors.$1.withValues(alpha: 0.04),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: colors.$1.withValues(alpha: 0.15),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: colors.$1.withValues(alpha: 0.08),
              blurRadius: 15,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: colors.$1.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(
                colors.$2,
                color: colors.$1,
                size: 26,
              ),
            ),
            const Spacer(),
            // Subject name
            Text(
              subject.name,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyles.bold16.copyWith(
                color: AppColors.textBoldColor(context),
              ),
            ),
            const SizedBox(height: 4),
            // Subject code
            Text(
              subject.code,
              style: TextStyles.regular12.copyWith(
                color: AppColors.textSecondaryColor(context),
              ),
            ),
            if (subject.track != null) ...[
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 3,
                ),
                decoration: BoxDecoration(
                  color: colors.$1.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  subject.track!,
                  style: TextStyles.regular10.copyWith(
                    color: colors.$1,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  (Color, IconData) _getSubjectColors(String code, BuildContext context) {
    final lowerCode = code.toLowerCase();
    if (lowerCode.contains('math') || lowerCode.contains('رياض')) {
      return (const Color(0xFF6366F1), Icons.calculate_rounded);
    }
    if (lowerCode.contains('phys') || lowerCode.contains('فيز')) {
      return (const Color(0xFF0EA5E9), Icons.science_rounded);
    }
    if (lowerCode.contains('chem') || lowerCode.contains('كيم')) {
      return (const Color(0xFF10B981), Icons.biotech_rounded);
    }
    if (lowerCode.contains('bio') || lowerCode.contains('احيا') || lowerCode.contains('أحيا')) {
      return (const Color(0xFF22C55E), Icons.eco_rounded);
    }
    if (lowerCode.contains('arab') || lowerCode.contains('عرب')) {
      return (const Color(0xFFF59E0B), Icons.menu_book_rounded);
    }
    if (lowerCode.contains('eng') || lowerCode.contains('انج') || lowerCode.contains('إنج')) {
      return (const Color(0xFFEC4899), Icons.language_rounded);
    }
    if (lowerCode.contains('islam') || lowerCode.contains('اسلام') || lowerCode.contains('إسلام') || lowerCode.contains('دين')) {
      return (const Color(0xFF8B5CF6), Icons.mosque_rounded);
    }
    if (lowerCode.contains('hist') || lowerCode.contains('تاريخ')) {
      return (const Color(0xFFD97706), Icons.history_edu_rounded);
    }
    if (lowerCode.contains('geo') || lowerCode.contains('جغر')) {
      return (const Color(0xFF14B8A6), Icons.public_rounded);
    }
    return (AppColors.primaryColor(context), Icons.auto_stories_rounded);
  }
}
