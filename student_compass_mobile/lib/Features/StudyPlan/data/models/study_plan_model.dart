class StudyTaskModel {
  final int id;
  final int planId;
  final int? subjectId;
  final String? subjectName;
  final int? lessonId;
  final String? lessonTitle;
  final String taskName;
  final String taskType;
  final int estimatedMinutes;
  String status; // not_started, in_progress, completed

  StudyTaskModel({
    required this.id,
    required this.planId,
    this.subjectId,
    this.subjectName,
    this.lessonId,
    this.lessonTitle,
    required this.taskName,
    this.taskType = 'solve_questions',
    this.estimatedMinutes = 30,
    this.status = 'not_started',
  });

  bool get isCompleted => status == 'completed';

  factory StudyTaskModel.fromJson(Map<String, dynamic> json) {
    String? sName;
    if (json['subject'] != null && json['subject'] is Map) {
      sName = json['subject']['name'] as String?;
    }

    String? lTitle;
    if (json['lesson'] != null && json['lesson'] is Map) {
      lTitle = json['lesson']['title'] as String?;
    }

    return StudyTaskModel(
      id: json['id'] as int? ?? 0,
      planId: json['study_plan_id'] as int? ?? (json['plan_id'] as int? ?? 0),
      subjectId: json['subject_id'] as int?,
      subjectName: sName,
      lessonId: json['lesson_id'] as int?,
      lessonTitle: lTitle,
      taskName: json['task_name'] as String? ?? 'مهمة دراسية',
      taskType: json['task_type'] as String? ?? 'solve_questions',
      estimatedMinutes: json['estimated_minutes'] as int? ?? 30,
      status: json['status'] as String? ?? 'not_started',
    );
  }
}

class StudyPlanModel {
  final int id;
  final String planDate;
  final int totalTasks;
  final int completedTasks;
  final double progressPercentage;
  final List<StudyTaskModel> tasks;

  const StudyPlanModel({
    required this.id,
    required this.planDate,
    required this.totalTasks,
    required this.completedTasks,
    required this.progressPercentage,
    required this.tasks,
  });

  factory StudyPlanModel.fromJson(Map<String, dynamic> json) {
    List<StudyTaskModel> parsedTasks = [];
    if (json['tasks'] != null && json['tasks'] is List) {
      parsedTasks = (json['tasks'] as List)
          .map((t) => StudyTaskModel.fromJson(t as Map<String, dynamic>))
          .toList();
    }

    return StudyPlanModel(
      id: json['id'] as int? ?? 0,
      planDate: json['plan_date'] as String? ?? '',
      totalTasks: json['total_tasks'] as int? ?? parsedTasks.length,
      completedTasks: json['completed_tasks'] as int? ?? 0,
      progressPercentage: (json['progress_percentage'] is num)
          ? (json['progress_percentage'] as num).toDouble()
          : 0.0,
      tasks: parsedTasks,
    );
  }
}
