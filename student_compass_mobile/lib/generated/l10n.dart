// GENERATED CODE - DO NOT MODIFY BY HAND
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'intl/messages_all.dart';

// **************************************************************************
// Generator: Flutter Intl IDE plugin
// Made by Localizely
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, lines_longer_than_80_chars
// ignore_for_file: join_return_with_assignment, prefer_final_in_for_each
// ignore_for_file: avoid_redundant_argument_values, avoid_escaping_inner_quotes

class S {
  S();

  static S? _current;

  static S get current {
    assert(
      _current != null,
      'No instance of S was loaded. Try to initialize the S delegate before accessing S.current.',
    );
    return _current!;
  }

  static const AppLocalizationDelegate delegate = AppLocalizationDelegate();

  static Future<S> load(Locale locale) {
    final name = (locale.countryCode?.isEmpty ?? false)
        ? locale.languageCode
        : locale.toString();
    final localeName = Intl.canonicalizedLocale(name);
    return initializeMessages(localeName).then((_) {
      Intl.defaultLocale = localeName;
      final instance = S();
      S._current = instance;

      return instance;
    });
  }

  static S of(BuildContext context) {
    final instance = S.maybeOf(context);
    assert(
      instance != null,
      'No instance of S present in the widget tree. Did you add S.delegate in localizationsDelegates?',
    );
    return instance!;
  }

  static S? maybeOf(BuildContext context) {
    return Localizations.of<S>(context, S);
  }

  /// `Connection timeout with server`
  String get ConnectionTimeout {
    return Intl.message(
      'Connection timeout with server',
      name: 'ConnectionTimeout',
      desc: '',
      args: [],
    );
  }

  /// `Send timeout in connection with server`
  String get SendTimeout {
    return Intl.message(
      'Send timeout in connection with server',
      name: 'SendTimeout',
      desc: '',
      args: [],
    );
  }

  /// `Receive timeout in connection with server`
  String get ReceiveTimeout {
    return Intl.message(
      'Receive timeout in connection with server',
      name: 'ReceiveTimeout',
      desc: '',
      args: [],
    );
  }

  /// `Incorrect or unverified security certificate`
  String get BadCertificate {
    return Intl.message(
      'Incorrect or unverified security certificate',
      name: 'BadCertificate',
      desc: '',
      args: [],
    );
  }

  /// `Request to server was canceled`
  String get RequestCanceled {
    return Intl.message(
      'Request to server was canceled',
      name: 'RequestCanceled',
      desc: '',
      args: [],
    );
  }

  /// `No internet connection available`
  String get NoInternetConnection {
    return Intl.message(
      'No internet connection available',
      name: 'NoInternetConnection',
      desc: '',
      args: [],
    );
  }

  /// `An unknown error occurred, please try again`
  String get UnknownError {
    return Intl.message(
      'An unknown error occurred, please try again',
      name: 'UnknownError',
      desc: '',
      args: [],
    );
  }

  /// `Unauthorized request, please login again`
  String get UnauthorizedRequest {
    return Intl.message(
      'Unauthorized request, please login again',
      name: 'UnauthorizedRequest',
      desc: '',
      args: [],
    );
  }

  /// `Requested resource or page not found`
  String get MethodNotFound {
    return Intl.message(
      'Requested resource or page not found',
      name: 'MethodNotFound',
      desc: '',
      args: [],
    );
  }

  /// `Internal server error, please try again later`
  String get InternalServerError {
    return Intl.message(
      'Internal server error, please try again later',
      name: 'InternalServerError',
      desc: '',
      args: [],
    );
  }

  /// `Oops! Something went wrong, please try again`
  String get OopsError {
    return Intl.message(
      'Oops! Something went wrong, please try again',
      name: 'OopsError',
      desc: '',
      args: [],
    );
  }

  /// `Loading...`
  String get Loading {
    return Intl.message('Loading...', name: 'Loading', desc: '', args: []);
  }

  /// `Skip`
  String get Skip {
    return Intl.message('Skip', name: 'Skip', desc: '', args: []);
  }

  /// `Start Now`
  String get StartNow {
    return Intl.message('Start Now', name: 'StartNow', desc: '', args: []);
  }

  /// `Welcome to Student Compass`
  String get OnBoarding1Title {
    return Intl.message(
      'Welcome to Student Compass',
      name: 'OnBoarding1Title',
      desc: '',
      args: [],
    );
  }

