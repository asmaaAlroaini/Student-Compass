import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/widgets/login_view_body.dart';
import 'package:student_compass_mobile/core/widgets/gradient_background.dart';

class LoginView extends StatelessWidget {
  const LoginView({super.key});
  static const String routeName = '/login';
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(hasImage: true, child: LoginViewBody()),
    );
  }
}
