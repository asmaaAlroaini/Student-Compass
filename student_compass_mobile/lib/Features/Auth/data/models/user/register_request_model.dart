import 'dart:io';

class RegisterRequestModel {
  final String firstName;
  final String lastName;
  final String userName;
  final String email;
  final String phone;
  final String gradeLevel;
  final String track;
  final String password;
  final String confirmPassword;
  final File? idCard;
  final File? image;

  const RegisterRequestModel({
    required this.firstName,
    required this.lastName,
    required this.userName,
    this.email = '',
    required this.phone,
    required this.gradeLevel,
    required this.track,
    required this.password,
    required this.confirmPassword,
    this.idCard,
    this.image,
  });

  Map<String, dynamic> toJson() {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'name': '$firstName $lastName'.trim(),
      'userName': userName,
      'email': email,
      'phone': phone,
      'grade_level': gradeLevel,
      'track': track,
      'password': password,
      'password_confirmation': confirmPassword,
      if (idCard != null) 'idCard': idCard,
      if (image != null) 'image': image,
    };
  }
}
