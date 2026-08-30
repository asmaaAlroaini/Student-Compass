import 'dart:io';

import 'package:dio/dio.dart';
import 'package:open_file/open_file.dart';
import 'package:path_provider/path_provider.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';

Future<void> downloadAnyFile({required String url}) async {
  final downloadUrl = _resolveDownloadUrl(url);
  final fileName = _fileNameFromUrl(downloadUrl);
  final file = await downloadFile(url: downloadUrl, fileName: fileName);
  if (file == null) return;

  await OpenFile.open(file.path);
}

Future<File?> downloadFile({
  required String url,
  required String fileName,
}) async {
  try {
    final path = await getApplicationDocumentsDirectory();
    final file = File('${path.path}/$fileName');

    final response = await Dio().get<List<int>>(
      url,
      options: Options(
        responseType: ResponseType.bytes,
        followRedirects: true,
        receiveTimeout: Duration(seconds: 60), // 60 ثانية
      ),
    );

    await file.writeAsBytes(response.data!);
    return file;
  } catch (e) {
    return null;
  }
}

String _resolveDownloadUrl(String url) {
  final trimmedUrl = url.trim();
  final uri = Uri.tryParse(trimmedUrl);

  if (uri == null) return trimmedUrl;

  if (!uri.hasScheme && trimmedUrl.startsWith('/')) {
    return Uri.parse(
      'http://${AppConstants.kIp}',
    ).replace(path: uri.path).toString();
  }

  final isLocalHost =
      uri.host == '127.0.0.1' ||
      uri.host == 'localhost' ||
      uri.host == '0.0.0.0';

  if (!isLocalHost) return trimmedUrl;

  final serverUri = Uri.parse('http://${AppConstants.kIp}');
  return uri
      .replace(
        scheme: serverUri.scheme,
        host: serverUri.host,
        port: serverUri.hasPort ? serverUri.port : null,
      )
      .toString();
}

String _fileNameFromUrl(String url) {
  final uri = Uri.tryParse(url);
  final fileName =
      uri == null || uri.pathSegments.isEmpty
          ? ''
          : uri.pathSegments.last.trim();

  if (fileName.isNotEmpty) return fileName;

  return 'downloaded_file_${DateTime.now().millisecondsSinceEpoch}';
}
