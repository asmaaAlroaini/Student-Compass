import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/educational_options_model.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

class AuthRepoImpl implements AuthRepo {
  final ApiService apiService;
  AuthRepoImpl(this.apiService);

  @override
  Future<Either<Failure, User>> login({
    required String email,
    required String password,
  }) async {
    try {
      var data = await apiService.post(
        endPoint: AppConstants.kLogin,
        body: {'email': email, 'password': password},
        token: null,
      );

      final loginData = data['data'] as Map<String, dynamic>;
      final accessToken =
          loginData['access_token'] as String? ??
          loginData['token'] as String? ??
          '';

      final userMap = loginData['user'] is Map<String, dynamic>
          ? Map<String, dynamic>.from(loginData['user'] as Map<String, dynamic>)
          : Map<String, dynamic>.from(loginData);

      if (accessToken.isNotEmpty) {
        userMap['token'] = accessToken;
        Prefs.setString(AppConstants.kToken, accessToken);
      }

      User user = User.fromJson(userMap);

      return right(user);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    String? gradeLevel,
    String? track,
    String? phone,
  }) async {
    try {
      await apiService.post(
        endPoint: AppConstants.kRegister,
        body: {
          'name': name,
          'email': email,
          'password': password,
          'password_confirmation': passwordConfirmation,
          if (gradeLevel != null && gradeLevel.isNotEmpty)
            'grade_level': gradeLevel,
          if (track != null && track.isNotEmpty) 'track': track,
          if (phone != null && phone.isNotEmpty) 'phone': phone,
        },
        token: null,
      );
      return right('تم إنشاء الحساب بنجاح');
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, EducationalOptionsModel>> getEducationalOptions() async {
    try {
      final data = await apiService.get(
        endPoint: AppConstants.kEducationalOptions,
        body: null,
        token: null,
      );
      final model = EducationalOptionsModel.fromJson(data as Map<String, dynamic>);
      return right(model);
    } catch (e) {
      return right(EducationalOptionsModel.defaultOptions());
    }
  }

  @override
  Future<Either<Failure, String>> resetPasswordRequest({
    required String email,
  }) async {
    try {
      final data = await apiService.post(
        endPoint: AppConstants.kResetPasswordRequest,
        body: {'email': email},
        token: null,
      );
      return right(data['message'] as String? ?? 'تم إرسال رمز التحقق بنجاح');
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> verifyResetCode({
    required String email,
    required String code,
  }) async {
    try {
      final data = await apiService.post(
        endPoint: AppConstants.kVerifyResetPasswordCode,
        body: {'email': email, 'code': code},
        token: null,
      );
      return right(data['message'] as String? ?? 'رمز التحقق صحيح');
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> resetPassword({
    required String email,
    required String code,
    required String password,
    required String passwordConfirmation,
  }) async {
    try {
      final data = await apiService.post(
        endPoint: AppConstants.kResetPassword,
        body: {
          'email': email,
          'code': code,
          'password': password,
          'password_confirmation': passwordConfirmation,
        },
        token: null,
      );
      return right(data['message'] as String? ?? 'تم إعادة تعيين كلمة المرور بنجاح');
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> logOut() async {
    try {
      await apiService.post(
        endPoint: AppConstants.kLogout,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );
      return right('Logged Out Successfully');
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }
}
