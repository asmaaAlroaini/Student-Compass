import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/models/on_boarding_model.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';

abstract class OnBoardingRepo {
  Future<Either<Failure, List<OnBoardingModel>>> fetchOnBoardingItems(
    BuildContext context,
  );
}
