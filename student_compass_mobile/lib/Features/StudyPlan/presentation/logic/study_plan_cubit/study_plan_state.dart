import 'package:student_compass_mobile/Features/StudyPlan/data/models/study_plan_model.dart';

abstract class StudyPlanState {}

class StudyPlanInitial extends StudyPlanState {}

class StudyPlanLoading extends StudyPlanState {}

class StudyPlanSuccess extends StudyPlanState {
  final StudyPlanModel plan;
  StudyPlanSuccess({required this.plan});
}

class StudyPlanRecalculated extends StudyPlanState {
  final StudyPlanModel plan;
  final String message;
  StudyPlanRecalculated({required this.plan, required this.message});
}

class StudyPlanFailure extends StudyPlanState {
  final String errorMessage;
  final String? errorKey;
  StudyPlanFailure({required this.errorMessage, this.errorKey});
}
