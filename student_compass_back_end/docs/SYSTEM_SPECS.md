# ملف المواصفات التقنية للنظام (System Specifications Document)
## مشروع تطبيق "بوصلة الطالب (Student Compass)" (Laravel DDD & Clean Architecture)

---

## 1. المعمارية الهندسية للنظام (Architecture Overview)

تم بناء مشروع **"Student Compass (بوصلة الطالب)"** بالاعتماد على البنية النظيفة (**Clean Architecture**) والتصميم الموجه بالمجال (**Domain-Driven Design - DDD**) لضمان استقلالية قواعد العمل التعليمية والتقييمية عن التفاصيل التقنية والإطارات الخارجية، ولضمان أداء استثنائي لبنك أسئلة ضخم يتجاوز 50,000 سؤال.

### الطبقات الأربع الهيكلية (The 4 Architectural Layers):

```
┌─────────────────────────────────────────────────────────┐
│              Presentation Layer (Http/API)              │
│       Controllers, Form Requests, API Resources         │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Application Layer (Use Cases)             │
│   GetQuestionsByLessonUseCase, SubmitExamAnswers...     │
└──────────────┬──────────────────────────┬───────────────┘
               │                          │
               ▼                          ▼
┌────────────────────────────┐ ┌──────────────────────────┐
│        Domain Layer        │ │   Infrastructure Layer   │
│ Entities, Value Objects,   │ │ Persistence, Eloquent    │
│  Repository Interfaces     │ │   Models, Repositories   │
└────────────────────────────┘ └──────────────────────────┘
```

#### 1. طبقة المجال (Domain Layer):
- **الهدف:** تحتوي على كيانات الأعمال الأساسية والقوانين التقييمية لمستويات الطلاب والمناهج والأسئلة.
- **المكونات:**
  - **الكيانات (Domain Entities):** `UserEntity`, `SubjectEntity`, `UnitEntity`, `LessonEntity`, `QuestionEntity`, `ExamEntity`, `StudentProgressEntity`, `BookmarkEntity`.
  - **كائنات القيم (Value Objects):** `DifficultyLevel`, `QuestionType`, `UserRole`, `GradeLevel`, `ExamType`.
  - **عقود المستودعات (Repository Interfaces):** `SubjectRepositoryInterface`, `QuestionRepositoryInterface`, `ExamRepositoryInterface`, `StudentProgressRepositoryInterface`.

#### 2. طبقة التطبيق (Application Layer / Use Cases):
- **الهدف:** تنفيذ وإدارة العمليات والسيناريوهات التعليمية وتجربة الطالب.
- **المكونات:**
  - **حالات الاستخدام (Use Cases):**
    - `GetQuestionsByLessonUseCase`: جلب وتصفية الأسئلة حسب الدرس والصعوبة مع التخزين المؤقت (Caching).
    - `SubmitExamAnswersUseCase`: معالجة إجابات امتحانات الطلاب وتصحيحها وحساب النتيجة.
    - `TrackStudentProgressUseCase`: احتساب نسبة تقدم الطالب وإحصائيات نقاط القوة والضعف.
    - `ToggleBookmarkUseCase`: حفظ/إلغاء حفظ الأسئلة للمراجعة.
    - `ReportQuestionErrorUseCase`: رفع بلاغ عن مشكلة في سؤال.
  - **DTOs:** `ExamSubmissionDTO`, `QuestionFilterDTO`, `StudentAnalyticsDTO`.

#### 3. طبقة البنية التحتية (Infrastructure Layer):
- **الهدف:** التعامل مع التفاعل مع قاعدة البيانات من خلال Eloquent ORM والخدمات الخارجية.
- **المكونات:**
  - **`Persistence/Eloquent/Models`:** تحتوي على نماذج Eloquent الموزعة بشكل مستقل وسليم.
  - **`Persistence/Eloquent/Repositories`:** التنفيذ الفعلي لواجهات المستودعات (Eloquent Implementations).

