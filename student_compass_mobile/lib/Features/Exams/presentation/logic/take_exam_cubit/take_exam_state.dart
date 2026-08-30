import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_result_model.dart';

abstract class TakeExamState {}

class TakeExamInitial extends TakeExamState {}

class TakeExamLoading extends TakeExamState {}

class TakeExamActive extends TakeExamState {
  final ExamModel exam;
  final int currentQuestionIndex;
  final Map<int, String> selectedAnswers;
  final int remainingSeconds;
  final int totalSeconds;
  final bool isSubmitting;

  TakeExamActive({
    required this.exam,
    required this.currentQuestionIndex,
    required this.selectedAnswers,
    required this.remainingSeconds,
    required this.totalSeconds,
    this.isSubmitting = false,
  });

  TakeExamActive copyWith({
    ExamModel? exam,
    int? currentQuestionIndex,
    Map<int, String>? selectedAnswers,
    int? remainingSeconds,
    int? totalSeconds,
    bool? isSubmitting,
  }) {
    return TakeExamActive(
      exam: exam ?? this.exam,
      currentQuestionIndex:
          currentQuestionIndex ?? this.currentQuestionIndex,
      selectedAnswers: selectedAnswers ?? this.selectedAnswers,
      remainingSeconds: remainingSeconds ?? this.remainingSeconds,
      totalSeconds: totalSeconds ?? this.totalSeconds,
      isSubmitting: isSubmitting ?? this.isSubmitting,
    );
  }
}

class TakeExamSubmitSuccess extends TakeExamState {
  final ExamResultModel result;

  TakeExamSubmitSuccess({required this.result});
}

class TakeExamFailure extends TakeExamState {
  final String errorMessage;
  final String? errorKey;

  TakeExamFailure({required this.errorMessage, this.errorKey});
}
