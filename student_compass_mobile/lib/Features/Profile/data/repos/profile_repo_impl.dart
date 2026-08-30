import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/Features/Profile/data/models/change_password_request_model.dart';
import 'package:student_compass_mobile/Features/Profile/data/models/update_profile_request_model.dart';
import 'package:student_compass_mobile/Features/Profile/data/repos/profile_repo.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

class ProfileRepoImpl implements ProfileRepo {
  final ApiService apiService;
  ProfileRepoImpl(this.apiService);

  @override
  Future<Either<Failure, User>> fetchProfile() async {
    try {
      var data = await apiService.get(
        endPoint: AppConstants.kProfile,
        body: null,
        token: Prefs.getString(AppConstants.kToken),
      );

      final userJson = data['data'] ?? data;
      final user = User.fromJson(userJson as Map<String, dynamic>);

      // Cache updated user locally
      Prefs.setUser(AppConstants.kCurrentUser, user);

      return right(user);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, User>> updateProfile({
    required UpdateProfileRequestModel request,
  }) async {
    try {
      var data = await apiService.put(
        endPoint: AppConstants.kUpdateProfile,
        body: request.toJson(),
        token: Prefs.getString(AppConstants.kToken),
      );

      final userJson = data['data'] ?? data;
      final user = User.fromJson(userJson as Map<String, dynamic>);

      // Update cached user locally
      Prefs.setUser(AppConstants.kCurrentUser, user);

      return right(user);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> changePassword({
    required ChangePasswordRequestModel request,
  }) async {
    try {
      await apiService.put(
        endPoint: AppConstants.kChangePassword,
        body: request.toJson(),
        token: Prefs.getString(AppConstants.kToken),
      );

      return right(null);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      }
      return left(ServerFailure(e.toString()));
    }
  }
}
