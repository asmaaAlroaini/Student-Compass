import 'dart:io';

class UpdateProfileRequestModel {
  final String firstName;
  final String lastName;
  final String phone;
  final String? gradeLevel;
  final String? track;
  final File? profileImage;

  const UpdateProfileRequestModel({
    required this.firstName,
    required this.lastName,
    required this.phone,
    this.gradeLevel,
    this.track,
    this.profileImage,
  });

  Map<String, dynamic> toJson() => {
        'first_name': firstName,
        'last_name': lastName,
        'phone': phone,
        if (gradeLevel != null) 'grade_level': gradeLevel,
        if (track != null) 'track': track,
        if (profileImage != null) 'image': profileImage,
      };
}
