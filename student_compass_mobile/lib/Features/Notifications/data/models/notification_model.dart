class NotificationModel {
  final int id;
  final int userId;
  final String title;
  final String message;
  final String type;
  final bool isRead;
  final DateTime? createdAt;

  const NotificationModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.message,
    this.type = 'general',
    this.isRead = false,
    this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    DateTime? parsedDate;
    if (json['created_at'] != null) {
      parsedDate = DateTime.tryParse(json['created_at'].toString());
    }

    return NotificationModel(
      id: json['id'] as int? ?? 0,
      userId: json['user_id'] as int? ?? 0,
      title: json['title'] as String? ?? '',
      message: json['message'] as String? ?? '',
      type: json['type'] as String? ?? 'general',
      isRead: json['is_read'] == true || json['is_read'] == 1,
      createdAt: parsedDate,
    );
  }

  NotificationModel copyWith({
    int? id,
    int? userId,
    String? title,
    String? message,
    String? type,
    bool? isRead,
    DateTime? createdAt,
  }) {
    return NotificationModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      message: message ?? this.message,
      type: type ?? this.type,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
