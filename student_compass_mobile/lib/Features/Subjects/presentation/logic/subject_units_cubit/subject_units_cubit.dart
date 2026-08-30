import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Subjects/data/repos/subjects_repo.dart';
import 'package:student_compass_mobile/Features/Subjects/presentation/logic/subject_units_cubit/subject_units_state.dart';

class SubjectUnitsCubit extends Cubit<SubjectUnitsState> {
  final SubjectsRepo subjectsRepo;
  SubjectUnitsCubit(this.subjectsRepo) : super(SubjectUnitsInitial());

  Future<void> fetchSubjectUnits({required int subjectId}) async {
    emit(SubjectUnitsLoading());
    var result = await subjectsRepo.fetchSubjectUnits(subjectId: subjectId);
    result.fold(
      (failure) => emit(
        SubjectUnitsFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (units) => emit(SubjectUnitsSuccess(units: units)),
    );
  }
}
