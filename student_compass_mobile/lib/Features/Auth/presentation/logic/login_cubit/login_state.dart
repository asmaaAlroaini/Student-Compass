import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';

abstract class LoginState {}

final class LoginInitial extends LoginState {}

final class LoginLoading extends LoginState {}

final class LoginFailure extends LoginState {
  final String errorMessage;
  final String? errorKey;

  LoginFailure({required this.errorMessage, this.errorKey});
}

final class LoginSuccess extends LoginState {
  final User user;

  LoginSuccess({required this.user});
}
