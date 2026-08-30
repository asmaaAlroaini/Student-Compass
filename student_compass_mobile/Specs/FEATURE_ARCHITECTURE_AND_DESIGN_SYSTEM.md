# دليل هيكلة الفيتشرات ونظام التصميم (Feature Architecture & Design System Guide)

تُحدد هذه الوثيقة المعايير والقواعد الهندسية التفصيلية لبناء وتطوير الفيتشرات (Features) في تطبيق **Student Compass Mobile**، اعتماداً على التحليل المستخلص من فيتشر `Auth` والالتزام التام بتوظيف مجلد الـ `Core` ونظام تصميم قوي لضمان أعلى مستويات الجودة والنظافة في الكود والجمالية في الواجهات.

---

## 1. فلسفة الهيكلة (Architecture Overview)

يعتمد المشروع على نمط **Clean Architecture** مدمجاً مع **Feature-First Pattern**، حيث يتم تقسم كل فيتشر في التطبيق بشكل مستقل تماماً إلى ثلاث طبقات رئيسية:

```text
lib/Features/[FeatureName]/
├── data/
│   ├── models/        # الموديلز ومطابقة الهياكل لـ JSON
│   └── repos/         # الواجهات التجريدية والـ Implementation للـ Repositories
└── presentation/
    ├── logic/         # الـ Cubits / Blocs لإدارة حالة الصفحة
    └── views/         # الشاشات والـ Widgets المنفصلة
        └── widgets/   # الويدجيتات الجزئية المعزولة
```

---

## 2. تحليل هيكلة فيتشر `Auth` الحالي (Case Study)

عند معاينة فيتشر `Auth` الحالي (`student_compass_mobile/lib/Features/Auth`) نجد التطبيق المثالي لهذا النمط:

### أ) طبقة البيانات (`data/`)
* **`models/`**: تحتوي على كلاسات البيانات المسؤولة عن تحويل الـ JSON واستقبال الاستجابات مثل:
  * `user/user.dart`: يمثل كائن المستخدم الأساسي البيانات المعادة من الباك إند.
  * `user/department.dart`: الموديل المساعد للتخصصات أو الأقسام.
  * `reset_password.dart`: كائن طلب إعادة تعيين كلمة المرور.
* **`repos/`**:
  * **نمط إرجاع المستودعات الصارم (`Future<Either<Failure, T>>`)**: يجب أن تُرجع جميع الدوال بداخل الـ Repositories القيمة من نوع `Future<Either<Failure, T>>` (باستخدام مكتبة `dartz`).
  * `auth_repo.dart`: العقود التجريدية (Abstract Class) للتفاعلات مثل `login()`, `signUp()`, `verifyCode()`, `resetPassword()`. تُرجع جميعها النوع `Future<Either<Failure, T>>`.
  * `auth_repo_impl.dart`: التنفيذ الفعلي للعقد وتمرير الطلبات إلى `ApiService` وتغليف الاستجابات لمعالجة الأخطاء السليمة بإرجاع `Left(Failure)` في حال الفشل أو `Right(Data)` في حال النجاح.

### ب) طبقة منطق الواجهات (`presentation/logic/`)
تُفصل كل عملية إلى Cubit مستقل مع الحالات الخاصة به (Initial, Loading, Success, Failure).
* **نمط معالجة النتائج الصارم في الـ Cubit**:
  يجب أن يتبع استدعاء الـ Repo في أي Cubit النمط المعياري التالي:
  ```dart
  emit(FeatureLoading());
  var result = await repo.someAction();
  result.fold(
    (failure) => emit(
      FeatureFailure(
        errorMessage: failure.errorMessage,
        errorKey: failure.errorKey,
      ),
    ),
    (data) => emit(FeatureSuccess(data: data)),
  );
  ```
* `login_cubit/`: إدارة عملية تسجيل الدخول.
* `register_cubit/`: إدارة تسجيل حساب جديد.
* `verify_code_cubit/`: إدارة التحقق من كود التفعيل (OTP).
* `reset_password_request_cubit/` & `reset_password_cubit/`: إدارة استعادة كلمة المرور.
* `logout_cubit/`: إدارة تسجيل الخروج.

### ج) طبقة العرض والواجهات (`presentation/views/`)
تتبع قاعدة الفصل التام بين العرض والهيكل التفاعلي:
1. **الـ View الرئيسية (Declartive Entry point)**: مثل `login_view.dart`:
   * تحتوي فقط على `Scaffold` وتغليف الـ Body بـ `BlocProvider` (إن لم يكن مغلفاً على مستوى أعم).
   * لا تحتوي على أي كود UI تفصيلي أو Controllers.
2. **جسم الشاشة (`widgets/login_view_body.dart`)**:
   * يحتوي على التنسيق العام للشاشة (الـ ScrollView, Padding, Background gradients).
   * يدمج الشعار والـ Forms العلوية والسفلية.
