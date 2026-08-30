import 'package:student_compass_mobile/Features/Subjects/data/models/lesson_model.dart';

abstract class UnitLessonsState {}

class UnitLessonsInitial extends UnitLessonsState {}

class UnitLessonsLoading extends UnitLessonsState {}

class UnitLessonsSuccess extends UnitLessonsState {
  final List<LessonModel> lessons;
  UnitLessonsSuccess({required this.lessons});
}

class UnitLessonsFailure extends UnitLessonsState {
  final String errorMessage;
  final String? errorKey;
  UnitLessonsFailure({required this.errorMessage, this.errorKey});
}
