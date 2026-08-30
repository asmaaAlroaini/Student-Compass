<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'questions';

    protected $fillable = [
        'subject_id',
        'unit_id',
        'lesson_id',
        'question_text',
        'question_image',
        'type',
        'options',
        'correct_answer',
        'explanation',
        'difficulty',
        'year',
        'source',
        'points',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'options' => 'array',
        'year' => 'integer',
        'points' => 'integer',
        'is_active' => 'boolean',
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

    public function exams(): BelongsToMany
    {
        return $this->belongsToMany(Exam::class, 'exam_question')
                    ->withPivot('marks', 'order');
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class, 'question_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(QuestionReport::class, 'question_id');
    }

    // --- Scopes لبنك الأسئلة الضخم ---

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByLesson($query, int $lessonId)
    {
        return $query->where('lesson_id', $lessonId);
    }

    public function scopeByDifficulty($query, string $difficulty)
    {
        return $query->where('difficulty', $difficulty);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('year', $year);
    }

    public function scopeBySource($query, string $source)
    {
        return $query->where('source', 'like', '%' . $source . '%');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRandomBank($query, int $limit = 10)
    {
        return $query->inRandomOrder()->limit($limit);
    }
}
