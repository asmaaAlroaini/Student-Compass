<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudyTask extends Model
{
    use HasFactory;

    protected $table = 'study_tasks';

    protected $fillable = [
        'study_plan_id',
        'subject_id',
        'lesson_id',
        'task_name',
        'task_type',
        'estimated_minutes',
        'status',
    ];

    protected $casts = [
        'estimated_minutes' => 'integer',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(StudyPlan::class, 'study_plan_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }
}
