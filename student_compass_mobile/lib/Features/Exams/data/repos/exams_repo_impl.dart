import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/custom_exam_request_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_result_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/repos/exams_repo.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

class ExamsRepoImpl implements ExamsRepo {
  final ApiService apiService;

  ExamsRepoImpl(this.apiService);

  @override
  Future<Either<Failure, List<ExamModel>>> fetchExams({
    int? subjectId,
    String? type,
  }) async {
    try {
      String endpoint = AppConstants.kStudentExams;
      List<String> queryParams = [];
      if (subjectId != null) queryParams.add('subject_id=$subjectId');
      if (type != null && type.isNotEmpty) queryParams.add('type=$type');
      if (queryParams.isNotEmpty) {
        endpoint += '?${queryParams.join('&')}';
      }

      final data = await apiService.get(
        endPoint: endpoint,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final List<dynamic> list = data['data'] ?? [];
      final exams = list
          .map((json) => ExamModel.fromJson(json as Map<String, dynamic>))
          .toList();

      return right(exams);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, ExamModel>> fetchExamDetails({
    required int examId,
  }) async {
    try {
      final data = await apiService.get(
        endPoint: '${AppConstants.kStudentExams}/$examId',
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final exam = ExamModel.fromJson(data['data'] as Map<String, dynamic>);
      return right(exam);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, ExamModel>> generateCustomExam({
    required CustomExamRequestModel request,
  }) async {
    try {
      final data = await apiService.post(
        endPoint: AppConstants.kStudentCustomExam,
        body: request.toJson(),
        token: Prefs.getString(AppConstants.kToken),
      );

      final exam = ExamModel.fromJson(data['data'] as Map<String, dynamic>);
      return right(exam);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, ExamResultModel>> submitExam({
    required int examId,
    required List<Map<String, dynamic>> answers,
    required int timeSpentSeconds,
  }) async {
    try {
      final data = await apiService.post(
        endPoint: '${AppConstants.kStudentSubmitExam}/$examId/submit',
        body: {
          'answers': answers,
          'time_spent_seconds': timeSpentSeconds,
        },
        token: Prefs.getString(AppConstants.kToken),
      );

      final result =
          ExamResultModel.fromJson(data['data'] as Map<String, dynamic>);
      return right(result);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }
}