  /// `Your easiest way to organize your study and track your academic progress smartly.`
  String get OnBoarding1SubTitle {
    return Intl.message(
      'Your easiest way to organize your study and track your academic progress smartly.',
      name: 'OnBoarding1SubTitle',
      desc: '',
      args: [],
    );
  }

  /// `Smart Learning Path`
  String get OnBoarding1Badge {
    return Intl.message(
      'Smart Learning Path',
      name: 'OnBoarding1Badge',
      desc: '',
      args: [],
    );
  }

  /// `Exams & Comprehensive Question Banks`
  String get OnBoarding2Title {
    return Intl.message(
      'Exams & Comprehensive Question Banks',
      name: 'OnBoarding2Title',
      desc: '',
      args: [],
    );
  }

  /// `Test your knowledge, solve question banks, and review your mistakes to excel.`
  String get OnBoarding2SubTitle {
    return Intl.message(
      'Test your knowledge, solve question banks, and review your mistakes to excel.',
      name: 'OnBoarding2SubTitle',
      desc: '',
      args: [],
    );
  }

  /// `Complete Question Bank`
  String get OnBoarding2Badge {
    return Intl.message(
      'Complete Question Bank',
      name: 'OnBoarding2Badge',
      desc: '',
      args: [],
    );
  }

  /// `Competitions & Study Challenges`
  String get OnBoarding3Title {
    return Intl.message(
      'Competitions & Study Challenges',
      name: 'OnBoarding3Title',
      desc: '',
      args: [],
    );
  }

  /// `Participate in academic competitions, compete with peers, and top the leaderboard.`
  String get OnBoarding3SubTitle {
    return Intl.message(
      'Participate in academic competitions, compete with peers, and top the leaderboard.',
      name: 'OnBoarding3SubTitle',
      desc: '',
      args: [],
    );
  }

  /// `Challenges & Leaderboard`
  String get OnBoarding3Badge {
    return Intl.message(
      'Challenges & Leaderboard',
      name: 'OnBoarding3Badge',
      desc: '',
      args: [],
    );
  }

  /// `Next`
  String get Next {
    return Intl.message('Next', name: 'Next', desc: '', args: []);
  }

  /// `Previous`
  String get Previous {
    return Intl.message('Previous', name: 'Previous', desc: '', args: []);
  }

  /// `Welcome Back!`
  String get WelcomeBack {
    return Intl.message(
      'Welcome Back!',
      name: 'WelcomeBack',
      desc: '',
      args: [],
    );
  }

  /// `Login`
  String get Login {
    return Intl.message('Login', name: 'Login', desc: '', args: []);
  }

  /// `Log in to continue your lessons and study plan`
  String get LoginToManageProducts {
    return Intl.message(
      'Log in to continue your lessons and study plan',
      name: 'LoginToManageProducts',
      desc: '',
      args: [],
    );
  }

  /// `Successfully logged in`
  String get LoginSuccess {
    return Intl.message(
      'Successfully logged in',
      name: 'LoginSuccess',
      desc: '',
      args: [],
    );
  }

  /// `Continue as Guest`
  String get LoginAsGuest {
    return Intl.message(
      'Continue as Guest',
      name: 'LoginAsGuest',
      desc: '',
      args: [],
    );
  }

  /// `Don't have an account?`
  String get DontHaveAccount {
    return Intl.message(
      'Don\'t have an account?',
      name: 'DontHaveAccount',
      desc: '',
      args: [],
    );
  }

  /// `Already have an account?`
  String get AlreadyHaveAccount {
    return Intl.message(
      'Already have an account?',
      name: 'AlreadyHaveAccount',
      desc: '',
      args: [],
    );
  }

  /// `Forgot password?`
  String get ForgotPassword {
    return Intl.message(
      'Forgot password?',
      name: 'ForgotPassword',
      desc: '',
      args: [],
    );
  }

  /// `Sign Up`
  String get SignUp {
    return Intl.message('Sign Up', name: 'SignUp', desc: '', args: []);
  }

  /// `Create your account now and start your journey with Student Compass`
  String get SignUpToManageProducts {
    return Intl.message(
      'Create your account now and start your journey with Student Compass',
      name: 'SignUpToManageProducts',
      desc: '',
      args: [],
    );
  }

  /// `New`
  String get New {
    return Intl.message('New', name: 'New', desc: '', args: []);
  }

  /// `First Name`
  String get FirstName {
    return Intl.message('First Name', name: 'FirstName', desc: '', args: []);
  }