#### 4. طبقة العرض والواجهات (Http / Presentation Layer):
- **الهدف:** استقبال طلبات الـ HTTP RESTful API للطلاب والمعلمين والمدراء وإرجاع استجابات JSON مهيكلة.
- **المكونات:**
  - **Controllers:** `SubjectController`, `LessonController`, `QuestionBankController`, `ExamController`, `StudentProgressController`.
  - **Requests:** `SubmitExamRequest`, `FilterQuestionsRequest`.
  - **Resources:** `QuestionResource`, `ExamResource`, `ProgressResource`.

---

## 2. المخطط التفصيلي لقواعد البيانات والأنظمة الفرعية (Database Schema & Subsystems)

تم تصميم قاعدة البيانات لتتحمل بنك أسئلة يتجاوز **50,000 سؤال** واستعلامات متزامنة من آلاف الطلاب عبر إضافة **الفهارس المركبة (Composite Indexes)** و **Foreign Key Constraints** مع عزل سليم.

### 1. جدول المستخدمين (`users`)
إدارة حسابات النظام (طلاب، أدمن، معلمون، مشرفون) والصفوف الدراسية.

| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد للمستخدم |
| `name` | `string` | Not Null | اسم المستخدم |
| `email` | `string` | Unique, Index, Not Null | البريد الإلكتروني |
| `password` | `string` | Not Null | كلمة المرور المشفرة |
| `role` | `enum` | student, teacher, admin, supervisor (Index) | الدور الوظيفي |
| `grade_level` | `string` | Nullable, Index | الصف الدراسي (مثل: "الثالث الثانوي") |
| `track` | `string` | Nullable, Index | الفرع / التخصص (علمي، أدبي، عام) |
| `phone` | `string` | Nullable, Index | رقم الهاتف |
| `avatar` | `string` | Nullable | الصورة الشخصية |
| `is_active` | `boolean` | Default: true, Index | حالة الحساب |
| `created_at` / `updated_at` | `timestamp` | Nullable | طوابع الوقت |
| `deleted_at` | `timestamp` | Soft Deletes | الحذف المرن |

### 2. جدول المواد الدراسية (`subjects`)
| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد للمادة |
| `name` | `string` | Not Null, Index | اسم المادة (مثال: الرياضيات، الفيزياء) |
| `code` | `string` | Unique, Not Null | كود المادة الفريد |
| `grade_level` | `string` | Not Null, Index | الصف الدراسي المستهدف |
| `track` | `string` | Nullable, Index | الفرع (علمي / أدبي) |
| `icon` | `string` | Nullable | أيقونة المادة |
| `is_active` | `boolean` | Default: true, Index | حالة تفعيل المادة |
| `created_at` / `updated_at` | `timestamp` | Nullable | طوابع الوقت |
| `deleted_at` | `timestamp` | Soft Deletes | الحذف المرن |

*الفهارس المركبة:* `index(['grade_level', 'track', 'is_active'])`

### 3. جدول الوحدات الدراسية (`units`)
| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد للوحدة |
| `subject_id` | `foreignId` | FK -> subjects, CascadeOnDelete, Index | المادة التابعة لها |
| `title` | `string` | Not Null | عنوان الوحدة |
| `unit_number` | `integer` | Default: 1 | رقم الوحدة |
| `order` | `integer` | Default: 0, Index | ترتيب الوحدة داخل المادة |
| `description` | `text` | Nullable | وصف الوحدة |
| `created_at` / `updated_at` | `timestamp` | Nullable | طوابع الوقت |
| `deleted_at` | `timestamp` | Soft Deletes | الحذف المرن |

*الفهارس المركبة:* `index(['subject_id', 'order'])`

