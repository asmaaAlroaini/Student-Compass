import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/widgets/blur_circle.dart';

class SplashBackgroundColors extends StatelessWidget {
  const SplashBackgroundColors({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned(
          top: 0,
          left: 0,
          child: BlurCircle(
            color: AppColors.primaryColor(context).withOpacity(0.5),
            size: 150,
          ),
        ),
        Positioned(
          bottom: 0,
          right: 0,
          child: BlurCircle(
            color: AppColors.primaryColor(context).withOpacity(0.5),
            size: 150,
          ),
        ),
        // Positioned(
        //   top: 150,
        //   left: 200,
        //   child: BlurCircle(color: AppColors.primaryColor(context), size: 350),
        // ),
      ],
    );
  }
}
