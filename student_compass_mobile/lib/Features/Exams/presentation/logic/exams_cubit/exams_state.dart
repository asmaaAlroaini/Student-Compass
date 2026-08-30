import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';

abstract class ExamsState {}

class ExamsInitial extends ExamsState {}

class ExamsLoading extends ExamsState {}

class ExamsSuccess extends ExamsState {
  final List<ExamModel> exams;

  ExamsSuccess({required this.exams});
}

class ExamsFailure extends ExamsState {
  final String errorMessage;
  final String? errorKey;

  ExamsFailure({required this.errorMessage, this.errorKey});
}
