import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';

class RememberMeWidget extends StatelessWidget {
  const RememberMeWidget({
    super.key,
    required this.value,
    required this.onChanged,
  });

  final bool value;
  final ValueChanged<bool?> onChanged;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        SizedBox(
          height: 28,
          width: 28,
          child: Checkbox(
            value: value,
            onChanged: onChanged,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(5),
            ),
            activeColor: AppColors.primaryColor(context),
            side: BorderSide(color: AppColors.borderColor(context)),
          ),
        ),
        const SizedBox(width: 4),
        Text(
          'تذكرني',
          style: TextStyle(
            color: AppColors.textPrimaryColor(context),
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
