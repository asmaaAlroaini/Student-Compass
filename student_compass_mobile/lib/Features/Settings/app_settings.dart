import 'package:flutter/material.dart';
import 'package:signals_flutter/signals_flutter.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

class AppSettings {
  static final localeSignal = signal(const Locale(AppConstants.kArabicLang));
  static final themeModeSignal = signal(ThemeMode.dark);

  static void init() {
    final langCode =
        Prefs.getString(AppConstants.kCurrentLanguageKey) ??
        AppConstants.kArabicLang;
    final theme =
        Prefs.getString(AppConstants.kCurrentThemeKey) ??
        AppConstants.kLightTheme;

    AppSettings.localeSignal.value = Locale(langCode);
    AppSettings.themeModeSignal.value = theme == AppConstants.kDarkTheme
        ? ThemeMode.dark
        : ThemeMode.light;
  }

  static void changeLanguage(String newLangCode) {
    final newLocale = Locale(newLangCode);
    AppSettings.localeSignal.value = newLocale;
    Prefs.setString(AppConstants.kCurrentLanguageKey, newLocale.languageCode);
  }

  static void changeTheme() {
    final isDark = AppSettings.themeModeSignal.value == ThemeMode.dark;

    final newTheme = isDark ? ThemeMode.light : ThemeMode.dark;
    AppSettings.themeModeSignal.value = newTheme;

    Prefs.setString(
      AppConstants.kCurrentThemeKey,
      isDark ? AppConstants.kLightTheme : AppConstants.kDarkTheme,
    );
  }
}
