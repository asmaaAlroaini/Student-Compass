class ExamQuestionModel {
  final int id;
  final int? subjectId;
  final int? unitId;
  final int? lessonId;
  final String questionText;
  final String type; // mcq, true_false, essay
  final String? imagePath;
  final List<String> options;
  final String? correctAnswer;
  final String? explanation;
  final String difficulty;
  final int? year;
  final String? source;
  final int points;
  final int? order;
  final bool isBookmarked;
  final String? studentAnswer; // for incorrect questions review

  const ExamQuestionModel({
    required this.id,
    this.subjectId,
    this.unitId,
    this.lessonId,
    required this.questionText,
    required this.type,
    this.imagePath,
    required this.options,
    this.correctAnswer,
    this.explanation,
    this.difficulty = 'medium',
    this.year,
    this.source,
    this.points = 1,
    this.order,
    this.isBookmarked = false,
    this.studentAnswer,
  });

  factory ExamQuestionModel.fromJson(Map<String, dynamic> json) {
    List<String> parsedOptions = [];
    if (json['options'] != null) {
      if (json['options'] is List) {
        parsedOptions = (json['options'] as List)
            .map((e) => e.toString())
            .toList();
      } else if (json['options'] is Map) {
        parsedOptions = (json['options'] as Map)
            .values
            .map((e) => e.toString())
            .toList();
      }
    }

    int marks = json['points'] as int? ?? 1;
    if (json['pivot'] != null && json['pivot']['marks'] != null) {
      marks = json['pivot']['marks'] as int;
    }

    int? orderNum;
    if (json['pivot'] != null && json['pivot']['order'] != null) {
      orderNum = json['pivot']['order'] as int;
    }

    // إجابة الطالب وتفاصيل المحاولة السابقة
    String? sAnswer;
    if (json['last_attempt_details'] != null && json['last_attempt_details'] is Map) {
      sAnswer = json['last_attempt_details']['student_answer'] as String?;
    }

    return ExamQuestionModel(
      id: json['id'] as int? ?? 0,
      subjectId: json['subject_id'] as int?,
      unitId: json['unit_id'] as int?,
      lessonId: json['lesson_id'] as int?,
      questionText: json['question_text'] as String? ?? '',
      type: json['type'] as String? ?? 'mcq',
      imagePath: json['image_path'] as String? ?? json['question_image'] as String?,
      options: parsedOptions,
      correctAnswer: json['correct_answer'] as String?,
      explanation: json['explanation'] as String?,
      difficulty: json['difficulty'] as String? ?? 'medium',
      year: json['year'] as int?,
      source: json['source'] as String?,
      points: marks,
      order: orderNum,
      isBookmarked: json['is_bookmarked'] == true,
      studentAnswer: sAnswer,
    );
  }
}
