import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_question_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/lesson_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/subject_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/unit_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/repos/subjects_repo.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

class SubjectsRepoImpl implements SubjectsRepo {
  final ApiService apiService;
  SubjectsRepoImpl(this.apiService);

  @override
  Future<Either<Failure, List<SubjectModel>>> fetchSubjects() async {
    try {
      var data = await apiService.get(
        endPoint: AppConstants.kStudentSubjects,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final List<dynamic> subjectsList = data['data'] ?? [];
      final subjects = subjectsList
          .map((json) => SubjectModel.fromJson(json as Map<String, dynamic>))
          .toList();

      return right(subjects);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<UnitModel>>> fetchSubjectUnits({
    required int subjectId,
  }) async {
    try {
      var data = await apiService.get(
        endPoint: '${AppConstants.kStudentSubjects}/$subjectId/units',
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final List<dynamic> unitsList = data['data'] ?? [];
      final units = unitsList
          .map((json) => UnitModel.fromJson(json as Map<String, dynamic>))
          .toList();

      return right(units);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<LessonModel>>> fetchUnitLessons({
    required int subjectId,
    required int unitId,
  }) async {
    try {
      var data = await apiService.get(
        endPoint:
            '${AppConstants.kStudentSubjects}/$subjectId/units/$unitId/lessons',
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final List<dynamic> lessonsList = data['data'] ?? [];
      final lessons = lessonsList
          .map((json) => LessonModel.fromJson(json as Map<String, dynamic>))
          .toList();

      return right(lessons);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, LessonModel>> fetchLessonDetails({
    required int lessonId,
  }) async {
    try {
      var data = await apiService.get(
        endPoint: '${AppConstants.kStudentLessons}/$lessonId',
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final rawData = data['data'] ?? data;
      final lessonJson = (rawData is Map && rawData.containsKey('lesson'))
          ? rawData['lesson']
          : rawData;
      final lesson =
          LessonModel.fromJson(lessonJson as Map<String, dynamic>);

      return right(lesson);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> updateLessonProgress({
    required int lessonId,
    required int stage,
    bool? isCompleted,
  }) async {
    try {
      var data = await apiService.post(
        endPoint: '${AppConstants.kStudentLessons}/$lessonId/progress',
        body: {
          'stage': stage,
          if (isCompleted != null) 'is_completed': isCompleted,
        },
        token: Prefs.getString(AppConstants.kToken),
      );

      return right(data['data'] as Map<String, dynamic>);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<ExamQuestionModel>>> fetchLessonQuestions({
    required int lessonId,
  }) async {
    try {
      var data = await apiService.get(
        endPoint: '${AppConstants.kStudentLessons}/$lessonId/questions',
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final dynamic rawData = data['data'];
      final List<dynamic> questionsList = rawData is Map
          ? (rawData['data'] is List ? rawData['data'] : [])
          : (rawData is List ? rawData : []);

      final questions = questionsList
          .map((json) => ExamQuestionModel.fromJson(json as Map<String, dynamic>))
          .toList();

      return right(questions);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }
}
