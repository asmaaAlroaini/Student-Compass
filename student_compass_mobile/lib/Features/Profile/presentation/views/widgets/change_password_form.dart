import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Profile/data/models/change_password_request_model.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/change_password_cubit/change_password_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/change_password_cubit/change_password_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';
import 'package:student_compass_mobile/core/widgets/custom_text_form_feild.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class ChangePasswordForm extends StatefulWidget {
  const ChangePasswordForm({super.key});

  @override
  State<ChangePasswordForm> createState() => _ChangePasswordFormState();
}

class _ChangePasswordFormState extends State<ChangePasswordForm> {
  final _formKey = GlobalKey<FormState>();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  AutovalidateMode _autovalidateMode = AutovalidateMode.disabled;

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _submitForm() {
    FocusScope.of(context).unfocus();

    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() {
        _autovalidateMode = AutovalidateMode.disabled;
      });

      final request = ChangePasswordRequestModel(
        currentPassword: _currentPasswordController.text,
        newPassword: _newPasswordController.text,
        newPasswordConfirmation: _confirmPasswordController.text,
      );

      context.read<ChangePasswordCubit>().changePassword(request: request);
    } else {
      setState(() {
        _autovalidateMode = AutovalidateMode.always;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ChangePasswordCubit, ChangePasswordState>(
      builder: (context, state) {
        final isLoading = state is ChangePasswordLoading;

        return AbsorbPointer(
          absorbing: isLoading,
          child: Form(
            key: _formKey,
            autovalidateMode: _autovalidateMode,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.s16),
              child: Column(
                children: [
                  // Current Password
                  CustomTextFormFeild(
                    controller: _currentPasswordController,
                    hintText: S.of(context).CurrentPassword,
                    keyboardType: TextInputType.visiblePassword,
                    isPassword: true,
                    prefixIcon: const Icon(Icons.lock_outline_rounded),
                  ),
                  const SizedBox(height: AppSpacing.s16),

                  // New Password
                  CustomTextFormFeild(
                    controller: _newPasswordController,
                    hintText: S.of(context).NewPassword,
                    keyboardType: TextInputType.visiblePassword,
                    isPassword: true,
                    prefixIcon: const Icon(Icons.lock_outline_rounded),
                  ),
                  const SizedBox(height: AppSpacing.s16),

                  // Confirm Password
                  CustomTextFormFeild(
                    controller: _confirmPasswordController,
                    hintText: S.of(context).ConfirmNewPassword,
                    keyboardType: TextInputType.visiblePassword,
                    isPassword: true,
                    type: 'confirm',
                    passwordController: _newPasswordController,
                    prefixIcon: const Icon(Icons.lock_outline_rounded),
                  ),
                  const SizedBox(height: AppSpacing.s28),

                  // Save Button / Loading Indicator
                  isLoading
                      ? const CustomLoadingIndicator()
                      : CustomButton(
                          title: S.of(context).Save,
                          onPressed: _submitForm,
                        ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
