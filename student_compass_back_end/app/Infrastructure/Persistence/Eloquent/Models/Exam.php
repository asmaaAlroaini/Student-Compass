<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Exam extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'exams';

    protected $fillable = [
        'subject_id',
        'unit_id',
        'lesson_id',
        'title',
        'type',
        'duration_minutes',
        'total_marks',
        'pass_marks',
        'is_randomized',
        'is_published',
        'created_by',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'total_marks' => 'integer',
        'pass_marks' => 'integer',
        'is_randomized' => 'boolean',
        'is_published' => 'boolean',
    ];

    // --- العلاقات (Relationships) ---

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'exam_question')
                    ->withPivot('marks', 'order')
                    ->orderBy('exam_question.order', 'asc');
    }

    public function progressEntries(): HasMany
    {
        return $this->hasMany(StudentProgress::class, 'exam_id');
    }

    // --- Scopes ---

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeBySubject($query, int $subjectId)
    {
        return $query->where('subject_id', $subjectId);
    }
}
