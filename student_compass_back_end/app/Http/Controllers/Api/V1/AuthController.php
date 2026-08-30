<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use App\Infrastructure\Services\PasswordResetService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(
        private ?PasswordResetService $passwordResetService = null
    ) {
        $this->passwordResetService = $passwordResetService ?? new PasswordResetService();
    }

    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = 'student';
        $validated['grade_level'] = $validated['grade_level'] ?? 'الثالث الثانوي';
        $validated['track'] = $validated['track'] ?? 'علمي';
        $validated['is_active'] = true;
        $validated['notifications_enabled'] = true;
        $validated['dark_mode'] = 'system';
        $validated['preferred_locale'] = 'ar';
        $validated['subscription_tier'] = 'free';

        $user = User::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء حساب الطالب بنجاح.',
            'data' => [
                'user' => $user,
            ]
        ], Response::HTTP_CREATED);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'عذراً، هذا الحساب معطل حالياً.',
            ], Response::HTTP_FORBIDDEN);
        }

        $token = $user->createToken('student_compass_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح.',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'grade_level' => 'nullable|string|max:100',
            'track' => 'nullable|string|max:100',
            'avatar' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات الملف الشخصي بنجاح.',
            'data' => $user,
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ], [
            'current_password.required' => 'كلمة المرور الحالية مطلوبة.',
            'new_password.required' => 'كلمة المرور الجديدة مطلوبة.',
            'new_password.min' => 'يجب أن لا تقل كلمة المرور الجديدة عن 8 أحرف.',
            'new_password.confirmed' => 'تأكيد كلمة المرور الجديدة غير متطابق.',
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'كلمة المرور الحالية غير صحيحة.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم تغيير كلمة المرور بنجاح.',
        ]);
    }

    /**
     * طلب استعادة كلمة المرور وإرسال رمز التحقق
     */
    public function resetPasswordRequest(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'البريد الإلكتروني مطلوب.',
            'email.email' => 'صيغة البريد الإلكتروني غير صحيحة.',
            'email.exists' => 'البريد الإلكتروني غير مسجل لدينا.',
        ]);

        try {
            $result = $this->passwordResetService->generateResetCode($request->input('email'));

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال رمز استعادة كلمة المرور بنجاح.',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * التحقق من رمز الاستعادة
     */
    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
        ], [
            'email.required' => 'البريد الإلكتروني مطلوب.',
            'code.required' => 'رمز التحقق مطلوب.',
            'code.size' => 'يجب أن يتكون رمز التحقق من 6 أرقام.',
        ]);

        $isValid = $this->passwordResetService->verifyCode(
            $request->input('email'),
            $request->input('code')
        );

        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => 'رمز التحقق غير صحيح أو انتهت صلاحيته.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json([
            'success' => true,
            'message' => 'رمز التحقق صحيح. يمكنك الآن تعيين كلمة مرور جديدة.',
        ]);
    }

    /**
     * تعيين كلمة المرور الجديدة
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.required' => 'البريد الإلكتروني مطلوب.',
            'code.required' => 'رمز التحقق مطلوب.',
            'password.required' => 'كلمة المرور الجديدة مطلوبة.',
            'password.min' => 'يجب أن لا تقل كلمة المرور عن 8 أحرف.',
            'password.confirmed' => 'تأكيد كلمة المرور غير متطابق.',
        ]);

        try {
            $this->passwordResetService->resetPassword(
                $request->input('email'),
                $request->input('code'),
                $request->input('password')
            );

            return response()->json([
                'success' => true,
                'message' => 'تم إعادة تعيين كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * جلب إعدادات وتفضيلات المستخدم
     */
    public function getSettings(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'notifications_enabled' => (bool) ($user->notifications_enabled ?? true),
                'dark_mode' => $user->dark_mode ?? 'system',
                'preferred_locale' => $user->preferred_locale ?? 'ar',
                'subscription_tier' => $user->subscription_tier ?? 'free',
            ]
        ]);
    }

    /**
     * تحديث إعدادات وتفضيلات المستخدم
     */
    public function updateSettings(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'notifications_enabled' => 'sometimes|boolean',
            'dark_mode' => 'sometimes|in:light,dark,system',
            'preferred_locale' => 'sometimes|in:ar,en',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ الإعدادات بنجاح.',
            'data' => [
                'notifications_enabled' => (bool) $user->notifications_enabled,
                'dark_mode' => $user->dark_mode,
                'preferred_locale' => $user->preferred_locale,
                'subscription_tier' => $user->subscription_tier,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح.',
        ]);
    }
}
