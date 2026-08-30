class ResetPassword {
  String message;
  int userId;

  ResetPassword({required this.message, required this.userId});

  @override
  String toString() {
    return 'ResetPassord(message: $message, userId: $userId)';
  }

  factory ResetPassword.fromJson(Map<String, dynamic> json) => ResetPassword(
    message: json['message'] as String,
    userId: json['user_id'] as int,
  );

  Map<String, dynamic> toJson() => {'message': message, 'user_id': userId};
}
