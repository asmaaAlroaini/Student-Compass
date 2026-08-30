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

class VerifyCodeView extends StatefulWidget {
  final String email;

  const VerifyCodeView({super.key, required this.email});

  @override
  State<VerifyCodeView> createState() => _VerifyCodeViewState();
}

class _VerifyCodeViewState extends State<VerifyCodeView> {
  final TextEditingController _codeController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: const CustomAppBar(title: 'تأكيد رمز التحقق'),
      body: BlocConsumer<ResetPasswordCubit, ResetPasswordState>(
        listener: (context, state) {
          if (state is VerifyCodeSuccess) {
            customToastBar(
              context: context,
              message: state.message,
              backgroundColor: AppColors.customGreen(),
              icon: Icons.check_circle_rounded,
              textColor: AppColors.white(),
            );
            context.push(
              RouteNames.resetPassword,
              extra: {
                'email': widget.email,
                'code': _codeController.text.trim(),
              },
            );
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
                      color: AppColors.primaryColor(
                        context,
                      ).withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.mark_email_read_rounded,
                      size: 56,
                      color: AppColors.primaryColor(context),
                    ),
                  ),
                  const SizedBox(height: 24),

                  Text(
                    'أدخل رمز التحقق (OTP)',
                    style: TextStyles.bold20.copyWith(
                      color: AppColors.textBoldColor(context),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'تم إرسال رمز مكون من 6 أرقام إلى البريد:\n${widget.email}',
                    textAlign: TextAlign.center,
                    style: TextStyles.regular14.copyWith(
                      color: AppColors.textSecondaryColor(context),
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 32),

                  CustomTextFormFeild(
                    controller: _codeController,
                    hintText: 'رمز التحقق (6 أرقام)',
                    keyboardType: TextInputType.number,
                    prefixIcon: Icon(
                      Icons.pin_outlined,
                      color: AppColors.primaryColor(context),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'يرجى إدخال رمز التحقق';
                      }
                      if (val.trim().length != 6) {
                        return 'يجب أن يتكون الرمز من 6 أرقام';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 28),

                  if (isLoading)
                    const Center(child: CustomLoadingIndicator())
                  else
                    CustomButton(
                      title: 'التحقق والمتابعة ➡️',
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          context.read<ResetPasswordCubit>().verifyCode(
                            email: widget.email,
                            code: _codeController.text.trim(),
                          );
                        }
                      },
                    ),
                  const SizedBox(height: 16),

                  TextButton(
                    onPressed: () {
                      context.read<ResetPasswordCubit>().sendResetRequest(
                        email: widget.email,
                      );
                    },
                    child: Text(
                      'لم يصلك الرمز؟ إعادة الإرسال',
                      style: TextStyles.semiBold14.copyWith(
                        color: AppColors.primaryColor(context),
                      ),
                    ),
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
