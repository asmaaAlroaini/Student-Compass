import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/Features/Notifications/presentation/logic/notifications_cubit/notifications_cubit.dart';
import 'package:student_compass_mobile/Features/Notifications/presentation/logic/notifications_cubit/notifications_state.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_state.dart';
import 'package:student_compass_mobile/Features/Settings/app_settings.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/cashed_networ_image.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class HomeHeaderWidget extends StatelessWidget {
  const HomeHeaderWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);

    return BlocBuilder<ProfileCubit, ProfileState>(
      builder: (context, profileState) {
        User? user;
        if (profileState is ProfileSuccess) {
          user = profileState.user;
        } else {
          user = Prefs.getUser(AppConstants.kCurrentUser);
        }

        final userName = user?.name.trim().split(' ').first ?? 'طالبنا العزيز';
        final isDark = AppSettings.themeModeSignal.value == ThemeMode.dark;

        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Right Side: User Avatar on the far right + Greeting text beside it
            GestureDetector(
              onTap: () {
                context.push(RouteNames.profile);
              },
              child: Row(
                children: [
                  // Avatar with Ring & Glow
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.primaryColor(context).withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppColors.primaryColor(context).withValues(alpha: 0.35),
                        width: 2,
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(24),
                      child: (user?.avatar != null && user!.avatar!.isNotEmpty)
                          ? CustomImageWidget(
                              image: user.avatar,
                              width: 48,
                              height: 48,
                              fit: BoxFit.cover,
                            )
                          : Icon(
                              Icons.person_rounded,
                              size: 28,
                              color: AppColors.primaryColor(context),
                            ),
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Greeting + Name Text
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: '${s.GreetingHello} ',
                              style: TextStyles.bold16.copyWith(
                                color: AppColors.textBoldColor(context),
                                fontFamily: 'Almarai',
                              ),
                            ),
                            TextSpan(
                              text: userName,
                              style: TextStyles.bold16.copyWith(
                                color: AppColors.primaryColor(context),
                                fontFamily: 'Almarai',
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        s.HowAreYouToday,
                        style: TextStyles.regular12.copyWith(
                          color: AppColors.textSecondaryColor(context),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Left Side: Action Icons (Theme Switcher + Notifications with Badge)
            Row(
              children: [
                // 1. Dark / Light Theme Toggle Button
                _buildCircleActionButton(
                  context: context,
                  icon: isDark
                      ? Icons.light_mode_outlined
                      : Icons.nightlight_round_outlined,
                  onTap: () {
                    AppSettings.changeTheme();
                  },
                ),

                const SizedBox(width: 10),

                // 2. Notifications Button with Red Badge
                BlocBuilder<NotificationsCubit, NotificationsState>(
                  builder: (context, notifState) {
                    int unreadCount = 0;
                    if (notifState is NotificationsSuccess) {
                      unreadCount = notifState.unreadCount;
                    }

                    return Stack(
                      clipBehavior: Clip.none,
                      children: [
                        _buildCircleActionButton(
                          context: context,
                          icon: Icons.notifications_none_rounded,
                          onTap: () {
                            context.push(RouteNames.notifications);
                          },
                        ),
                        if (unreadCount > 0)
                          Positioned(
                            top: -2,
                            right: -2,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: Color(0xFFEF4444),
                                shape: BoxShape.circle,
                              ),
                              constraints: const BoxConstraints(
                                minWidth: 18,
                                minHeight: 18,
                              ),
                              child: Center(
                                child: Text(
                                  unreadCount > 9 ? '9+' : '$unreadCount',
                                  style: TextStyles.bold10.copyWith(
                                    color: Colors.white,
                                    height: 1,
                                  ),
                                ),
                              ),
                            ),
                          ),
                      ],
                    );
                  },
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  Widget _buildCircleActionButton({
    required BuildContext context,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: AppColors.itemsColor(context),
          shape: BoxShape.circle,
          border: Border.all(
            color: AppColors.borderColor(context),
            width: 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadowColor(context).withValues(alpha: 0.05),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Center(
          child: Icon(
            icon,
            size: 20,
            color: AppColors.textPrimaryColor(context),
          ),
        ),
      ),
    );
  }
}
