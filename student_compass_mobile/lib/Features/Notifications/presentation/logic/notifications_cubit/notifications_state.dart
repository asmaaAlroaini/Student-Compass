import 'package:student_compass_mobile/Features/Notifications/data/models/notification_model.dart';

abstract class NotificationsState {}

class NotificationsInitial extends NotificationsState {}

class NotificationsLoading extends NotificationsState {}

class NotificationsSuccess extends NotificationsState {
  final List<NotificationModel> notifications;
  final int unreadCount;

  NotificationsSuccess({
    required this.notifications,
    required this.unreadCount,
  });
}

class NotificationsFailure extends NotificationsState {
  final String errorMessage;
  final String? errorKey;

  NotificationsFailure({required this.errorMessage, this.errorKey});
}
