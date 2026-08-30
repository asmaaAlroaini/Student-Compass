import 'package:flutter/material.dart';
import 'package:signals_flutter/signals_flutter.dart';
import 'package:student_compass_mobile/Features/Settings/app_settings.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class SettingsView extends StatelessWidget {
  const SettingsView({super.key});

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);

    return Watch((context) {
      final currentLocale = AppSettings.localeSignal.value;
      final currentThemeMode = AppSettings.themeModeSignal.value;
      final isDark = currentThemeMode == ThemeMode.dark;

      return Scaffold(
        backgroundColor: AppColors.scaffoldBackgroundColor(isDark, context),
        appBar: CustomAppBar(title: s.LanguageAndTheme),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.s16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // قسم اللغة
              Text(
                s.Language,
                style: TextStyles.bold16.copyWith(
                  color: AppColors.textBoldColor(context),
                ),
              ),
              const SizedBox(height: AppSpacing.s12),
              _buildSettingCard(
                context: context,
                child: Column(
                  children: [
                    _buildRadioTile(
                      context: context,
                      title: s.ArabicLang,
                      selected:
                          currentLocale.languageCode ==
                          AppConstants.kArabicLang,
                      onTap: () =>
                          AppSettings.changeLanguage(AppConstants.kArabicLang),
                    ),
                    const Divider(height: 1),
                    _buildRadioTile(
                      context: context,
                      title: s.EnglishLang,
                      selected:
                          currentLocale.languageCode ==
                          AppConstants.kEnglishLang,
                      onTap: () =>
                          AppSettings.changeLanguage(AppConstants.kEnglishLang),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.s24),

              // قسم المظهر
              Text(
                s.Theme,
                style: TextStyles.bold16.copyWith(
                  color: AppColors.textBoldColor(context),
                ),
              ),
              const SizedBox(height: AppSpacing.s12),
              _buildSettingCard(
                context: context,
                child: SwitchListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.s16,
                    vertical: AppSpacing.s4,
                  ),
                  secondary: Icon(
                    isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                    color: AppColors.primaryColor(context),
                  ),
                  title: Text(
                    isDark ? s.DarkMode : s.LightMode,
                    style: TextStyles.semiBold14.copyWith(
                      color: AppColors.textPrimaryColor(context),
                    ),
                  ),
                  value: isDark,
                  activeThumbColor: AppColors.primaryColor(context),
                  onChanged: (val) {
                    AppSettings.changeTheme();
                  },
                ),
              ),
            ],
          ),
        ),
      );
    });
  }

  Widget _buildSettingCard({
    required BuildContext context,
    required Widget child,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderColor(context), width: 1),
      ),
      child: ClipRRect(borderRadius: BorderRadius.circular(16), child: child),
    );
  }

  Widget _buildRadioTile({
    required BuildContext context,
    required String title,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.s16,
        vertical: 2.0,
      ),
      title: Text(
        title,
        style: TextStyles.semiBold14.copyWith(
          color: selected
              ? AppColors.primaryColor(context)
              : AppColors.textPrimaryColor(context),
        ),
      ),
      trailing: selected
          ? Icon(
              Icons.check_circle_rounded,
              color: AppColors.primaryColor(context),
            )
          : const Icon(Icons.circle_outlined, color: Colors.grey),
    );
  }
}
