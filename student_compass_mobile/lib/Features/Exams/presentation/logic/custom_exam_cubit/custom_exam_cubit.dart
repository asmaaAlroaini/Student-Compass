import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/custom_exam_request_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/repos/exams_repo.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/custom_exam_cubit/custom_exam_state.dart';

class CustomExamCubit extends Cubit<CustomExamState> {
  final ExamsRepo examsRepo;

  CustomExamCubit(this.examsRepo) : super(CustomExamInitial());

  Future<void> generateCustomExam({
    required CustomExamRequestModel request,
  }) async {
    emit(CustomExamLoading());
    final result = await examsRepo.generateCustomExam(request: request);
    result.fold(
      (failure) => emit(
        CustomExamFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (exam) => emit(CustomExamSuccess(exam: exam)),
    );
  }
}