### 4. جدول الدروس (`lessons`)
| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد للدرس |
| `unit_id` | `foreignId` | FK -> units, CascadeOnDelete, Index | الوحدة التابعة لها |
| `subject_id` | `foreignId` | FK -> subjects, CascadeOnDelete, Index | تسريع الاستعلامات مباشرة |
| `title` | `string` | Not Null, Index | عنوان الدرس |
| `lesson_number` | `integer` | Default: 1 | رقم الدرس |
| `order` | `integer` | Default: 0, Index | ترتيب الدرس بداخل الوحدة |
| `summary` | `longText` | Nullable | ملخص أو شرح الدرس |
| `created_at` / `updated_at` | `timestamp` | Nullable | طوابع الوقت |
| `deleted_at` | `timestamp` | Soft Deletes | الحذف المرن |

*الفهارس المركبة:* `index(['unit_id', 'order'])`, `index(['subject_id', 'unit_id'])`

### 5. جدول بنك الأسئلة الضخم (`questions`)
تم استيعاب أكثر من 50,000 سؤال مع تحسين أداء استعلامات العشوائية والتصفية حسب الدرس والصعوبة.

| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد للسؤال |
| `subject_id` | `foreignId` | FK -> subjects, CascadeOnDelete, Index | المادة |
| `unit_id` | `foreignId` | FK -> units, CascadeOnDelete, Index | الوحدة |
| `lesson_id` | `foreignId` | FK -> lessons, CascadeOnDelete, Index | الدرس |
| `question_text` | `text` | Not Null | نص السؤال |
| `question_image` | `string` | Nullable | رابط صورة أو توضيح للسؤال |
| `type` | `enum` | mcq, true_false, essay (Index) | نوع السؤال |
| `options` | `json` | Nullable | الخيارات (في حالة الاختيار من متعدد) |
| `correct_answer` | `text` | Not Null | الإجابة الصحيحة |
| `explanation` | `text` | Nullable | الشرح والتعليل الإرشادي |
| `difficulty` | `enum` | easy, medium, hard (Index) | مستوى الصعوبة |
| `points` | `integer` | Default: 1 | درجة السؤال |
| `is_active` | `boolean` | Default: true, Index | حالة السؤال |
| `created_by` | `foreignId` | FK -> users, NullOnDelete | المعلم/الادمن المنشئ |
| `created_at` / `updated_at` | `timestamp` | Nullable | طوابع الوقت |
| `deleted_at` | `timestamp` | Soft Deletes | الحذف المرن |

*الفهارس المركبة فائقة السرعة:*
- `index(['lesson_id', 'difficulty', 'is_active'])`
- `index(['subject_id', 'unit_id', 'lesson_id'])`
- `index(['type', 'difficulty'])`

### 6. جدول الامتحانات والتقييمات (`exams`)
| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد للامتحان |
| `subject_id` | `foreignId` | FK -> subjects, CascadeOnDelete, Index | المادة الدراسية |
| `unit_id` | `foreignId` | FK -> units, NullOnDelete, Nullable | الوحدة (إن كان امتحان وحدة) |
| `lesson_id` | `foreignId` | FK -> lessons, NullOnDelete, Nullable | الدرس (إن كان امتحان درس) |
| `title` | `string` | Not Null, Index | عنوان الامتحان |
| `type` | `enum` | practice, assessment, ministerial (Index) | نوع الامتحان (تجريبي، تقييمي، وزاري) |
| `duration_minutes` | `integer` | Default: 60 | مدة الامتحان بالدقائق |
| `total_marks` | `integer` | Default: 100 | الدرجة الكلية |
| `pass_marks` | `integer` | Default: 50 | درجة النجاح |
| `is_randomized` | `boolean` | Default: true | ترتيب الأسئلة عشوائياً |
| `is_published` | `boolean` | Default: true, Index | نشر الامتحان للطلاب |
| `created_by` | `foreignId` | FK -> users, NullOnDelete | منشئ الامتحان |
| `created_at` / `updated_at` | `timestamp` | Nullable | طوابع الوقت |
| `deleted_at` | `timestamp` | Soft Deletes | الحذف المرن |