  /// `Last Name`
  String get LastName {
    return Intl.message('Last Name', name: 'LastName', desc: '', args: []);
  }

  /// `Username`
  String get UserName {
    return Intl.message('Username', name: 'UserName', desc: '', args: []);
  }

  /// `Phone Number`
  String get PhoneNumber {
    return Intl.message(
      'Phone Number',
      name: 'PhoneNumber',
      desc: '',
      args: [],
    );
  }

  /// `Password`
  String get Password {
    return Intl.message('Password', name: 'Password', desc: '', args: []);
  }

  /// `Confirm Password`
  String get ConfirmPassword {
    return Intl.message(
      'Confirm Password',
      name: 'ConfirmPassword',
      desc: '',
      args: [],
    );
  }

  /// `ID Card / Student ID`
  String get IdCard {
    return Intl.message(
      'ID Card / Student ID',
      name: 'IdCard',
      desc: '',
      args: [],
    );
  }

  /// `Profile Picture`
  String get ProfileImage {
    return Intl.message(
      'Profile Picture',
      name: 'ProfileImage',
      desc: '',
      args: [],
    );
  }

  /// `Profile picture is required`
  String get ImageIsRequired {
    return Intl.message(
      'Profile picture is required',
      name: 'ImageIsRequired',
      desc: '',
      args: [],
    );
  }

  /// `Remember Me`
  String get RememberMe {
    return Intl.message('Remember Me', name: 'RememberMe', desc: '', args: []);
  }

  /// `Password must be at least 8 characters`
  String get PasswordMinLength {
    return Intl.message(
      'Password must be at least 8 characters',
      name: 'PasswordMinLength',
      desc: '',
      args: [],
    );
  }

  /// `Password confirmation does not match.`
  String get PasswordNotMatch {
    return Intl.message(
      'Password confirmation does not match.',
      name: 'PasswordNotMatch',
      desc: '',
      args: [],
    );
  }

  /// `This field is required`
  String get FieldIsRequired {
    return Intl.message(
      'This field is required',
      name: 'FieldIsRequired',
      desc: '',
      args: [],
    );
  }

  /// `Logout`
  String get Logout {
    return Intl.message('Logout', name: 'Logout', desc: '', args: []);
  }

  /// `Cancel`
  String get Cancel {
    return Intl.message('Cancel', name: 'Cancel', desc: '', args: []);
  }

  /// `Photo Gallery`
  String get ImageSourceTitle {
    return Intl.message(
      'Photo Gallery',
      name: 'ImageSourceTitle',
      desc: '',
      args: [],
    );
  }

  /// `Select an image from device gallery`
  String get ImageSourceSubTitle {
    return Intl.message(
      'Select an image from device gallery',
      name: 'ImageSourceSubTitle',
      desc: '',
      args: [],
    );
  }

  /// `Camera`
  String get Camera {
    return Intl.message('Camera', name: 'Camera', desc: '', args: []);
  }

  /// `Take a photo directly using camera`
  String get CameraSubTitle {
    return Intl.message(
      'Take a photo directly using camera',
      name: 'CameraSubTitle',
      desc: '',
      args: [],
    );
  }

  /// `Upload File`
  String get UploadFile {
    return Intl.message('Upload File', name: 'UploadFile', desc: '', args: []);
  }

  /// `Click here to upload the required file or photo`
  String get UploadFileSubTitle {
    return Intl.message(
      'Click here to upload the required file or photo',
      name: 'UploadFileSubTitle',
      desc: '',
      args: [],
    );
  }

  /// `Grade Level`
  String get GradeLevel {
    return Intl.message('Grade Level', name: 'GradeLevel', desc: '', args: []);
  }

  /// `Select Grade Level`
  String get SelectGradeLevel {
    return Intl.message(
      'Select Grade Level',
      name: 'SelectGradeLevel',
      desc: '',
      args: [],
    );
  }

  /// `Track / Branch`
  String get Track {
    return Intl.message('Track / Branch', name: 'Track', desc: '', args: []);
  }

  /// `Select Track (Scientific / Literary)`
  String get SelectTrack {
    return Intl.message(
      'Select Track (Scientific / Literary)',
      name: 'SelectTrack',
      desc: '',
      args: [],
    );
  }

  /// `Scientific`
  String get ScientificTrack {
    return Intl.message(
      'Scientific',
      name: 'ScientificTrack',
      desc: '',
      args: [],
    );
  }

  /// `Literary`
  String get LiteraryTrack {
    return Intl.message('Literary', name: 'LiteraryTrack', desc: '', args: []);
  }

