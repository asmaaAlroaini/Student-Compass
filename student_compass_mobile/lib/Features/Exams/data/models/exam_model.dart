import 'package:student_compass_mobile/Features/Exams/data/models/exam_question_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_result_model.dart';

class ExamModel {
  final int id;
  final int? subjectId;
  final String? subjectName;
  final String? subjectIcon;
  final int? unitId;
  final String? unitTitle;
  final int? lessonId;
  final String? lessonTitle;
  final String title;
  final String type; // ministerial, custom, comprehensive, unit
  final int durationMinutes;
  final int totalMarks;
  final int passMarks;
  final bool isRandomized;
  final int questionsCount;
  final bool hasTaken;
  final double? lastScore;
  final double? lastPercentage;
  final String? progressStatus;
  final ExamResultModel? progressResult;
  final List<ExamQuestionModel> questions;

  const ExamModel({
    required this.id,
    this.subjectId,
    this.subjectName,
    this.subjectIcon,
    this.unitId,
    this.unitTitle,
    this.lessonId,
    this.lessonTitle,
    required this.title,
    this.type = 'ministerial',
    this.durationMinutes = 45,
    this.totalMarks = 20,
    this.passMarks = 10,
    this.isRandomized = false,
    this.questionsCount = 0,
    this.hasTaken = false,
    this.lastScore,
    this.lastPercentage,
    this.progressStatus,
    this.progressResult,
    this.questions = const [],
  });

  factory ExamModel.fromJson(Map<String, dynamic> json) {
    String? sName;
    String? sIcon;
    if (json['subject'] != null && json['subject'] is Map) {
      sName = json['subject']['name'] as String?;
      sIcon = json['subject']['icon'] as String?;
    }

    String? uTitle;
    if (json['unit'] != null && json['unit'] is Map) {
      uTitle = json['unit']['title'] as String?;
    }

    String? lTitle;
    if (json['lesson'] != null && json['lesson'] is Map) {
      lTitle = json['lesson']['title'] as String?;
    }

    List<ExamQuestionModel> parsedQuestions = [];
    if (json['questions'] != null && json['questions'] is List) {
      parsedQuestions = (json['questions'] as List)
          .map((q) => ExamQuestionModel.fromJson(q as Map<String, dynamic>))
          .toList();
    }

    ExamResultModel? pResult;
    if (json['progress_result'] != null && json['progress_result'] is Map) {
      pResult = ExamResultModel.fromJson(
        json['progress_result'] as Map<String, dynamic>,
      );
    } else if (json['result'] != null && json['result'] is Map) {
      pResult = ExamResultModel.fromJson(
        json['result'] as Map<String, dynamic>,
      );
    }

    return ExamModel(
      id: json['id'] as int? ?? 0,
      subjectId: json['subject_id'] as int?,
      subjectName: sName,
      subjectIcon: sIcon,
      unitId: json['unit_id'] as int?,
      unitTitle: uTitle,
      lessonId: json['lesson_id'] as int?,
      lessonTitle: lTitle,
      title: json['title'] as String? ?? 'امتحان',
      type: json['type'] as String? ?? 'ministerial',
      durationMinutes: json['duration_minutes'] as int? ?? 45,
      totalMarks: json['total_marks'] as int? ?? 20,
      passMarks: json['pass_marks'] as int? ?? 10,
      isRandomized: json['is_randomized'] == true || json['is_randomized'] == 1,
      questionsCount: json['questions_count'] as int? ?? parsedQuestions.length,
      hasTaken: json['has_taken'] == true,
      lastScore: (json['last_score'] is num)
          ? (json['last_score'] as num).toDouble()
          : null,
      lastPercentage: (json['last_percentage'] is num)
          ? (json['last_percentage'] as num).toDouble()
          : null,
      progressStatus: json['progress_status'] as String?,
      progressResult: pResult,
      questions: parsedQuestions,
    );
  }
}
