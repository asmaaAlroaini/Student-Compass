import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/logout_cubit/logout_state.dart';

class LogoutCubit extends Cubit<LogoutState> {
  final AuthRepo authRepo;
  LogoutCubit(this.authRepo) : super(LogoutInitial());

  Future<void> logout() async {
    emit(LogoutLoading());
    var result = await authRepo.logOut();
    result.fold(
      (failure) => emit(
        LogoutFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (message) => emit(LogoutSuccess(message: message)),
    );
  }
}
