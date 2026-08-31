import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/logout_cubit/logout_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_state.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/views/widgets/profile_header_card.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/views/widgets/profile_menu_tile.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class ProfileView extends StatefulWidget {
  const ProfileView({super.key});

  @override
  State<ProfileView> createState() => _ProfileViewState();
}

class _ProfileViewState extends State<ProfileView> {
  @override
  void initState() {
    super.initState();
    context.read<ProfileCubit>().loadProfile();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(title: S.of(context).Profile),
      body: BlocBuilder<ProfileCubit, ProfileState>(
        builder: (context, state) {
          if (state is ProfileLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is ProfileSuccess) {
            final user = state.user;
            return SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.s16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // User Header Card
                  ProfileHeaderCard(user: user),
                  const SizedBox(height: AppSpacing.s24),

                  // Account Settings Section Header
                  Text(
                    S.of(context).AccountSettings,
                    style: TextStyles.bold16.copyWith(
                      color: AppColors.textBoldColor(context),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.s12),

                  // Edit Profile
                  ProfileMenuTile(
                    icon: Icons.person_outline_rounded,
                    title: S.of(context).EditProfile,
                    onTap: () {
                      context.push(RouteNames.editProfile, extra: user);
                    },
                  ),

                  // Change Password
                  ProfileMenuTile(
                    icon: Icons.lock_outline_rounded,
                    title: S.of(context).ChangePassword,
                    onTap: () {
                      context.push(RouteNames.changePassword);
                    },
                  ),

                  // Language & Settings
                  ProfileMenuTile(
                    icon: Icons.tune_rounded,
                    title: S.of(context).LanguageAndTheme,
                    onTap: () {
                      context.push(RouteNames.settings);
                    },
                  ),

                  const SizedBox(height: AppSpacing.s8),
                  Divider(color: AppColors.borderColor(context)),
                  const SizedBox(height: AppSpacing.s8),

                  // Student Progress & Performance
                  ProfileMenuTile(
                    icon: Icons.analytics_outlined,
                    title: 'السجل التراكمي وتحليلات الأداء',
                    onTap: () => context.push(RouteNames.studentProgress),
                  ),

                  // My Study Plan
                  ProfileMenuTile(
                    icon: Icons.event_note_rounded,
                    title: 'خطتي الدراسية',
                    onTap: () => context.push(RouteNames.studyPlan),
                  ),

                  // Incorrect Questions
                  ProfileMenuTile(
                    icon: Icons.history_edu_rounded,
                    title: 'مراجعة أخطائي',
                    onTap: () => context.push(RouteNames.incorrectQuestions),
                  ),

                  // Bookmarks
                  ProfileMenuTile(
                    icon: Icons.bookmark_rounded,
                    title: 'الأسئلة المحفوظة',
                    onTap: () => context.push(RouteNames.bookmarks),
                  ),

                  // Competitions
                  ProfileMenuTile(
                    icon: Icons.emoji_events_rounded,
                    title: 'المسابقات التفاعلية',
                    onTap: () => context.push(RouteNames.competitions),
                  ),

                  const SizedBox(height: AppSpacing.s16),

                  // Logout Tile
                  ProfileMenuTile(
                    icon: Icons.logout_rounded,
                    title: S.of(context).Logout,
                    iconColor: AppColors.red(),
                    textColor: AppColors.red(),
                    trailing: const SizedBox.shrink(),
                    onTap: () {
                      context.read<LogoutCubit>().logout();
                    },
                  ),
                ],
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }
}
