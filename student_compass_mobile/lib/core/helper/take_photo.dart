import 'dart:io';

import 'package:image_picker/image_picker.dart';

Future<File?> takePhoto() async {
  File image;
  final imagePicker = ImagePicker();

  var pickedImage = await imagePicker.pickImage(source: ImageSource.camera);

  if (pickedImage == null) {
    return null;
  } else {
    image = File(pickedImage.path);
    print('Image selected: $image');
  }
  return image;
}
