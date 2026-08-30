<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Student\ToggleBookmarkRequest;
use App\Infrastructure\Persistence\Eloquent\Models\Bookmark;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    /**
     * عرض قائمة الأسئلة المحفوظة للمراجعة لاحقاً (أسئلتي المحفوظة)
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $bookmarks = Bookmark::byUser($userId)
            ->with(['question' => function ($q) {
                $q->with(['subject:id,name', 'unit:id,title', 'lesson:id,title']);
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $bookmarks,
        ]);
    }

    /**
     * حفظ أو إزالة سؤال من القائمة المحفوظة
     */
    public function toggle(ToggleBookmarkRequest $request)
    {
        $userId = $request->user()->id;
        $questionId = $request->validated('question_id');
        $notes = $request->validated('notes');

        $bookmark = Bookmark::where('user_id', $userId)
            ->where('question_id', $questionId)
            ->first();

        if ($bookmark) {
            $bookmark->delete();
            return response()->json([
                'success' => true,
                'is_bookmarked' => false,
                'message' => 'تم إزالة السؤال من الأسئلة المحفوظة للمراجعة.',
            ]);
        }

        $newBookmark = Bookmark::create([
            'user_id' => $userId,
            'question_id' => $questionId,
            'notes' => $notes,
        ]);

        return response()->json([
            'success' => true,
            'is_bookmarked' => true,
            'message' => 'تم حفظ السؤال بنجاح في قائمتك للمراجعة.',
            'data' => $newBookmark,
        ]);
    }
}
