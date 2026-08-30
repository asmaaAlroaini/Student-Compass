import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({
    super.key,
    required this.title,
    this.backgroundColor,
    this.textColor,
    this.isChat = false,
    this.centerTitle = true,
    this.showBackButton = true,
    this.onBackTap,
    this.actions,
    this.leading,
    this.elevation = 0,
    this.useGradient = false,
  });

  final String title;
  final Color? backgroundColor;
  final Color? textColor;
  final bool? isChat;
  final bool centerTitle;
  final bool showBackButton;
  final VoidCallback? onBackTap;
  final List<Widget>? actions;
  final Widget? leading;
  final double elevation;
  final bool useGradient;

  @override
  Widget build(BuildContext context) {
    final bool canPop = Navigator.of(context).canPop();
    final bool shouldShowBack = showBackButton && canPop;

    final defaultBgColor = AppColors.itemsColor(context);
    final effectiveBackgroundColor = backgroundColor ?? (useGradient ? Colors.transparent : defaultBgColor);
    final effectiveTextColor = textColor ?? (useGradient ? Colors.white : AppColors.textBoldColor(context));

    return Container(
      decoration: BoxDecoration(
        color: useGradient ? null : effectiveBackgroundColor,
        gradient: useGradient
            ? LinearGradient(
                colors: [
                  AppColors.primaryColor(context),
                  AppColors.primaryColor(context).withValues(alpha: 0.85),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              )
            : null,
        border: useGradient
            ? null
            : Border(
                bottom: BorderSide(
                  color: AppColors.borderColor(context).withValues(alpha: 0.6),
                  width: 1,
                ),
              ),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor(context).withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: SafeArea(
        bottom: false,
        child: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          scrolledUnderElevation: 0,
          centerTitle: isChat == true ? false : centerTitle,
          titleSpacing: isChat == true ? 0 : NavigationToolbar.kMiddleSpacing,
          automaticallyImplyLeading: false,
          leading: leading ??
              (shouldShowBack
                  ? Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(12),
                          onTap: onBackTap ??
                              () {
                                if (context.canPop()) {
                                  context.pop();
                                } else {
                                  Navigator.of(context).maybePop();
                                }
                              },
                          child: Container(
                            decoration: BoxDecoration(
                              color: useGradient
                                  ? Colors.white.withValues(alpha: 0.2)
                                  : AppColors.scaffoldBackgroundColor(null, context),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: useGradient
                                    ? Colors.white.withValues(alpha: 0.3)
                                    : AppColors.borderColor(context),
                                width: 1,
                              ),
                            ),
                            child: Icon(
                              Icons.arrow_back_ios_new_rounded,
                              size: 16,
                              color: effectiveTextColor,
                            ),
                          ),
                        ),
                      ),
                    )
                  : null),
          actions: actions != null
              ? [
                  ...actions!,
                  const SizedBox(width: 8),
                ]
              : null,
          title: isChat == true
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CircleAvatar(
                      radius: 18,
                      backgroundImage: AssetImage(Assets.assetsIconsAppIcon),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      title,
                      style: TextStyles.bold16.copyWith(color: effectiveTextColor),
                    ),
                  ],
                )
              : Text(
                  title,
                  style: TextStyles.bold16.copyWith(
                    color: effectiveTextColor,
                    letterSpacing: -0.2,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight + 4);
}
