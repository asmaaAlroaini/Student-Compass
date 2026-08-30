# دليل الموديلز وربط الباك إند (Database Models & Backend API Mapping Guide)

تُقدم هذه الوثيقة تحليلاً استراتيجياً كاملاً لجميع الموديلز (Data Models) المطلوبة لكل فيتشر في تطبيق **Student Compass Mobile**، استناداً المباشر على جداول قواعد البيانات ومسارات الـ API في مشروع الباك إند (`student_compass_back_end`).

---

## 1. البنية العامة لإنشاء الموديلز في التطبيق (Model Standard)

تتبع جميع الموديلز في مجلدات `lib/Features/[Feature]/data/models/` المبادئ التالية:

1. **الاستقلالية والحماية (Immutability)**:
   * تحويل جميع الحقول إلى `final`.
2. **التحويل لـ JSON (`fromJson` & `toJson`)**:
   * صياغة `factory Model.fromJson(Map<String, dynamic> json)` دقيقة مع التعامل الذكي مع الأنواع (التحويل لـ `int`, `double`, `bool` بأمان).
   * تقديم دالة `Map<String, dynamic> toJson()` للبيانات المرسلة للباك إند.
3. **التعامل الأمني مع Null Safety**:
   * الحقول الاختيارية أو القابلة لـ NULL في قاعدة البيانات يتم تعريفها كـ Nullable (`Type?`).
   * إعطاء قيم افتراضية (Default values) عند غياب البيانات من الـ JSON.

---

## 2. تفاصيل الموديلز حسب الفيتشرات (Feature-by-Feature Models)

---

### أولاً: فيتشر التوثيق والمستخدمين (Auth Feature)

#### 1. `UserModel`
* **المسار في الموبايل**: `lib/Features/Auth/data/models/user/user.dart`
* **الجدول المقابل**: `users`
* **الباك إند Endpoints**: `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/me`, `/api/v1/student/profile`
* **الحقول في Dart**:
  ```dart
  class UserModel {
    final int id;
    final String name;
    final String email;
    final String role; // 'student', 'teacher', 'admin', 'supervisor'
    final String? gradeLevel; // الصف الدراسي
    final String? track; // الفرع (علمي / أدبي)
    final String? phone;
    final String? avatar;
    final bool isActive;
    final String? token; // Sanctum Token عند التسجيل/الدخول

    const UserModel({
      required this.id,
      required this.name,
      required this.email,
      required this.role,
      this.gradeLevel,
      this.track,
      this.phone,
      this.avatar,
      this.isActive = true,
      this.token,
    });

    factory UserModel.fromJson(Map<String, dynamic> json) {
      return UserModel(
        id: json['id'] as int,
        name: json['name'] as String? ?? '',
        email: json['email'] as String? ?? '',
        role: json['role'] as String? ?? 'student',
        gradeLevel: json['grade_level'] as String?,
        track: json['track'] as String?,
        phone: json['phone'] as String?,
        avatar: json['avatar'] as String?,
        isActive: json['is_active'] == 1 || json['is_active'] == true,
        token: json['token'] as String?,
      );
    }

    Map<String, dynamic> toJson() {
      return {
        'id': id,
        'name': name,
        'email': email,
        'role': role,
        'grade_level': gradeLevel,
        'track': track,
        'phone': phone,
        'avatar': avatar,
        'is_active': isActive,
        if (token != null) 'token': token,
      };
    }
  }
  ```

#### 2. `LoginRequestModel` & `RegisterRequestModel`
* **الحقول المبعوثة لـ API**:
  * `LoginRequestModel`: `{email, password}`
  * `RegisterRequestModel`: `{name, email, password, password_confirmation, grade_level, track, phone}`

#### 3. `DepartmentModel`
* **المسار**: `lib/Features/Auth/data/models/user/department.dart`
* **استخدامه**: تخصصات الطلاب / المسارات العلمية والأدبية.

---

### ثانياً: فيتشر المواد والدروس (Subjects & Units Feature)

