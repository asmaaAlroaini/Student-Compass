import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Notifications/data/repos/notifications_repo.dart';
import 'package:student_compass_mobile/Features/Notifications/presentation/logic/notifications_cubit/notifications_state.dart';

class NotificationsCubit extends Cubit<NotificationsState> {
  final NotificationsRepo notificationsRepo;

  NotificationsCubit(this.notificationsRepo) : super(NotificationsInitial());

  Future<void> fetchNotifications() async {
    emit(NotificationsLoading());
    final result = await notificationsRepo.fetchNotifications();
    result.fold(
      (failure) => emit(
        NotificationsFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (data) {
        final (notifications, unreadCount) = data;
        emit(
          NotificationsSuccess(
            notifications: notifications,
            unreadCount: unreadCount,
          ),
        );
      },
    );
  }

  Future<void> markAsRead(int notificationId) async {
    if (state is! NotificationsSuccess) return;
    final current = state as NotificationsSuccess;

    final updated = current.notifications.map((n) {
      if (n.id == notificationId) {
        return n.copyWith(isRead: true);
      }
      return n;
    }).toList();

    final newUnread = updated.where((n) => !n.isRead).length;
    emit(NotificationsSuccess(notifications: updated, unreadCount: newUnread));

    await notificationsRepo.markAsRead(notificationId: notificationId);
  }

  Future<void> markAllAsRead() async {
    if (state is! NotificationsSuccess) return;
    final current = state as NotificationsSuccess;

    final updated = current.notifications
        .map((n) => n.copyWith(isRead: true))
        .toList();
    emit(NotificationsSuccess(notifications: updated, unreadCount: 0));

    await notificationsRepo.markAllAsRead();
  }
}
