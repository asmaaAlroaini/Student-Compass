import 'package:flutter/material.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';
import 'package:student_compass_mobile/core/helper/custom_toast_bar.dart';
import 'package:student_compass_mobile/core/services/api_service.dart';
import 'package:student_compass_mobile/core/services/service_locator.dart';
import 'package:student_compass_mobile/core/services/shared_pref_singleton.dart';
import 'package:student_compass_mobile/core/utils/app_colors.dart';
import 'package:student_compass_mobile/core/utils/app_text_style.dart';

class ReportQuestionDialog extends StatefulWidget {
  final int questionId;

  const ReportQuestionDialog({super.key, required this.questionId});

  static Future<void> show(BuildContext context, {required int questionId}) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => ReportQuestionDialog(questionId: questionId),
    );
  }

  @override
  State<ReportQuestionDialog> createState() => _ReportQuestionDialogState();
}

class _ReportQuestionDialogState extends State<ReportQuestionDialog> {
  String _selectedType = 'wrong_answer';
  final TextEditingController _descController = TextEditingController();
  bool _isSubmitting = false;

  final List<Map<String, String>> _reasons = [
    {'type': 'wrong_answer', 'label': 'الإجابة المحددة غير صحيحة علمياً'},
    {'type': 'typo', 'label': 'خطأ إملائي أو لغوي في نص السؤال'},
    {'type': 'unclear_image', 'label': 'الصورة التوضيحية أو الرسم غير واضح'},
    {'type': 'other', 'label': 'ملاحظة أو صياغة بحاجة لتوضيح'},
  ];

  @override
  void dispose() {
    _descController.dispose();
    super.dispose();
  }

  Future<void> _submitReport() async {
    final desc = _descController.text.trim();
    if (desc.isEmpty) {
      CustomToastBar.showErrorToast(
        context: context,
        title: 'يرجى كتابة تفاصيل المشكلة أو الخطأ',
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      final apiService = getIt<ApiService>();
      final token = Prefs.getString(AppConstants.kToken);

      await apiService.post(
        endPoint: AppConstants.kStudentReports,
        body: {
          'question_id': widget.questionId,
          'report_type': _selectedType,
          'description': desc,
        },
        token: token,
      );

      if (!mounted) return;
      Navigator.of(context).pop();

      CustomToastBar.showSuccessToast(
        context: context,
        title: 'تم إرسال بلاغك بنجاح، وسيقوم الفريق بمراجعته 👏',
      );
    } catch (e) {
      if (!mounted) return;
      CustomToastBar.showErrorToast(
        context: context,
        title: 'تعذر إرسال البلاغ حالياً، يرجى المحاولة لاحقاً',
      );
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: bottomInset + 20,
      ),
      decoration: BoxDecoration(
        color: AppColors.itemsColor(context),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(28),
          topRight: Radius.circular(28),
        ),
        border: Border.all(color: AppColors.borderColor(context)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle Bar
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE11D48).withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.flag_rounded,
                    color: Color(0xFFE11D48),
                    size: 20,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'الإبلاغ عن خطأ في السؤال #${widget.questionId}',
                        style: TextStyles.bold16.copyWith(
                          color: AppColors.textBoldColor(context),
                        ),
                      ),
                      Text(
                        'ساعدنا في تحسين جودة المحتوى التعليمي',
                        style: TextStyles.regular12.copyWith(
                          color: AppColors.textSecondaryColor(context),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Reason Selector
            Text(
              'نوع المشكلة:',
              style: TextStyles.bold12.copyWith(
                color: AppColors.textBoldColor(context),
              ),
            ),
            const SizedBox(height: 8),

            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _reasons.map((r) {
                final isSelected = _selectedType == r['type'];
                return ChoiceChip(
                  label: Text(
                    r['label']!,
                    style: TextStyles.semiBold11.copyWith(
                      color: isSelected
                          ? Colors.white
                          : AppColors.textSecondaryColor(context),
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: AppColors.primaryColor(context),
                  backgroundColor: AppColors.scaffoldBackgroundColor(null, context),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(
                      color: isSelected
                          ? AppColors.primaryColor(context)
                          : AppColors.borderColor(context),
                    ),
                  ),
                  onSelected: (selected) {
                    if (selected) {
                      setState(() {
                        _selectedType = r['type']!;
                      });
                    }
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            // Description TextField
            Text(
              'تفاصيل الملاحظة:',
              style: TextStyles.bold12.copyWith(
                color: AppColors.textBoldColor(context),
              ),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _descController,
              maxLines: 3,
              style: TextStyles.regular13.copyWith(
                color: AppColors.textBoldColor(context),
              ),
              decoration: InputDecoration(
                hintText: 'اكتب توضيح المشكلة أو الإجابة الصحيحة المقترحة...',
                hintStyle: TextStyles.regular12.copyWith(
                  color: AppColors.textSecondaryColor(context),
                ),
                filled: true,
                fillColor: AppColors.scaffoldBackgroundColor(null, context),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: AppColors.borderColor(context)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: AppColors.borderColor(context)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: AppColors.primaryColor(context)),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: OutlinedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: Text(
                      'إلغاء',
                      style: TextStyles.bold13.copyWith(
                        color: AppColors.textSecondaryColor(context),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isSubmitting ? null : _submitReport,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE11D48),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: _isSubmitting
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : Text(
                            'إرسال البلاغ',
                            style: TextStyles.bold13.copyWith(
                              color: Colors.white,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
