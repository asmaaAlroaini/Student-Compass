import 'package:flutter/widgets.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';

class LogoWidget extends StatelessWidget {
  const LogoWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.borderColor(context), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor(context),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipOval(
        child: Image.asset(
          Assets.assetsIconsAppIcon,
          height: 80,
          width: 80,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
