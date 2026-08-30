import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Profile/data/models/change_password_request_model.dart';
import 'package:student_compass_mobile/Features/Profile/data/repos/profile_repo.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/change_password_cubit/change_password_state.dart';

class ChangePasswordCubit extends Cubit<ChangePasswordState> {
  final ProfileRepo profileRepo;
  ChangePasswordCubit(this.profileRepo) : super(ChangePasswordInitial());

  Future<void> changePassword({
    required ChangePasswordRequestModel request,
  }) async {
    emit(ChangePasswordLoading());
    var result = await profileRepo.changePassword(request: request);
    result.fold(
      (failure) => emit(
        ChangePasswordFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (_) => emit(ChangePasswordSuccess()),
    );
  }
}
