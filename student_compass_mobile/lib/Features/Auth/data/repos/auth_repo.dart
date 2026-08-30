import 'package:dartz/dartz.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/educational_options_model.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';

abstract class AuthRepo {
  /// تسجيل الدخول: email + password
  Future<Either<Failure, User>> login({
    required String email,
    required String password,
  });

  /// إنشاء الحساب: name + email + password + password_confirmation
  /// اختياري: grade_level, track, phone
  Future<Either<Failure, String>> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    String? gradeLevel,
    String? track,
    String? phone,
  });

  /// جلب الصفوف الدراسية والمسارات من الباك إند
  Future<Either<Failure, EducationalOptionsModel>> getEducationalOptions();

  /// طلب رمز استعادة كلمة المرور
  Future<Either<Failure, String>> resetPasswordRequest({
    required String email,
  });

  /// التحقق من رمز الاستعادة السداسي
  Future<Either<Failure, String>> verifyResetCode({
    required String email,
    required String code,
  });

  /// تعيين كلمة المرور الجديدة
  Future<Either<Failure, String>> resetPassword({
    required String email,
    required String code,
    required String password,
    required String passwordConfirmation,
  });

  Future<Either<Failure, String>> logOut();
}
