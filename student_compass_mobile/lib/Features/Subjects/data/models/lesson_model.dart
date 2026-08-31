class LessonModel {
  final int id;
  final int unitId;
  final int subjectId;
  final String title;
  final int lessonNumber;
  final int order;
  final String? summary;
  final String? videoUrl;
  final String? pdfPath;
  final int questionsCount;
  final int currentStage;
  final int progressPercentage;
  final bool isCompleted;
  final Map<String, dynamic>? shortExam;
  final Map<String, dynamic>? learningJourney;

  const LessonModel({
    required this.id,
    required this.unitId,
    required this.subjectId,
    required this.title,
    this.lessonNumber = 1,
    this.order = 0,
    this.summary,
    this.videoUrl,
    this.pdfPath,
    this.questionsCount = 0,
    this.currentStage = 1,
    this.progressPercentage = 0,
    this.isCompleted = false,
    this.shortExam,
    this.learningJourney,
  });

  factory LessonModel.fromJson(Map<String, dynamic> json) {
    // دعم الاستجابة المباشرة أو المجمعة
    final lessonData = json.containsKey('lesson') && json['lesson'] is Map<String, dynamic>
        ? json['lesson'] as Map<String, dynamic>
        : json;

    return LessonModel(
      id: (lessonData['id'] as num?)?.toInt() ?? 0,
      unitId: (lessonData['unit_id'] as num?)?.toInt() ?? 0,
      subjectId: (lessonData['subject_id'] as num?)?.toInt() ?? 0,
      title: lessonData['title'] as String? ?? '',
      lessonNumber: (lessonData['lesson_number'] as num?)?.toInt() ?? 1,
      order: (lessonData['order'] as num?)?.toInt() ?? 0,
      summary: lessonData['summary'] as String?,
      videoUrl: lessonData['video_url'] as String?,
      pdfPath: lessonData['pdf_path'] as String?,
      questionsCount: (lessonData['questions_count'] as num?)?.toInt() ?? 0,
      currentStage: json['learning_journey'] != null && json['learning_journey']['current_stage'] != null
          ? ((json['learning_journey']['current_stage'] as num?)?.toInt() ?? 1)
          : ((json['current_stage'] as num?)?.toInt() ?? 1),
      progressPercentage: json['learning_journey'] != null && json['learning_journey']['progress_percentage'] != null
          ? ((json['learning_journey']['progress_percentage'] as num?)?.toInt() ?? 0)
          : ((json['progress_percentage'] as num?)?.toInt() ?? 0),
      isCompleted: json['learning_journey'] != null && json['learning_journey']['is_completed'] != null
          ? (json['learning_journey']['is_completed'] == true || json['learning_journey']['is_completed'] == 1)
          : (json['is_completed'] == true || json['is_completed'] == 1),
      shortExam: json['short_exam'] as Map<String, dynamic>?,
      learningJourney: json['learning_journey'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'unit_id': unitId,
        'subject_id': subjectId,
        'title': title,
        'lesson_number': lessonNumber,
        'order': order,
        'summary': summary,
        'video_url': videoUrl,
        'pdf_path': pdfPath,
        'questions_count': questionsCount,
        'current_stage': currentStage,
        'progress_percentage': progressPercentage,
        'is_completed': isCompleted,
      };
}