3. **النماذج والـ Widgets المعزولة**:
   * `login_form.dart`: يحوي الـ Form Key والـ Form Fields والـ Validation والـ Buttons.
   * `remember_me_widget.dart`: ويدجيت معزول لخاصية تذكرني.
   * `has_an_account.dart`: ويدجيت التنقل بين التسجيل وتسجيل الدخول.
   * `custom_gradient_text.dart`: ويدجيت مخصص لعرض النصوص المتدرجة.

---

## 3. قواعد التفكيك وتنسيق الويدجيتات (Widget Isolation Rules)

لكي تظل جميع الفيتشرات المستقبليّة قابلة للصيانة والتطوير، يجب الالتزام الصارم بالقواعد التالية:

1. **قاعدة الـ Single Responsibility للويدجيت**:
   * يمنع منعاً باتاً كتابة ويدجيت يتجاوز 120-150 سطراً في ملف واحد.
   * كل عنصر له وظيفة أو شكل مستقل (مثل زر التذكر، نموذج الإدخال، حقل رفع الصور `upload_file.dart`) يجب أن يوضع في ملف مستقل في مجلد `views/widgets/`.
2. **عزل النماذج (Form Extraction)**:
   * يجب أن يوضع الـ `GlobalKey<FormState>` داخل الـ Form Widget المستقل وليس في الـ ViewBody.
3. **عدم خلط التنسيق بالمنطق (Decoupled Logic & UI)**:
   * يمنع استدعاء API أو معالجة داتا مباشرة داخل الـ Widget `build()` method.
   * التفاعل يتم دائماً عبر إطلاق أحداث الـ Cubit مثل: `context.read<LoginCubit>().login(...)`.

---

## 4. الاستخدام الكامل والمُطلق لملفات الـ `Core`

يجب على كل فيتشر يتم بناؤه في التطبيق الاعتماد التام والمُطلق على البنية التحتية المشتركة في مجلد `lib/core`:

```text
lib/core/
├── constants/    # الثوابت والمسافات (app_spacing.dart, constants.dart)
├── errors/       # معالجة الأخطاء التجريدية (failuar.dart)
├── helper/       # الدوال المساعدة (custom_toast_bar.dart, upload_image_controller.dart, etc.)
├── routers/      # مسارات التطبيق (app_routes.dart, route_names.dart)
├── services/     # الخدمات الأساسية (api_service.dart, service_locator.dart, shared_pref.dart)
├── utils/        # الألوان، الخطوط، والصور (app_colors.dart, app_text_style.dart, app_images.dart)
└── widgets/      # الويدجيتات العامة المكررة (custom_button.dart, custom_text_form_feild.dart, etc.)
```

### أ) نظام الألوان (`core/utils/app_colors.dart`)
* **ممنوع بتاتاً**: استخدام الألوان المباشرة المرمزة في الكود مثل `Color(0xFF1E293B)` أو `Colors.blue`.
* **الواجب**: استخدام الألوان من كلاس `AppColors` دائماً (مثل `AppColors.primaryColor`, `AppColors.secondaryColor`, `AppColors.darkBlue`).
* **التحديث**: عند تغيير الثيم أو نظام الألوان مستقبلاً، يتم التعديل فقط في ملف `app_colors.dart` ليتغير التطبيق بالكامل تلقائياً.

### ب) نصوص وخطوط التطبيق (`core/utils/app_text_style.dart`)
* **ممنوع بتاتاً**: إنشاء `TextStyle(...)` جديد داخل أي فيتشر.
* **الواجب**: استدعاء الأنماط الموحدة من `AppTextStyle` (مثل `AppTextStyle.font18SemiBold`, `AppTextStyle.font14Regular`).

### ج) الأبعاد والمسافات (`core/constants/app_spacing.dart`)
* استخدام المسافات الثابتة لضمان التناسق (مثل `AppSpacing.verticalSpacing16`, `AppSpacing.horizontalSpacing12`).

### د) معالجة الأخطاء (`core/errors/failuar.dart`)
* تعتمد جميع الـ Repositories على نمط `Either<Failure, T>` من حزمة `dartz`.
* تحويل جميع أخطاء الشبكة والـ Dio إلى `ServerFailure.fromDioError(e)` أو `ServerFailure(message)` لعرض رسائل خطأ موحدة وعربية واضحة للمستخدم عبر الـ Toast أو الـ SnackBar.

### هـ) دوال المساعدة (`core/helper/`)
* **`CustomToastBar`**: لعرض تنبيهات النجاح والخطأ بشكل احترافي.
* **`CustomLoadingIndicator`**: لعرض مؤشرات التحميل بدلاً من الـ `CircularProgressIndicator` التقليدي.
* **`upload_image_controller.dart` & `pick_file.dart`**: لجميع عمليات اختيار ورفع الملفات والصور.
* **`download_files.dart`**: لتنزيل الملفات وكتب الـ PDF والمرفقات التعليمية.

