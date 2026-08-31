import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/Features/Profile/data/repos/profile_repo.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_state.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

class ProfileCubit extends Cubit<ProfileState> {
  final ProfileRepo profileRepo;
  ProfileCubit(this.profileRepo) : super(ProfileInitial());

  void loadProfile() {
    final cachedUser = Prefs.getUser(AppConstants.kCurrentUser);
    if (cachedUser != null) {
      emit(ProfileSuccess(user: cachedUser));
    } else {
      fetchProfile();
    }
  }

  void updateUser(User user) {
    Prefs.setUser(AppConstants.kCurrentUser, user);
    emit(ProfileSuccess(user: user));
  }

  Future<void> fetchProfile() async {
    emit(ProfileLoading());
    var result = await profileRepo.fetchProfile();
    result.fold(
      (failure) => emit(
        ProfileFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (user) => emit(ProfileSuccess(user: user)),
    );
  }
}
