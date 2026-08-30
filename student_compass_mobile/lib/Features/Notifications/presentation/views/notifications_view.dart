import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Notifications/presentation/logic/notifications_cubit/notifications_cubit.dart';
import 'package:student_compass_mobile/Features/Notifications/presentation/logic/notifications_cubit/notifications_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class NotificationsView extends StatefulWidget {
  const NotificationsView({super.key});

  @override
  State<NotificationsView> createState() => _NotificationsViewState();
}

class _NotificationsViewState extends State<NotificationsView> {
  @override
  void initState() {
    super.initState();
    context.read<NotificationsCubit>().fetchNotifications();
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'study_reminder':
        return Icons.access_time_filled_rounded;
      case 'new_content':
        return Icons.auto_stories_rounded;
      case 'exam_result':
        return Icons.military_tech_rounded;
      case 'competition':
        return Icons.emoji_events_rounded;
      default:
        return Icons.notifications_active_rounded;
    }
  }

  Color _getColorForType(String type, BuildContext context) {
    switch (type) {
      case 'study_reminder':
        return AppColors.customOrange(context);
      case 'new_content':
        return AppColors.primaryColor(context);
      case 'exam_result':
        return AppColors.customGreen(context);
      case 'competition':
        return const Color(0xFFEAB308);
      default:
        return AppColors.primaryColor(context);
    }
  }

  String _formatDate(DateTime? dt) {
    if (dt == null) return '';
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 60) {
      return 'منذ ${diff.inMinutes == 0 ? 1 : diff.inMinutes} دقيقة';
    } else if (diff.inHours < 24) {
      return 'منذ ${diff.inHours} ساعة';
    } else {
      return 'منذ ${diff.inDays} يوم';
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(
        title: s.NotificationsAndAlerts,
        actions: [
          BlocBuilder<NotificationsCubit, NotificationsState>(
            builder: (context, state) {
              if (state is NotificationsSuccess && state.unreadCount > 0) {
                return TextButton(
                  onPressed: () {
                    context.read<NotificationsCubit>().markAllAsRead();
                  },
                  child: Text(
                    s.MarkAllAsRead,
                    style: TextStyles.semiBold12.copyWith(
                      color: AppColors.primaryColor(context),
                    ),
                  ),
                );
              }
              return const SizedBox.shrink();
            },
          ),
        ],
      ),
      body: BlocBuilder<NotificationsCubit, NotificationsState>(
        builder: (context, state) {
          if (state is NotificationsLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is NotificationsFailure) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline_rounded,
                    size: 48,
                    color: AppColors.red(context),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    state.errorMessage,
                    style: TextStyles.semiBold14.copyWith(
                      color: AppColors.textPrimaryColor(context),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<NotificationsCubit>().fetchNotifications();
                    },
                    child: Text(s.Retry),
                  ),
                ],
              ),
            );
          }

          if (state is NotificationsSuccess) {
            final notifications = state.notifications;

            if (notifications.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppColors.primaryColor(
                          context,
                        ).withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.notifications_none_rounded,
                        size: 64,
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      s.NoNotificationsYet,
                      style: TextStyles.bold16.copyWith(
                        color: AppColors.textPrimaryColor(context),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      s.NoNotificationsSub,
                      style: TextStyles.regular12.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                  ],
                ),
              );
            }

            return RefreshIndicator(
              onRefresh: () async {
                context.read<NotificationsCubit>().fetchNotifications();
              },
              child: ListView.separated(
                padding: const EdgeInsets.all(AppSpacing.s16),
                itemCount: notifications.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: AppSpacing.s12),
                itemBuilder: (context, index) {
                  final item = notifications[index];
                  final iconColor = _getColorForType(item.type, context);

                  return InkWell(
                    onTap: () {
                      if (!item.isRead) {
                        context.read<NotificationsCubit>().markAsRead(item.id);
                      }
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.all(AppSpacing.s16),
                      decoration: BoxDecoration(
                        color: item.isRead
                            ? AppColors.itemsColor(context)
                            : AppColors.primaryColor(
                                context,
                              ).withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: item.isRead
                              ? AppColors.borderColor(context)
                              : AppColors.primaryColor(
                                  context,
                                ).withValues(alpha: 0.3),
                          width: item.isRead ? 1 : 1.5,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.shadowColor(context),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Type Icon Avatar
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: iconColor.withValues(alpha: 0.12),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              _getIconForType(item.type),
                              color: iconColor,
                              size: 22,
                            ),
                          ),
                          const SizedBox(width: 14),

                          // Notification Text Content
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        item.title,
                                        style: TextStyles.bold14.copyWith(
                                          color: AppColors.textBoldColor(
                                            context,
                                          ),
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    if (!item.isRead)
                                      Container(
                                        width: 8,
                                        height: 8,
                                        decoration: BoxDecoration(
                                          color: AppColors.primaryColor(
                                            context,
                                          ),
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  item.message,
                                  style: TextStyles.regular12.copyWith(
                                    color: AppColors.textPrimaryColor(context),
                                    height: 1.4,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  _formatDate(item.createdAt),
                                  style: TextStyles.regular10.copyWith(
                                    color: AppColors.textSecondaryColor(
                                      context,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }
}
