import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';

class CustomImageWidget extends StatelessWidget {
  final String? image;
  final double? height;
  final double? width;
  final BoxFit fit;
  final String? placeholder;
  const CustomImageWidget({
    super.key,
    required this.image,
    this.height,
    this.width,
    this.fit = BoxFit.cover,
    this.placeholder,
  });

  @override
  Widget build(BuildContext context) {
    final String imageUrl = (image ?? '').trim();
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    if (imageUrl.isEmpty) {
      return Image.asset(
        placeholder ??
            (isDark
                ? Assets.assetsImagesLightUserPlaseholder
                : Assets.assetsImagesLightUserPlaseholder),
        height: height,
        width: width,
        fit: BoxFit.cover,
      );
    }
    return CachedNetworkImage(
      placeholder:
          (context, url) => Image.asset(
            placeholder ??
                (isDark
                    ? Assets.assetsImagesLightUserPlaseholder
                    : Assets.assetsImagesLightUserPlaseholder),
            height: height,
            width: width,
            fit: BoxFit.cover,
          ),
      imageUrl: imageUrl,
      fit: fit,
      height: height,
      width: width,
      errorWidget:
          (c, o, s) => Image.asset(
            placeholder ??
                (isDark
                    ? Assets.assetsImagesLightUserPlaseholder
                    : Assets.assetsImagesLightUserPlaseholder),
            height: height,
            width: width,
            fit: BoxFit.cover,
          ),
    );
  }
}