### و) مسارات ونظام التوجيه (`core/routers/`)
* يمنع استخدام `Navigator.push(MaterialPageRoute(...))` المباشر.
* يتم تسجيل اسم المسار في `RouteNames` (مثل `RouteNames.loginView`, `RouteNames.homeView`).
* يتم تعريف وبناء الراوت مع ممر الـ Arguments داخل `AppRoutes.generateRoute` لضمان فصل منطق الراوتات عن الشاشات.

### ز) خدمات الـ API وتوفير التبعيات (`core/services/`)
* **`ApiService`**: الخدمة المركزية لإجراء طلبات `get()`, `post()`, `put()`, `delete()`, `uploadMultipart()`. تقوم بالتعامل التلقائي مع `Dio` وتضمين الـ `Bearer Token` للتوثيق وتعديل الـ Headers.
* **`ServiceLocator` (`getIt`)**: كلاس التسجيل المركزي لتوفير الـ Singletons والـ Factories للـ `ApiService`, `AuthRepoImpl`, والـ `Cubits`.

### ح) العناصر التفاعلية الأساسية (`core/widgets/`)
* **`CustomTextFormField`**: الحقل الموحد لجميع مدخلات التطبيق مع الدعم التلقائي للـ Validation والتنسيق.
* **`CustomButton`**: الزر الموحد للتطبيق مع حالات التحميل والتفليم.
* **`GradientBackground`**: للخلفيات الممتدة المتدرجة.
* **`HeaderCard`**: للبطاقات العلوية المتميزة.
* **`CashedNetworkImageWidget`**: لعرض الصور الشبكية مع التخزين المؤقت وصورة التجهيز (Placeholder).

---

## 5. قواعد التصميم والجمالية الرقمية (Design System Rules for WOW Effect)

لكي تظهر جميع الفيتشرات بمظهر فائق الاحترافية والحداثة عند تغيير الألوان والراوتات، يجب اتباع المبادئ التجميلية التالية:

### 1. نظام الألوان والتدرجات (Gradients & Micro-Palettes)
* الاعتماد على الخلفيات ذات التدرج اللطيف (Subtle Gradients) المزودة ببقع ضوئية ملونة خفيفة (`blur_circle.dart`).
* استخدام تأثير الـ **Glassmorphism** (البطاقات شبه الشفافة ذات الضبابية الخلفية `BackdropFilter` والتحديد الدقيق `Border.all(color: white.withOpacity(0.2))`).

### 2. التفاعل الدقيق والتحريك (Micro-Animations & Dynamic States)
* استخدام الانتقالات الناعمة (Smooth Transitions) في النقر وحالات التركيز على الحقول (Focus Glows).
* تغيير حالة الأزرار والحقول عند الإدخال النشط أو التحميل فورياً وبشكل مرن.

### 3. التناسق البصري للهوامش والزوايا (Border Radius & Spacing Standard)
* توحيد انحناءات الزوايا (Border Radius):
  * حقول الإدخال والبطاقات الصغيرة: `12.r` إلى `16.r`.
  * البطاقات الكبيرة والحاويات العلوية: `20.r` إلى `24.r`.
  * الأزرار الأساسية: `12.r` أو زوايا دائرية بالكامل (Pill Shape).
* توحيد الظلال (Drop Shadows): ظلال خفيفة وناعمة ناتجة عن لون العنصر مع أوفست منخفض وبقية انتشار عالية (`blurRadius: 15, spreadRadius: 0, opacity: 0.08`).

---

## 6. قائمة المراجعة (Checklist) عند إضافة فيتشر جديد

عند إنشاء أي فيتشر جديد في مشروع `student_compass_mobile` يجب التأكد من الخطوات التالية:

- [ ] إنشاء المجلد بنفس اسم الفيتشر تحت `lib/Features/`.
- [ ] تقسيم المجلد إلى `data` و `presentation`.
- [ ] إنشاء `models` و `repos` للتجريد والتنفيذ.
- [ ] إنشاء الـ `Cubit` والـ `State` وتحديث الـ `ServiceLocator` تسجيل الـ Repo والـ Cubit.
- [ ] بناء الشاشات في `views` وفصل جسم الشاشة والويدجيتات الصغرى في `widgets`.
- [ ] التأكد من عدم وجود أي لون أو نص ثابت أو مقاس يدوي بدون الاعتماد على `AppColors`, `AppTextStyle`, و `AppSpacing`.
- [ ] تسجيل المسار الجديد في `RouteNames` و `AppRoutes`.
