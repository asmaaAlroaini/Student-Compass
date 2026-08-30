import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:student_compass_mobile/Features/Competitions/data/models/competition_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

abstract class CompetitionsRepo {
  Future<Either<Failure, List<CompetitionModel>>> fetchCompetitions();
  Future<Either<Failure, ExamModel>> fetchCompetitionQuestions({required int competitionId});
  Future<Either<Failure, Map<String, dynamic>>> submitCompetition({
    required int competitionId,
    required List<Map<String, dynamic>> answers,
    required int timeSpentSeconds,
  });
  Future<Either<Failure, List<LeaderboardEntryModel>>> fetchLeaderboard({required int competitionId});
}

class CompetitionsRepoImpl implements CompetitionsRepo {
  final ApiService apiService;
  CompetitionsRepoImpl(this.apiService);

  @override
  Future<Either<Failure, List<CompetitionModel>>> fetchCompetitions() async {
    try {
      final data = await apiService.get(
        endPoint: AppConstants.kStudentCompetitions,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );
      final List<dynamic> list = data['data'] ?? [];
      final competitions = list.map((json) => CompetitionModel.fromJson(json as Map<String, dynamic>)).toList();
      return right(competitions);
    } catch (e) {
      if (e is DioException) return left(ServerFailure.fromDioException(e));
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, ExamModel>> fetchCompetitionQuestions({required int competitionId}) async {
    try {
      final data = await apiService.get(
        endPoint: '${AppConstants.kStudentCompetitions}/$competitionId',
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );
      final exam = ExamModel.fromJson(data['data'] as Map<String, dynamic>);
      return right(exam);
    } catch (e) {
      if (e is DioException) return left(ServerFailure.fromDioException(e));
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> submitCompetition({
    required int competitionId,
    required List<Map<String, dynamic>> answers,
    required int timeSpentSeconds,
  }) async {
    try {
      final data = await apiService.post(
        endPoint: '${AppConstants.kStudentCompetitions}/$competitionId/submit',
        body: {'answers': answers, 'time_spent_seconds': timeSpentSeconds},
        token: Prefs.getString(AppConstants.kToken),
      );
      return right(data['data'] as Map<String, dynamic>);
    } catch (e) {
      if (e is DioException) return left(ServerFailure.fromDioException(e));
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<LeaderboardEntryModel>>> fetchLeaderboard({required int competitionId}) async {
    try {
      final data = await apiService.get(
        endPoint: '${AppConstants.kStudentCompetitions}/$competitionId/leaderboard',
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final dynamic rawData = data['data'];
      final List<dynamic> list = rawData is Map
          ? (rawData['top_students'] is List
              ? rawData['top_students']
              : (rawData['data'] is List ? rawData['data'] : []))
          : (rawData is List ? rawData : []);

      final entries = list.map((json) => LeaderboardEntryModel.fromJson(json as Map<String, dynamic>)).toList();
      return right(entries);
    } catch (e) {
      if (e is DioException) return left(ServerFailure.fromDioException(e));
      return left(ServerFailure(e.toString()));
    }
  }
}
