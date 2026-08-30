import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';

class CustomFloatingActionButton extends StatelessWidget {
  const CustomFloatingActionButton({super.key, this.onPressed});
  final void Function()? onPressed;
  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      backgroundColor: AppColors.primaryColor(context),
      onPressed: onPressed,
      child: SvgPicture.asset(
        Assets.assetsIconsMessageQuestion,
        width: 30,
        height: 30,
        colorFilter: ColorFilter.mode(AppColors.white(), BlendMode.srcIn),
      ),
    );
  }
}
