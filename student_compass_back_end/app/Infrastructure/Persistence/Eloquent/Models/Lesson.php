<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lesson extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'lessons';

    protected $fillable = [
        'unit_id',
        'subject_id',
        'title',
        'lesson_number',
        'order',
        'summary',
        'video_url',
        'pdf_path',
    ];

    protected $casts = [
        'lesson_number' => 'integer',
        'order' => 'integer',
    ];

    // --- العلاقات (Relationships) ---

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'lesson_id');
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class, 'lesson_id');
    }

    public function progressEntries(): HasMany
    {
        return $this->hasMany(StudentProgress::class, 'lesson_id');
    }

    public function studentJourneyProgress(): HasMany
    {
        return $this->hasMany(LessonStudentProgress::class, 'lesson_id');
    }

    // --- Scopes ---

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function scopeByUnit($query, int $unitId)
    {
        return $query->where('unit_id', $unitId);
    }
}
