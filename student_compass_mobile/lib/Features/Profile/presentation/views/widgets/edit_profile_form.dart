import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/educational_options_model.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';
import 'package:student_compass_mobile/Features/Auth/data/repos/auth_repo.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/widgets/grade_level_selector_widget.dart';
import 'package:student_compass_mobile/Features/Auth/presentation/views/widgets/track_selector_widget.dart';
import 'package:student_compass_mobile/Features/Profile/data/models/update_profile_request_model.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/update_profile_cubit/update_profile_cubit.dart';
import 'package:student_compass_mobile/Features/Profile/presentation/logic/update_profile_cubit/update_profile_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/upload_image_controller.dart';
import 'package:student_compass_mobile/core/services/service_locator.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/widgets/cashed_networ_image.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';
import 'package:student_compass_mobile/core/widgets/custom_text_form_feild.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

class EditProfileForm extends StatefulWidget {
  final User user;

  const EditProfileForm({super.key, required this.user});

  @override
  State<EditProfileForm> createState() => _EditProfileFormState();
}

class _EditProfileFormState extends State<EditProfileForm> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _phoneController;

  AutovalidateMode _autovalidateMode = AutovalidateMode.disabled;
  String? _selectedGradeLevel;
  String? _selectedTrack;
  File? _selectedImageFile;

  // خيارات المراحل الدراسية والمسارات
  EducationalOptionsModel? _educationalOptions;
  bool _isLoadingOptions = true;

  @override
  void initState() {
    super.initState();
    final nameParts = widget.user.name.trim().split(' ');
    _firstNameController = TextEditingController(text: nameParts.first);
    _lastNameController = TextEditingController(
      text: nameParts.length > 1 ? nameParts.sublist(1).join(' ') : '',
    );
    _phoneController = TextEditingController(text: widget.user.phone);
    _selectedGradeLevel = widget.user.gradeLevel;
    _selectedTrack = widget.user.track;
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
    if (_educationalOptions == null || _selectedGradeLevel == null) {
      return ['علمي', 'أدبي', 'عام'];
    }
    final grade = _educationalOptions!.gradeLevels.firstWhere(
      (g) => g.id == _selectedGradeLevel,
      orElse: () => GradeLevelOption(id: '', name: '', tracks: []),
    );
    return grade.tracks.isNotEmpty ? grade.tracks : ['علمي', 'أدبي', 'عام'];
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _pickAvatar() async {
    final file = await UploadImageController().showImageSourceDialog(
      context,
      isStoreImage: false,
    );
    if (file != null) {
      setState(() {
        _selectedImageFile = file;
      });
    }
  }

  void _submitForm() {
    FocusScope.of(context).unfocus();

    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() {
        _autovalidateMode = AutovalidateMode.disabled;
      });

      final request = UpdateProfileRequestModel(
        firstName: _firstNameController.text.trim(),
        lastName: _lastNameController.text.trim(),
        phone: _phoneController.text.trim(),
        gradeLevel: _selectedGradeLevel,
        track: _selectedTrack,
        profileImage: _selectedImageFile,
      );

      context.read<UpdateProfileCubit>().updateProfile(request: request);
    } else {
      setState(() {
        _autovalidateMode = AutovalidateMode.always;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UpdateProfileCubit, UpdateProfileState>(
      builder: (context, state) {
        final isLoading = state is UpdateProfileLoading;

        return AbsorbPointer(
          absorbing: isLoading,
          child: Form(
            key: _formKey,
            autovalidateMode: _autovalidateMode,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.s16),
              child: Column(
                children: [
                  // Avatar Picker
                  GestureDetector(
                    onTap: _pickAvatar,
                    child: Stack(
                      children: [
                        Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            color: AppColors.primaryColor(
                              context,
                            ).withValues(alpha: 0.15),
                            shape: BoxShape.circle,
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(50),
                            child: _selectedImageFile != null
                                ? Image.file(
                                    _selectedImageFile!,
                                    width: 100,
                                    height: 100,
                                    fit: BoxFit.cover,
                                  )
                                : CustomImageWidget(
                                    image: widget.user.avatar,
                                    width: 100,
                                    height: 100,
                                    fit: BoxFit.cover,
                                  ),
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: AppColors.primaryColor(context),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                            child: const Icon(
                              Icons.camera_alt_rounded,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.s24),

                  // First Name Field
                  CustomTextFormFeild(
                    controller: _firstNameController,
                    hintText: S.of(context).FirstName,
                    keyboardType: TextInputType.name,
                    prefixIcon: const Icon(Icons.person_outline_rounded),
                  ),
                  const SizedBox(height: AppSpacing.s16),

                  // Last Name Field
                  CustomTextFormFeild(
                    controller: _lastNameController,
                    hintText: S.of(context).LastName,
                    keyboardType: TextInputType.name,
                    prefixIcon: const Icon(Icons.person_outline_rounded),
                  ),
                  const SizedBox(height: AppSpacing.s16),

                  // Phone Field
                  CustomTextFormFeild(
                    controller: _phoneController,
                    hintText: S.of(context).Phone,
                    keyboardType: TextInputType.phone,
                    prefixIcon: const Icon(Icons.phone_outlined),
                    validator: (val) => null,
                  ),
                  const SizedBox(height: AppSpacing.s16),

                  // Grade Level Selector
                  GradeLevelSelectorWidget(
                    selectedGradeLevel: _selectedGradeLevel,
                    gradeLevels: _educationalOptions?.gradeLevels ?? [],
                    isLoading: _isLoadingOptions,
                    onChanged: (val) {
                      setState(() {
                        _selectedGradeLevel = val;
                        _selectedTrack = null;
                      });
                    },
                  ),
                  const SizedBox(height: AppSpacing.s16),

                  // Track Selector
                  TrackSelectorWidget(
                    selectedTrack: _selectedTrack,
                    tracks: _availableTracks,
                    isLoading: _isLoadingOptions,
                    onChanged: (val) {
                      setState(() {
                        _selectedTrack = val;
                      });
                    },
                  ),
                  const SizedBox(height: AppSpacing.s28),

                  // Save Button / Loading Indicator
                  isLoading
                      ? const CustomLoadingIndicator()
                      : CustomButton(
                          title: S.of(context).Save,
                          onPressed: _submitForm,
                        ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
