<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompetitionResult extends Model
{
    use HasFactory;

    protected $table = 'competition_results';

    protected $fillable = [
        'competition_id',
        'user_id',
        'score_percentage',
        'correct_answers',
        'total_questions',
        'time_spent_seconds',
        'points_earned',
        'completed_at',
    ];

    protected $casts = [
        'score_percentage' => 'float',
        'correct_answers' => 'integer',
        'total_questions' => 'integer',
        'time_spent_seconds' => 'integer',
        'points_earned' => 'integer',
        'completed_at' => 'datetime',
    ];

    // --- العلاقات (Relationships) ---

    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class, 'competition_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
