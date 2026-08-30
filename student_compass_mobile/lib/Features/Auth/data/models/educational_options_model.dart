class GradeLevelOption {
  final String id;
  final String name;
  final List<String> tracks;

  GradeLevelOption({
    required this.id,
    required this.name,
    required this.tracks,
  });

  factory GradeLevelOption.fromJson(Map<String, dynamic> json) {
    return GradeLevelOption(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      tracks: (json['tracks'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
    );
  }
}

class TrackOption {
  final String id;
  final String name;

  TrackOption({
    required this.id,
    required this.name,
  });

  factory TrackOption.fromJson(Map<String, dynamic> json) {
    return TrackOption(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
    );
  }
}

class EducationalOptionsModel {
  final List<GradeLevelOption> gradeLevels;
  final List<TrackOption> tracks;

  EducationalOptionsModel({
    required this.gradeLevels,
    required this.tracks,
  });

  factory EducationalOptionsModel.fromJson(Map<String, dynamic> json) {
    final data = json['data'] is Map<String, dynamic>
        ? json['data'] as Map<String, dynamic>
        : json;

    final rawGrades = data['grade_levels'] as List<dynamic>? ?? [];
    final rawTracks = data['tracks'] as List<dynamic>? ?? [];

    return EducationalOptionsModel(
      gradeLevels: rawGrades
          .map((e) => GradeLevelOption.fromJson(e as Map<String, dynamic>))
          .toList(),
      tracks: rawTracks
          .map((e) => TrackOption.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  factory EducationalOptionsModel.defaultOptions() {
    return EducationalOptionsModel(
      gradeLevels: [
        GradeLevelOption(
          id: 'الثالث الثانوي',
          name: 'الثالث الثانوي',
          tracks: ['علمي', 'أدبي'],
        ),
        GradeLevelOption(
          id: 'الثاني الثانوي',
          name: 'الثاني الثانوي',
          tracks: ['علمي', 'أدبي'],
        ),
        GradeLevelOption(
          id: 'الأول الثانوي',
          name: 'الأول الثانوي',
          tracks: ['عام'],
        ),
      ],
      tracks: [
        TrackOption(id: 'علمي', name: 'علمي'),
        TrackOption(id: 'أدبي', name: 'أدبي'),
        TrackOption(id: 'عام', name: 'عام'),
      ],
    );
  }
}
