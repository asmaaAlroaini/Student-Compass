import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/logic/on_boarding_cubit/on_boarding_cubit.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/logic/on_boarding_cubit/on_boarding_state.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/views/widgets/on_boarding_navigation_bar.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/views/widgets/on_boarding_page_indicator.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/views/widgets/on_boarding_page_item.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';
import 'package:student_compass_mobile/core/widgets/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/widgets/gradient_background.dart';

class OnBoardingViewBody extends StatefulWidget {
  const OnBoardingViewBody({super.key});

  @override
  State<OnBoardingViewBody> createState() => _OnBoardingViewBodyState();
}

class _OnBoardingViewBodyState extends State<OnBoardingViewBody> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OnBoardingCubit>().fetchOnBoardingItems(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    final images = [
      Assets.assetsIconsOnBoarding1,
      Assets.assetsIconsOnBoarding2,
      Assets.assetsIconsOnBoarding3,
    ];
    return GradientBackground(
      child: SafeArea(
        child: BlocBuilder<OnBoardingCubit, OnBoardingState>(
          builder: (context, state) {
            final cubit = context.read<OnBoardingCubit>();
            final items = cubit.items;

            if (state is OnBoardingLoading && items.isEmpty) {
              return const CustomLoadingIndicator();
            }

            if (items.isEmpty) {
              return const SizedBox.shrink();
            }

            return Column(
              children: [
                Expanded(
                  child: PageView.builder(
                    controller: cubit.pageController,
                    itemCount: items.length,
                    onPageChanged: cubit.onPageChanged,
                    itemBuilder: (context, index) {
                      return OnBoardingPageItem(
                        item: items[index],
                        image: images[index],
                      );
                    },
                  ),
                ),
                const SizedBox(height: AppSpacing.s16),
                OnBoardingPageIndicator(
                  currentPage: cubit.currentPage,
                  pageCount: items.length,
                ),
                const SizedBox(height: AppSpacing.s16),
                OnBoardingNavigationBar(
                  currentPage: cubit.currentPage,
                  pageCount: items.length,
                  onNext: cubit.nextPage,
                  onSkip: cubit.completeOnBoarding,
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
