class CompetitionModel {
  final int id;
  final String title;
  final String? description;
  final String? subjectName;
  final int durationMinutes;
  final int totalPoints;
  final int participantsCount;
  final String status; // active, upcoming, ended
  final String? startDate;
  final String? endDate;
  final int? myRank;
  final double? myScore;

  const CompetitionModel({
    required this.id,
    required this.title,
    this.description,
    this.subjectName,
    this.durationMinutes = 30,
    this.totalPoints = 100,
    this.participantsCount = 0,
    this.status = 'active',
    this.startDate,
    this.endDate,
    this.myRank,
    this.myScore,
  });

  factory CompetitionModel.fromJson(Map<String, dynamic> json) {
    String? sName;
    if (json['subject'] != null && json['subject'] is Map) {
      sName = json['subject']['name'] as String?;
    }

    return CompetitionModel(
      id: json['id'] as int? ?? 0,
      title: json['title'] as String? ?? 'مسابقة',
      description: json['description'] as String?,
      subjectName: sName ?? json['subject_name'] as String?,
      durationMinutes: json['duration_minutes'] as int? ?? 30,
      totalPoints: json['total_points'] as int? ?? 100,
      participantsCount: json['participants_count'] as int? ?? 0,
      status: json['status'] as String? ?? 'active',
      startDate: json['start_date'] as String?,
      endDate: json['end_date'] as String?,
      myRank: json['my_rank'] as int?,
      myScore: (json['my_score'] is num) ? (json['my_score'] as num).toDouble() : null,
    );
  }
}

class LeaderboardEntryModel {
  final int rank;
  final int userId;
  final String name;
  final String? avatar;
  final double score;
  final int timeTakenSeconds;

  const LeaderboardEntryModel({
    required this.rank,
    required this.userId,
    required this.name,
    this.avatar,
    required this.score,
    this.timeTakenSeconds = 0,
  });

  factory LeaderboardEntryModel.fromJson(Map<String, dynamic> json) {
    String? uName;
    if (json['student'] != null && json['student'] is Map) {
      uName = json['student']['name'] as String?;
    } else if (json['user'] != null && json['user'] is Map) {
      uName = json['user']['name'] as String?;
    }

    double finalScore = 0.0;
    if (json['total_points'] is num) {
      finalScore = (json['total_points'] as num).toDouble();
    } else if (json['points_earned'] is num) {
      finalScore = (json['points_earned'] as num).toDouble();
    } else if (json['score_percentage'] is num) {
      finalScore = (json['score_percentage'] as num).toDouble();
    } else if (json['score'] is num) {
      finalScore = (json['score'] as num).toDouble();
    }

    return LeaderboardEntryModel(
      rank: json['rank'] as int? ?? 0,
      userId: json['user_id'] as int? ?? (json['id'] as int? ?? 0),
      name: uName ?? (json['student_name'] as String? ?? (json['name'] as String? ?? 'طالب')),
      avatar: json['avatar'] as String?,
      score: finalScore,
      timeTakenSeconds: json['time_spent_seconds'] as int? ?? (json['time_taken_seconds'] as int? ?? 0),
    );
  }
}
