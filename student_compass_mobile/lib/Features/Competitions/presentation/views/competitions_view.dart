import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Competitions/data/models/competition_model.dart';
import 'package:student_compass_mobile/Features/Competitions/presentation/logic/competitions_cubit.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';

class CompetitionsView extends StatefulWidget {
  const CompetitionsView({super.key});

  @override
  State<CompetitionsView> createState() => _CompetitionsViewState();
}

class _CompetitionsViewState extends State<CompetitionsView> {
  @override
  void initState() {
    super.initState();
    context.read<CompetitionsCubit>().fetchCompetitions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: const CustomAppBar(title: 'المسابقات التفاعلية'),
      body: BlocBuilder<CompetitionsCubit, CompetitionsState>(
        builder: (context, state) {
          if (state is CompetitionsLoading) return const Center(child: CustomLoadingIndicator());

          if (state is CompetitionsFailure) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline_rounded, size: 56, color: AppColors.red().withValues(alpha: 0.6)),
                  const SizedBox(height: 16),
                  Text(
                    Failure.localizedMessage(context, errorMessage: state.errorMessage, errorKey: state.errorKey),
                    textAlign: TextAlign.center,
                    style: TextStyles.semiBold14.copyWith(color: AppColors.textSecondaryColor(context)),
                  ),
                  const SizedBox(height: 20),
                  TextButton.icon(
                    onPressed: () => context.read<CompetitionsCubit>().fetchCompetitions(),
                    icon: const Icon(Icons.refresh_rounded),
                    label: const Text('إعادة المحاولة'),
                  ),
                ],
              ),
            );
          }

          if (state is CompetitionsSuccess) {
            final competitions = state.competitions;
            if (competitions.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('🏆', style: TextStyle(fontSize: 56)),
                    const SizedBox(height: 16),
                    Text('لا توجد مسابقات نشطة حالياً', style: TextStyles.bold16.copyWith(color: AppColors.textBoldColor(context))),
                    const SizedBox(height: 8),
                    Text('تابع إشعاراتك لتعرف موعد انطلاق المسابقة القادمة.',
                        textAlign: TextAlign.center,
                        style: TextStyles.regular14.copyWith(color: AppColors.textSecondaryColor(context))),
                  ],
                ),
              );
            }

            return RefreshIndicator(
              onRefresh: () async => context.read<CompetitionsCubit>().fetchCompetitions(),
              child: ListView.builder(
                padding: const EdgeInsets.all(AppSpacing.s16),
                itemCount: competitions.length,
                itemBuilder: (context, index) => _buildCompetitionCard(context, competitions[index]),
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildCompetitionCard(BuildContext context, CompetitionModel competition) {
    final isActive = competition.status == 'active';
    final statusColor = isActive ? AppColors.customGreen() : const Color(0xFFF59E0B);

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.s16),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isActive ? AppColors.customGreen().withValues(alpha: 0.4) : AppColors.borderColor(context)),
        boxShadow: [BoxShadow(color: AppColors.shadowColor(context), blurRadius: 10, offset: const Offset(0, 3))],
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.s18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(competition.title, style: TextStyles.bold16.copyWith(color: AppColors.textBoldColor(context))),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(12)),
                  child: Text(isActive ? 'جارية الآن 🟢' : 'قريباً',
                      style: TextStyles.bold10.copyWith(color: statusColor)),
                ),
              ],
            ),
            if (competition.description != null) ...[
              const SizedBox(height: 6),
              Text(competition.description!, style: TextStyles.regular13.copyWith(color: AppColors.textSecondaryColor(context)), maxLines: 2, overflow: TextOverflow.ellipsis),
            ],
            const SizedBox(height: 14),
            // Stats row
            Row(
              children: [
                _statChip(Icons.timer_outlined, '${competition.durationMinutes} دقيقة', context),
                const SizedBox(width: 10),
                _statChip(Icons.star_rounded, '${competition.totalPoints} نقطة', context),
                const SizedBox(width: 10),
                _statChip(Icons.people_outline_rounded, '${competition.participantsCount} مشارك', context),
              ],
            ),
            if (competition.myRank != null) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.primaryColor(context).withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.emoji_events_rounded, color: AppColors.primaryColor(context), size: 16),
                    const SizedBox(width: 6),
                    Text('ترتيبك: #${competition.myRank}', style: TextStyles.bold12.copyWith(color: AppColors.primaryColor(context))),
                    if (competition.myScore != null) Text('  •  ${competition.myScore!.toStringAsFixed(1)} نقطة', style: TextStyles.regular12.copyWith(color: AppColors.primaryColor(context))),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: isActive
                        ? () => context.push(RouteNames.competitionDetails, extra: competition)
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryColor(context),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(isActive ? 'المشاركة في المسابقة 🏆' : 'انتظر موعد الانطلاق'),
                  ),
                ),
                const SizedBox(width: 10),
                OutlinedButton(
                  onPressed: () => context.push(RouteNames.leaderboard, extra: competition),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Icon(Icons.leaderboard_rounded),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _statChip(IconData icon, String label, BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.scaffoldBackgroundColor(null, context),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.borderColor(context)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: AppColors.textSecondaryColor(context)),
          const SizedBox(width: 4),
          Text(label, style: TextStyles.regular10.copyWith(color: AppColors.textSecondaryColor(context))),
        ],
      ),
    );
  }
}
