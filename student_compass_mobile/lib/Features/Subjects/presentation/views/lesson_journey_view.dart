import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/lesson_model.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/lesson_journey_cubit/lesson_journey_cubit.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/lesson_journey_cubit/lesson_journey_state.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/helper/file_downloader.dart';
import 'package:student_compass_mobile/core/routers/route_names.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/core/widgets/custom_button.dart';
import 'package:url_launcher/url_launcher.dart';

class LessonJourneyView extends StatefulWidget {
  final int lessonId;
  final String? initialTitle;

  const LessonJourneyView({
    super.key,
    required this.lessonId,
    this.initialTitle,
  });

  @override
  State<LessonJourneyView> createState() => _LessonJourneyViewState();
}

class _LessonJourneyViewState extends State<LessonJourneyView> {
  @override
  void initState() {
    super.initState();
    context.read<LessonJourneyCubit>().fetchLessonDetails(lessonId: widget.lessonId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: CustomAppBar(
        title: widget.initialTitle ?? 'رحلة تعلم الدرس',
      ),
      body: BlocConsumer<LessonJourneyCubit, LessonJourneyState>(
        listener: (context, state) {
          if (state is LessonJourneyProgressUpdated) {
            customToastBar(
              context: context,
              message: 'أحسنت! تم تحديث تقدمك في رحلة الدرس.',
              backgroundColor: AppColors.customGreen(),
              icon: Icons.check_circle_rounded,
              textColor: AppColors.white(),
            );
          }
        },
        builder: (context, state) {
          if (state is LessonJourneyLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is LessonJourneyFailure) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.s24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline_rounded,
                      size: 56,
                      color: AppColors.red().withValues(alpha: 0.6),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      Failure.localizedMessage(
                        context,
                        errorMessage: state.errorMessage,
                        errorKey: state.errorKey,
                      ),
                      textAlign: TextAlign.center,
                      style: TextStyles.semiBold14.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextButton.icon(
                      onPressed: () {
                        context
                            .read<LessonJourneyCubit>()
                            .fetchLessonDetails(lessonId: widget.lessonId);
                      },
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state is LessonJourneySuccess) {
            final lesson = state.lesson;
            final currentStage = lesson.currentStage;
            final isCompleted = lesson.isCompleted;

            return Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(AppSpacing.s16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Header Lesson Journey Card
                        _buildJourneyHeaderCard(context, lesson),
                        const SizedBox(height: AppSpacing.s20),

                        Text(
                          'مراحل رحلة التعلم (افهم ⬅️ طبّق ⬅️ ثبّت ⬅️ تقدّم)',
                          style: TextStyles.bold14.copyWith(
                            color: AppColors.textBoldColor(context),
                          ),
                        ),
                        const SizedBox(height: AppSpacing.s12),

                        // Stage 1: Explanation Video
                        _buildStageCard(
                          context: context,
                          stageNumber: 1,
                          title: '1. فيديو الشرح والتوضيح',
                          subtitle: lesson.videoUrl != null
                              ? 'مشاهدة شرح تفاعلي للدرس عبر الفيديو'
                              : 'شرح الدرس متاح ومجهز',
                          icon: Icons.play_circle_fill_rounded,
                          iconColor: const Color(0xFFEF4444),
                          isActive: currentStage >= 1,
                          isFinished: currentStage > 1 || isCompleted,
                          onAction: () => _openVideoStage(context, lesson),
                        ),

                        // Stage 2: Summary & PDF
                        _buildStageCard(
                          context: context,
                          stageNumber: 2,
                          title: '2. ملخص الدرس والـ PDF',
                          subtitle: lesson.pdfPath != null
                              ? 'قراءة وتنزيل الملخص المركز وملف الـ PDF'
                              : 'ملخص المفاهيم والقوانين الأساسية',
                          icon: Icons.picture_as_pdf_rounded,
                          iconColor: const Color(0xFFF59E0B),
                          isActive: currentStage >= 2,
                          isFinished: currentStage > 2 || isCompleted,
                          onAction: () => _openSummaryStage(context, lesson),
                        ),

                        // Stage 3: Practice Questions Bank
                        _buildStageCard(
                          context: context,
                          stageNumber: 3,
                          title: '3. أسئلة التثبيت والتدريب',
                          subtitle: '${lesson.questionsCount} سؤال للتدريب والحل التفاعلي الفوري',
                          icon: Icons.quiz_rounded,
                          iconColor: AppColors.primaryColor(context),
                          isActive: currentStage >= 3,
                          isFinished: currentStage > 3 || isCompleted,
                          onAction: () => _openPracticeQuestionsStage(context, lesson),
                        ),

                        // Stage 4: Short Test
                        _buildStageCard(
                          context: context,
                          stageNumber: 4,
                          title: '4. الاختبار القصير لتقييم الدرس',
                          subtitle: lesson.shortExam != null
                              ? 'اختبار سريع لقياس استيعاب الدرس'
                              : 'اختبار تقييمي للدرس',
                          icon: Icons.assignment_turned_in_rounded,
                          iconColor: const Color(0xFF10B981),
                          isActive: currentStage >= 4,
                          isFinished: currentStage > 4 || isCompleted,
                          onAction: () => _openShortExamStage(context, lesson),
                        ),

                        // Stage 5: Result & Error Analysis
                        _buildStageCard(
                          context: context,
                          stageNumber: 5,
                          title: '5. تحليل النتيجة ومراجعة الأخطاء',
                          subtitle: 'مراجعة الأسئلة الخاطئة وتثبيت المفاهيم المعقدة',
                          icon: Icons.analytics_rounded,
                          iconColor: const Color(0xFF8B5CF6),
                          isActive: currentStage >= 5 || isCompleted,
                          isFinished: isCompleted,
                          onAction: () => _openResultAnalysisStage(context, lesson),
                        ),

                        const SizedBox(height: AppSpacing.s24),
                      ],
                    ),
                  ),
                ),

                // Bottom Action Bar
                Container(
                  padding: const EdgeInsets.all(AppSpacing.s16),
                  decoration: BoxDecoration(
                    color: AppColors.itemsColor(context),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.shadowColor(context),
                        blurRadius: 10,
                        offset: const Offset(0, -3),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    child: CustomButton(
                      title: isCompleted
                          ? '🎉 تم إكمال رحلة هذا الدرس بنجاح'
                          : _getStageActionText(currentStage),
                      onPressed: () {
                        _handleMainActionButton(context, lesson);
                      },
                    ),
                  ),
                ),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildJourneyHeaderCard(BuildContext context, LessonModel lesson) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.s16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryColor(context),
            AppColors.primaryColor(context).withValues(alpha: 0.8),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryColor(context).withValues(alpha: 0.25),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'الدرس ${lesson.lessonNumber}',
                style: TextStyles.bold12.copyWith(
                  color: AppColors.white().withValues(alpha: 0.8),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.white().withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'المرحلة ${lesson.currentStage} من 5',
                  style: TextStyles.bold12.copyWith(
                    color: AppColors.white(),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            lesson.title,
            style: TextStyles.bold18.copyWith(
              color: AppColors.white(),
            ),
          ),
          const SizedBox(height: 14),

          // Progress Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'نسبة الإنجاز',
                style: TextStyles.regular12.copyWith(
                  color: AppColors.white().withValues(alpha: 0.9),
                ),
              ),
              Text(
                '${lesson.progressPercentage}%',
                style: TextStyles.bold14.copyWith(
                  color: AppColors.white(),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: (lesson.progressPercentage / 100).clamp(0.0, 1.0),
              minHeight: 8,
              backgroundColor: AppColors.white().withValues(alpha: 0.25),
              valueColor: AlwaysStoppedAnimation<Color>(
                lesson.isCompleted ? AppColors.customGreen() : AppColors.white(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStageCard({
    required BuildContext context,
    required int stageNumber,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required bool isActive,
    required bool isFinished,
    required VoidCallback onAction,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.s12),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isFinished
              ? AppColors.customGreen().withValues(alpha: 0.5)
              : (isActive
                  ? AppColors.primaryColor(context).withValues(alpha: 0.6)
                  : AppColors.borderColor(context)),
          width: isActive ? 1.5 : 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onAction,
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.s14),
            child: Row(
              children: [
                // Icon
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: iconColor.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    icon,
                    color: iconColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: AppSpacing.s12),

                // Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyles.bold14.copyWith(
                          color: AppColors.textBoldColor(context),
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        subtitle,
                        style: TextStyles.regular12.copyWith(
                          color: AppColors.textSecondaryColor(context),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 8),
                if (isFinished)
                  Icon(
                    Icons.check_circle_rounded,
                    color: AppColors.customGreen(),
                    size: 22,
                  )
                else if (isActive)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primaryColor(context).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'الحالية',
                      style: TextStyles.bold10.copyWith(
                        color: AppColors.primaryColor(context),
                      ),
                    ),
                  )
                else
                  Icon(
                    Icons.lock_outline_rounded,
                    color: AppColors.textSecondaryColor(context).withValues(alpha: 0.5),
                    size: 18,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getStageActionText(int stage) {
    return switch (stage) {
      1 => '▶️ ابدأ الآن: مشاهدة فيديو الشرح',
      2 => '📄 الانتقال إلى ملخص الدرس',
      3 => '📝 تدرب الآن: أسئلة التثبيت',
      4 => '✍️ خوض الاختبار القصير',
      5 => '📊 استعراض تحليل النتيجة ومراجعة الأخطاء',
      _ => 'المتابعة',
    };
  }

  void _handleMainActionButton(BuildContext context, LessonModel lesson) {
    switch (lesson.currentStage) {
      case 1:
        _openVideoStage(context, lesson);
        break;
      case 2:
        _openSummaryStage(context, lesson);
        break;
      case 3:
        _openPracticeQuestionsStage(context, lesson);
        break;
      case 4:
        _openShortExamStage(context, lesson);
        break;
      case 5:
        _openResultAnalysisStage(context, lesson);
        break;
      default:
        _openPracticeQuestionsStage(context, lesson);
    }
  }

  Future<void> _launchVideoUrl(String? videoUrl) async {
    if (videoUrl == null || videoUrl.trim().isEmpty) {
      customToastBar(
        context: context,
        message: 'لا يتوفر رابط فيديو لهذا الدرس حالياً.',
        backgroundColor: AppColors.primaryColor(context),
        icon: Icons.info_outline,
        textColor: AppColors.white(),
      );
      return;
    }

    try {
      final uri = Uri.parse(videoUrl.trim());
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        await launchUrl(uri, mode: LaunchMode.platformDefault);
      }
    } catch (e) {
      if (mounted) {
        customToastBar(
          context: context,
          message: 'تعذر فتح رابط الفيديو: $e',
          backgroundColor: AppColors.red(),
          icon: Icons.error_outline,
          textColor: AppColors.white(),
        );
      }
    }
  }

  void _openVideoStage(BuildContext context, LessonModel lesson) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(AppSpacing.s20),
        decoration: BoxDecoration(
          color: AppColors.itemsColor(context),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.borderColor(context),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEF4444).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.play_circle_fill_rounded, color: Color(0xFFEF4444), size: 22),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'شرح الدرس: ${lesson.title}',
                    style: TextStyles.bold16.copyWith(color: AppColors.textBoldColor(context)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => _launchVideoUrl(lesson.videoUrl),
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.s16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [
                        Color(0xFF1E293B),
                        Color(0xFF0F172A),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.play_circle_filled_rounded, color: Color(0xFFEF4444), size: 56),
                      const SizedBox(height: 10),
                      Text(
                        'اضغط هنا لمشاهدة فيديو الشرح ▶️',
                        style: TextStyles.bold14.copyWith(color: Colors.white),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        lesson.videoUrl != null ? 'انقر لفتح الفيديو في تطبيق YouTube أو المتصفح' : 'شرح تفاعلي للدرس',
                        style: TextStyles.regular12.copyWith(color: Colors.white70),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primaryColor(context).withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.primaryColor(context).withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  Icon(Icons.lightbulb_outline_rounded, color: AppColors.primaryColor(context), size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'نصيحة: دوّن الملاحظات والقوانين الرئيسية أثناء المشاهدة لتثبيت المعلومة.',
                      style: TextStyles.regular12.copyWith(color: AppColors.primaryColor(context)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            CustomButton(
              title: 'أكملت المشاهدة والانتقال للملخص ✔️',
              onPressed: () {
                Navigator.pop(ctx);
                context.read<LessonJourneyCubit>().updateStage(lessonId: lesson.id, stage: 1);
                // الانتقال التلقائي لمرحلة الملخص
                Future.delayed(const Duration(milliseconds: 300), () {
                  if (context.mounted) {
                    _openSummaryStage(context, lesson);
                  }
                });
              },
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  void _openSummaryStage(BuildContext context, LessonModel lesson) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(AppSpacing.s20),
        decoration: BoxDecoration(
          color: AppColors.itemsColor(context),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.borderColor(context),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF59E0B).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.menu_book_rounded, color: Color(0xFFF59E0B), size: 22),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'ملخص ومكتنز الدرس: ${lesson.title}',
                    style: TextStyles.bold16.copyWith(color: AppColors.textBoldColor(context)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.scaffoldBackgroundColor(null, context),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.borderColor(context)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '📌 أهم القواعد والمفاهيم الوزارية:',
                    style: TextStyles.bold14.copyWith(color: AppColors.textBoldColor(context)),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    lesson.summary ??
                        'يحتوي هذا الدرس على أهم المفاهيم والقواعد الوزارية الأساسية. احرص على مراجعة التعريفات والنقاط المحورية قبل الانتقال إلى أسئلة التثبيت.',
                    style: TextStyles.regular14.copyWith(
                      color: AppColors.textPrimaryColor(context),
                      height: 1.6,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            // PDF & Resources Card
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.itemsColor(context),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFF59E0B).withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFFEF4444), size: 28),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'ملزمة وملخص الدرس الشامل (PDF)',
                          style: TextStyles.bold12.copyWith(color: AppColors.textBoldColor(context)),
                        ),
                        Text(
                          lesson.pdfPath != null
                              ? 'جاهز للتنزيل والفتح على جهازك'
                              : 'الملف متاح مع مادة الدرس',
                          style: TextStyles.regular10.copyWith(color: AppColors.textSecondaryColor(context)),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      FileDownloader.downloadAndOpenPdf(
                        context: context,
                        pdfPath: lesson.pdfPath,
                        fileName: '${lesson.title}_ملخص',
                      );
                    },
                    icon: const Icon(Icons.download_rounded, size: 16, color: Colors.white),
                    label: const Text('تحميل وفتح', style: TextStyle(fontSize: 11, color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryColor(context),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            CustomButton(
              title: 'فهمت الملخص والانتقال لأسئلة التثبيت ➡️',
              onPressed: () {
                Navigator.pop(ctx);
                context.read<LessonJourneyCubit>().updateStage(lessonId: lesson.id, stage: 2);
                Future.delayed(const Duration(milliseconds: 300), () {
                  if (context.mounted) {
                    _openPracticeQuestionsStage(context, lesson);
                  }
                });
              },
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  void _openPracticeQuestionsStage(BuildContext ctx, LessonModel lesson) async {
    await ctx.push(
      RouteNames.lessonQuestions,
      extra: {'lesson_id': lesson.id, 'title': lesson.title, 'lesson': lesson},
    );
    if (!mounted) return;
    context.read<LessonJourneyCubit>().fetchLessonDetails(lessonId: lesson.id);
  }

  void _openShortExamStage(BuildContext ctx, LessonModel lesson) async {
    if (lesson.shortExam != null) {
      final exam = ExamModel(
        id: lesson.shortExam!['id'] as int? ?? 0,
        title: lesson.shortExam!['title'] as String? ?? 'اختبار الدرس',
        durationMinutes: lesson.shortExam!['duration_minutes'] as int? ?? 15,
        totalMarks: lesson.shortExam!['total_marks'] as int? ?? 10,
      );
      await ctx.push(RouteNames.exam, extra: exam);
    } else {
      customToastBar(
        context: ctx,
        message: 'يمكنك خوض أسئلة التثبيت الآن لقياس مدى فهمك للدرس.',
        backgroundColor: AppColors.primaryColor(ctx),
        icon: Icons.info_outline,
        textColor: AppColors.white(),
      );
      _openPracticeQuestionsStage(ctx, lesson);
      return;
    }
    if (!mounted) return;
    context.read<LessonJourneyCubit>().fetchLessonDetails(lessonId: lesson.id);
  }

  void _openResultAnalysisStage(BuildContext context, LessonModel lesson) {
    context.push(RouteNames.incorrectQuestions);
  }
}
