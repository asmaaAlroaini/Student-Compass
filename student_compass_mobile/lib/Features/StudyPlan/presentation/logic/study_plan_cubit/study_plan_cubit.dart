import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/StudyPlan/data/repos/study_plan_repo.dart';
import 'package:student_compass_mobile/Features/StudyPlan/presentation/logic/study_plan_cubit/study_plan_state.dart';

class StudyPlanCubit extends Cubit<StudyPlanState> {
  final StudyPlanRepo studyPlanRepo;

  StudyPlanCubit(this.studyPlanRepo) : super(StudyPlanInitial());

  Future<void> fetchTodayPlan() async {
    emit(StudyPlanLoading());
    final result = await studyPlanRepo.fetchTodayPlan();

    result.fold(
      (failure) => emit(
        StudyPlanFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (plan) => emit(StudyPlanSuccess(plan: plan)),
    );
  }

  Future<void> recalculatePlan() async {
    emit(StudyPlanLoading());
    final result = await studyPlanRepo.recalculatePlan();

    result.fold(
      (failure) => emit(
        StudyPlanFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (plan) => emit(StudyPlanRecalculated(plan: plan, message: 'تم إعادة جدولة خطتك بنجاح')),
    );
  }

  Future<void> updateTaskStatus({required int taskId, required String status}) async {
    final result = await studyPlanRepo.updateTaskStatus(taskId: taskId, status: status);

    result.fold(
      (failure) => emit(
        StudyPlanFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (task) {
        // Refresh today plan
        fetchTodayPlan();
      },
    );
  }

  Future<void> submitOnboarding({
    required List<int> subjectIds,
    int? daysUntilExam,
    int? dailyStudyHours,
  }) async {
    emit(StudyPlanLoading());
    final result = await studyPlanRepo.onboardingPlan(
      subjectIds: subjectIds,
      daysUntilExam: daysUntilExam,
      dailyStudyHours: dailyStudyHours,
    );

    result.fold(
      (failure) => emit(
        StudyPlanFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (plan) => emit(StudyPlanSuccess(plan: plan)),
    );
  }
}
