import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class QuickActionsGrid extends StatelessWidget {
  const QuickActionsGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Title
        Text(
          s.QuickServices,
          style: TextStyles.bold14.copyWith(
            color: AppColors.textBoldColor(context),
          ),
        ),
        const SizedBox(height: AppSpacing.s10),

        // Row 1: 3 Cards
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                context: context,
                title: s.CurriculumAndSubjects,
                icon: Icons.menu_book_rounded,
                iconBgColor: const Color(0xFFD1FAE5),
                iconColor: const Color(0xFF065F46),
                onTap: () => context.go(RouteNames.dashboard, extra: 1),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildActionCard(
                context: context,
                title: s.ExamsBank,
                icon: Icons.assignment_turned_in_rounded,
                iconBgColor: const Color(0xFFDBEAFE),
                iconColor: const Color(0xFF1D4ED8),
                onTap: () => context.go(RouteNames.dashboard, extra: 2),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildActionCard(
                context: context,
                title: 'خطتي',
                icon: Icons.event_note_rounded,
                iconBgColor: const Color(0xFFFEF3C7),
                iconColor: const Color(0xFF92400E),
                onTap: () => context.push(RouteNames.studyPlan),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Row 2: 3 Cards
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                context: context,
                title: 'أخطائي',
                icon: Icons.history_edu_rounded,
                iconBgColor: const Color(0xFFFEE2E2),
                iconColor: const Color(0xFF991B1B),
                onTap: () => context.push(RouteNames.incorrectQuestions),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildActionCard(
                context: context,
                title: 'المسابقات',
                icon: Icons.emoji_events_rounded,
                iconBgColor: const Color(0xFFEDE9FE),
                iconColor: const Color(0xFF5B21B6),
                onTap: () => context.push(RouteNames.competitions),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildActionCard(
                context: context,
                title: s.ProfileAndResults,
                icon: Icons.person_pin_rounded,
                iconBgColor: const Color(0xFFF0FDF4),
                iconColor: const Color(0xFF14532D),
                onTap: () => context.go(RouteNames.dashboard, extra: 3),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard({
    required BuildContext context,
    required String title,
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
        decoration: BoxDecoration(
          color: AppColors.itemsColor(context),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderColor(context), width: 1),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadowColor(context),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: iconBgColor, shape: BoxShape.circle),
              child: Icon(icon, size: 22, color: iconColor),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyles.bold11.copyWith(color: AppColors.textPrimaryColor(context)),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
