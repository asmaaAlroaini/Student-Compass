import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class CustomGradientText extends StatelessWidget {
  const CustomGradientText({super.key, required this.text});
  final String text;
  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback:
          (bounds) => LinearGradient(
            colors: [
              Color(0xff4983F6),
              Color(0xffBF4BDB),
              AppColors.primaryColor(context),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ).createShader(bounds),
      child: Text(
        text,
        style: TextStyles.bold30.copyWith(
          color: AppColors.white(), // اللون الأساسي للنص قبل التدرج
        ),
      ),
    );
  }
}
