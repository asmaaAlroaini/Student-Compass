import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:student_compass_mobile/Features/Notifications/data/models/notification_model.dart';
import 'package:student_compass_mobile/Features/Notifications/data/repos/notifications_repo.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

class NotificationsRepoImpl implements NotificationsRepo {
  final ApiService apiService;

  NotificationsRepoImpl(this.apiService);

  @override
  Future<Either<Failure, (List<NotificationModel>, int unreadCount)>>
      fetchNotifications() async {
    try {
      final data = await apiService.get(
        endPoint: AppConstants.kNotifications,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final List<dynamic> list = data['data'] ?? [];
      final notifications = list
          .map((json) => NotificationModel.fromJson(json as Map<String, dynamic>))
          .toList();
      final unreadCount = data['unread_count'] as int? ??
          notifications.where((n) => !n.isRead).length;

      return right((notifications, unreadCount));
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> markAsRead({
    required int notificationId,
  }) async {
    try {
      await apiService.put(
        endPoint: '${AppConstants.kNotifications}/$notificationId/read',
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );
      return right(null);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> markAllAsRead() async {
    try {
      await apiService.put(
        endPoint: AppConstants.kNotificationsReadAll,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );
      return right(null);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }
}
