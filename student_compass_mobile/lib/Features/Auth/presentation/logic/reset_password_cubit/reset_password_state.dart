abstract class ResetPasswordState {}

class ResetPasswordInitial extends ResetPasswordState {}

class ResetPasswordLoading extends ResetPasswordState {}

class ResetPasswordRequestSuccess extends ResetPasswordState {
  final String message;
  ResetPasswordRequestSuccess({required this.message});
}

class VerifyCodeSuccess extends ResetPasswordState {
  final String message;
  VerifyCodeSuccess({required this.message});
}

class ResetPasswordSuccess extends ResetPasswordState {
  final String message;
  ResetPasswordSuccess({required this.message});
}

class ResetPasswordFailure extends ResetPasswordState {
  final String errorMessage;
  final String? errorKey;
  ResetPasswordFailure({required this.errorMessage, this.errorKey});
}
