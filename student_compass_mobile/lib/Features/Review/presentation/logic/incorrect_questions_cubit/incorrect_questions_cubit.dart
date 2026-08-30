import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_question_model.dart';
import 'package:student_compass_mobile/Features/Review/data/repos/review_repo.dart';

abstract class IncorrectQuestionsState {}

class IncorrectQuestionsInitial extends IncorrectQuestionsState {}

class IncorrectQuestionsLoading extends IncorrectQuestionsState {}

class IncorrectQuestionsSuccess extends IncorrectQuestionsState {
  final List<ExamQuestionModel> questions;
  IncorrectQuestionsSuccess({required this.questions});
}

class IncorrectQuestionsFailure extends IncorrectQuestionsState {
  final String errorMessage;
  final String? errorKey;
  IncorrectQuestionsFailure({required this.errorMessage, this.errorKey});
}

class IncorrectQuestionsCubit extends Cubit<IncorrectQuestionsState> {
  final ReviewRepo reviewRepo;

  IncorrectQuestionsCubit(this.reviewRepo) : super(IncorrectQuestionsInitial());

  Future<void> fetchIncorrectQuestions() async {
    emit(IncorrectQuestionsLoading());
    final result = await reviewRepo.fetchIncorrectQuestions();

    result.fold(
      (failure) => emit(
        IncorrectQuestionsFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (questions) => emit(IncorrectQuestionsSuccess(questions: questions)),
    );
  }
}
