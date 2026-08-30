import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/logic/on_boarding_cubit/on_boarding_cubit.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/logic/on_boarding_cubit/on_boarding_state.dart';
import 'package:student_compass_mobile/Features/OnBoarding/presentation/views/widgets/on_boarding_view_body.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/services/service_locator.dart';

class OnBoardingView extends StatelessWidget {
  const OnBoardingView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<OnBoardingCubit>(),
      child: BlocListener<OnBoardingCubit, OnBoardingState>(
        listener: (context, state) {
          if (state is OnBoardingCompleted) {
            context.go(RouteNames.login);
          }
        },
        child: const Scaffold(
          body: OnBoardingViewBody(),
        ),
      ),
    );
  }
}
