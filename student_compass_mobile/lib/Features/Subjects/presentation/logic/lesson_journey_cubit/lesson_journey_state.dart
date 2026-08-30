import 'package:student_compass_mobile/Features/Subjects/data/models/lesson_model.dart';

abstract class LessonJourneyState {}

class LessonJourneyInitial extends LessonJourneyState {}

class LessonJourneyLoading extends LessonJourneyState {}

class LessonJourneySuccess extends LessonJourneyState {
  final LessonModel lesson;
  LessonJourneySuccess({required this.lesson});
}

class LessonJourneyProgressUpdated extends LessonJourneyState {
  final Map<String, dynamic> progressData;
  LessonJourneyProgressUpdated({required this.progressData});
}

class LessonJourneyFailure extends LessonJourneyState {
  final String errorMessage;
  final String? errorKey;
  LessonJourneyFailure({required this.errorMessage, this.errorKey});
}
