class UnitModel {
  final int id;
  final int subjectId;
  final String title;
  final int unitNumber;
  final int order;
  final String? description;
  final int lessonsCount;

  const UnitModel({
    required this.id,
    required this.subjectId,
    required this.title,
    this.unitNumber = 1,
    this.order = 0,
    this.description,
    this.lessonsCount = 0,
  });

  factory UnitModel.fromJson(Map<String, dynamic> json) => UnitModel(
        id: (json['id'] as num?)?.toInt() ?? 0,
        subjectId: (json['subject_id'] as num?)?.toInt() ?? 0,
        title: json['title'] as String? ?? '',
        unitNumber: (json['unit_number'] as num?)?.toInt() ?? 1,
        order: (json['order'] as num?)?.toInt() ?? 0,
        description: json['description'] as String?,
        lessonsCount: (json['lessons_count'] as num?)?.toInt() ?? 0,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'subject_id': subjectId,
        'title': title,
        'unit_number': unitNumber,
        'order': order,
        'description': description,
        'lessons_count': lessonsCount,
      };
}
