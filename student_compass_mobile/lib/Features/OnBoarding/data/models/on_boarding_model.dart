import 'package:flutter/material.dart';

class OnBoardingModel {
  final int id;
  final String image;
  final String title;
  final String subTitle;
  final String? badge;
  final Color? accentColor;

  const OnBoardingModel({
    required this.id,
    required this.image,
    required this.title,
    required this.subTitle,
    this.badge,
    this.accentColor,
  });

  factory OnBoardingModel.fromJson(Map<String, dynamic> json) {
    return OnBoardingModel(
      id: json['id'] as int? ?? 0,
      image: json['image'] as String? ?? '',
      title: json['title'] as String? ?? '',
      subTitle: json['sub_title'] as String? ?? '',
      badge: json['badge'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'image': image,
      'title': title,
      'sub_title': subTitle,
      if (badge != null) 'badge': badge,
    };
  }
}
