import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/Settings/app_settings.dart';

abstract class AppColors {
  /// فحص هل التثبيت حالياً في وضع الداكن (Dark Mode)
  static bool isDarkMode([BuildContext? context]) {
    if (context != null && context.mounted) {
      return Theme.of(context).brightness == Brightness.dark;
    }
    return AppSettings.themeModeSignal.value == ThemeMode.dark;
  }

  // --- الألوان الأساسية للمشروع التعليمي (Student Compass) ---

  /// اللون الرئيسي للمشروع (أزرق ملكي أكاديمي للمود الفاتح / أزرق مشرق للمود المظلم)
  static Color primaryColor([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF3B82F6) : const Color(0xFF1D4ED8);

  /// اللون الثانوي (تيل / أكوا أكاديمي)
  static Color secondaryColor([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF2DD4BF) : const Color(0xFF0D9488);

  /// لون خلفية الشاشات (Scaffold)
  static Color scaffoldBackgroundColor([bool? isDark, BuildContext? context]) =>
      (isDark ?? isDarkMode(context))
      ? const Color(0xFF0F172A)
      : const Color(0xFFF8FAFC);

  /// اللون الرئيسي للنصوص العادية
  static Color textPrimaryColor([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFFF8FAFC) : const Color(0xFF1E293B);

  /// اللون الثانوي للنصوص الفرعية والوصف
  static Color textSecondaryColor([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

  /// لون العناوين والنصوص العريضة
  static Color textBoldColor([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFFFFFFFF) : const Color(0xFF0F172A);

  /// لون النص الأحمر للتحذيرات والتنبيهات
  static Color textRedColor([BuildContext? context, bool isFixed = false]) =>
      isDarkMode(context)
      ? isFixed
            ? const Color(0xFF991B1B)
            : const Color(0xFFF87171)
      : const Color(0xFFDC2626);

  /// لون أحمر مخصص للبطاقات والخلفيات التنبيهية
  static Color customRed([BuildContext? context, bool isFixed = false]) =>
      isDarkMode(context)
      ? isFixed
            ? const Color(0xFFFEE2E2)
            : const Color(0xFFEF4444)
      : const Color(0xFFFEE2E2);

  /// لون خلفية حقول المدخلات (Input Fields)
  static Color textFeilColor([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9);

  /// لون الكروت والعناصر (Card / Container Surface)
  static Color itemsColor([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF1E293B) : const Color(0xFFFFFFFF);

  /// لون الحدود والفاصل (Borders & Dividers)
  static Color borderColor([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

  /// لون تركيز حقول المدخلات (Focus Color)
  static Color fieldFocusColor([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF1E3A8A) : const Color(0xFFEFF6FF);

  /// لون الظلال
  static Color shadowColor([BuildContext? context]) => isDarkMode(context)
      ? const Color(0xFF000000).withValues(alpha: 0.40)
      : const Color(0xFF0F172A).withValues(alpha: 0.06);

  // --- الألوان المساعدة والفرعية ---

  /// لون النجاح الخفيف (خلفية الإشعارات الناجحة)
  static Color successSoft([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF064E3B) : const Color(0xFFDCFCE7);

  /// لون الخطأ الخفيف (خلفية التنبيهات)
  static Color errorSoft([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF7F1D1D) : const Color(0xFFFEE2E2);

  /// اللون الأحمر للتنبيهات الحادة
  static Color red([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFFF87171) : const Color(0xFFEF4444);

  /// اللون الأخضر التفاعلي (إنجاز / نجاح / درجات)
  static Color customGreen([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF34D399) : const Color(0xFF10B981);

  /// اللون البرتقالي (مهام قادمة / مواعيد / تنبيهات)
  static Color customOrange([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFFFBBF24) : const Color(0xFFF59E0B);

  /// اللون الأزرق الإضافي
  static Color customBlue([BuildContext? context]) =>
      isDarkMode(context) ? const Color(0xFF60A5FA) : const Color(0xFF2563EB);

  /// اللون الأبيض الثابت
  static Color white([BuildContext? context]) => const Color(0xFFFFFFFF);
}
