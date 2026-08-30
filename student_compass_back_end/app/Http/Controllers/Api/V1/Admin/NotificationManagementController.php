<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Models\Notification;
use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NotificationManagementController extends Controller
{
    /**
     * استعراض الإشعارات الإدارية المرسلة
     */
    public function index(Request $request)
    {
        $notifications = Notification::with('user:id,name,email,grade_level')
            ->where('type', 'admin_announcement')
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    /**
     * إنشاء وبث إشعار للطلاب (عام أو مخصص لمرحلة/مسار)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|string|in:admin_announcement,study_reminder,new_content,competition',
            'target_audience' => 'required|string|in:all_students,grade_level,specific_users',
            'grade_level' => 'required_if:target_audience,grade_level|nullable|string',
            'track' => 'nullable|string',
            'user_ids' => 'required_if:target_audience,specific_users|nullable|array',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        $query = User::where('role', 'student')->where('is_active', true);

        if ($validated['target_audience'] === 'grade_level') {
            $query->where('grade_level', $validated['grade_level']);
            if (!empty($validated['track'])) {
                $query->where('track', $validated['track']);
            }
        } elseif ($validated['target_audience'] === 'specific_users') {
            $query->whereIn('id', $validated['user_ids']);
        }

        $targetUserIds = $query->pluck('id')->toArray();

        if (empty($targetUserIds)) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على طلاب ينطبق عليهم شرط الإرسال.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $now = now();
        $notificationsData = [];
        foreach ($targetUserIds as $studentId) {
            $notificationsData[] = [
                'user_id' => $studentId,
                'title' => $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['type'],
                'is_read' => false,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        Notification::insert($notificationsData);

        return response()->json([
            'success' => true,
            'message' => "تم بث الإشعار بنجاح إلى " . count($notificationsData) . " طالب.",
            'sent_count' => count($notificationsData),
        ], Response::HTTP_CREATED);
    }
}
