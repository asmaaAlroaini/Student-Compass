import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Exams/data/repos/exams_repo.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/exams_cubit/exams_state.dart';

class ExamsCubit extends Cubit<ExamsState> {
  final ExamsRepo examsRepo;

  ExamsCubit(this.examsRepo) : super(ExamsInitial());

  Future<void> fetchExams({int? subjectId, String? type}) async {
    emit(ExamsLoading());
    final result =
        await examsRepo.fetchExams(subjectId: subjectId, type: type);
    result.fold(
      (failure) => emit(
        ExamsFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (exams) => emit(ExamsSuccess(exams: exams)),
    );
  }
}