  /// `General`
  String get GeneralTrack {
    return Intl.message('General', name: 'GeneralTrack', desc: '', args: []);
  }

  /// `3rd Secondary`
  String get ThirdSecondary {
    return Intl.message(
      '3rd Secondary',
      name: 'ThirdSecondary',
      desc: '',
      args: [],
    );
  }

  /// `2nd Secondary`
  String get SecondSecondary {
    return Intl.message(
      '2nd Secondary',
      name: 'SecondSecondary',
      desc: '',
      args: [],
    );
  }

  /// `1st Secondary`
  String get FirstSecondary {
    return Intl.message(
      '1st Secondary',
      name: 'FirstSecondary',
      desc: '',
      args: [],
    );
  }

  /// `Subjects`
  String get Subjects {
    return Intl.message('Subjects', name: 'Subjects', desc: '', args: []);
  }

  /// `Browse curriculum, lessons and summaries`
  String get SubjectsBrowse {
    return Intl.message(
      'Browse curriculum, lessons and summaries',
      name: 'SubjectsBrowse',
      desc: '',
      args: [],
    );
  }

  /// `units`
  String get Units {
    return Intl.message('units', name: 'Units', desc: '', args: []);
  }

  /// `Lessons`
  String get Lessons {
    return Intl.message('Lessons', name: 'Lessons', desc: '', args: []);
  }

  /// `Lesson Summary`
  String get LessonSummary {
    return Intl.message(
      'Lesson Summary',
      name: 'LessonSummary',
      desc: '',
      args: [],
    );
  }

  /// `No subjects available at the moment`
  String get NoSubjectsFound {
    return Intl.message(
      'No subjects available at the moment',
      name: 'NoSubjectsFound',
      desc: '',
      args: [],
    );
  }

  /// `No units found for this subject`
  String get NoUnitsFound {
    return Intl.message(
      'No units found for this subject',
      name: 'NoUnitsFound',
      desc: '',
      args: [],
    );
  }

  /// `No lessons found in this unit`
  String get NoLessonsFound {
    return Intl.message(
      'No lessons found in this unit',
      name: 'NoLessonsFound',
      desc: '',
      args: [],
    );
  }

  /// `Unit`
  String get Unit {
    return Intl.message('Unit', name: 'Unit', desc: '', args: []);
  }

  /// `Lesson`
  String get Lesson {
    return Intl.message('Lesson', name: 'Lesson', desc: '', args: []);
  }

  /// `Questions Count`
  String get QuestionsCount {
    return Intl.message(
      'Questions Count',
      name: 'QuestionsCount',
      desc: '',
      args: [],
    );
  }

  /// `Lessons Count`
  String get LessonsCount {
    return Intl.message(
      'Lessons Count',
      name: 'LessonsCount',
      desc: '',
      args: [],
    );
  }

  /// `Start Questions`
  String get StartQuestions {
    return Intl.message(
      'Start Questions',
      name: 'StartQuestions',
      desc: '',
      args: [],
    );
  }

  /// `View Summary`
  String get ViewSummary {
    return Intl.message(
      'View Summary',
      name: 'ViewSummary',
      desc: '',
      args: [],
    );
  }

  /// `Retry`
  String get Retry {
    return Intl.message('Retry', name: 'Retry', desc: '', args: []);
  }

  /// `Profile`
  String get Profile {
    return Intl.message('Profile', name: 'Profile', desc: '', args: []);
  }

  /// `Edit Personal Info`
  String get EditProfile {
    return Intl.message(
      'Edit Personal Info',
      name: 'EditProfile',
      desc: '',
      args: [],
    );
  }

  /// `Change Password`
  String get ChangePassword {
    return Intl.message(
      'Change Password',
      name: 'ChangePassword',
      desc: '',
      args: [],
    );
  }

  /// `Current Password`
  String get CurrentPassword {
    return Intl.message(
      'Current Password',
      name: 'CurrentPassword',
      desc: '',
      args: [],
    );
  }

  /// `New Password`
  String get NewPassword {
    return Intl.message(
      'New Password',
      name: 'NewPassword',
      desc: '',
      args: [],
    );
  }

  /// `Confirm New Password`
  String get ConfirmNewPassword {
    return Intl.message(
      'Confirm New Password',
      name: 'ConfirmNewPassword',
      desc: '',
      args: [],
    );
  }

  /// `Phone Number`
  String get Phone {
    return Intl.message('Phone Number', name: 'Phone', desc: '', args: []);
  }

