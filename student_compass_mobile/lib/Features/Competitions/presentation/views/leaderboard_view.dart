import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Competitions/data/models/competition_model.dart';
import 'package:student_compass_mobile/Features/Competitions/presentation/logic/competitions_cubit.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';

class LeaderboardView extends StatefulWidget {
  final CompetitionModel competition;

  const LeaderboardView({super.key, required this.competition});

  @override
  State<LeaderboardView> createState() => _LeaderboardViewState();
}

class _LeaderboardViewState extends State<LeaderboardView> {
  @override
  void initState() {
    super.initState();
    context.read<LeaderboardCubit>().fetchLeaderboard(competitionId: widget.competition.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(title: 'لوحة المتصدرين: ${widget.competition.title}'),
      body: BlocBuilder<LeaderboardCubit, LeaderboardState>(
        builder: (context, state) {
          if (state is LeaderboardLoading) return const Center(child: CustomLoadingIndicator());

          if (state is LeaderboardFailure) {
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
                ],
              ),
            );
          }

          if (state is LeaderboardSuccess) {
            final entries = state.entries;
            final currentUserName = Prefs.getString(AppConstants.kCurrentUser);

            if (entries.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('🏆', style: TextStyle(fontSize: 56)),
                    const SizedBox(height: 16),
                    Text('لا يوجد متصدرون بعد', style: TextStyles.bold16.copyWith(color: AppColors.textBoldColor(context))),
                    const SizedBox(height: 8),
                    Text('كن أول من يشارك ويتصدر القائمة!',
                        style: TextStyles.regular14.copyWith(color: AppColors.textSecondaryColor(context))),
                  ],
                ),
              );
            }

            return Column(
              children: [
                // Top 3 Podium
                if (entries.length >= 3)
                  _buildPodium(context, entries.take(3).toList()),
                const SizedBox(height: AppSpacing.s8),

                // Rest of list
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s16),
                    itemCount: entries.length > 3 ? entries.length - 3 : 0,
                    itemBuilder: (context, index) {
                      final entry = entries[index + 3];
                      final isMe = entry.name == currentUserName;
                      return _buildLeaderboardRow(context, entry, isMe);
                    },
                  ),
                ),

                // My rank sticky footer (if outside top 10)
                if (widget.competition.myRank != null && widget.competition.myRank! > 10)
                  _buildMyRankFooter(context, widget.competition),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildPodium(BuildContext context, List<LeaderboardEntryModel> top3) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.s20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primaryColor(context), AppColors.primaryColor(context).withValues(alpha: 0.75)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // 2nd place
          if (top3.length > 1) _buildPodiumColumn(context, top3[1], 2, 80),
          // 1st place
          _buildPodiumColumn(context, top3[0], 1, 110),
          // 3rd place
          if (top3.length > 2) _buildPodiumColumn(context, top3[2], 3, 60),
        ],
      ),
    );
  }

  Widget _buildPodiumColumn(BuildContext context, LeaderboardEntryModel entry, int rank, double height) {
    final medal = rank == 1 ? '🥇' : (rank == 2 ? '🥈' : '🥉');
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(medal, style: const TextStyle(fontSize: 28)),
        const SizedBox(height: 6),
        CircleAvatar(
          radius: rank == 1 ? 30 : 22,
          backgroundColor: Colors.white.withValues(alpha: 0.2),
          child: Text(
            entry.name.isNotEmpty ? entry.name[0].toUpperCase() : '?',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: rank == 1 ? 20 : 16),
          ),
        ),
        const SizedBox(height: 6),
        Text(entry.name.split(' ').first, style: TextStyles.bold12.copyWith(color: Colors.white), overflow: TextOverflow.ellipsis),
        Text('${entry.score.toStringAsFixed(0)} نقطة', style: TextStyles.regular10.copyWith(color: Colors.white70)),
        const SizedBox(height: 4),
        Container(
          width: 60,
          height: height,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.15),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
          ),
          child: Center(child: Text('#$rank', style: TextStyles.bold18.copyWith(color: Colors.white))),
        ),
      ],
    );
  }

  Widget _buildLeaderboardRow(BuildContext context, LeaderboardEntryModel entry, bool isMe) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.s10),
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s14, vertical: AppSpacing.s12),
      decoration: BoxDecoration(
        color: isMe ? AppColors.primaryColor(context).withValues(alpha: 0.08) : AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isMe ? AppColors.primaryColor(context).withValues(alpha: 0.4) : AppColors.borderColor(context),
          width: isMe ? 1.5 : 1,
        ),
      ),
      child: Row(
        children: [
          Text('#${entry.rank}', style: TextStyles.bold14.copyWith(color: AppColors.textSecondaryColor(context))),
          const SizedBox(width: 12),
          CircleAvatar(
            radius: 18,
            backgroundColor: AppColors.primaryColor(context).withValues(alpha: 0.15),
            child: Text(
              entry.name.isNotEmpty ? entry.name[0].toUpperCase() : '?',
              style: TextStyles.bold14.copyWith(color: AppColors.primaryColor(context)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  entry.name + (isMe ? ' (أنت)' : ''),
                  style: TextStyles.bold14.copyWith(color: AppColors.textBoldColor(context)),
                ),
                Text('${entry.timeTakenSeconds ~/ 60} دقيقة ${entry.timeTakenSeconds % 60} ثانية',
                    style: TextStyles.regular11.copyWith(color: AppColors.textSecondaryColor(context))),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.customGreen().withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              '${entry.score.toStringAsFixed(0)} نقطة',
              style: TextStyles.bold12.copyWith(color: AppColors.customGreen()),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMyRankFooter(BuildContext context, CompetitionModel competition) {
    return Container(
      margin: const EdgeInsets.all(AppSpacing.s16),
      padding: const EdgeInsets.all(AppSpacing.s14),
      decoration: BoxDecoration(
        color: AppColors.primaryColor(context).withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryColor(context).withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(Icons.person_pin_circle_rounded, color: AppColors.primaryColor(context), size: 22),
          const SizedBox(width: 10),
          Text('ترتيبك: #${competition.myRank}', style: TextStyles.bold14.copyWith(color: AppColors.primaryColor(context))),
          const Spacer(),
          if (competition.myScore != null)
            Text('${competition.myScore!.toStringAsFixed(1)} نقطة', style: TextStyles.bold14.copyWith(color: AppColors.customGreen())),
        ],
      ),
    );
  }
}
