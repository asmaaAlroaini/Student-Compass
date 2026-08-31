import 'dart:developer';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:open_file/open_file.dart';
import 'package:path_provider/path_provider.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';

class FileDownloader {
  static Future<void> downloadAndOpenPdf({
    required BuildContext context,
    required String? pdfPath,
    required String fileName,
  }) async {
    if (pdfPath == null || pdfPath.trim().isEmpty) {
      customToastBar(
        context: context,
        message: 'لا يوجد ملف PDF مرفق لهذا الدرس حالياً.',
        backgroundColor: AppColors.red(),
        icon: Icons.info_outline,
        textColor: Colors.white,
      );
      return;
    }

    try {
      // 1. Build full URL
      String url;
      if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) {
        url = pdfPath;
      } else {
        final base = AppConstants.kBaseUrl.replaceAll('/api/v1', '');
        var cleanPath = pdfPath.replaceAll('\\', '/');
        if (cleanPath.startsWith('/')) {
          cleanPath = cleanPath.substring(1);
        }
        if (!cleanPath.startsWith('storage/')) {
          url = '$base/storage/$cleanPath';
        } else {
          url = '$base/$cleanPath';
        }
      }

      log('Downloading PDF from: $url');

      customToastBar(
        context: context,
        message: 'جاري تحميل ملف الـ PDF...',
        backgroundColor: AppColors.primaryColor(context),
        icon: Icons.downloading_rounded,
        textColor: Colors.white,
      );

      // 2. Local save path
      final dir = await getApplicationDocumentsDirectory();
      final sanitizedFileName = fileName
          .replaceAll(RegExp(r'[^\w\s\u0600-\u06FF.-]'), '_')
          .trim();
      final savePath = '${dir.path}/$sanitizedFileName.pdf';

      final dio = Dio();
      final response = await dio.download(
        url,
        savePath,
        options: Options(
          responseType: ResponseType.bytes,
          followRedirects: true,
          validateStatus: (status) => status != null && status < 400,
        ),
      );

      if (response.statusCode == 200) {
        final result = await OpenFile.open(savePath);
        if (result.type != ResultType.done && context.mounted) {
          customToastBar(
            context: context,
            message: 'تم حفظ الملف بنجاح في المستندات 📄',
            backgroundColor: AppColors.customGreen(),
            icon: Icons.check_circle_rounded,
            textColor: Colors.white,
          );
        }
      } else {
        if (context.mounted) {
          customToastBar(
            context: context,
            message: 'تعذر تحميل الملف من الخادم (رمز الخطأ: ${response.statusCode})',
            backgroundColor: AppColors.red(),
            icon: Icons.error_outline,
            textColor: Colors.white,
          );
        }
      }
    } on DioException catch (e) {
      log('Download DioException: $e');
      if (context.mounted) {
        if (e.response?.statusCode == 404) {
          customToastBar(
            context: context,
            message: 'ملف الـ PDF غير موجود على الخادم (404).',
            backgroundColor: AppColors.red(),
            icon: Icons.warning_amber_rounded,
            textColor: Colors.white,
          );
        } else {
          customToastBar(
            context: context,
            message: 'فشل في تحميل الملف: ${e.message ?? "خطأ في الشبكة"}',
            backgroundColor: AppColors.red(),
            icon: Icons.error_outline,
            textColor: Colors.white,
          );
        }
      }
    } catch (e) {
      log('Download error: $e');
      if (context.mounted) {
        customToastBar(
          context: context,
          message: 'حدث خطأ أثناء فتح الملف: $e',
          backgroundColor: AppColors.red(),
          icon: Icons.error_outline,
          textColor: Colors.white,
        );
      }
    }
  }
}