  /// `Save Changes`
  String get Save {
    return Intl.message('Save Changes', name: 'Save', desc: '', args: []);
  }

  /// `Profile updated successfully`
  String get ProfileUpdatedSuccessfully {
    return Intl.message(
      'Profile updated successfully',
      name: 'ProfileUpdatedSuccessfully',
      desc: '',
      args: [],
    );
  }

  /// `Password changed successfully`
  String get PasswordChangedSuccessfully {
    return Intl.message(
      'Password changed successfully',
      name: 'PasswordChangedSuccessfully',
      desc: '',
      args: [],
    );
  }

  /// `Passwords do not match`
  String get PasswordsDoNotMatch {
    return Intl.message(
      'Passwords do not match',
      name: 'PasswordsDoNotMatch',
      desc: '',
      args: [],
    );
  }

  /// `Account Settings`
  String get AccountSettings {
    return Intl.message(
      'Account Settings',
      name: 'AccountSettings',
      desc: '',
      args: [],
    );
  }

  /// `Language & Theme`
  String get LanguageAndTheme {
    return Intl.message(
      'Language & Theme',
      name: 'LanguageAndTheme',
      desc: '',
      args: [],
    );
  }

  /// `Enter first name`
  String get EnterFirstName {
    return Intl.message(
      'Enter first name',
      name: 'EnterFirstName',
      desc: '',
      args: [],
    );
  }

  /// `Enter last name`
  String get EnterLastName {
    return Intl.message(
      'Enter last name',
      name: 'EnterLastName',
      desc: '',
      args: [],
    );
  }

  /// `Enter phone number`
  String get EnterPhone {
    return Intl.message(
      'Enter phone number',
      name: 'EnterPhone',
      desc: '',
      args: [],
    );
  }

  /// `Enter current password`
  String get EnterCurrentPassword {
    return Intl.message(
      'Enter current password',
      name: 'EnterCurrentPassword',
      desc: '',
      args: [],
    );
  }

  /// `Enter new password`
  String get EnterNewPassword {
    return Intl.message(
      'Enter new password',
      name: 'EnterNewPassword',
      desc: '',
      args: [],
    );
  }

  /// `Welcome to Student Compass App`
  String get WelcomeMessage {
    return Intl.message(
      'Welcome to Student Compass App',
      name: 'WelcomeMessage',
      desc: '',
      args: [],
    );
  }

  /// `IP Address`
  String get IpAddress {
    return Intl.message('IP Address', name: 'IpAddress', desc: '', args: []);
  }

  /// `Save`
  String get SaveButton {
    return Intl.message('Save', name: 'SaveButton', desc: '', args: []);
  }

  /// `No IP address saved previously, please enter and save it first`
  String get BaseUrlNotSaved {
    return Intl.message(
      'No IP address saved previously, please enter and save it first',
      name: 'BaseUrlNotSaved',
      desc: '',
      args: [],
    );
  }

  /// `Email`
  String get Email {
    return Intl.message('Email', name: 'Email', desc: '', args: []);
  }

  /// `Full Name`
  String get FullName {
    return Intl.message('Full Name', name: 'FullName', desc: '', args: []);
  }

  /// `Student name is required.`
  String get NameRequired {
    return Intl.message(
      'Student name is required.',
      name: 'NameRequired',
      desc: '',
      args: [],
    );
  }

  /// `Email is required.`
  String get EmailRequired {
    return Intl.message(
      'Email is required.',
      name: 'EmailRequired',
      desc: '',
      args: [],
    );
  }

  /// `Invalid email address.`
  String get EmailInvalid {
    return Intl.message(
      'Invalid email address.',
      name: 'EmailInvalid',
      desc: '',
      args: [],
    );
  }

  /// `Password is required.`
  String get PasswordRequired {
    return Intl.message(
      'Password is required.',
      name: 'PasswordRequired',
      desc: '',
      args: [],
    );
  }

  /// `Password must be at least 8 characters.`
  String get PasswordMin {
    return Intl.message(
      'Password must be at least 8 characters.',
      name: 'PasswordMin',
      desc: '',
      args: [],
    );
  }

  /// `Exams & Quizzes`
  String get ExamsAndQuizzes {
    return Intl.message(
      'Exams & Quizzes',
      name: 'ExamsAndQuizzes',
      desc: '',
      args: [],
    );
  }

  /// `Available Exams`
  String get AvailableExams {
    return Intl.message(
      'Available Exams',
      name: 'AvailableExams',
      desc: '',
      args: [],
    );
  }

