<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProgress extends Model
{
    use HasFactory;

    protected $table = 'student_progress';

    protected $fillable = [
        'user_id',
        'exam_id',
        'lesson_id',
        'score',
        'total_possible_score',
        'percentage',
        'time_spent_seconds',
        'answers',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'score' => 'float',
        'total_possible_score' => 'float',
        'percentage' => 'float',
        'time_spent_seconds' => 'integer',
        'answers' => 'array',
        'completed_at' => 'datetime',
    ];

    // --- العلاقات (Relationships) ---

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }

    // --- Scopes ---

    public function scopeCompleted($query)
    {
        return $query->whereNotNull('completed_at');
    }

    public function scopePassed($query)
    {
        return $query->where('status', 'passed');
    }

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
