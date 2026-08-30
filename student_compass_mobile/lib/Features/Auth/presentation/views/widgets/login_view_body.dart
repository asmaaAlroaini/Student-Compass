import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/widgets/login_form.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/logo_widget.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class LoginViewBody extends StatelessWidget {
  const LoginViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              LogoWidget(),
              const SizedBox(height: 16),
              Text(
                S.of(context).WelcomeBack,
                style: TextStyles.bold24.copyWith(
                  color: AppColors.textBoldColor(context),
                ),
              ),
              const SizedBox(height: 32),
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppColors.itemsColor(context),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: AppColors.borderColor(context),
                    width: 1.2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.shadowColor(context),
                      blurRadius: 30,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 28,
                  ),
                  child: Column(
                    children: [
                      Text(
                        S.of(context).Login,
                        style: TextStyles.bold30.copyWith(
                          color: AppColors.primaryColor(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        S.of(context).LoginToManageProducts,
                        textAlign: TextAlign.center,
                        style: TextStyles.semiBold12.copyWith(
                          color: AppColors.textSecondaryColor(context),
                        ),
                      ),
                      const SizedBox(height: 24),
                      LoginForm(),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
