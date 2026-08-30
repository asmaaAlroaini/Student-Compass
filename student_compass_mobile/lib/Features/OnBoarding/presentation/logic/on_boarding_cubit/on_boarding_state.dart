import 'package:student_compass_mobile/Features/OnBoarding/data/models/on_boarding_model.dart';

abstract class OnBoardingState {
  const OnBoardingState();
}

class OnBoardingInitial extends OnBoardingState {
  const OnBoardingInitial();
}

class OnBoardingLoading extends OnBoardingState {
  const OnBoardingLoading();
}

class OnBoardingSuccess extends OnBoardingState {
  final List<OnBoardingModel> items;
  const OnBoardingSuccess({required this.items});
}

class OnBoardingFailure extends OnBoardingState {
  final String errorMessage;
  final String? errorKey;

  const OnBoardingFailure({
    required this.errorMessage,
    this.errorKey,
  });
}

class OnBoardingPageChanged extends OnBoardingState {
  final int pageIndex;
  const OnBoardingPageChanged(this.pageIndex);
}

class OnBoardingCompleted extends OnBoardingState {
  const OnBoardingCompleted();
}
