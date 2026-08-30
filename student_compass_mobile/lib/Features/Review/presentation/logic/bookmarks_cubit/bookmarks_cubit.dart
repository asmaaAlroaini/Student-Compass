import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_question_model.dart';
import 'package:student_compass_mobile/Features/Review/data/repos/review_repo.dart';

abstract class BookmarksState {}

class BookmarksInitial extends BookmarksState {}

class BookmarksLoading extends BookmarksState {}

class BookmarksSuccess extends BookmarksState {
  final List<ExamQuestionModel> questions;
  BookmarksSuccess({required this.questions});
}

class BookmarksFailure extends BookmarksState {
  final String errorMessage;
  final String? errorKey;
  BookmarksFailure({required this.errorMessage, this.errorKey});
}

class BookmarksCubit extends Cubit<BookmarksState> {
  final ReviewRepo reviewRepo;

  BookmarksCubit(this.reviewRepo) : super(BookmarksInitial());

  Future<void> fetchBookmarks() async {
    emit(BookmarksLoading());
    final result = await reviewRepo.fetchBookmarks();

    result.fold(
      (failure) => emit(
        BookmarksFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (questions) => emit(BookmarksSuccess(questions: questions)),
    );
  }

  Future<void> toggleBookmark({required int questionId}) async {
    await reviewRepo.toggleBookmark(questionId: questionId);
    fetchBookmarks();
  }
}
