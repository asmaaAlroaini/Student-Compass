abstract class StudentProgressState {}

class StudentProgressInitial extends StudentProgressState {}

class StudentProgressLoading extends StudentProgressState {}

class StudentProgressSuccess extends StudentProgressState {
  final Map<String, dynamic> data;

  StudentProgressSuccess({required this.data});

  Map<String, dynamic> get summary =>
      (data['summary'] is Map<String, dynamic>) ? data['summary'] as Map<String, dynamic> : {};

  List<dynamic> get subjectBreakdown =>
      (data['subject_breakdown'] is List) ? data['subject_breakdown'] as List : [];

  List<dynamic> get history =>
      (data['history'] is List) ? data['history'] as List : [];
}

class StudentProgressFailure extends StudentProgressState {
  final String errorMessage;
  final String? errorKey;

  StudentProgressFailure({required this.errorMessage, this.errorKey});
}
