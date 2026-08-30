import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/widgets/sign_up_view_body.dart';
import 'package:student_compass_mobile/core/widgets/gradient_background.dart';

class SignUpView extends StatelessWidget {
  const SignUpView({super.key});
  static const String routeName = '/sign-up';
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(hasImage: true, child: SignUpViewBody()),
    );
  }
}
