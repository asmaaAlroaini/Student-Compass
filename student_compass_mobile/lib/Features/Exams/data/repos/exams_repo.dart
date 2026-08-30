import 'package:dartz/dartz.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/custom_exam_request_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_result_model.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';

abstract class ExamsRepo {
  /// جلب قائمة الامتحانات المنشورة
  Future<Either<Failure, List<ExamModel>>> fetchExams({int? subjectId, String? type});

  /// جلب تفاصيل الامتحان والأسئلة لبدء الاختبار
  Future<Either<Failure, ExamModel>> fetchExamDetails({required int examId});

  /// إنشاء وتوليد امتحان مخصص
  Future<Either<Failure, ExamModel>> generateCustomExam({
    required CustomExamRequestModel request,
  });

  /// تسليم إجابات الامتحان والحصول على النتيجة والتصحيح
  Future<Either<Failure, ExamResultModel>> submitExam({
    required int examId,
    required List<Map<String, dynamic>> answers,
    required int timeSpentSeconds,
  });
}
