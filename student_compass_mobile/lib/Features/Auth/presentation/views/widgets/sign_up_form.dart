import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/educational_options_model.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/register_cubit/register_cubit.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/logic/register_cubit/register_state.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/widgets/grade_level_selector_widget.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/widgets/track_selector_widget.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/services/service_locator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_images.dart';
import 'package:student_compass_mobile/core/widgets/build_svg_icon.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';
import 'package:student_compass_mobile/core/widgets/custom_text_form_feild.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class SignUpForm extends StatefulWidget {
  const SignUpForm({super.key});

  @override
  State<SignUpForm> createState() => _SignUpFormState();
}

class _SignUpFormState extends State<SignUpForm> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  String? selectedGradeLevel;
  String? selectedTrack;
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();
  AutovalidateMode autovalidateMode = AutovalidateMode.disabled;

  // بيانات المراحل الدراسية والمسارات
  EducationalOptionsModel? _educationalOptions;
  bool _isLoadingOptions = true;

  @override
  void initState() {
    super.initState();
    _fetchEducationalOptions();
  }

  Future<void> _fetchEducationalOptions() async {
    final authRepo = getIt<AuthRepo>();
    final result = await authRepo.getEducationalOptions();
    result.fold(
      (failure) {
        if (!mounted) return;
        setState(() {
          _educationalOptions = EducationalOptionsModel.defaultOptions();
          _isLoadingOptions = false;
        });
      },
      (options) {
        if (!mounted) return;
        setState(() {
          _educationalOptions = options;
          _isLoadingOptions = false;
        });
      },
    );
  }

  /// الحصول على مسارات الصف المختار فقط
  List<String> get _availableTracks {
    if (_educationalOptions == null || selectedGradeLevel == null) return [];
    final grade = _educationalOptions!.gradeLevels.firstWhere(
      (g) => g.id == selectedGradeLevel,
      orElse: () => GradeLevelOption(id: '', name: '', tracks: []),
    );
    return grade.tracks;
  }

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<RegisterCubit, RegisterState>(
      listener: (context, state) {
        if (state is RegisterSuccess) {
          customToastBar(
            context: context,
            message: state.message,
            backgroundColor: AppColors.customGreen(),
            icon: Icons.check,
            textColor: AppColors.white(),
          );
          context.go(RouteNames.login);
        } else if (state is RegisterFailure) {
          customToastBar(
            context: context,
            message: Failure.localizedMessage(
              context,
              errorMessage: state.errorMessage,
              errorKey: state.errorKey,
            ),
            backgroundColor: AppColors.red(),
            icon: Icons.close,
            textColor: AppColors.white(),
          );
        }
      },
      builder: (BuildContext context, RegisterState state) => AbsorbPointer(
        absorbing: state is RegisterLoading,
        child: Form(
          key: formKey,
          autovalidateMode: autovalidateMode,
          child: Column(
            spacing: AppSpacing.s16,
            children: [
              // الاسم الكامل (مطلوب)
              CustomTextFormFeild(
                controller: nameController,
                hintText: S.of(context).FirstName,
                keyboardType: TextInputType.name,
                prefixIcon: buildSvgIcon(context, Assets.assetsIconsUser),
                validator: (value) {
                  final text = value?.trim() ?? '';
                  if (text.isEmpty) {
                    return S.of(context).FieldIsRequired;
                  }
                  return null;
                },
              ),

              // البريد الإلكتروني (مطلوب)
              CustomTextFormFeild(
                controller: emailController,
                hintText: S.of(context).Email,
                keyboardType: TextInputType.emailAddress,
                prefixIcon: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: Icon(
                    Icons.email_outlined,
                    color: AppColors.textSecondaryColor(context),
                    size: 26,
                  ),
                ),
                validator: (value) {
                  final text = value?.trim() ?? '';
                  if (text.isEmpty) return S.of(context).FieldIsRequired;
                  final emailRegex = RegExp(
                    r'^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$',
                  );
                  if (!emailRegex.hasMatch(text)) {
                    return 'البريد الإلكتروني غير صحيح';
                  }
                  return null;
                },
              ),

              // رقم الهاتف (اختياري)
              CustomTextFormFeild(
                controller: phoneController,
                hintText: S.of(context).PhoneNumber,
                keyboardType: TextInputType.phone,
                prefixIcon: buildSvgIcon(context, Assets.assetsIconsPhone),
                validator: (value) => null, // اختياري
              ),

              // المرحلة الدراسية (مطلوبة)
              GradeLevelSelectorWidget(
                selectedGradeLevel: selectedGradeLevel,
                gradeLevels: _educationalOptions?.gradeLevels ?? [],
                isLoading: _isLoadingOptions,
                onChanged: (val) {
                  setState(() {
                    selectedGradeLevel = val;
                    // إعادة تعيين المسار إذا تغير الصف
                    selectedTrack = null;
                  });
                },
              ),

              // المسار (يظهر فقط إذا اختار المرحلة الدراسية)
              if (selectedGradeLevel != null || _isLoadingOptions)
                TrackSelectorWidget(
                  selectedTrack: selectedTrack,
                  tracks: _availableTracks,
                  isLoading: _isLoadingOptions,
                  onChanged: (val) {
                    setState(() {
                      selectedTrack = val;
                    });
                  },
                ),

              // كلمة المرور (مطلوب - 8 أحرف على الأقل)
              CustomTextFormFeild(
                prefixIcon: buildSvgIcon(context, Assets.assetsIconsLock),
                controller: passwordController,
                isPassword: true,
                hintText: S.of(context).Password,
                keyboardType: TextInputType.visiblePassword,
                validator: (value) {
                  final text = value ?? '';
                  if (text.isEmpty) return S.of(context).FieldIsRequired;
                  if (text.length < 8) return S.of(context).PasswordMinLength;
                  return null;
                },
              ),

              // تأكيد كلمة المرور (مطلوب)
              CustomTextFormFeild(
                prefixIcon: buildSvgIcon(context, Assets.assetsIconsLock),
                controller: confirmPasswordController,
                isPassword: true,
                hintText: S.of(context).ConfirmPassword,
                keyboardType: TextInputType.visiblePassword,
                type: 'confirm',
                passwordController: passwordController,
                validator: (value) {
                  final text = value ?? '';
                  if (text.isEmpty) {
                    return S.of(context).FieldIsRequired;
                  }
                  if (text != passwordController.text) {
                    return S.of(context).PasswordNotMatch;
                  }
                  return null;
                },
              ),

              state is RegisterLoading
                  ? const CustomLoadingIndicator()
                  : CustomButton(
                      title: S.of(context).SignUp,
                      onPressed: signUpMethod,
                    ),
            ],
          ),
        ),
      ),
    );
  }

  void signUpMethod() {
    FocusScope.of(context).unfocus();
    if (formKey.currentState!.validate()) {
      formKey.currentState!.save();
      setState(() {
        autovalidateMode = AutovalidateMode.disabled;
      });
      BlocProvider.of<RegisterCubit>(context).register(
        name: nameController.text.trim(),
        email: emailController.text.trim(),
        password: passwordController.text,
        passwordConfirmation: confirmPasswordController.text,
        gradeLevel: selectedGradeLevel,
        track: selectedTrack,
        phone: phoneController.text.trim().isEmpty
            ? null
            : phoneController.text.trim(),
      );
    } else {
      setState(() {
        autovalidateMode = AutovalidateMode.always;
      });
    }
  }
}
