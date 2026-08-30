import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/logout_cubit/logout_cubit.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/logout_cubit/logout_state.dart';
import 'package:student_compass_mobile/Features/DashBoard/presentation/views/widgets/custom_nav_bar.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/exams_cubit/exams_cubit.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/views/exams_view.dart';
import 'package:student_compass_mobile/Features/Home/presentation/views/home_view.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/profile_cubit/profile_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/views/profile_view.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/views/subjects_view.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/services/service_locator.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/widgets/sign_out_confirmation_dialog_widget.dart';

class DashBoard extends StatefulWidget {
  const DashBoard({super.key, this.initialPage = 0});

  final int initialPage;

  @override
  State<DashBoard> createState() => _HomeBaseState();
}

class _HomeBaseState extends State<DashBoard> {
  late final PageController _pageController;
  late final List<Widget> _screens;
  int _pageIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    _pageIndex = widget.initialPage.clamp(0, 3).toInt();
    _pageController = PageController(initialPage: _pageIndex);
    _screens = [
      const HomeView(),
      BlocProvider(
        create: (context) => getIt<SubjectsCubit>(),
        child: const SubjectsView(),
      ),
      BlocProvider(
        create: (context) => getIt<ExamsCubit>(),
        child: const ExamsView(),
      ),
      BlocProvider(
        create: (context) => getIt<ProfileCubit>(),
        child: const ProfileView(),
      ),
    ];
  }

  @override
  void didUpdateWidget(covariant DashBoard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialPage != widget.initialPage) {
      final nextPage = widget.initialPage.clamp(0, 3).toInt();

      if (nextPage != _pageIndex) {
        _pageIndex = nextPage;
        if (_pageController.hasClients) {
          _pageController.jumpToPage(nextPage);
        }
      }
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LogoutCubit, LogoutState>(
      listener: (context, state) {
        if (state is LogoutSuccess) {
          customToastBar(
            context: context,
            message: 'تم تسجيل الخروج بنجاح',
            backgroundColor: AppColors.customGreen(),
            icon: Icons.check,
            textColor: AppColors.white(),
          );
          Prefs.setBool(AppConstants.kIsLogedIn, false);
          Prefs.removeUser(AppConstants.kCurrentUser);
          context.go(RouteNames.login);
        }
      },
      child: PopScope(
        canPop: false,
        onPopInvokedWithResult: (didPop, result) async {
          if (didPop) {
            return;
          }
          final NavigatorState navigator = Navigator.of(context);
          if (navigator.canPop()) {
            navigator.pop(result);
          } else {
            if (_pageIndex != 0) {
              setPage(0);
            } else {
              showCupertinoModalPopup(
                context: context,
                builder: (_) => SignOutConfirmationDialogWidget(
                  onConfirm: () {
                    context.read<LogoutCubit>().logout();
                  },
                ),
              );
            }
          }
        },
        child: Scaffold(
          key: _scaffoldKey,
          body: PageView.builder(
            controller: _pageController,
            itemCount: _screens.length,
            physics: const NeverScrollableScrollPhysics(),
            itemBuilder: (context, index) {
              return _screens[index];
            },
          ),
          bottomNavigationBar: CustomNavBar(
            pageIndex: _pageIndex,
            onTap: setPage,
          ),
        ),
      ),
    );
  }

  void setPage(int pageIndex) {
    setState(() {
      _pageController.jumpToPage(pageIndex);
      _pageIndex = pageIndex;
    });
  }
}
