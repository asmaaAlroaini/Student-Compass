import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/login_cubit/login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  final AuthRepo authRepo;
  LoginCubit(this.authRepo) : super(LoginInitial());

  Future<void> login({required String email, required String password}) async {
    emit(LoginLoading());
    var result = await authRepo.login(email: email, password: password);
    result.fold(
      (failure) => emit(
        LoginFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (user) => emit(LoginSuccess(user: user)),
    );
  }
}
