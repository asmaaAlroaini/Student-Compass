import 'package:file_picker/file_picker.dart';

Future<String?> pickFile({
  required List<String> allowedExtensions,
  bool allowMultiple = false,
}) async {
  final result = await FilePicker.platform.pickFiles(
    type: FileType.custom,
    allowedExtensions: allowedExtensions,
    allowMultiple: allowMultiple,
  );
  if (result != null) {
    final file = result.files.first;
    return file.path;
  }
  return null;
}
