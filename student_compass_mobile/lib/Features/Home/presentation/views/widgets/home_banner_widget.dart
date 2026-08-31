import 'dart:async';
import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class HomeBannerWidget extends StatefulWidget {
  const HomeBannerWidget({super.key});

  @override
  State<HomeBannerWidget> createState() => _HomeBannerWidgetState();
}

class _HomeBannerWidgetState extends State<HomeBannerWidget> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  Timer? _timer;

  final List<BannerItem> _banners = const [
    BannerItem(
      titlePrefix: 'اختبر معارفك ',
      titleHighlight: 'مع بنك الأسئلة',
      description: 'أكثر من 1,000 سؤال وزاري وأتمتة شاملة 🚀',
      tag: 'امتحانات مؤتمتة',
      gradientColors: [Color(0xFF1E3A8A), Color(0xFF1D4ED8), Color(0xFF2563EB)],
      icon: Icons.quiz_rounded,
      highlightColor: Color(0xFF34D399),
    ),
    BannerItem(
      titlePrefix: 'واكب تقدمك ',
      titleHighlight: 'بخطتك الذكية',
      description: 'جدول دراسي يومي منظم لإنهاء المنهج بامتياز 🎯',
      tag: 'خطة التفوق',
      gradientColors: [Color(0xFF065F46), Color(0xFF059669), Color(0xFF10B981)],
      icon: Icons.auto_awesome_rounded,
      highlightColor: Color(0xFFFBBF24),
    ),
    BannerItem(
      titlePrefix: 'تحدَّ زملاءك ',
      titleHighlight: 'في مسابقات الأسبوع',
      description: 'تصدر قائمة الأوائل واحصد كؤوس وأوسمة المنصة 🏆',
      tag: 'لوحة الشرف',
      gradientColors: [Color(0xFF581C87), Color(0xFF6D28D9), Color(0xFF8B5CF6)],
      icon: Icons.emoji_events_rounded,
      highlightColor: Color(0xFFF472B6),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
  }

  void _startAutoSlide() {
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_pageController.hasClients) {
        final nextPage = (_currentPage + 1) % _banners.length;
        _pageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 600),
          curve: Curves.easeInOutCubic,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 135,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemCount: _banners.length,
            itemBuilder: (context, index) {
              final banner = _banners[index];
              return _buildBannerCard(banner);
            },
          ),
        ),
        const SizedBox(height: 8),

        // Pagination Dots Indicator
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_banners.length, (index) {
            final isSelected = index == _currentPage;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              height: 5,
              width: isSelected ? 20 : 6,
              decoration: BoxDecoration(
                color: isSelected
                    ? const Color(0xFF10B981)
                    : Colors.grey.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(4),
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildBannerCard(BannerItem banner) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(horizontal: 2),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          colors: banner.gradientColors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: banner.gradientColors[1].withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Background decorative circles
          Positioned(
            left: -20,
            top: -20,
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.07),
              ),
            ),
          ),
          Positioned(
            right: 80,
            bottom: -30,
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.04),
              ),
            ),
          ),

          // Content
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.s16,
              vertical: AppSpacing.s12,
            ),
            child: Row(
              children: [
                // Text Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Tag Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.18),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          banner.tag,
                          style: TextStyles.bold10.copyWith(
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),

                      // Title
                      Row(
                        children: [
                          Text(
                            banner.titlePrefix,
                            style: TextStyles.bold16.copyWith(
                              color: Colors.white,
                            ),
                          ),
                          Text(
                            banner.titleHighlight,
                            style: TextStyles.bold16.copyWith(
                              color: banner.highlightColor,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),

                      // Description
                      Text(
                        banner.description,
                        style: TextStyles.semiBold12.copyWith(
                          color: Colors.white.withValues(alpha: 0.88),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 8),

                // Icon Container
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.14),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.25),
                      width: 1.5,
                    ),
                  ),
                  child: Icon(
                    banner.icon,
                    size: 26,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class BannerItem {
  final String titlePrefix;
  final String titleHighlight;
  final String description;
  final String tag;
  final List<Color> gradientColors;
  final IconData icon;
  final Color highlightColor;

  const BannerItem({
    required this.titlePrefix,
    required this.titleHighlight,
    required this.description,
    required this.tag,
    required this.gradientColors,
    required this.icon,
    required this.highlightColor,
  });
}
