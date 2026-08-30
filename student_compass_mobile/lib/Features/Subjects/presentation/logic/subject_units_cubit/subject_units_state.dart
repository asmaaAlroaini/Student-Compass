import 'package:student_compass_mobile/Features/Subjects/data/models/unit_model.dart';

abstract class SubjectUnitsState {}

class SubjectUnitsInitial extends SubjectUnitsState {}

class SubjectUnitsLoading extends SubjectUnitsState {}

class SubjectUnitsSuccess extends SubjectUnitsState {
  final List<UnitModel> units;
  SubjectUnitsSuccess({required this.units});
}

class SubjectUnitsFailure extends SubjectUnitsState {
  final String errorMessage;
  final String? errorKey;
  SubjectUnitsFailure({required this.errorMessage, this.errorKey});
}
