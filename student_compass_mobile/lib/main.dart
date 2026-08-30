import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:signals_flutter/signals_flutter.dart';
import 'package:student_compass_mobile/Features/Settings/app_settings.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/routers/app_routes.dart';
import 'package:student_compass_mobile/core/services/bloc_providers.dart';
import 'package:student_compass_mobile/core/services/service_locator.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';
import 'package:student_compass_mobile/core/services/simple_bloc_obsever.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

void main() async {
  await initApp();
  runApp(const StudentCompassApp());
}

Future<void> initApp() async {
  WidgetsFlutterBinding.ensureInitialized();

  setUpServiceLocator();
  await Prefs.init();
  AppSettings.init();
  Bloc.observer = SimpleBlocObserver();
}

class StudentCompassApp extends StatelessWidget {
  const StudentCompassApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Watch((context) {
      return BlocProviders.wrapWithProviders(
        child: MaterialApp.router(
          locale: AppSettings.localeSignal.value,
          themeMode: AppSettings.themeModeSignal.value,

          theme: ThemeData(
            brightness: Brightness.light,
            fontFamily: 'Almarai',
            scaffoldBackgroundColor: AppColors.scaffoldBackgroundColor(false),
          ),

          darkTheme: ThemeData(
            brightness: Brightness.dark,
            fontFamily: 'Almarai',
            scaffoldBackgroundColor: AppColors.scaffoldBackgroundColor(true),
          ),

          localizationsDelegates: const [
            S.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],

          supportedLocales: S.delegate.supportedLocales,
          routerConfig: AppRoutes.router,
          title: AppConstants.kAppName,
          debugShowCheckedModeBanner: false,
        ),
      );
    });
  }
}
