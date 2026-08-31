import 'package:flutter/material.dart';
import 'package:signals_flutter/signals_flutter.dart';
import 'package:student_compass_mobile/Features/Settings/app_settings.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class SettingsView extends StatefulWidget {
  const SettingsView({super.key});

  @override
  State<SettingsView> createState() => _SettingsViewState();
}

class _SettingsViewState extends State<SettingsView> {
  bool _studyReminders = true;
  bool _examAlerts = true;

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);

    return Watch((context) {
      final currentLocale = AppSettings.localeSignal.value;
      final currentThemeMode = AppSettings.themeModeSignal.value;
      final isDark = currentThemeMode == ThemeMode.dark;

      return Scaffold(
        backgroundColor: AppColors.scaffoldBackgroundColor(isDark, context),
        appBar: const CustomAppBar(title: 'الإعدادات والتفضيلات'),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.s16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. قسم اللغة
              _buildSectionTitle(context, s.Language),
              const SizedBox(height: AppSpacing.s10),
              _buildSettingCard(
                context: context,
                child: Column(
                  children: [
                    _buildRadioTile(
                      context: context,
                      title: s.ArabicLang,
                      subtitle: 'اللغة العربية (اليمن)',
                      selected: currentLocale.languageCode == AppConstants.kArabicLang,
                      onTap: () => AppSettings.changeLanguage(AppConstants.kArabicLang),
                    ),
                    Divider(height: 1, color: AppColors.borderColor(context)),
                    _buildRadioTile(
                      context: context,
                      title: s.EnglishLang,
                      subtitle: 'English (US)',
                      selected: currentLocale.languageCode == AppConstants.kEnglishLang,
                      onTap: () => AppSettings.changeLanguage(AppConstants.kEnglishLang),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.s20),

              // 2. قسم المظهر
              _buildSectionTitle(context, s.Theme),
              const SizedBox(height: AppSpacing.s10),
              _buildSettingCard(
                context: context,
                child: SwitchListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.s16,
                    vertical: AppSpacing.s4,
                  ),
                  secondary: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primaryColor(context).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                      color: AppColors.primaryColor(context),
                      size: 22,
                    ),
                  ),
                  title: Text(
                    isDark ? s.DarkMode : s.LightMode,
                    style: TextStyles.semiBold14.copyWith(
                      color: AppColors.textPrimaryColor(context),
                    ),
                  ),
                  subtitle: Text(
                    isDark ? 'تفعيل الألوان الداكنة للراحة الليلية' : 'تفعيل السطوع والوضوح النهاري',
                    style: TextStyles.regular11.copyWith(
                      color: AppColors.textSecondaryColor(context),
                    ),
                  ),
                  value: isDark,
                  activeThumbColor: AppColors.primaryColor(context),
                  onChanged: (val) {
                    AppSettings.changeTheme();
                  },
                ),
              ),

              const SizedBox(height: AppSpacing.s20),

              // 3. قسم التنبيهات والإشعارات
              _buildSectionTitle(context, 'التنبيهات والإشعارات'),
              const SizedBox(height: AppSpacing.s10),
              _buildSettingCard(
                context: context,
                child: Column(
                  children: [
                    SwitchListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.s16, vertical: 2),
                      secondary: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.alarm_rounded, color: Color(0xFF10B981), size: 22),
                      ),
                      title: Text(
                        'تنبيهات المذاكرة اليومية',
                        style: TextStyles.semiBold14.copyWith(color: AppColors.textPrimaryColor(context)),
                      ),
                      subtitle: Text(
                        'تذكير بإنجاز جدول الخطة الدراسية',
                        style: TextStyles.regular11.copyWith(color: AppColors.textSecondaryColor(context)),
                      ),
                      value: _studyReminders,
                      activeThumbColor: const Color(0xFF10B981),
                      onChanged: (val) {
                        setState(() => _studyReminders = val);
                      },
                    ),
                    Divider(height: 1, color: AppColors.borderColor(context)),
                    SwitchListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.s16, vertical: 2),
                      secondary: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF3B82F6).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.notifications_active_rounded, color: Color(0xFF3B82F6), size: 22),
                      ),
                      title: Text(
                        'إشعارات الامتحانات والمسابقات',
                        style: TextStyles.semiBold14.copyWith(color: AppColors.textPrimaryColor(context)),
                      ),
                      subtitle: Text(
                        'إشعارات عند توفر اختبارات وزارية جديدة',
                        style: TextStyles.regular11.copyWith(color: AppColors.textSecondaryColor(context)),
                      ),
                      value: _examAlerts,
                      activeThumbColor: const Color(0xFF3B82F6),
                      onChanged: (val) {
                        setState(() => _examAlerts = val);
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.s20),

              // 4. قسم الدعم الفني وسياسة الخصوصية
              _buildSectionTitle(context, 'المساعدة والخصوصية'),
              const SizedBox(height: AppSpacing.s10),
              _buildSettingCard(
                context: context,
                child: Column(
                  children: [
                    _buildActionTile(
                      context: context,
                      icon: Icons.support_agent_rounded,
                      iconColor: const Color(0xFF8B5CF6),
                      title: 'الدعم الفني وملاحظات الطلاب',
                      subtitle: 'تواصل مع فريق الدعم والإرشاد التعليمي',
                      onTap: () => _showSupportBottomSheet(context),
                    ),
                    Divider(height: 1, color: AppColors.borderColor(context)),
                    _buildActionTile(
                      context: context,
                      icon: Icons.privacy_tip_outlined,
                      iconColor: const Color(0xFF0EA5E9),
                      title: 'سياسة الخصوصية وشروط الاستخدام',
                      subtitle: 'حماية بياناتك وسياسة المنصة التعليمية',
                      onTap: () => _showPrivacyBottomSheet(context),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.s20),

              // 5. قسم الذاكرة والتطبيق
              _buildSectionTitle(context, 'التخزين ومعلومات التطبيق'),
              const SizedBox(height: AppSpacing.s10),
              _buildSettingCard(
                context: context,
                child: Column(
                  children: [
                    _buildActionTile(
                      context: context,
                      icon: Icons.cleaning_services_rounded,
                      iconColor: const Color(0xFFF59E0B),
                      title: 'مسح الذاكرة المؤقتة',
                      subtitle: 'تحرير 18.4 MB من الملفات المؤقتة والرسومات',
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'تنظيف',
                          style: TextStyles.bold11.copyWith(color: const Color(0xFFD97706)),
                        ),
                      ),
                      onTap: () {
                        customToastBar(
                          context: context,
                          message: 'تم مسح الذاكرة المؤقتة بنجاح',
                          icon: Icons.check_circle_outline,
                          backgroundColor: AppColors.customGreen(context),
                          textColor: AppColors.textPrimaryColor(context),
                        );
                      },
                    ),
                    Divider(height: 1, color: AppColors.borderColor(context)),
                    _buildActionTile(
                      context: context,
                      icon: Icons.info_outline_rounded,
                      iconColor: AppColors.primaryColor(context),
                      title: 'عن منصة بوصلة الطالب',
                      subtitle: 'الإصدار 1.0.0 (بناء 120) - 2026',
                      onTap: () => _showAboutBottomSheet(context),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.s32),
            ],
          ),
        ),
      );
    });
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Text(
      title,
      style: TextStyles.bold16.copyWith(
        color: AppColors.textBoldColor(context),
      ),
    );
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
    required String subtitle,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.s16, vertical: 4.0),
      title: Text(
        title,
        style: TextStyles.semiBold14.copyWith(
          color: selected ? AppColors.primaryColor(context) : AppColors.textPrimaryColor(context),
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyles.regular11.copyWith(color: AppColors.textSecondaryColor(context)),
      ),
      trailing: selected
          ? Icon(Icons.check_circle_rounded, color: AppColors.primaryColor(context))
          : const Icon(Icons.circle_outlined, color: Colors.grey),
    );
  }

  Widget _buildActionTile({
    required BuildContext context,
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Widget? trailing,
  }) {
    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.s16, vertical: 4.0),
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: iconColor.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: iconColor, size: 22),
      ),
      title: Text(
        title,
        style: TextStyles.semiBold14.copyWith(color: AppColors.textPrimaryColor(context)),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyles.regular11.copyWith(color: AppColors.textSecondaryColor(context)),
      ),
      trailing: trailing ?? Icon(
        Icons.arrow_forward_ios_rounded,
        size: 14,
        color: AppColors.textSecondaryColor(context),
      ),
    );
  }

  void _showSupportBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.itemsColor(context),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(AppSpacing.s20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade400,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'مركز الدعم والمساعدة 🎓',
                style: TextStyles.bold18.copyWith(color: AppColors.textBoldColor(context)),
              ),
              const SizedBox(height: 8),
              Text(
                'فريق دعم منصة بوصلة الطالب جاهز للإجابة على استفساراتكم وحل أي مشكلة تواجهكم في المواد أو الامتحانات.',
                style: TextStyles.regular13.copyWith(color: AppColors.textSecondaryColor(context)),
              ),
              const SizedBox(height: 20),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF25D366).withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.chat_bubble_outline_rounded, color: Color(0xFF25D366)),
                ),
                title: const Text('واتساب الدعم الفني'),
                subtitle: const Text('+967 770 000 000'),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  customToastBar(
                    context: ctx,
                    message: 'سيتم فتح تطبيق الواتساب...',
                    icon: Icons.chat_bubble_outline,
                    backgroundColor: AppColors.customGreen(ctx),
                    textColor: AppColors.textPrimaryColor(ctx),
                  );
                },
              ),
              Divider(color: AppColors.borderColor(context)),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF3B82F6).withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.email_outlined, color: Color(0xFF3B82F6)),
                ),
                title: const Text('البريد الإلكتروني'),
                subtitle: const Text('support@studentcompass.ye'),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  customToastBar(
                    context: ctx,
                    message: 'support@studentcompass.ye',
                    icon: Icons.email_outlined,
                    backgroundColor: AppColors.primaryColor(ctx),
                    textColor: AppColors.textPrimaryColor(ctx),
                  );
                },
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  void _showPrivacyBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.itemsColor(context),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return DraggableScrollableSheet(
          initialChildSize: 0.7,
          minChildSize: 0.4,
          maxChildSize: 0.9,
          expand: false,
          builder: (_, controller) {
            return Padding(
              padding: const EdgeInsets.all(AppSpacing.s20),
              child: ListView(
                controller: controller,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade400,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'سياسة الخصوصية وشروط الاستخدام 🔒',
                    style: TextStyles.bold18.copyWith(color: AppColors.textBoldColor(context)),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'نحن في منصة "بوصلة الطالب" نلتزم بأعلى معايير حماية وخصوصية بيانات الطلاب والمعلمين.',
                    style: TextStyles.regular13.copyWith(color: AppColors.textSecondaryColor(context)),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '1. جمع البيانات واستخدامها',
                    style: TextStyles.bold14.copyWith(color: AppColors.textBoldColor(context)),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'تُستخدم بيانات الحساب، كالاسم والصف الدراسي والمسار والبريد الإلكتروني، لتخصيص الخطة الدراسية وتوفير نتائج الامتحانات وتحديد الترتيب في لوحة الشرف.',
                    style: TextStyles.regular12.copyWith(color: AppColors.textSecondaryColor(context)),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    '2. حماية وتشفير البيانات',
                    style: TextStyles.bold14.copyWith(color: AppColors.textBoldColor(context)),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'تخضع كافة البيانات والاتصالات للتشفير القياسي، ولا يتم مشاركة أي معلومات شخصية مع أي أطراف ثالثة دون إذنك المسبق.',
                    style: TextStyles.regular12.copyWith(color: AppColors.textSecondaryColor(context)),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    '3. حقوق الملكية الفكرية',
                    style: TextStyles.bold14.copyWith(color: AppColors.textBoldColor(context)),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'جميع النماذج الامتحانية والملخصات والأسئلة والحلول محفوظة لصالح منصة بوصلة الطالب ووزارة التربية والتعليم.',
                    style: TextStyles.regular12.copyWith(color: AppColors.textSecondaryColor(context)),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showAboutBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.itemsColor(context),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(AppSpacing.s24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 70,
                height: 70,
                decoration: BoxDecoration(
                  color: AppColors.primaryColor(context).withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.explore_rounded,
                  size: 40,
                  color: AppColors.primaryColor(context),
                ),
              ),
              const SizedBox(height: 14),
              Text(
                'بوصلة الطالب | Student Compass',
                style: TextStyles.bold18.copyWith(color: AppColors.textBoldColor(context)),
              ),
              const SizedBox(height: 4),
              Text(
                'المنصة التفاعلية الشاملة لطلاب الثانوية العامة',
                style: TextStyles.regular12.copyWith(color: AppColors.textSecondaryColor(context)),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.borderColor(context).withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'الإصدار 1.0.0 - Stable',
                  style: TextStyles.semiBold12.copyWith(color: AppColors.textPrimaryColor(context)),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'تم التطوير بعناية لدعم طلاب الجمهورية اليمنية وتوفير بنك أسئلة مؤتمت ومحاكي للاختبارات الوزارية مع خطط مذاكرة ذكية ورحلة تعلم متكاملة.',
                textAlign: TextAlign.center,
                style: TextStyles.regular12.copyWith(
                  color: AppColors.textSecondaryColor(context),
                  height: 1.6,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'جميع الحقوق محفوظة © 2026',
                style: TextStyles.regular11.copyWith(color: AppColors.textSecondaryColor(context)),
              ),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }
}
