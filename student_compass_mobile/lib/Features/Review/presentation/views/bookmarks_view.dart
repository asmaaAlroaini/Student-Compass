import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Review/presentation/logic/bookmarks_cubit/bookmarks_cubit.dart';
import 'package:student_compass_mobile/core/constants/app_spacing.dart';
import 'package:student_compass_mobile/core/errors/failuar.dart';
import 'package:student_compass_mobile/core/helper/custom_loading_indicator.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';
import 'package:student_compass_mobile/core/widgets/custom_app_bar.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_question_model.dart';

class BookmarksView extends StatefulWidget {
  const BookmarksView({super.key});

  @override
  State<BookmarksView> createState() => _BookmarksViewState();
}

class _BookmarksViewState extends State<BookmarksView> {
  @override
  void initState() {
    super.initState();
    context.read<BookmarksCubit>().fetchBookmarks();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
      appBar: const CustomAppBar(title: 'الأسئلة المحفوظة'),
      body: BlocBuilder<BookmarksCubit, BookmarksState>(
        builder: (context, state) {
          if (state is BookmarksLoading) {
            return const Center(child: CustomLoadingIndicator());
          }

          if (state is BookmarksFailure) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.s24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.error_outline_rounded, size: 56, color: AppColors.red().withValues(alpha: 0.6)),
                    const SizedBox(height: 16),
                    Text(
                      Failure.localizedMessage(context, errorMessage: state.errorMessage, errorKey: state.errorKey),
                      textAlign: TextAlign.center,
                      style: TextStyles.semiBold14.copyWith(color: AppColors.textSecondaryColor(context)),
                    ),
                    const SizedBox(height: 20),
                    TextButton.icon(
                      onPressed: () => context.read<BookmarksCubit>().fetchBookmarks(),
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (state is BookmarksSuccess) {
            final questions = state.questions;

            if (questions.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.bookmark_border_rounded, size: 64, color: AppColors.primaryColor(context).withValues(alpha: 0.4)),
                    const SizedBox(height: 16),
                    Text('لا توجد أسئلة محفوظة بعد', style: TextStyles.bold16.copyWith(color: AppColors.textBoldColor(context))),
                    const SizedBox(height: 8),
                    Text(
                      'احفظ الأسئلة المهمة أثناء حل الاختبارات والتدريب.',
                      textAlign: TextAlign.center,
                      style: TextStyles.regular14.copyWith(color: AppColors.textSecondaryColor(context)),
                    ),
                  ],
                ),
              );
            }

            return RefreshIndicator(
              onRefresh: () async => context.read<BookmarksCubit>().fetchBookmarks(),
              child: Column(
                children: [
                  // Header count
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s16, vertical: AppSpacing.s12),
                    color: AppColors.primaryColor(context).withValues(alpha: 0.06),
                    child: Row(
                      children: [
                        Icon(Icons.bookmark_rounded, color: AppColors.primaryColor(context), size: 20),
                        const SizedBox(width: 8),
                        Text('${questions.length} سؤال محفوظ', style: TextStyles.bold14.copyWith(color: AppColors.primaryColor(context))),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(AppSpacing.s16),
                      itemCount: questions.length,
                      itemBuilder: (context, index) {
                        final q = questions[index];
                        return _buildBookmarkCard(context, q, index);
                      },
                    ),
                  ),
                ],
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildBookmarkCard(BuildContext context, ExamQuestionModel q, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.s14),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.borderColor(context)),
        boxShadow: [BoxShadow(color: AppColors.shadowColor(context), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.s16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top row with remove bookmark button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.primaryColor(context).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(q.difficulty, style: TextStyles.semiBold10.copyWith(color: AppColors.primaryColor(context))),
                    ),
                    if (q.source != null) ...[
                      const SizedBox(width: 6),
                      Text(q.source!, style: TextStyles.regular10.copyWith(color: AppColors.textSecondaryColor(context))),
                    ],
                  ],
                ),
                IconButton(
                  onPressed: () {
                    context.read<BookmarksCubit>().toggleBookmark(questionId: q.id);
                    customToastBar(
                      context: context,
                      message: 'تم إزالة السؤال من المحفوظات',
                      backgroundColor: AppColors.textSecondaryColor(context),
                      icon: Icons.bookmark_remove_rounded,
                      textColor: AppColors.white(),
                    );
                  },
                  icon: Icon(Icons.bookmark_remove_rounded, color: AppColors.primaryColor(context), size: 22),
                  tooltip: 'إزالة من المحفوظات',
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(q.questionText, style: TextStyles.bold14.copyWith(color: AppColors.textBoldColor(context), height: 1.5)),

            // Show correct answer badge
            if (q.correctAnswer != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.customGreen().withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.customGreen().withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.check_circle_outline_rounded, color: AppColors.customGreen(), size: 16),
                    const SizedBox(width: 8),
                    Text('الإجابة الصحيحة: ', style: TextStyles.bold12.copyWith(color: AppColors.customGreen())),
                    Expanded(child: Text(q.correctAnswer!, style: TextStyles.regular12.copyWith(color: AppColors.customGreen()))),
                  ],
                ),
              ),
            ],

            // Explanation
            if (q.explanation != null && q.explanation!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.scaffoldBackgroundColor(null, context),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(q.explanation!, style: TextStyles.regular12.copyWith(color: AppColors.textSecondaryColor(context), height: 1.5)),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
