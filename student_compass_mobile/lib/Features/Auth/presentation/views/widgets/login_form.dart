import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/login_cubit/login_cubit.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/login_cubit/login_state.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/widgets/has_an_account.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/widgets/remember_me_widget.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';
import 'package:student_compass_mobile/core/widgets/build_svg_icon.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';
import 'package:student_compass_mobile/core/widgets/custom_text_form_feild.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();

  AutovalidateMode autovalidateMode = AutovalidateMode.disabled;
  bool isRememberMe = false;

  @override
  void initState() {
    super.initState();
    _loadSavedCredentials();
  }

  void _loadSavedCredentials() {
    final savedUsername = Prefs.getString(AppConstants.kSavedEmail);
    final savedPassword = Prefs.getString(AppConstants.kSavedPassword);

    if (savedUsername != null && savedPassword != null) {
      emailController.text = savedUsername;
      passwordController.text = savedPassword;

      setState(() {
        isRememberMe = true;
      });
    }
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocListener(
      listeners: [
        BlocListener<LoginCubit, LoginState>(
          listener: (context, state) async {
            if (state is LoginSuccess) {
              if (isRememberMe) {
                Prefs.setString(AppConstants.kSavedEmail, emailController.text);

                Prefs.setString(
                  AppConstants.kSavedPassword,
                  passwordController.text,
                );
              } else {
                Prefs.removeString(AppConstants.kSavedEmail);
                Prefs.removeString(AppConstants.kSavedPassword);
              }

              customToastBar(
                context: context,
                message: S.of(context).LoginSuccess,
                backgroundColor: AppColors.customGreen(),
                icon: Icons.check,
                textColor: AppColors.white(),
              );

              Prefs.setBool(AppConstants.kIsLogedIn, true);
              Prefs.setUser(AppConstants.kCurrentUser, state.user);
              context.go(RouteNames.dashboard);
            } else if (state is LoginFailure) {
              customToastBar(
                context: context,
                message: Failure.localizedMessage(
                  context,
                  errorMessage: state.errorMessage,
                  errorKey: state.errorKey,
                ),
                backgroundColor: AppColors.red(),
                icon: Icons.close,
                textColor: AppColors.white(),
              );
            }
          },
        ),
      ],
      child: BlocBuilder<LoginCubit, LoginState>(
        builder: (context, state) {
          return AbsorbPointer(
            absorbing: state is LoginLoading,
            child: Form(
              key: formKey,
              autovalidateMode: autovalidateMode,
              child: Column(
                children: [
                  CustomTextFormFeild(
                    controller: emailController,
                    hintText: S.of(context).Email,
                    keyboardType: TextInputType.emailAddress,
                    prefixIcon: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: Icon(
                        Icons.email_outlined,
                        color: AppColors.textSecondaryColor(context),
                        size: 26,
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  CustomTextFormFeild(
                    controller: passwordController,
                    isPassword: true,
                    hintText: S.of(context).Password,
                    keyboardType: TextInputType.visiblePassword,
                    prefixIcon: buildSvgIcon(context, Assets.assetsIconsLock),
                  ),

                  const SizedBox(height: 12),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      RememberMeWidget(
                        value: isRememberMe,
                        onChanged: (value) {
                          setState(() {
                            isRememberMe = value ?? false;
                          });
                        },
                      ),
                      // Forgot Password link
                      TextButton(
                        onPressed: () => context.push(RouteNames.forgotPassword),
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.zero,
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: Text(
                          'نسيت كلمة المرور؟',
                          style: TextStyle(
                            color: AppColors.primaryColor(context),
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  HasAnAccount(
                    isLoginView: true,
                    primaryText: S.of(context).DontHaveAccount,
                    secondaryText: S.of(context).SignUp,
                  ),

                  const SizedBox(height: 17),

                  state is LoginLoading
                      ? const CustomLoadingIndicator()
                      : CustomButton(
                          title: S.of(context).Login,
                          onPressed: () {
                            loginMethod(
                              email: emailController.text,
                              password: passwordController.text,
                            );
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

  void loginMethod({required String email, required String password}) {
    FocusScope.of(context).unfocus();

    if (formKey.currentState!.validate()) {
      formKey.currentState!.save();

      setState(() {
        autovalidateMode = AutovalidateMode.disabled;
      });

      BlocProvider.of<LoginCubit>(
        context,
      ).login(email: email, password: password);
    } else {
      setState(() {
        autovalidateMode = AutovalidateMode.always;
      });
    }
  }
}