  /// `Smart Custom Exam`
  String get SmartCustomExam {
    return Intl.message(
      'Smart Custom Exam',
      name: 'SmartCustomExam',
      desc: '',
      args: [],
    );
  }

  /// `Official Exam`
  String get OfficialExam {
    return Intl.message(
      'Official Exam',
      name: 'OfficialExam',
      desc: '',
      args: [],
    );
  }

  /// `Custom Exam`
  String get CustomExam {
    return Intl.message('Custom Exam', name: 'CustomExam', desc: '', args: []);
  }

  /// `Start Exam Now`
  String get StartExamNow {
    return Intl.message(
      'Start Exam Now',
      name: 'StartExamNow',
      desc: '',
      args: [],
    );
  }

  /// `View Result & Review`
  String get ViewResultAndReview {
    return Intl.message(
      'View Result & Review',
      name: 'ViewResultAndReview',
      desc: '',
      args: [],
    );
  }

  /// `min`
  String get Minutes {
    return Intl.message('min', name: 'Minutes', desc: '', args: []);
  }

  /// `question`
  String get Question {
    return Intl.message('question', name: 'Question', desc: '', args: []);
  }

  /// `questions`
  String get Questions {
    return Intl.message('questions', name: 'Questions', desc: '', args: []);
  }

  /// `marks`
  String get Marks {
    return Intl.message('marks', name: 'Marks', desc: '', args: []);
  }

  /// `Generate Smart Custom Exam`
  String get GenerateSmartExam {
    return Intl.message(
      'Generate Smart Custom Exam',
      name: 'GenerateSmartExam',
      desc: '',
      args: [],
    );
  }

  /// `Customize subject, difficulty, and question count`
  String get CustomizeSubjectAndDifficulty {
    return Intl.message(
      'Customize subject, difficulty, and question count',
      name: 'CustomizeSubjectAndDifficulty',
      desc: '',
      args: [],
    );
  }

  /// `Select Subject`
  String get SelectSubject {
    return Intl.message(
      'Select Subject',
      name: 'SelectSubject',
      desc: '',
      args: [],
    );
  }

  /// `Difficulty Level`
  String get DifficultyLevel {
    return Intl.message(
      'Difficulty Level',
      name: 'DifficultyLevel',
      desc: '',
      args: [],
    );
  }

  /// `All Levels`
  String get AllLevels {
    return Intl.message('All Levels', name: 'AllLevels', desc: '', args: []);
  }

  /// `Easy`
  String get Easy {
    return Intl.message('Easy', name: 'Easy', desc: '', args: []);
  }

  /// `Medium`
  String get Medium {
    return Intl.message('Medium', name: 'Medium', desc: '', args: []);
  }

  /// `Hard`
  String get Hard {
    return Intl.message('Hard', name: 'Hard', desc: '', args: []);
  }

  /// `Generate & Start Exam Now`
  String get GenerateAndStartExam {
    return Intl.message(
      'Generate & Start Exam Now',
      name: 'GenerateAndStartExam',
      desc: '',
      args: [],
    );
  }

  /// `Exam generated successfully!`
  String get ExamGeneratedSuccess {
    return Intl.message(
      'Exam generated successfully!',
      name: 'ExamGeneratedSuccess',
      desc: '',
      args: [],
    );
  }

  /// `Submit Exam`
  String get SubmitExam {
    return Intl.message('Submit Exam', name: 'SubmitExam', desc: '', args: []);
  }

  /// `Submit & Grade`
  String get SubmitAndCorrect {
    return Intl.message(
      'Submit & Grade',
      name: 'SubmitAndCorrect',
      desc: '',
      args: [],
    );
  }

  /// `Are you sure you want to finish and submit your answers for grading?`
  String get SubmitExamConfirmation {
    return Intl.message(
      'Are you sure you want to finish and submit your answers for grading?',
      name: 'SubmitExamConfirmation',
      desc: '',
      args: [],
    );
  }

  /// `Continue Solving`
  String get ContinueSolving {
    return Intl.message(
      'Continue Solving',
      name: 'ContinueSolving',
      desc: '',
      args: [],
    );
  }

  /// `Exit Exam`
  String get ExitExam {
    return Intl.message('Exit Exam', name: 'ExitExam', desc: '', args: []);
  }

