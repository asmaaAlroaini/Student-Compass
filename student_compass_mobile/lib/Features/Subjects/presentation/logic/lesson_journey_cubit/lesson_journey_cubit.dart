import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Subjects/data/models/lesson_model.dart';
import 'package:student_compass_mobile/Features/Subjects/data/repos/subjects_repo.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/lesson_journey_cubit/lesson_journey_state.dart';

class LessonJourneyCubit extends Cubit<LessonJourneyState> {
  final SubjectsRepo subjectsRepo;
  LessonModel? currentLesson;

  LessonJourneyCubit(this.subjectsRepo) : super(LessonJourneyInitial());

  Future<void> fetchLessonDetails({required int lessonId}) async {
    emit(LessonJourneyLoading());
    final result = await subjectsRepo.fetchLessonDetails(lessonId: lessonId);

    result.fold(
      (failure) => emit(
        LessonJourneyFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (lesson) {
        currentLesson = lesson;
        emit(LessonJourneySuccess(lesson: lesson));
      },
    );
  }

  Future<void> updateStage({
    required int lessonId,
    required int stage,
    bool? isCompleted,
  }) async {
    final result = await subjectsRepo.updateLessonProgress(
      lessonId: lessonId,
      stage: stage,
      isCompleted: isCompleted,
    );

    result.fold(
      (failure) => emit(
        LessonJourneyFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (progressData) {
        emit(LessonJourneyProgressUpdated(progressData: progressData));
        // Refresh details
        fetchLessonDetails(lessonId: lessonId);
      },
    );
  }
}
