import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Splash/presentation/views/widgets/splash_background_colors.dart';
import 'package:student_compass_mobile/Features/Splash/presentation/views/widgets/splash_loading_indicator.dart';
import 'package:student_compass_mobile/Features/Splash/presentation/views/widgets/splash_logo.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/widgets/gradient_background.dart';

class SplashViewBody extends StatefulWidget {
  const SplashViewBody({super.key});

  @override
  State<SplashViewBody> createState() => _SplashViewBodyState();
}

class _SplashViewBodyState extends State<SplashViewBody> {
  static const Duration _splashDuration = Duration(seconds: 4);
  Timer? _navigationTimer;

  @override
  void initState() {
    super.initState();
    _navigationTimer = Timer(_splashDuration, _navigateToOnBoarding);
  }

  @override
  void dispose() {
    _navigationTimer?.cancel();
    super.dispose();
  }

  void _navigateToOnBoarding() async {
    //
    context.go(RouteNames.initView);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = AppColors.isDarkMode(context);

    return GradientBackground(
      hasImage: true,
      backgroundColors: const SplashBackgroundColors(),
      child: SafeArea(
        child: SizedBox.expand(
          child: Column(
            children: [
              const Spacer(flex: 7),
              SplashLogo(isDark: isDark),
              const Spacer(flex: 4),
              const SplashLoadingIndicator(),
              const Spacer(flex: 2),
            ],
          ),
        ),
      ),
    );
  }
}