#### 1. `SubjectModel`
* **المسار المقترح**: `lib/Features/Subjects/data/models/subject_model.dart`
* **الجدول المقابل**: `subjects`
* **الباك إند Endpoints**: `/api/v1/student/subjects`
* **الحقول في Dart**:
  ```dart
  class SubjectModel {
    final int id;
    final String name;
    final String code;
    final String gradeLevel;
    final String? track;
    final String? icon;
    final bool isActive;

    const SubjectModel({
      required this.id,
      required this.name,
      required this.code,
      required this.gradeLevel,
      this.track,
      this.icon,
      this.isActive = true,
    });

    factory SubjectModel.fromJson(Map<String, dynamic> json) => SubjectModel(
          id: json['id'] as int,
          name: json['name'] as String,
          code: json['code'] as String,
          gradeLevel: json['grade_level'] as String,
          track: json['track'] as String?,
          icon: json['icon'] as String?,
          isActive: json['is_active'] == 1 || json['is_active'] == true,
        );

    Map<String, dynamic> toJson() => {
          'id': id,
          'name': name,
          'code': code,
          'grade_level': gradeLevel,
          'track': track,
          'icon': icon,
          'is_active': isActive,
        };
  }
  ```

#### 2. `UnitModel`
* **الجدول المقابل**: `units`
* **الحقول في Dart**: `id`, `subjectId`, `title`, `unitNumber`, `order`, `description`.

#### 3. `LessonModel`
* **الجدول المقابل**: `lessons`
* **الباك إند Endpoints**: `/api/v1/student/lessons/{id}`
* **الحقول في Dart**: `id`, `unitId`, `subjectId`, `title`, `lessonNumber`, `order`, `summary`, `videoUrl`, `pdfPath`.

---

### ثالثاً: فيتشر الأسئلة والاختبارات (Exams & Questions Feature)

#### 1. `QuestionModel`
* **المسار المقترح**: `lib/Features/Questions/data/models/question_model.dart`
* **الجدول المقابل**: `questions`
* **الباك إند Endpoints**: `/api/v1/student/questions`, `/api/v1/student/lessons/{id}/questions`
* **الحقول في Dart**:
  ```dart
  class QuestionModel {
    final int id;
    final int subjectId;
    final int unitId;
    final int lessonId;
    final String questionText;
    final String? questionImage;
    final String type; // 'mcq', 'true_false', 'essay'
    final List<String> options; // مصفوفة الخيارات
    final String correctAnswer;
    final String? explanation;
    final String difficulty; // 'easy', 'medium', 'hard'
    final int? year; // السنة الوزارية
    final int points;

    const QuestionModel({
      required this.id,
      required this.subjectId,
      required this.unitId,
      required this.lessonId,
      required this.questionText,
      this.questionImage,
      required this.type,
      required this.options,
      required this.correctAnswer,
      this.explanation,
      required this.difficulty,
      this.year,
      this.points = 1,
    });

    factory QuestionModel.fromJson(Map<String, dynamic> json) {
      List<String> parsedOptions = [];
      if (json['options'] != null) {
        if (json['options'] is List) {
          parsedOptions = List<String>.from(json['options']);
        }
      }
      return QuestionModel(
        id: json['id'] as int,
        subjectId: json['subject_id'] as int,
        unitId: json['unit_id'] as int,
        lessonId: json['lesson_id'] as int,
        questionText: json['question_text'] as String,
        questionImage: json['question_image'] as String?,
        type: json['type'] as String? ?? 'mcq',
        options: parsedOptions,
        correctAnswer: json['correct_answer'] as String,
        explanation: json['explanation'] as String?,
        difficulty: json['difficulty'] as String? ?? 'medium',
        year: json['year'] as int?,
        points: json['points'] as int? ?? 1,
      );
    }
  }
  ```

#### 2. `ExamModel`
* **الجدول المقابل**: `exams`
* **الباك إند Endpoints**: `/api/v1/student/exams`
* **الحقول في Dart**: `id`, `subjectId`, `unitId`, `lessonId`, `title`, `type` ('practice', 'assessment', 'ministerial'), `durationMinutes`, `totalMarks`, `passMarks`, `isRandomized`, `isPublished`, `questions` (List of `QuestionModel`).

#### 3. `QuestionReportModel`
* **الجدول المقابل**: `question_reports`
* **الحقول**: `id`, `questionId`, `reportType` ('typo', 'wrong_answer', 'unclear_image', 'other'), `description`, `status`.

---

### رابعاً: فيتشر تقدم الطالب والمفضلات (Progress & Bookmarks Feature)

