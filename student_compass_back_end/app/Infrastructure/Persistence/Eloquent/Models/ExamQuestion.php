<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ExamQuestion extends Pivot
{
    use HasFactory;

    protected $table = 'exam_question';

    public $timestamps = false;

    protected $fillable = [
        'exam_id',
        'question_id',
        'marks',
        'order',
    ];

    protected $casts = [
        'marks' => 'integer',
        'order' => 'integer',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
