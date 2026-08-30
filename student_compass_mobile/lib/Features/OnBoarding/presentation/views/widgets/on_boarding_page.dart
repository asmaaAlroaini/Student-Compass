import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/models/on_boarding_model.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/views/widgets/on_boarding_page_item.dart';

class OnBoardingPage extends StatelessWidget {
  const OnBoardingPage({super.key, required this.page, required this.image});

  final OnBoardingModel page;
  final String image;

  @override
  Widget build(BuildContext context) {
    return OnBoardingPageItem(item: page, image: image);
  }
}
