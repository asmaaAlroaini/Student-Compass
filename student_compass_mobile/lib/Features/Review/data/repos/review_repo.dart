import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_question_model.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

abstract class ReviewRepo {
  /// جلب الأسئلة التي أجاب عليها الطالب خطأً في الاختبارات
  Future<Either<Failure, List<ExamQuestionModel>>> fetchIncorrectQuestions();

  /// جلب الأسئلة المحفوظة
  Future<Either<Failure, List<ExamQuestionModel>>> fetchBookmarks();

  /// حفظ أو إلغاء حفظ سؤال
  Future<Either<Failure, bool>> toggleBookmark({required int questionId});
}

class ReviewRepoImpl implements ReviewRepo {
  final ApiService apiService;

  ReviewRepoImpl(this.apiService);

  @override
  Future<Either<Failure, List<ExamQuestionModel>>> fetchIncorrectQuestions() async {
    try {
      final data = await apiService.get(
        endPoint: AppConstants.kStudentIncorrectQuestions,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final List<dynamic> list = data['data']['questions'] ?? (data['data'] is List ? data['data'] : []);
      final questions = list
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

  @override
  Future<Either<Failure, List<ExamQuestionModel>>> fetchBookmarks() async {
    try {
      final data = await apiService.get(
        endPoint: AppConstants.kStudentBookmarks,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final dynamic rawData = data['data'];
      final List<dynamic> list = rawData is Map
          ? (rawData['data'] is List ? rawData['data'] : [])
          : (rawData is List ? rawData : []);

      final questions = list
          .map((json) {
            // دعم استجابة البوك مارك كـ question object
            final qJson = (json is Map && json.containsKey('question') && json['question'] is Map)
                ? json['question'] as Map<String, dynamic>
                : json as Map<String, dynamic>;
            return ExamQuestionModel.fromJson(qJson);
          })
          .toList();

      return right(questions);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> toggleBookmark({required int questionId}) async {
    try {
      final data = await apiService.post(
        endPoint: AppConstants.kStudentToggleBookmark,
        body: {'question_id': questionId},
        token: Prefs.getString(AppConstants.kToken),
      );

      final isBookmarked = data['is_bookmarked'] == true;
      return right(isBookmarked);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }
}
