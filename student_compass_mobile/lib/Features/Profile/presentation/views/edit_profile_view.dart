import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/update_profile_cubit/update_profile_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/update_profile_cubit/update_profile_state.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/views/widgets/edit_profile_form.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class EditProfileView extends StatelessWidget {
  final User user;

  const EditProfileView({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(
        title: S.of(context).EditProfile,
      ),
      body: BlocListener<UpdateProfileCubit, UpdateProfileState>(
        listener: (context, state) {
          if (state is UpdateProfileSuccess) {
            CustomToastBar.showSuccessToast(
              context: context,
              title: S.of(context).ProfileUpdatedSuccessfully,
            );
            context.read<ProfileCubit>().loadProfile();
            Navigator.of(context).pop();
          } else if (state is UpdateProfileFailure) {
            CustomToastBar.showErrorToast(
              context: context,
              title: Failure.localizedMessage(
                context,
                errorMessage: state.errorMessage,
                errorKey: state.errorKey,
              ),
            );
          }
        },
        child: EditProfileForm(user: user),
      ),
    );
  }
}
