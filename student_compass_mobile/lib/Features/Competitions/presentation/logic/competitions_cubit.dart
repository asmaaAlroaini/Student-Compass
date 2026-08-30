import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Competitions/data/models/competition_model.dart';
import 'package:student_compass_mobile/Features/Competitions/data/repos/competitions_repo.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';

// ====== States ======
abstract class CompetitionsState {}
class CompetitionsInitial extends CompetitionsState {}
class CompetitionsLoading extends CompetitionsState {}
class CompetitionsSuccess extends CompetitionsState {
  final List<CompetitionModel> competitions;
  CompetitionsSuccess({required this.competitions});
}
class CompetitionsFailure extends CompetitionsState {
  final String errorMessage;
  final String? errorKey;
  CompetitionsFailure({required this.errorMessage, this.errorKey});
}

// ====== Cubit ======
class CompetitionsCubit extends Cubit<CompetitionsState> {
  final CompetitionsRepo repo;
  CompetitionsCubit(this.repo) : super(CompetitionsInitial());

  Future<void> fetchCompetitions() async {
    emit(CompetitionsLoading());
    final result = await repo.fetchCompetitions();
    result.fold(
      (f) => emit(CompetitionsFailure(errorMessage: f.errorMessage, errorKey: f.errorKey)),
      (list) => emit(CompetitionsSuccess(competitions: list)),
    );
  }
}

// ====== Leaderboard States & Cubit ======
abstract class LeaderboardState {}
class LeaderboardInitial extends LeaderboardState {}
class LeaderboardLoading extends LeaderboardState {}
class LeaderboardSuccess extends LeaderboardState {
  final List<LeaderboardEntryModel> entries;
  LeaderboardSuccess({required this.entries});
}
class LeaderboardFailure extends LeaderboardState {
  final String errorMessage;
  final String? errorKey;
  LeaderboardFailure({required this.errorMessage, this.errorKey});
}

class LeaderboardCubit extends Cubit<LeaderboardState> {
  final CompetitionsRepo repo;
  LeaderboardCubit(this.repo) : super(LeaderboardInitial());

  Future<void> fetchLeaderboard({required int competitionId}) async {
    emit(LeaderboardLoading());
    final result = await repo.fetchLeaderboard(competitionId: competitionId);
    result.fold(
      (f) => emit(LeaderboardFailure(errorMessage: f.errorMessage, errorKey: f.errorKey)),
      (entries) => emit(LeaderboardSuccess(entries: entries)),
    );
  }
}

// ====== Take Competition States & Cubit ======
abstract class TakeCompetitionState {}
class TakeCompetitionInitial extends TakeCompetitionState {}
class TakeCompetitionLoading extends TakeCompetitionState {}
class TakeCompetitionReady extends TakeCompetitionState {
  final ExamModel exam;
  TakeCompetitionReady({required this.exam});
}
class TakeCompetitionSubmitted extends TakeCompetitionState {
  final Map<String, dynamic> result;
  TakeCompetitionSubmitted({required this.result});
}
class TakeCompetitionFailure extends TakeCompetitionState {
  final String errorMessage;
  final String? errorKey;
  TakeCompetitionFailure({required this.errorMessage, this.errorKey});
}

class TakeCompetitionCubit extends Cubit<TakeCompetitionState> {
  final CompetitionsRepo repo;
  TakeCompetitionCubit(this.repo) : super(TakeCompetitionInitial());

  Future<void> startCompetition({required int competitionId}) async {
    emit(TakeCompetitionLoading());
    final result = await repo.fetchCompetitionQuestions(competitionId: competitionId);
    result.fold(
      (f) => emit(TakeCompetitionFailure(errorMessage: f.errorMessage, errorKey: f.errorKey)),
      (exam) => emit(TakeCompetitionReady(exam: exam)),
    );
  }

  Future<void> submitCompetition({
    required int competitionId,
    required List<Map<String, dynamic>> answers,
    required int timeSpentSeconds,
  }) async {
    emit(TakeCompetitionLoading());
    final result = await repo.submitCompetition(
      competitionId: competitionId,
      answers: answers,
      timeSpentSeconds: timeSpentSeconds,
    );
    result.fold(
      (f) => emit(TakeCompetitionFailure(errorMessage: f.errorMessage, errorKey: f.errorKey)),
      (data) => emit(TakeCompetitionSubmitted(result: data)),
    );
  }
}
