class User {
  final int id;
  final String name;
  final String email;
  final String? emailVerifiedAt;
  final String? phone;
  final String? avatar;
  final String role;
  final String? gradeLevel;
  final String? track;
  final bool isActive;
  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;
  final String? token;

  User({
    required this.id,
    required this.name,
    this.email = '',
    this.emailVerifiedAt,
    this.phone,
    this.avatar,
    this.role = 'student',
    this.gradeLevel,
    this.track,
    this.isActive = true,
    this.createdAt,
    this.updatedAt,
    this.deletedAt,
    this.token,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      emailVerifiedAt: json['email_verified_at'] as String?,
      phone: json['phone'] as String?,
      avatar: json['avatar'] as String?,
      role: json['role'] as String? ?? 'student',
      gradeLevel:
          json['grade_level'] as String? ?? json['gradeLevel'] as String?,
      track: json['track'] as String?,
      isActive: json['is_active'] == 1 ||
          json['is_active'] == true ||
          json['isActive'] == true,
      createdAt: json['created_at'] as String?,
      updatedAt: json['updated_at'] as String?,
      deletedAt: json['deleted_at'] as String?,
      token: json['token'] as String? ?? json['access_token'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        if (emailVerifiedAt != null) 'email_verified_at': emailVerifiedAt,
        'phone': phone,
        'avatar': avatar,
        'role': role,
        'grade_level': gradeLevel,
        'track': track,
        'is_active': isActive,
        if (createdAt != null) 'created_at': createdAt,
        if (updatedAt != null) 'updated_at': updatedAt,
        if (deletedAt != null) 'deleted_at': deletedAt,
        if (token != null) 'token': token,
      };
}
