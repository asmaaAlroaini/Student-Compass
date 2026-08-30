import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/reset_password_cubit/reset_password_state.dart';

class ResetPasswordCubit extends Cubit<ResetPasswordState> {
  final AuthRepo authRepo;

  ResetPasswordCubit(this.authRepo) : super(ResetPasswordInitial());

  Future<void> sendResetRequest({required String email}) async {
    emit(ResetPasswordLoading());
    final result = await authRepo.resetPasswordRequest(email: email);

    result.fold(
      (failure) => emit(
        ResetPasswordFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (message) => emit(ResetPasswordRequestSuccess(message: message)),
    );
  }

  Future<void> verifyCode({required String email, required String code}) async {
    emit(ResetPasswordLoading());
    final result = await authRepo.verifyResetCode(email: email, code: code);

    result.fold(
      (failure) => emit(
        ResetPasswordFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (message) => emit(VerifyCodeSuccess(message: message)),
    );
  }

  Future<void> resetPassword({
    required String email,
    required String code,
    required String password,
    required String passwordConfirmation,
  }) async {
    emit(ResetPasswordLoading());
    final result = await authRepo.resetPassword(
      email: email,
      code: code,
      password: password,
      passwordConfirmation: passwordConfirmation,
    );

    result.fold(
      (failure) => emit(
        ResetPasswordFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (message) => emit(ResetPasswordSuccess(message: message)),
    );
  }
}
