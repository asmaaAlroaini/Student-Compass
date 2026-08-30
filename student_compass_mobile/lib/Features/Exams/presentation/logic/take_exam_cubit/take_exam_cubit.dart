import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student_compass_mobile/Features/Exams/data/models/exam_model.dart';
import 'package:student_compass_mobile/Features/Exams/data/repos/exams_repo.dart';
import 'package:student_compass_mobile/Features/Exams/presentation/logic/take_exam_cubit/take_exam_state.dart';

class TakeExamCubit extends Cubit<TakeExamState> {
  final ExamsRepo examsRepo;
  Timer? _timer;

  TakeExamCubit(this.examsRepo) : super(TakeExamInitial());

  @override
  Future<void> close() {
    _timer?.cancel();
    return super.close();
  }

  void initializeExam(ExamModel exam) {
    _timer?.cancel();
    final totalSec = exam.durationMinutes * 60;

    emit(
      TakeExamActive(
        exam: exam,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        remainingSeconds: totalSec,
        totalSeconds: totalSec,
      ),
    );

    _startTimer();
  }

  Future<void> loadExamAndStart(int examId) async {
    emit(TakeExamLoading());
    final result = await examsRepo.fetchExamDetails(examId: examId);
    result.fold(
      (failure) => emit(
        TakeExamFailure(
          errorMessage: failure.errorMessage,
          errorKey: failure.errorKey,
        ),
      ),
      (exam) => initializeExam(exam),
    );
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state is TakeExamActive) {
        final activeState = state as TakeExamActive;
        if (activeState.remainingSeconds <= 1) {
          timer.cancel();
          submitExam();
        } else {
          emit(
            activeState.copyWith(
              remainingSeconds: activeState.remainingSeconds - 1,
            ),
          );
        }
      } else {
        timer.cancel();
      }
    });
  }

  void selectAnswer(int questionId, String answer) {
    if (state is! TakeExamActive) return;
    final activeState = state as TakeExamActive;
    final updatedAnswers = Map<int, String>.from(activeState.selectedAnswers);
    updatedAnswers[questionId] = answer;
    emit(activeState.copyWith(selectedAnswers: updatedAnswers));
  }

  void nextQuestion() {
    if (state is! TakeExamActive) return;
    final activeState = state as TakeExamActive;
    if (activeState.currentQuestionIndex <
        activeState.exam.questions.length - 1) {
      emit(
        activeState.copyWith(
          currentQuestionIndex: activeState.currentQuestionIndex + 1,
        ),
      );
    }
  }

  void previousQuestion() {
    if (state is! TakeExamActive) return;
    final activeState = state as TakeExamActive;
    if (activeState.currentQuestionIndex > 0) {
      emit(
        activeState.copyWith(
          currentQuestionIndex: activeState.currentQuestionIndex - 1,
        ),
      );
    }
  }

  void jumpToQuestion(int index) {
    if (state is! TakeExamActive) return;
    final activeState = state as TakeExamActive;
    if (index >= 0 && index < activeState.exam.questions.length) {
      emit(activeState.copyWith(currentQuestionIndex: index));
    }
  }

  Future<void> submitExam() async {
    if (state is! TakeExamActive) return;
    final activeState = state as TakeExamActive;
    if (activeState.isSubmitting) return;

    _timer?.cancel();
    emit(activeState.copyWith(isSubmitting: true));

    final timeSpent = activeState.totalSeconds - activeState.remainingSeconds;

    final formattedAnswers = activeState.exam.questions.map((q) {
      return {
        'question_id': q.id,
        'student_answer': activeState.selectedAnswers[q.id],
      };
    }).toList();

    final result = await examsRepo.submitExam(
      examId: activeState.exam.id,
      answers: formattedAnswers,
      timeSpentSeconds: timeSpent,
    );

    result.fold(
      (failure) {
        emit(
          TakeExamFailure(
            errorMessage: failure.errorMessage,
            errorKey: failure.errorKey,
          ),
        );
      },
      (examResult) => emit(TakeExamSubmitSuccess(result: examResult)),
    );
  }
}
