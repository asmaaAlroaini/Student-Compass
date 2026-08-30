import 'dart:io';

import 'package:dotted_border/dotted_border.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:student_compass_mobile/core/helper/upload_image_controller.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class UploadFile extends StatefulWidget {
  const UploadFile({
    super.key,
    required this.title,
    required this.subTitle,
    required this.isStoreImage,
    this.isRequired = true,
    this.onImageChanged,
    this.allowPdf = false,
    this.useLocalState = false,
    this.file,
  });
  final String title;
  final String subTitle;
  final bool isStoreImage;
  final bool isRequired;
  final ValueChanged<File?>? onImageChanged;
  final bool allowPdf;
  final bool useLocalState;
  final File? file;
  @override
  State<UploadFile> createState() => _UploadFileState();
}

class _UploadFileState extends State<UploadFile>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  File? _localFile;

  @override
  void initState() {
    super.initState();
    _localFile = widget.file;
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat();
  }

  @override
  void didUpdateWidget(covariant UploadFile oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.file != oldWidget.file) {
      _localFile = widget.file;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  bool _isPdf(File file) {
    return file.path.toLowerCase().endsWith('.pdf');
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<UploadImageController>(
      init: UploadImageController(),
      builder: (controller) {
        final image =
            widget.isStoreImage
                ? controller.storeImagePath
                : controller.imagePath;
        final currentFile = widget.useLocalState ? _localFile : image;

        return FormField<File?>(
          validator: (value) {
            if (widget.isRequired && currentFile == null) {
              return S.of(context).ImageIsRequired;
            }
            return null;
          },
          builder: (formState) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                DottedBorder(
                  color: AppColors.primaryColor(context),
                  strokeWidth: 2,
                  dashPattern: const [6, 6],
                  borderType: BorderType.RRect,
                  radius: const Radius.circular(12),
                  child:
                      currentFile != null
                          ? (_isPdf(currentFile)
                              ? SelectedPdf(
                                title: widget.title,
                                fileName:
                                    currentFile.path
                                        .split(Platform.isWindows ? '\\' : '/')
                                        .last,
                                onRemove: () {
                                  if (widget.useLocalState) {
                                    setState(() {
                                      _localFile = null;
                                    });
                                  } else {
                                    controller.removeImage(
                                      isStoreImage: widget.isStoreImage,
                                    );
                                  }
                                  formState.didChange(null);
                                  widget.onImageChanged?.call(null);
                                },
                              )
                              : OpenImage(
                                imagePath: currentFile,
                                onRemove: () {
                                  if (widget.useLocalState) {
                                    setState(() {
                                      _localFile = null;
                                    });
                                  } else {
                                    controller.removeImage(
                                      isStoreImage: widget.isStoreImage,
                                    );
                                  }
                                  formState.didChange(null);
                                  widget.onImageChanged?.call(null);
                                },
                              ))
                          : SelectImage(
                            title: widget.title,
                            subTitle: widget.subTitle,
                            onImageSelected: () async {
                              File? selectedFile;
                              selectedFile = await controller
                                  .showImageSourceDialog(
                                    context,
                                    isStoreImage: widget.isStoreImage,
                                    allowedExtensions:
                                        widget.allowPdf
                                            ? [
                                              'jpg',
                                              'png',
                                              'jpeg',
                                              'gif',
                                              'pdf',
                                            ]
                                            : ['jpg', 'png', 'jpeg', 'gif'],
                                  );

                              if (selectedFile != null) {
                                if (widget.useLocalState) {
                                  setState(() {
                                    _localFile = selectedFile;
                                  });
                                }
                                formState.didChange(selectedFile);
                                widget.onImageChanged?.call(selectedFile);
                              }
                            },
                          ),
                ),
                if (formState.hasError)
                  Padding(
                    padding: const EdgeInsets.only(top: 8, right: 12),
                    child: Text(
                      formState.errorText!,
                      style: TextStyles.semiBold14.copyWith(
                        color: AppColors.red().withValues(alpha: 0.8),
                      ),
                    ),
                  ),
              ],
            );
          },
        );
      },
    );
  }
}

class OpenImage extends StatelessWidget {
  const OpenImage({super.key, required this.imagePath, required this.onRemove});
  final File imagePath;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: AlignmentDirectional.topEnd,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.file(imagePath, width: double.infinity),
        ),
        Positioned(
          top: 10,
          right: 10,
          child: GestureDetector(
            onTap: onRemove,
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.red().withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.delete, color: AppColors.red(), size: 24),
            ),
          ),
        ),
      ],
    );
  }
}

class SelectImage extends StatelessWidget {
  const SelectImage({
    super.key,
    required this.title,
    required this.subTitle,
    required this.onImageSelected,
  });
  final String title;
  final String subTitle;
  final Future<void> Function() onImageSelected;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onImageSelected,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: AppColors.textFeilColor(context),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SvgPicture.asset(
              Assets.assetsIconsUploadFiles,
              width: 35,
              colorFilter: ColorFilter.mode(
                AppColors.textRedColor(context),
                BlendMode.srcIn,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              style: TextStyles.bold16.copyWith(color: Color(0xff525252)),
            ),
            const SizedBox(height: 5),
            Text(
              subTitle,
              style: TextStyles.bold14.copyWith(color: Color(0xffA3A3A3)),
            ),
          ],
        ),
      ),
    );
  }
}

class SelectedPdf extends StatelessWidget {
  const SelectedPdf({
    super.key,
    required this.title,
    required this.fileName,
    required this.onRemove,
  });
  final String title;
  final String fileName;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: AppColors.textFeilColor(context),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.customGreen().withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.check, color: AppColors.customGreen(), size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyles.bold16.copyWith(
                    color: const Color(0xff525252),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  fileName,
                  style: TextStyles.bold14.copyWith(
                    color: AppColors.customGreen(),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: onRemove,
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.red().withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.delete, color: AppColors.red(), size: 24),
            ),
          ),
        ],
      ),
    );
  }
}
