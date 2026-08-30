import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/DashBoard/presentation/views/widgets/custom_nav_bar_item.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';

class CustomNavBar extends StatelessWidget {
  const CustomNavBar({super.key, required this.pageIndex, required this.onTap});

  final int pageIndex;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Container(
        padding: const EdgeInsets.fromLTRB(8, 8, 8, 16),
        decoration: BoxDecoration(
          color: AppColors.itemsColor(context),
          border: Border(
            top: BorderSide(color: AppColors.borderColor(context)),
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: CustomNavBarItem(
                icon:
                    pageIndex == 0
                        ? Assets.assetsIconsHomeBold
                        : Assets.assetsIconsHome,
                label: 'الرئيسية',
                index: 0,
                pageIndex: pageIndex,
                onTap: () => onTap(0),
                isBoldIcon: pageIndex == 0,
              ),
            ),
            Expanded(
              child: CustomNavBarItem(
                icon:
                    pageIndex == 1
                        ? Assets.assetsIconsLampChargeBold
                        : Assets.assetsIconsLampCharge,
                label: 'المواد',
                index: 1,
                pageIndex: pageIndex,
                onTap: () => onTap(1),
                isBoldIcon: pageIndex == 1,
              ),
            ),
            Expanded(
              child: CustomNavBarItem(
                icon:
                    pageIndex == 2
                        ? Assets.assetsIconsAddSquareBold
                        : Assets.assetsIconsAddSquare,
                label: 'الامتحانات',
                index: 2,
                pageIndex: pageIndex,
                onTap: () => onTap(2),
                isBoldIcon: pageIndex == 2,
              ),
            ),
            Expanded(
              child: CustomNavBarItem(
                icon:
                    pageIndex == 3
                        ? Assets.assetsIconsProfileBold
                        : Assets.assetsIconsProfile,
                label: 'الملف الشخصي',
                index: 3,
                pageIndex: pageIndex,
                onTap: () => onTap(3),
                isBoldIcon: pageIndex == 3,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
