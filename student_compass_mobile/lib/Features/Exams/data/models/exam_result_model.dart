class ExamAnswerDetail {
  final int questionId;
  final String questionText;
  final String? studentAnswer;
  final String correctAnswer;
  final bool isCorrect;
  final int marksAwarded;
  final String? explanation;

  const ExamAnswerDetail({
    required this.questionId,
    required this.questionText,
    this.studentAnswer,
    required this.correctAnswer,
    required this.isCorrect,
    required this.marksAwarded,
    this.explanation,
  });

  factory ExamAnswerDetail.fromJson(Map<String, dynamic> json) {
    return ExamAnswerDetail(
      questionId: json['question_id'] as int? ?? 0,
      questionText: json['question_text'] as String? ?? '',
      studentAnswer: json['student_answer'] as String?,
      correctAnswer: json['correct_answer'] as String? ?? '',
      isCorrect: json['is_correct'] == true || json['is_correct'] == 1,
      marksAwarded: json['marks_awarded'] as int? ?? 0,
      explanation: json['explanation'] as String?,
    );
  }
}

class ExamResultModel {
  final String examTitle;
  final int score;
  final int totalPossibleScore;
  final double percentage;
  final String status; // passed, failed
  final int timeSpentSeconds;
  final List<ExamAnswerDetail> details;

  const ExamResultModel({
    required this.examTitle,
    required this.score,
    required this.totalPossibleScore,
    required this.percentage,
    required this.status,
    this.timeSpentSeconds = 0,
    required this.details,
  });

  int get correctCount => details.where((d) => d.isCorrect).length;
  int get wrongCount => details.where((d) => !d.isCorrect).length;
  bool get isPassed => status == 'passed';

  factory ExamResultModel.fromJson(Map<String, dynamic> json) {
    final rawDetails = json['details'] as List<dynamic>? ?? [];
    final detailsList = rawDetails
        .map((d) => ExamAnswerDetail.fromJson(d as Map<String, dynamic>))
        .toList();

    int time = 0;
    if (json['progress'] != null && json['progress'] is Map) {
      time = json['progress']['time_spent_seconds'] as int? ?? 0;
    }

    return ExamResultModel(
      examTitle: json['exam_title'] as String? ?? 'نتيجة الامتحان',
      score: json['score'] as int? ?? 0,
      totalPossibleScore: json['total_possible_score'] as int? ?? 0,
      percentage: (json['percentage'] is num)
          ? (json['percentage'] as num).toDouble()
          : 0.0,
      status: json['status'] as String? ?? 'completed',
      timeSpentSeconds: time,
      details: detailsList,
    );
  }
}
