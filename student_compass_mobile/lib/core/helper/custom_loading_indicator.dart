import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';

class CustomLoadingIndicator extends StatelessWidget {
  const CustomLoadingIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: CircularProgressIndicator(color: AppColors.primaryColor(context)),
    );
  }
}
