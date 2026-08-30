class CustomExamRequestModel {
  final int subjectId;
  final List<int>? lessonIds;
  final String? difficulty; // easy, medium, hard
  final int questionCount;
  final int? year;

  const CustomExamRequestModel({
    required this.subjectId,
    this.lessonIds,
    this.difficulty,
    this.questionCount = 10,
    this.year,
  });

  Map<String, dynamic> toJson() => {
        'subject_id': subjectId,
        if (lessonIds != null && lessonIds!.isNotEmpty) 'lesson_ids': lessonIds,
        if (difficulty != null && difficulty!.isNotEmpty)
          'difficulty': difficulty,
        'question_count': questionCount,
        if (year != null) 'year': year,
      };
}