#### 1. `StudentProgressModel`
* **الجدول المقابل**: `student_progress`
* **الباك إند Endpoints**: `/api/v1/student/progress`, `/api/v1/student/exams/submit`
* **الحقول في Dart**:
  ```dart
  class StudentProgressModel {
    final int id;
    final int userId;
    final int? examId;
    final int? lessonId;
    final double score;
    final double totalPossibleScore;
    final double percentage;
    final int timeSpentSeconds;
    final Map<String, dynamic>? answers; // إجابات الطالب
    final String status; // 'passed', 'failed', 'in_progress'
    final String? completedAt;

    const StudentProgressModel({
      required this.id,
      required this.userId,
      this.examId,
      this.lessonId,
      required this.score,
      required this.totalPossibleScore,
      required this.percentage,
      required this.timeSpentSeconds,
      this.answers,
      required this.status,
      this.completedAt,
    });
  }
  ```

#### 2. `BookmarkModel`
* **الجدول المقابل**: `bookmarks`
* **الحقول في Dart**: `id`, `userId`, `questionId`, `notes`, `question` (`QuestionModel`).

---

### خامساً: فيتشر خطة الدراسة والمهام (Study Plans Feature)

#### 1. `StudyPlanModel` & `StudyTaskModel`
* **الداول المقابلة**: `study_plans` & `study_tasks`
* **الباك إند Endpoints**: `/api/v1/student/study-plans`
* **الحقول في Dart**:
  * `StudyPlanModel`: `id`, `planDate`, `totalTasks`, `completedTasks`, `progressPercentage`, `tasks` (List of `StudyTaskModel`).
  * `StudyTaskModel`: `id`, `studyPlanId`, `subjectId`, `lessonId`, `taskName`, `taskType` ('review_lesson', 'watch_video', 'solve_questions', 'short_quiz', 'review_errors'), `estimatedMinutes`, `status` ('not_started', 'in_progress', 'completed').

---

### سادساً: فيتشر التنبيهات (Notifications Feature)

#### 1. `NotificationModel`
* **الجدول المقابل**: `notifications`
* **الباك إند Endpoints**: `/api/v1/notifications`
* **الحقول في Dart**: `id`, `title`, `message`, `type` ('study_reminder', 'exam_result', 'new_content', 'competition', 'admin_announcement'), `isRead`, `createdAt`.

---

### سابعاً: فيتشر المسابقات والمنافسات (Competitions Feature)

#### 1. `CompetitionModel` & `CompetitionResultModel`
* **الجداول المقابلة**: `competitions` & `competition_results`
* **الباك إند Endpoints**: `/api/v1/student/competitions`
* **الحقول في Dart**:
  * `CompetitionModel`: `id`, `title`, `description`, `subjectId`, `questionCount`, `durationMinutes`, `pointsReward`, `startTime`, `endTime`, `isActive`.
  * `CompetitionResultModel`: `id`, `competitionId`, `userId`, `scorePercentage`, `correctAnswers`, `totalQuestions`, `timeSpentSeconds`, `pointsEarned`, `completedAt`.

---

## 3. خريطة توصيل الخدمات (API Endpoint to Model Mapping Summary)

| الفيتشر | الموديل الأساسي | الـ Endpoints المقابلة في الباك إند |
| :--- | :--- | :--- |
| **Auth** | `UserModel` | `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/auth/me` |
| **Subjects** | `SubjectModel` | `GET /api/v1/student/subjects` |
| **Units & Lessons**| `UnitModel`, `LessonModel` | `GET /api/v1/student/subjects/{id}/units`, `GET /api/v1/student/lessons/{id}` |
| **Questions** | `QuestionModel` | `GET /api/v1/student/questions`, `GET /api/v1/student/lessons/{id}/questions` |
| **Exams** | `ExamModel` | `GET /api/v1/student/exams`, `POST /api/v1/student/exams/{id}/submit` |
| **Progress** | `StudentProgressModel` | `GET /api/v1/student/progress` |
| **Bookmarks** | `BookmarkModel` | `GET /api/v1/student/bookmarks`, `POST /api/v1/student/bookmarks` |
| **Study Plans** | `StudyPlanModel`, `StudyTaskModel`| `GET /api/v1/student/study-plans`, `PATCH /api/v1/student/study-tasks/{id}` |
| **Notifications** | `NotificationModel` | `GET /api/v1/notifications`, `PATCH /api/v1/notifications/{id}/read` |
| **Competitions** | `CompetitionModel`, `CompetitionResultModel` | `GET /api/v1/student/competitions`, `POST /api/v1/student/competitions/{id}/submit` |
