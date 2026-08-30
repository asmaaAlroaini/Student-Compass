import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Subjects/data/repos/subjects_repo.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/unit_lessons_cubit/unit_lessons_state.dart';

class UnitLessonsCubit extends Cubit<UnitLessonsState> {
  final SubjectsRepo subjectsRepo;

  UnitLessonsCubit(this.subjectsRepo) : super(UnitLessonsInitial());

  Future<void> fetchUnitLessons({
    required int subjectId,
    required int unitId,
  }) async {
    emit(UnitLessonsLoading());
    final result = await subjectsRepo.fetchUnitLessons(
      subjectId: subjectId,
      unitId: unitId,
    );

    result.fold(
      (failure) => emit(
        UnitLessonsFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (lessons) => emit(UnitLessonsSuccess(lessons: lessons)),
    );
  }
}
