import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:student_compass_mobile/core/helper/pick_file.dart';
import 'package:student_compass_mobile/core/helper/take_photo.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class UploadImageController extends GetxController {
  File? imagePath;
  File? storeImagePath;

  void removeImage({required bool isStoreImage}) {
    isStoreImage ? storeImagePath = null : imagePath = null;
    update();
  }

  Future<File?> pickCameraImage({required bool isStoreImage}) async {
    File? image = await takePhoto();
    if (image != null) {
      isStoreImage ? storeImagePath = image : imagePath = image;
      update();
    }
    return image;
  }

  Future<File?> pickFileImage({
    required bool isStoreImage,
    List<String> allowedExtensions = const ['jpg', 'png', 'jpeg', 'gif'],
  }) async {
    String? path = await pickFile(allowedExtensions: allowedExtensions);
    if (path != null) {
      final image = File(path);
      isStoreImage ? storeImagePath = image : imagePath = image;
      update();
      return image;
    }
    return null;
  }

  Future<File?> showImageSourceDialog(
    BuildContext context, {
    required bool isStoreImage,
    List<String> allowedExtensions = const ['jpg', 'png', 'jpeg', 'gif'],
  }) {
    return showDialog<File?>(
      barrierColor: Colors.black.withValues(alpha: 0.55),
      context: context,
      builder: (context) {
        return _ImageSourceDialog(
          onCameraPressed: () async {
            final image = await pickCameraImage(isStoreImage: isStoreImage);
            if (context.mounted) {
              Navigator.pop(context, image);
            }
          },
          onFilePressed: () async {
            final image = await pickFileImage(
              isStoreImage: isStoreImage,
              allowedExtensions: allowedExtensions,
            );
            if (context.mounted) {
              Navigator.pop(context, image);
            }
          },
        );
      },
    );
  }
}

class _ImageSourceDialog extends StatelessWidget {
  const _ImageSourceDialog({
    required this.onCameraPressed,
    required this.onFilePressed,
  });

  final Future<void> Function() onCameraPressed;
  final Future<void> Function() onFilePressed;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 22),
      backgroundColor: Colors.transparent,
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(maxWidth: 420),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppColors.itemsColor(context),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.borderColor(context)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.14),
              blurRadius: 28,
              offset: const Offset(0, 16),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const _DialogHeaderIcon(),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        S.of(context).ImageSourceTitle,
                        style: TextStyles.bold18.copyWith(
                          color: AppColors.textBoldColor(context),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        S.of(context).ImageSourceSubTitle,
                        style: TextStyles.regular14.copyWith(
                          color: AppColors.textSecondaryColor(context),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            _ImageSourceOption(
              title: S.of(context).Camera,
              subTitle: S.of(context).CameraSubTitle,
              iconAsset: Assets.assetsIconsImage,
              iconColor: AppColors.primaryColor(context),
              backgroundColor: AppColors.primaryColor(
                context,
              ).withValues(alpha: 0.09),
              onTap: onCameraPressed,
            ),
            const SizedBox(height: 10),
            _ImageSourceOption(
              title: S.of(context).UploadFile,
              subTitle: S.of(context).UploadFileSubTitle,
              iconAsset: Assets.assetsIconsUploadFiles,
              iconColor: AppColors.customBlue(),
              backgroundColor: AppColors.customBlue().withValues(alpha: 0.09),
              onTap: onFilePressed,
            ),
            const SizedBox(height: 14),
            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: () => Navigator.pop(context),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  foregroundColor: AppColors.red(),
                ),
                child: Text(
                  S.of(context).Cancel,
                  style: TextStyles.bold14.copyWith(color: AppColors.red()),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DialogHeaderIcon extends StatelessWidget {
  const _DialogHeaderIcon();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 46,
      height: 46,
      decoration: BoxDecoration(
        color: AppColors.secondaryColor(context).withValues(alpha: 0.22),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Center(
        child: SvgPicture.asset(
          Assets.assetsIconsUploadFiles,
          width: 24,
          height: 24,
          colorFilter: ColorFilter.mode(
            AppColors.primaryColor(context),
            BlendMode.srcIn,
          ),
        ),
      ),
    );
  }
}

class _ImageSourceOption extends StatelessWidget {
  const _ImageSourceOption({
    required this.title,
    required this.subTitle,
    required this.iconAsset,
    required this.iconColor,
    required this.backgroundColor,
    required this.onTap,
  });

  final String title;
  final String subTitle;
  final String iconAsset;
  final Color iconColor;
  final Color backgroundColor;
  final Future<void> Function() onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.textFeilColor(context),
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.borderColor(context)),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: backgroundColor,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: SvgPicture.asset(
                    iconAsset,
                    width: 24,
                    height: 24,
                    colorFilter: ColorFilter.mode(iconColor, BlendMode.srcIn),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyles.bold16.copyWith(
                        color: AppColors.textBoldColor(context),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subTitle,
                      style: TextStyles.regular14.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.arrow_forward_ios_rounded,
                size: 16,
                color: AppColors.textSecondaryColor(context),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
