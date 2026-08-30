import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Subjects/data/repos/subjects_repo.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/practice_questions_cubit/practice_questions_state.dart';

class PracticeQuestionsCubit extends Cubit<PracticeQuestionsState> {
  final SubjectsRepo subjectsRepo;

  PracticeQuestionsCubit(this.subjectsRepo) : super(PracticeQuestionsInitial());

  Future<void> fetchQuestions({required int lessonId}) async {
    emit(PracticeQuestionsLoading());
    final result = await subjectsRepo.fetchLessonQuestions(lessonId: lessonId);

    result.fold(
      (failure) => emit(
        PracticeQuestionsFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (questions) => emit(PracticeQuestionsSuccess(questions: questions)),
    );
  }
}
