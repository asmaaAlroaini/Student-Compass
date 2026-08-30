import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/reset_password_cubit/reset_password_cubit.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/reset_password_cubit/reset_password_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';
import 'package:student_compass_mobile/core/widgets/custom_text_form_feild.dart';

class ResetPasswordView extends StatefulWidget {
  final String email;
  final String code;

  const ResetPasswordView({super.key, required this.email, required this.code});

  @override
  State<ResetPasswordView> createState() => _ResetPasswordViewState();
}

class _ResetPasswordViewState extends State<ResetPasswordView> {
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: const CustomAppBar(title: 'تعيين كلمة مرور جديدة'),
      body: BlocConsumer<ResetPasswordCubit, ResetPasswordState>(
        listener: (context, state) {
          if (state is ResetPasswordSuccess) {
            customToastBar(
              context: context,
              message: state.message,
              backgroundColor: AppColors.customGreen(),
              icon: Icons.check_circle_rounded,
              textColor: AppColors.white(),
            );
            context.go(RouteNames.login);
          } else if (state is ResetPasswordFailure) {
            customToastBar(
              context: context,
              message: state.errorMessage,
              backgroundColor: AppColors.red(),
              icon: Icons.error_outline,
              textColor: AppColors.white(),
            );
          }
        },
        builder: (context, state) {
          final isLoading = state is ResetPasswordLoading;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.s20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 20),
                  // Icon
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.customGreen().withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.shield_outlined,
                      size: 56,
                      color: AppColors.customGreen(),
                    ),
                  ),
                  const SizedBox(height: 24),

                  Text(
                    'تعيين كلمة مرور جديدة',
                    style: TextStyles.bold20.copyWith(
                      color: AppColors.textBoldColor(context),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'اختر كلمة مرور قوية تتكون من 8 أحرف أو أكثر لحماية حسابك.',
                    textAlign: TextAlign.center,
                    style: TextStyles.regular14.copyWith(
                      color: AppColors.textSecondaryColor(context),
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 32),

                  CustomTextFormFeild(
                    controller: _passwordController,
                    keyboardType: TextInputType.visiblePassword,
                    hintText: 'كلمة المرور الجديدة',
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'يرجى إدخال كلمة المرور الجديدة';
                      }
                      if (val.length < 8) {
                        return 'يجب أن لا تقل كلمة المرور عن 8 أحرف';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  CustomTextFormFeild(
                    controller: _confirmPasswordController,
                    keyboardType: TextInputType.visiblePassword,
                    hintText: 'تأكيد كلمة المرور الجديدة',
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'يرجى تأكيد كلمة المرور';
                      }
                      if (val != _passwordController.text) {
                        return 'تأكيد كلمة المرور غير متطابق';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 28),

                  if (isLoading)
                    const Center(child: CustomLoadingIndicator())
                  else
                    CustomButton(
                      title: 'حفظ وتأكيد كلمة المرور ✔️',
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          context.read<ResetPasswordCubit>().resetPassword(
                            email: widget.email,
                            code: widget.code,
                            password: _passwordController.text,
                            passwordConfirmation:
                                _confirmPasswordController.text,
                          );
                        }
                      },
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
