import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';

abstract class CustomExamState {}

class CustomExamInitial extends CustomExamState {}

class CustomExamLoading extends CustomExamState {}

class CustomExamSuccess extends CustomExamState {
  final ExamModel exam;

  CustomExamSuccess({required this.exam});
}

class CustomExamFailure extends CustomExamState {
  final String errorMessage;
  final String? errorKey;

  CustomExamFailure({required this.errorMessage, this.errorKey});
}
