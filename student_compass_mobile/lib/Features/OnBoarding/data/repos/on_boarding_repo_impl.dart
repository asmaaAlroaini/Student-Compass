import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/models/on_boarding_model.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/repos/on_boarding_repo.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class OnBoardingRepoImpl implements OnBoardingRepo {
  @override
  Future<Either<Failure, List<OnBoardingModel>>> fetchOnBoardingItems(
    BuildContext context,
  ) async {
    try {
      final items = [
        OnBoardingModel(
          id: 1,
          image: Assets.assetsIconsOnBoarding1,
          title: S.of(context).OnBoarding1Title,
          subTitle: S.of(context).OnBoarding1SubTitle,
          badge: S.of(context).OnBoarding1Badge,
          accentColor: AppColors.primaryColor(context),
        ),
        OnBoardingModel(
          id: 2,
          image: Assets.assetsIconsOnBoarding2,
          title: S.of(context).OnBoarding2Title,
          subTitle: S.of(context).OnBoarding2SubTitle,
          badge: S.of(context).OnBoarding2Badge,
          accentColor: AppColors.secondaryColor(context),
        ),
        OnBoardingModel(
          id: 3,
          image: Assets.assetsIconsOnBoarding3,
          title: S.of(context).OnBoarding3Title,
          subTitle: S.of(context).OnBoarding3SubTitle,
          badge: S.of(context).OnBoarding3Badge,
          accentColor: AppColors.customOrange(context),
        ),
      ];
      return Right(items);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
