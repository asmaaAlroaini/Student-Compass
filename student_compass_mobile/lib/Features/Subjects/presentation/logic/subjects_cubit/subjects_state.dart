import 'package:student_compass_mobile/Features/Subjects/data/models/subject_model.dart';

abstract class SubjectsState {}

class SubjectsInitial extends SubjectsState {}

class SubjectsLoading extends SubjectsState {}

class SubjectsSuccess extends SubjectsState {
  final List<SubjectModel> subjects;
  SubjectsSuccess({required this.subjects});
}

class SubjectsFailure extends SubjectsState {
  final String errorMessage;
  final String? errorKey;
  SubjectsFailure({required this.errorMessage, this.errorKey});
}
