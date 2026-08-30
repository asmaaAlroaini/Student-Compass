import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/models/on_boarding_model.dart';
import 'package:student_compass_mobile/Features/OnBoarding/data/repos/on_boarding_repo.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/logic/on_boarding_cubit/on_boarding_state.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';

class OnBoardingCubit extends Cubit<OnBoardingState> {
  final OnBoardingRepo onBoardingRepo;
  final PageController pageController = PageController();

  List<OnBoardingModel> items = [];
  int currentPage = 0;

  OnBoardingCubit(this.onBoardingRepo) : super(const OnBoardingInitial());

  Future<void> fetchOnBoardingItems(BuildContext context) async {
    emit(const OnBoardingLoading());
    var result = await onBoardingRepo.fetchOnBoardingItems(context);
    result.fold(
      (failure) => emit(
        OnBoardingFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (data) {
        items = data;
        emit(OnBoardingSuccess(items: data));
      },
    );
  }

  void onPageChanged(int index) {
    currentPage = index;
    emit(OnBoardingPageChanged(index));
  }

  void nextPage() {
    if (currentPage < items.length - 1) {
      pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOutCubic,
      );
    } else {
      completeOnBoarding();
    }
  }

  void completeOnBoarding() {
    Prefs.setBool(AppConstants.kSeenOnBoarding, true);
    emit(const OnBoardingCompleted());
  }

  @override
  Future<void> close() {
    pageController.dispose();
    return super.close();
  }
}
