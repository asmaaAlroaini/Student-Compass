<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Competition extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'competitions';

    protected $fillable = [
        'title',
        'description',
        'subject_id',
        'question_count',
        'duration_minutes',
        'points_reward',
        'start_time',
        'end_time',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'question_count' => 'integer',
        'duration_minutes' => 'integer',
        'points_reward' => 'integer',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_active' => 'boolean',
    ];

    // --- العلاقات (Relationships) ---

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'competition_question')
                    ->withPivot('order')
                    ->orderBy('competition_question.order', 'asc');
    }

    public function results(): HasMany
    {
        return $this->hasMany(CompetitionResult::class, 'competition_id');
    }

    // --- Scopes ---

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
