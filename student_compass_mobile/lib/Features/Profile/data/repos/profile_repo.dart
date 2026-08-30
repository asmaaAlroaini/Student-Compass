import 'package:dartz/dartz.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/Features/Profile/data/models/change_password_request_model.dart';
import 'package:student_compass_mobile/Features/Profile/data/models/update_profile_request_model.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';

abstract class ProfileRepo {
  /// GET /api/v1/auth/profile
  Future<Either<Failure, User>> fetchProfile();

  /// POST /api/v1/auth/profile
  Future<Either<Failure, User>> updateProfile({
    required UpdateProfileRequestModel request,
  });

  /// POST /api/v1/auth/change-password
  Future<Either<Failure, void>> changePassword({
    required ChangePasswordRequestModel request,
  });
}
