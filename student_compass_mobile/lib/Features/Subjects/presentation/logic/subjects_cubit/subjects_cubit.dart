import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Subjects/data/repos/subjects_repo.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subjects_cubit/subjects_state.dart';

class SubjectsCubit extends Cubit<SubjectsState> {
  final SubjectsRepo subjectsRepo;
  SubjectsCubit(this.subjectsRepo) : super(SubjectsInitial());

  Future<void> fetchSubjects() async {
    emit(SubjectsLoading());
    var result = await subjectsRepo.fetchSubjects();
    result.fold(
      (failure) => emit(
        SubjectsFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (subjects) => emit(SubjectsSuccess(subjects: subjects)),
    );
  }
}
