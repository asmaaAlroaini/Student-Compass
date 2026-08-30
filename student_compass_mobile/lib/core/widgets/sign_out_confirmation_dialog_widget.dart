import 'package:flutter/cupertino.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class SignOutConfirmationDialogWidget extends StatelessWidget {
  const SignOutConfirmationDialogWidget({super.key, this.onConfirm});

  final VoidCallback? onConfirm;

  @override
  Widget build(BuildContext context) {
    final l10n = S.of(context);
    final isArabic = Localizations.localeOf(context).languageCode == 'ar';
    final message =
        isArabic
            ? 'هل أنت متأكد من أنك تريد تسجيل الخروج؟'
            : 'Are you sure you want to log out?';

    return CupertinoActionSheet(
      title: Text(
        l10n.Logout,
        style: TextStyle(
          color: AppColors.textBoldColor(context),
          fontSize: 18,
          fontWeight: FontWeight.bold,
          fontFamily: isArabic ? 'Cairo' : null,
        ),
      ),
      message: Text(
        message,
        style: TextStyle(
          color: AppColors.textSecondaryColor(context),
          fontSize: 14,
          fontFamily: isArabic ? 'Cairo' : null,
        ),
      ),
      actions: [
        CupertinoActionSheetAction(
          isDestructiveAction: true,
          onPressed: () {
            Navigator.pop(context);
            if (onConfirm != null) {
              onConfirm!();
            }
          },
          child: Text(
            l10n.Logout,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontFamily: isArabic ? 'Cairo' : null,
            ),
          ),
        ),
      ],
      cancelButton: CupertinoActionSheetAction(
        child: Text(
          l10n.Cancel,
          style: TextStyle(
            color: AppColors.primaryColor(context),
            fontFamily: isArabic ? 'Cairo' : null,
          ),
        ),
        onPressed: () {
          Navigator.pop(context);
        },
      ),
    );
  }
}