### 7. جدول ربط أسئلة الامتحان (`exam_question`)
| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد |
| `exam_id` | `foreignId` | FK -> exams, CascadeOnDelete, Index | المعرف الفريد للامتحان |
| `question_id` | `foreignId` | FK -> questions, CascadeOnDelete, Index | المعرف الفريد للسؤال |
| `marks` | `integer` | Default: 1 | درجة السؤال في هذا الامتحان |
| `order` | `integer` | Default: 1 | ترتيب السؤال داخل الامتحان |

*الفهرس الفريد المركب:* `unique(['exam_id', 'question_id'])`

### 8. جدول تتبع تقدم وتقييم الطلاب (`student_progress`)
| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد للمحاولة |
| `user_id` | `foreignId` | FK -> users, CascadeOnDelete, Index | الطالب |
| `exam_id` | `foreignId` | FK -> exams, CascadeOnDelete, Index, Nullable | الامتحان (إن وجد) |
| `lesson_id` | `foreignId` | FK -> lessons, NullOnDelete, Index, Nullable | الدرس المعني |
| `score` | `decimal(5,2)` | Not Null, Index | الدرجة المحققة |
| `total_possible_score` | `decimal(5,2)` | Not Null | الدرجة العظمى |
| `percentage` | `decimal(5,2)` | Not Null, Index | النسبة المئوية (%) |
| `time_spent_seconds` | `integer` | Default: 0 | الوقت المستغرق بالثواني |
| `answers` | `json` | Nullable | تفاصيل الإجابات المقدمة |
| `status` | `enum` | passed, failed, in_progress (Index) | نتيجة المحاولة |
| `completed_at` | `dateTime` | Nullable, Index | تاريخ الإكمال |
| `created_at` / `updated_at` | `timestamp` | Nullable | طوابع الوقت |

*الفهارس المركبة:* `index(['user_id', 'exam_id'])`, `index(['user_id', 'status'])`

### 9. جدول العناصر المحفوظة للمراجعة (`bookmarks`)
| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد |
| `user_id` | `foreignId` | FK -> users, CascadeOnDelete, Index | الطالب |
| `question_id` | `foreignId` | FK -> questions, CascadeOnDelete, Index | السؤال المحفوظ |
| `notes` | `text` | Nullable | ملاحظات الطالب على السؤال |
| `created_at` / `updated_at` | `timestamp` | Nullable | طوابع الوقت |

*الفهرس الفريد المركب:* `unique(['user_id', 'question_id'])`

### 10. جدول بلاغات وسجلات أخطاء الأسئلة (`question_reports`)
| اسم الحقل | نوع البيانات | القيود والفهارس | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `bigIncrements` | Primary Key | المعرف الفريد البلاغ |
| `user_id` | `foreignId` | FK -> users, CascadeOnDelete, Index | الطالب/المعلم المبلغ |
| `question_id` | `foreignId` | FK -> questions, CascadeOnDelete, Index | السؤال المبلغ عنه |
| `report_type` | `enum` | typo, wrong_answer, unclear_image, other | نوع الخطأ |
| `description` | `text` | Not Null | شرح المشكلة |
| `status` | `enum` | pending, reviewed, resolved, rejected (Index) | حالة البلاغ |
| `admin_notes` | `text` | Nullable | ملاحظات الأدمن |
| `created_at` / `updated_at` | `timestamp` | Nullable | طوابع الوقت |

---

## 3. مسارات النماذج الـ Eloquent Models
توضع النماذج بداخل المجلد الخاص بها في طبقة البنية التحتية:
`app/Infrastructure/Persistence/Eloquent/Models/`
- `User.php`
- `Subject.php`
- `Unit.php`
- `Lesson.php`
- `Question.php`
- `Exam.php`
- `ExamQuestion.php`
- `StudentProgress.php`
- `Bookmark.php`
- `QuestionReport.php`
