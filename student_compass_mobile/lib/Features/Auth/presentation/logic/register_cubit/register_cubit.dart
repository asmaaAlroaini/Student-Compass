import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/register_cubit/register_state.dart';

class RegisterCubit extends Cubit<RegisterState> {
  final AuthRepo authRepo;
  RegisterCubit(this.authRepo) : super(RegisterInitial());

  Future<void> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    String? gradeLevel,
    String? track,
    String? phone,
  }) async {
    emit(RegisterLoading());
    var result = await authRepo.register(
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      gradeLevel: gradeLevel,
      track: track,
      phone: phone,
    );
    result.fold(
      (failure) => emit(
        RegisterFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (message) => emit(RegisterSuccess(message: message)),
    );
  }
}
