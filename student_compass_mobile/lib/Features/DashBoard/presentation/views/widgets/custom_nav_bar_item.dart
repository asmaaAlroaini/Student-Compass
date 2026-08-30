import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class CustomNavBarItem extends StatefulWidget {
  const CustomNavBarItem({
    super.key,
    required this.index,
    required this.pageIndex,
    required this.icon,
    required this.label,
    this.onTap,
    this.isBoldIcon,
  });

  final int index;
  final int pageIndex;
  final String icon;
  final String? label;
  final void Function()? onTap;
  final bool? isBoldIcon;

  @override
  State<CustomNavBarItem> createState() => _CustomNavBarItemState();
}

class _CustomNavBarItemState extends State<CustomNavBarItem>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  bool _wasSelected = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350), // slower and smoother
    );
    _scaleAnim = TweenSequence([
      TweenSequenceItem(
        tween: Tween(
          begin: 1.0,
          end: 1.35,
        ).chain(CurveTween(curve: Curves.easeOut)),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween(
          begin: 1.35,
          end: 1.0,
        ).chain(CurveTween(curve: Curves.easeIn)),
        weight: 50,
      ),
    ]).animate(_controller);
  }

  @override
  void didUpdateWidget(covariant CustomNavBarItem oldWidget) {
    super.didUpdateWidget(oldWidget);
    final bool isSelected = widget.index == widget.pageIndex;
    if (isSelected && !_wasSelected) {
      _controller.forward(from: 0);
    }
    _wasSelected = isSelected;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final primary = AppColors.primaryColor(context);
    final bool isSelected = widget.index == widget.pageIndex;
    return InkWell(
      onTap: widget.onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 350),
            curve: Curves.easeOut,
            alignment: Alignment.center,
            width: isSelected ? 82 : 44,
            height: 36,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(50),
              color: isSelected ? primary.withValues(alpha: 0.12) : null,
            ),
            child: AnimatedBuilder(
              animation: _scaleAnim,
              builder: (context, child) {
                return Transform.scale(
                  scale: isSelected ? _scaleAnim.value : 1.0,
                  child: AnimatedOpacity(
                    duration: const Duration(milliseconds: 350),
                    opacity: isSelected ? 1.0 : 0.8,
                    child: SvgPicture.asset(
                      widget.icon,
                      width: 24,
                      height: 24,
                      colorFilter: ColorFilter.mode(
                        isSelected
                            ? primary
                            : AppColors.textSecondaryColor(context),
                        BlendMode.srcIn,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 4),
          Text(
            widget.label!,
            style: TextStyles.bold14.copyWith(
              color: isSelected
                  ? primary
                  : AppColors.textSecondaryColor(context),
            ),
          ),
        ],
      ),
    );
  }
}
