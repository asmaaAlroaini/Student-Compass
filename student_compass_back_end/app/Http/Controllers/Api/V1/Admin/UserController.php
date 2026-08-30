<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\UpdateUserStatusRequest;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role');
        $query = User::query();

        if ($role) {
            $query->where('role', $role);
        }

        $users = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    public function updateStatus(UpdateUserStatusRequest $request, int $id)
    {
        $user = User::findOrFail($id);
        $user->is_active = $request->validated('is_active');
        $user->save();

        $statusText = $user->is_active ? 'تفعيل' : 'تعطيل';

        return response()->json([
            'success' => true,
            'message' => "تم {$statusText} حساب المستخدم بنجاح.",
            'data' => $user,
        ]);
    }
}
