import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';

abstract class ProfileState {}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileSuccess extends ProfileState {
  final User user;
  ProfileSuccess({required this.user});
}

class ProfileFailure extends ProfileState {
  final String errorMessage;
  final String? errorKey;
  ProfileFailure({required this.errorMessage, this.errorKey});
}