  /// `Are you sure you want to exit? The current attempt will be cancelled.`
  String get ExitExamConfirmation {
    return Intl.message(
      'Are you sure you want to exit? The current attempt will be cancelled.',
      name: 'ExitExamConfirmation',
      desc: '',
      args: [],
    );
  }

  /// `Exit`
  String get Exit {
    return Intl.message('Exit', name: 'Exit', desc: '', args: []);
  }

  /// `Exam Result & Grading`
  String get ExamResultTitle {
    return Intl.message(
      'Exam Result & Grading',
      name: 'ExamResultTitle',
      desc: '',
      args: [],
    );
  }

  /// `Exam Passed Successfully 🎉`
  String get ExamPassedSuccess {
    return Intl.message(
      'Exam Passed Successfully 🎉',
      name: 'ExamPassedSuccess',
      desc: '',
      args: [],
    );
  }

  /// `Needs More Practice & Review 📚`
  String get ExamNeedsReview {
    return Intl.message(
      'Needs More Practice & Review 📚',
      name: 'ExamNeedsReview',
      desc: '',
      args: [],
    );
  }

  /// `Correct Answers`
  String get CorrectAnswers {
    return Intl.message(
      'Correct Answers',
      name: 'CorrectAnswers',
      desc: '',
      args: [],
    );
  }

  /// `Wrong Answers`
  String get WrongAnswers {
    return Intl.message(
      'Wrong Answers',
      name: 'WrongAnswers',
      desc: '',
      args: [],
    );
  }

  /// `Review Questions & Explanations`
  String get ReviewQuestionsAndExplanations {
    return Intl.message(
      'Review Questions & Explanations',
      name: 'ReviewQuestionsAndExplanations',
      desc: '',
      args: [],
    );
  }

  /// `Your Answer:`
  String get YourAnswer {
    return Intl.message('Your Answer:', name: 'YourAnswer', desc: '', args: []);
  }

  /// `Correct Answer:`
  String get CorrectAnswerIs {
    return Intl.message(
      'Correct Answer:',
      name: 'CorrectAnswerIs',
      desc: '',
      args: [],
    );
  }

  /// `Explanation:`
  String get Explanation {
    return Intl.message(
      'Explanation:',
      name: 'Explanation',
      desc: '',
      args: [],
    );
  }

  /// `No answer provided`
  String get NoAnswerProvided {
    return Intl.message(
      'No answer provided',
      name: 'NoAnswerProvided',
      desc: '',
      args: [],
    );
  }

  /// `Back to Exams List`
  String get BackToExamsList {
    return Intl.message(
      'Back to Exams List',
      name: 'BackToExamsList',
      desc: '',
      args: [],
    );
  }

  /// `No official exams available at the moment`
  String get NoAvailableExams {
    return Intl.message(
      'No official exams available at the moment',
      name: 'NoAvailableExams',
      desc: '',
      args: [],
    );
  }

  /// `You can generate a custom exam instantly from the second tab!`
  String get GenerateCustomExamHint {
    return Intl.message(
      'You can generate a custom exam instantly from the second tab!',
      name: 'GenerateCustomExamHint',
      desc: '',
      args: [],
    );
  }

  /// `Hello`
  String get GreetingHello {
    return Intl.message('Hello', name: 'GreetingHello', desc: '', args: []);
  }

  /// `How are you today?`
  String get HowAreYouToday {
    return Intl.message(
      'How are you today?',
      name: 'HowAreYouToday',
      desc: '',
      args: [],
    );
  }

  /// `Academic Progress Info`
  String get AcademicProgressInfo {
    return Intl.message(
      'Academic Progress Info',
      name: 'AcademicProgressInfo',
      desc: '',
      args: [],
    );
  }

  /// `Comprehensive Academic Plan`
  String get AcademicComprehensivePlan {
    return Intl.message(
      'Comprehensive Academic Plan',
      name: 'AcademicComprehensivePlan',
      desc: '',
      args: [],
    );
  }

  /// `Success Rate`
  String get SuccessRate {
    return Intl.message(
      'Success Rate',
      name: 'SuccessRate',
      desc: '',
      args: [],
    );
  }

  /// `Exams`
  String get CompletedExams {
    return Intl.message('Exams', name: 'CompletedExams', desc: '', args: []);
  }

  /// `Active Subjects`
  String get ActiveSubjects {
    return Intl.message(
      'Active Subjects',
      name: 'ActiveSubjects',
      desc: '',
      args: [],
    );
  }

