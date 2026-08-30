import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Profile/data/models/update_profile_request_model.dart';
import 'package:student_compass_mobile/Features/Profile/data/repos/profile_repo.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/update_profile_cubit/update_profile_state.dart';

class UpdateProfileCubit extends Cubit<UpdateProfileState> {
  final ProfileRepo profileRepo;
  UpdateProfileCubit(this.profileRepo) : super(UpdateProfileInitial());

  Future<void> updateProfile({
    required UpdateProfileRequestModel request,
  }) async {
    emit(UpdateProfileLoading());
    var result = await profileRepo.updateProfile(request: request);
    result.fold(
      (failure) => emit(
        UpdateProfileFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (user) => emit(UpdateProfileSuccess(user: user)),
    );
  }
}
