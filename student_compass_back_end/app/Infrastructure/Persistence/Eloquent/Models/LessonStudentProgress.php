<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonStudentProgress extends Model
{
    use HasFactory;

    protected $table = 'lesson_student_progress';

    protected $fillable = [
        'user_id',
        'lesson_id',
        'current_stage',
        'completed_stages',
        'progress_percentage',
        'is_completed',
        'last_accessed_at',
    ];

    protected $casts = [
        'current_stage' => 'integer',
        'completed_stages' => 'array',
        'progress_percentage' => 'integer',
        'is_completed' => 'boolean',
        'last_accessed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }
}
