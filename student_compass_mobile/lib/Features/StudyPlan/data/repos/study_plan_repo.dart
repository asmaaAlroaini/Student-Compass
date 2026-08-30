import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:student_compass_mobile/Features/StudyPlan/data/models/study_plan_model.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

abstract class StudyPlanRepo {
  Future<Either<Failure, StudyPlanModel>> fetchTodayPlan();
  Future<Either<Failure, StudyPlanModel>> recalculatePlan();
  Future<Either<Failure, StudyPlanModel>> onboardingPlan({
    required List<int> subjectIds,
    int? daysUntilExam,
    int? dailyStudyHours,
  });
  Future<Either<Failure, StudyTaskModel>> updateTaskStatus({
    required int taskId,
    required String status,
  });
}

class StudyPlanRepoImpl implements StudyPlanRepo {
  final ApiService apiService;

  StudyPlanRepoImpl(this.apiService);

  @override
  Future<Either<Failure, StudyPlanModel>> fetchTodayPlan() async {
    try {
      final data = await apiService.get(
        endPoint: AppConstants.kStudentStudyPlan,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final plan = StudyPlanModel.fromJson(data['data'] as Map<String, dynamic>);
      return right(plan);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, StudyPlanModel>> recalculatePlan() async {
    try {
      final data = await apiService.post(
        endPoint: AppConstants.kStudentStudyPlanRecalculate,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final plan = StudyPlanModel.fromJson(data['data'] as Map<String, dynamic>);
      return right(plan);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, StudyPlanModel>> onboardingPlan({
    required List<int> subjectIds,
    int? daysUntilExam,
    int? dailyStudyHours,
  }) async {
    try {
      final data = await apiService.post(
        endPoint: AppConstants.kStudentStudyPlanOnboarding,
        body: {
          'subject_ids': subjectIds,
          if (daysUntilExam != null) 'days_until_exam': daysUntilExam,
          if (dailyStudyHours != null) 'daily_study_hours': dailyStudyHours,
        },
        token: Prefs.getString(AppConstants.kToken),
      );

      final plan = StudyPlanModel.fromJson(data['data'] as Map<String, dynamic>);
      return right(plan);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, StudyTaskModel>> updateTaskStatus({
    required int taskId,
    required String status,
  }) async {
    try {
      final data = await apiService.put(
        endPoint: '${AppConstants.kStudentStudyTasks}/$taskId/status',
        body: {'status': status},
        token: Prefs.getString(AppConstants.kToken),
      );

      final task = StudyTaskModel.fromJson(data['data'] as Map<String, dynamic>);
      return right(task);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }
}
