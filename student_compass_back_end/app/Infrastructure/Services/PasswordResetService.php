<?php

namespace App\Infrastructure\Services;

use App\Infrastructure\Persistence\Eloquent\Models\PasswordResetCode;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetService
{
    /**
     * إنشاء وإرسال رمز استعادة كلمة المرور المكون من 6 أرقام
     */
    public function generateResetCode(string $email): array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new \Exception('البريد الإلكتروني المدخل غير مسجل لدينا.');
        }

        // إبطال أي رموز سابقة غير مستخدمة لهذا البريد
        PasswordResetCode::where('email', $email)
            ->where('is_used', false)
            ->update(['is_used' => true]);

        // توليد رمز عشوائي مكون من 6 أرقام
        $code = (string) random_int(100000, 999999);

        PasswordResetCode::create([
            'email' => $email,
            'code' => $code,
            'expires_at' => now()->addMinutes(15),
            'is_used' => false,
        ]);

        return [
            'email' => $email,
            'code' => $code, // يُعاد في البيئة التجريبية أو عبر البريد/SMS
            'expires_in_minutes' => 15,
        ];
    }

    /**
     * التحقق من صحة وصلاحية رمز الاستعادة
     */
    public function verifyCode(string $email, string $code): bool
    {
        $resetEntry = PasswordResetCode::where('email', $email)
            ->where('code', $code)
            ->where('is_used', false)
            ->latest()
            ->first();

        if (!$resetEntry || !$resetEntry->isValid()) {
            return false;
        }

        return true;
    }

    /**
     * إعادة تعيين كلمة المرور بعد التحقق من الرمز
     */
    public function resetPassword(string $email, string $code, string $newPassword): bool
    {
        $resetEntry = PasswordResetCode::where('email', $email)
            ->where('code', $code)
            ->where('is_used', false)
            ->latest()
            ->first();

        if (!$resetEntry || !$resetEntry->isValid()) {
            throw new \Exception('رمز التحقق غير صحيح أو انتهت صلاحيته.');
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            throw new \Exception('المستخدم غير موجود.');
        }

        $user->password = Hash::make($newPassword);
        $user->save();

        // تعليم الرمز كمستخدم
        $resetEntry->is_used = true;
        $resetEntry->save();

        return true;
    }
}
