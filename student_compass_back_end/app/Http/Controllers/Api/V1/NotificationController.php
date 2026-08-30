<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $notifications = Notification::where('user_id', $userId)
            ->latest()
            ->get();

        $unreadCount = Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'unread_count' => $unreadCount,
            'data' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, int $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)->findOrFail($id);
        $notification->is_read = true;
        $notification->save();

        return response()->json([
            'success' => true,
            'message' => 'تم تعليم الإشعار كمقروء.',
            'data' => $notification,
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $userId = $request->user()->id;
        Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'تم تعليم كافة الإشعارات كمقروءة.',
        ]);
    }
}
