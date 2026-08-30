import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';
import 'package:student_compass_mobile/core/widgets/custom_text_form_feild.dart';
import 'package:student_compass_mobile/core/widgets/gradient_background.dart';
import 'package:student_compass_mobile/core/widgets/logo_widget.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class InitView extends StatefulWidget {
  const InitView({super.key});

  @override
  State<InitView> createState() => _InitViewState();
}

class _InitViewState extends State<InitView> {
  final TextEditingController ipController = TextEditingController();
  GlobalKey<FormState> formKey = GlobalKey<FormState>();
  AutovalidateMode autovalidateMode = AutovalidateMode.disabled;
  @override
  dispose() {
    ipController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    void navigateToOnBoarding() async {
      if (!mounted) {
        return;
      }
      if (Prefs.getBool(AppConstants.kSeenOnBoarding) == true) {
        if (Prefs.getBool(AppConstants.kIsLogedIn) == true) {
          context.go(RouteNames.dashboard);
        } else {
          context.go(RouteNames.login);
        }
      } else {
        context.go(RouteNames.onBoarding1);
      }
    }

    return Scaffold(
      body: GradientBackground(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Center(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  LogoWidget(),
                  const SizedBox(height: AppSpacing.s24),
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: AppColors.itemsColor(context),
                      borderRadius: BorderRadius.circular(AppSpacing.radius16),
                      border: Border.all(color: AppColors.borderColor(context)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Form(
                        key: formKey,
                        autovalidateMode: autovalidateMode,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.start,
                          spacing: AppSpacing.s20,
                          children: [
                            Text(
                              textAlign: TextAlign.center,
                              // S.of(context).WelcomeMessage,
                              "أهلاً بك في بوصلة الطالب",
                              style: TextStyles.bold24.copyWith(
                                color: AppColors.primaryColor(context),
                              ),
                            ),
                            CustomTextFormFeild(
                              hintText: S.of(context).IpAddress,
                              keyboardType: TextInputType.text,
                              controller: ipController,
                              prefixIcon: Icon(
                                Icons.wifi_outlined,
                                color: AppColors.textPrimaryColor(context),
                              ),
                            ),

                            Column(
                              spacing: AppSpacing.s10,
                              children: [
                                CustomButton(
                                  title: S.of(context).SaveButton,
                                  onPressed: () {
                                    if (formKey.currentState!.validate()) {
                                      formKey.currentState!.save();
                                      setState(() {
                                        autovalidateMode =
                                            AutovalidateMode.disabled;
                                      });
                                      Prefs.setString(
                                        AppConstants.kApiBaseUrl,
                                        ipController.text.trim(),
                                      );
                                      navigateToOnBoarding();
                                    } else {
                                      setState(() {
                                        autovalidateMode =
                                            AutovalidateMode.always;
                                      });
                                    }
                                  },
                                ),
                                Center(
                                  child: TextButton(
                                    onPressed: () {
                                      final savedUrl = Prefs.getString(
                                        AppConstants.kApiBaseUrl,
                                      );
                                      if (savedUrl == null ||
                                          savedUrl.trim().isEmpty) {
                                        CustomToastBar.showErrorToast(
                                          context: context,
                                          title: S.of(context).BaseUrlNotSaved,
                                        );
                                        return;
                                      }
                                      navigateToOnBoarding();
                                    },
                                    child: Text(
                                      S.of(context).Skip,
                                      style: TextStyle(
                                        color: AppColors.textPrimaryColor(
                                          context,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
