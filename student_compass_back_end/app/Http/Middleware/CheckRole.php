<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // 1. التحقق من تسجيل دخول المستخدم
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'عذراً، غير مصرح بالوصول. يرجى تسجيل الدخول أولاً.',
                'error_code' => 'UNAUTHENTICATED'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // 2. التحقق من نشاط حساب المستخدم
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'تم تعطيل حسابك. يرجى التواصل مع إدارة النظام.',
                'error_code' => 'ACCOUNT_DEACTIVATED'
            ], Response::HTTP_FORBIDDEN);
        }

        // 3. التحقق من تطابق الدور الوظيفي للمستخدم مع الدور المطلوب للمسار
        if (!empty($roles) && !in_array($user->role, $roles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذا الإجراء.',
                'error_code' => 'FORBIDDEN_ROLE',
                'required_roles' => $roles,
                'your_role' => $user->role
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