  /// `Continue Study & Exams`
  String get ContinueStudyAndExams {
    return Intl.message(
      'Continue Study & Exams',
      name: 'ContinueStudyAndExams',
      desc: '',
      args: [],
    );
  }

  /// `Quick Services`
  String get QuickServices {
    return Intl.message(
      'Quick Services',
      name: 'QuickServices',
      desc: '',
      args: [],
    );
  }

  /// `Curriculum & Subjects`
  String get CurriculumAndSubjects {
    return Intl.message(
      'Curriculum & Subjects',
      name: 'CurriculumAndSubjects',
      desc: '',
      args: [],
    );
  }

  /// `Exams Bank`
  String get ExamsBank {
    return Intl.message('Exams Bank', name: 'ExamsBank', desc: '', args: []);
  }

  /// `Profile & Results`
  String get ProfileAndResults {
    return Intl.message(
      'Profile & Results',
      name: 'ProfileAndResults',
      desc: '',
      args: [],
    );
  }

  /// `Curriculum Subjects`
  String get CurriculumSubjects {
    return Intl.message(
      'Curriculum Subjects',
      name: 'CurriculumSubjects',
      desc: '',
      args: [],
    );
  }

  /// `View All`
  String get ViewAll {
    return Intl.message('View All', name: 'ViewAll', desc: '', args: []);
  }

  /// `Dark Mode`
  String get DarkMode {
    return Intl.message('Dark Mode', name: 'DarkMode', desc: '', args: []);
  }

  /// `Light Mode`
  String get LightMode {
    return Intl.message('Light Mode', name: 'LightMode', desc: '', args: []);
  }

  /// `Language`
  String get Language {
    return Intl.message('Language', name: 'Language', desc: '', args: []);
  }

  /// `Theme`
  String get Theme {
    return Intl.message('Theme', name: 'Theme', desc: '', args: []);
  }

  /// `Arabic`
  String get ArabicLang {
    return Intl.message('Arabic', name: 'ArabicLang', desc: '', args: []);
  }

  /// `English`
  String get EnglishLang {
    return Intl.message('English', name: 'EnglishLang', desc: '', args: []);
  }

  /// `Notifications & Alerts`
  String get NotificationsAndAlerts {
    return Intl.message(
      'Notifications & Alerts',
      name: 'NotificationsAndAlerts',
      desc: '',
      args: [],
    );
  }

  /// `Mark All as Read`
  String get MarkAllAsRead {
    return Intl.message(
      'Mark All as Read',
      name: 'MarkAllAsRead',
      desc: '',
      args: [],
    );
  }

  /// `No new notifications`
  String get NoNotificationsYet {
    return Intl.message(
      'No new notifications',
      name: 'NoNotificationsYet',
      desc: '',
      args: [],
    );
  }

  /// `We will notify you with the latest updates and tasks`
  String get NoNotificationsSub {
    return Intl.message(
      'We will notify you with the latest updates and tasks',
      name: 'NoNotificationsSub',
      desc: '',
      args: [],
    );
  }

  /// `Passed Successfully`
  String get PassedExamStatus {
    return Intl.message(
      'Passed Successfully',
      name: 'PassedExamStatus',
      desc: '',
      args: [],
    );
  }

  /// `Exam Completed`
  String get TakenExamStatus {
    return Intl.message(
      'Exam Completed',
      name: 'TakenExamStatus',
      desc: '',
      args: [],
    );
  }

  /// `No subjects available`
  String get NoSubjectsAvailable {
    return Intl.message(
      'No subjects available',
      name: 'NoSubjectsAvailable',
      desc: '',
      args: [],
    );
  }

  /// `No questions in this exam`
  String get NoQuestionsInExam {
    return Intl.message(
      'No questions in this exam',
      name: 'NoQuestionsInExam',
      desc: '',
      args: [],
    );
  }
}

class AppLocalizationDelegate extends LocalizationsDelegate<S> {
  const AppLocalizationDelegate();

  List<Locale> get supportedLocales {
    return const <Locale>[
      Locale.fromSubtags(languageCode: 'en'),
      Locale.fromSubtags(languageCode: 'ar'),
    ];
  }

  @override
  bool isSupported(Locale locale) => _isSupported(locale);
  @override
  Future<S> load(Locale locale) => S.load(locale);
  @override
  bool shouldReload(AppLocalizationDelegate old) => false;

  bool _isSupported(Locale locale) {
    for (var supportedLocale in supportedLocales) {
      if (supportedLocale.languageCode == locale.languageCode) {
        return true;
      }
    }
    return false;
  }
}
