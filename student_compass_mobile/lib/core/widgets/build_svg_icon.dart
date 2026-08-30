import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';

Widget buildSvgIcon(BuildContext context, String asset) {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 6),
    child: SvgPicture.asset(
      asset,
      width: 26,
      colorFilter: ColorFilter.mode(
        AppColors.textPrimaryColor(context),
        BlendMode.srcIn,
      ),
    ),
  );
}
