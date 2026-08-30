<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudyPlan extends Model
{
    use HasFactory;

    protected $table = 'study_plans';

    protected $fillable = [
        'user_id',
        'plan_date',
        'total_tasks',
        'completed_tasks',
        'progress_percentage',
    ];

    protected $casts = [
        'plan_date' => 'date',
        'total_tasks' => 'integer',
        'completed_tasks' => 'integer',
        'progress_percentage' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(StudyTask::class, 'study_plan_id');
    }
}
