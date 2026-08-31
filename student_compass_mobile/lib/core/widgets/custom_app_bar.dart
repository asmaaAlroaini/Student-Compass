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
    this.useGradient = true,
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

    final primary = AppColors.primaryColor(context);
    final effectiveBgColor = backgroundColor ?? primary;
    final effectiveTextColor = textColor ?? Colors.white;

    return Container(
      decoration: BoxDecoration(
        color: effectiveBgColor,
        gradient: useGradient && backgroundColor == null
            ? LinearGradient(
                colors: [
                  primary,
                  primary.withValues(alpha: 0.92),
                ],
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
              )
            : null,
        boxShadow: [
          BoxShadow(
            color: primary.withValues(alpha: 0.25),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        child: Stack(
          children: [
            // Decorative subtle background circles on corners
            Positioned(
              top: -30,
              right: -25,
              child: Container(
                width: 95,
                height: 95,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.09),
                ),
              ),
            ),
            Positioned(
              bottom: -35,
              left: -20,
              child: Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.07),
                ),
              ),
            ),
            Positioned(
              top: 15,
              left: 70,
              child: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.05),
                ),
              ),
            ),

            SafeArea(
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
                                    color: Colors.white.withValues(alpha: 0.18),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: Colors.white.withValues(alpha: 0.28),
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
                        style: TextStyles.bold18.copyWith(
                          color: effectiveTextColor,
                          letterSpacing: -0.2,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight + 6);
}
