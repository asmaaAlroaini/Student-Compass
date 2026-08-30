import 'package:dartz/dartz.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_question_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/lesson_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/subject_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/unit_model.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';

abstract class SubjectsRepo {
  /// جلب المواد الدراسية حسب الصف والتخصص
  /// GET /api/v1/student/subjects
  Future<Either<Failure, List<SubjectModel>>> fetchSubjects();

  /// جلب وحدات مادة معينة
  /// GET /api/v1/student/subjects/{subjectId}/units
  Future<Either<Failure, List<UnitModel>>> fetchSubjectUnits({
    required int subjectId,
  });

  /// جلب دروس وحدة معينة
  /// GET /api/v1/student/subjects/{subjectId}/units/{unitId}/lessons
  Future<Either<Failure, List<LessonModel>>> fetchUnitLessons({
    required int subjectId,
    required int unitId,
  });

  /// جلب تفاصيل درس معين ورحلة التعلم الـ 5 مراحل
  /// GET /api/v1/student/lessons/{lessonId}
  Future<Either<Failure, LessonModel>> fetchLessonDetails({
    required int lessonId,
  });

  /// تحديث مرحلة رحلة التعلم للدرس
  /// POST /api/v1/student/lessons/{lessonId}/progress
  Future<Either<Failure, Map<String, dynamic>>> updateLessonProgress({
    required int lessonId,
    required int stage,
    bool? isCompleted,
  });

  /// جلب بنك أسئلة التثبيت للدرس
  /// GET /api/v1/student/lessons/{lessonId}/questions
  Future<Either<Failure, List<ExamQuestionModel>>> fetchLessonQuestions({
    required int lessonId,
  });
}
