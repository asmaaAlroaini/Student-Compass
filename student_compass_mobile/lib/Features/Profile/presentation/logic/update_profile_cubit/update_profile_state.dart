import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';

abstract class UpdateProfileState {}

class UpdateProfileInitial extends UpdateProfileState {}

class UpdateProfileLoading extends UpdateProfileState {}

class UpdateProfileSuccess extends UpdateProfileState {
  final User user;
  UpdateProfileSuccess({required this.user});
}

class UpdateProfileFailure extends UpdateProfileState {
  final String errorMessage;
  final String? errorKey;
  UpdateProfileFailure({required this.errorMessage, this.errorKey});
}
