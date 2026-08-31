import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Review/data/repos/review_repo.dart';
import 'package:student_compass_mobile/Features/Review/presentation/logic/student_progress_cubit/student_progress_state.dart';

class StudentProgressCubit extends Cubit<StudentProgressState> {
  final ReviewRepo reviewRepo;

  StudentProgressCubit(this.reviewRepo) : super(StudentProgressInitial());

  Future<void> fetchProgress() async {
    emit(StudentProgressLoading());
    final result = await reviewRepo.fetchStudentProgress();

    result.fold(
      (failure) => emit(
        StudentProgressFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (data) => emit(StudentProgressSuccess(data: data)),
    );
  }
}
