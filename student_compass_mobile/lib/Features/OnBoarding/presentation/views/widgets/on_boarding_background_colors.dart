import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/widgets/blur_circle.dart';

class OnBoarrdingBackgroundColors extends StatelessWidget {
  const OnBoarrdingBackgroundColors({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned(
          bottom: -10,
          right: -10,
          child: BlurCircle(
            color: AppColors.primaryColor(context).withAlpha(130),
            size: 155,
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
