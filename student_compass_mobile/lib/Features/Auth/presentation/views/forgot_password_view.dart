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

class ForgotPasswordView extends StatefulWidget {
  const ForgotPasswordView({super.key});

  @override
  State<ForgotPasswordView> createState() => _ForgotPasswordViewState();
}

class _ForgotPasswordViewState extends State<ForgotPasswordView> {
  final TextEditingController _emailController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: const CustomAppBar(title: 'استعادة كلمة المرور'),
      body: BlocConsumer<ResetPasswordCubit, ResetPasswordState>(
        listener: (context, state) {
          if (state is ResetPasswordRequestSuccess) {
            customToastBar(
              context: context,
              message: state.message,
              backgroundColor: AppColors.customGreen(),
              icon: Icons.mark_email_read_rounded,
              textColor: AppColors.white(),
            );
            context.push(
              RouteNames.verifyCode,
              extra: _emailController.text.trim(),
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
                      color: AppColors.primaryColor(context).withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.lock_reset_rounded,
                      size: 56,
                      color: AppColors.primaryColor(context),
                    ),
                  ),
                  const SizedBox(height: 24),

                  Text(
                    'نسيت كلمة المرور؟',
                    style: TextStyles.bold20.copyWith(
                      color: AppColors.textBoldColor(context),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'أدخل بريدك الإلكتروني المسجل لدينا وسنقوم بإرسال رمز تحقق سداسي لاستعادة كلمة المرور.',
                    textAlign: TextAlign.center,
                    style: TextStyles.regular14.copyWith(
                      color: AppColors.textSecondaryColor(context),
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 32),

                  CustomTextFormFeild(
                    controller: _emailController,
                    hintText: 'البريد الإلكتروني',
                    keyboardType: TextInputType.emailAddress,
                    prefixIcon: Icon(
                      Icons.email_outlined,
                      color: AppColors.primaryColor(context),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'يرجى إدخال البريد الإلكتروني';
                      }
                      if (!val.contains('@')) {
                        return 'صيغة البريد الإلكتروني غير صحيحة';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 28),

                  if (isLoading)
                    const Center(child: CustomLoadingIndicator())
                  else
                    CustomButton(
                      title: 'إرسال رمز التحقق ✉️',
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          context.read<ResetPasswordCubit>().sendResetRequest(
                                email: _emailController.text.trim(),
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
