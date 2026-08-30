import 'package:student_compass_mobile/Features/Exams/data/models/exam_question_model.dart';

abstract class PracticeQuestionsState {}

class PracticeQuestionsInitial extends PracticeQuestionsState {}

class PracticeQuestionsLoading extends PracticeQuestionsState {}

class PracticeQuestionsSuccess extends PracticeQuestionsState {
  final List<ExamQuestionModel> questions;
  PracticeQuestionsSuccess({required this.questions});
}

class PracticeQuestionsFailure extends PracticeQuestionsState {
  final String errorMessage;
  final String? errorKey;
  PracticeQuestionsFailure({required this.errorMessage, this.errorKey});
}
