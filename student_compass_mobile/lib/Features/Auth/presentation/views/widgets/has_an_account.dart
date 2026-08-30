import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class HasAnAccount extends StatelessWidget {
  const HasAnAccount({
    super.key,
    required this.primaryText,
    required this.secondaryText,
    this.isLoginView,
  });
  final String primaryText;
  final String secondaryText;
  final bool? isLoginView;
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          primaryText,
          style: TextStyles.semiBold16.copyWith(
            color: AppColors.textPrimaryColor(context),
          ),
        ),
        const SizedBox(width: 5),
        GestureDetector(
          onTap: () {
            isLoginView == true
                ? context.push(RouteNames.register)
                : context.pop(); // context.push(SignUpView.routeName);
          },
          child: Text(
            secondaryText,
            style: TextStyles.semiBold16.copyWith(
              color: AppColors.primaryColor(),
            ),
          ),
        ),
      ],
    );
  }
}
