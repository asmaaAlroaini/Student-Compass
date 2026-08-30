class SubjectModel {
  final int id;
  final String name;
  final String code;
  final String gradeLevel;
  final String? track;
  final String? icon;
  final bool isActive;
  final int unitsCount;

  const SubjectModel({
    required this.id,
    required this.name,
    required this.code,
    required this.gradeLevel,
    this.track,
    this.icon,
    this.isActive = true,
    this.unitsCount = 0,
  });

  factory SubjectModel.fromJson(Map<String, dynamic> json) => SubjectModel(
        id: json['id'] as int,
        name: json['name'] as String? ?? '',
        code: json['code'] as String? ?? '',
        gradeLevel: json['grade_level'] as String? ?? '',
        track: json['track'] as String?,
        icon: json['icon'] as String?,
        isActive: json['is_active'] == 1 || json['is_active'] == true,
        unitsCount: json['units_count'] as int? ?? 0,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'code': code,
        'grade_level': gradeLevel,
        'track': track,
        'icon': icon,
        'is_active': isActive,
        'units_count': unitsCount,
      };
}
