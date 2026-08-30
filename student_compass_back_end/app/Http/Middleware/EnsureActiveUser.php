<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'حسابك معطل حالياً. يرجى مراجعة إدارة بوصلة الطالب.',
                'error_code' => 'ACCOUNT_SUSPENDED'
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
