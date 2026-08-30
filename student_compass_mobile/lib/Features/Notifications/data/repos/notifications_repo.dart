import 'package:dartz/dartz.dart';
import 'package:student_compass_mobile/Features/Notifications/data/models/notification_model.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';

abstract class NotificationsRepo {
  /// جلب الإشعارات وعدد غير المقروء
  Future<Either<Failure, (List<NotificationModel>, int unreadCount)>> fetchNotifications();

  /// تعليم إشعار كمقروء
  Future<Either<Failure, void>> markAsRead({required int notificationId});

  /// تعليم كافة الإشعارات كمقروءة
  Future<Either<Failure, void>> markAllAsRead();
}
