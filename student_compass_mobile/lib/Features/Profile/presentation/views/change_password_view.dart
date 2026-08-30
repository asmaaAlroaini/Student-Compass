import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/change_password_cubit/change_password_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/change_password_cubit/change_password_state.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/views/widgets/change_password_form.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class ChangePasswordView extends StatelessWidget {
  const ChangePasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(
        title: S.of(context).ChangePassword,
      ),
      body: BlocListener<ChangePasswordCubit, ChangePasswordState>(
        listener: (context, state) {
          if (state is ChangePasswordSuccess) {
            CustomToastBar.showSuccessToast(
              context: context,
              title: S.of(context).PasswordChangedSuccessfully,
            );
            Navigator.of(context).pop();
          } else if (state is ChangePasswordFailure) {
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
        child: const ChangePasswordForm(),
      ),
    );
  }
}
