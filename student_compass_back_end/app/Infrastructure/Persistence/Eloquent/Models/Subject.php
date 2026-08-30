<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'subjects';

    protected $fillable = [
        'name',
        'code',
        'grade_level',
        'track',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // --- العلاقات (Relationships) ---

    public function units(): HasMany
    {
        return $this->hasMany(Unit::class, 'subject_id')->orderBy('order', 'asc');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class, 'subject_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'subject_id');
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class, 'subject_id');
    }

    // --- Scopes ---

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForGrade($query, string $gradeLevel, ?string $track = null)
    {
        $q = $query->where('grade_level', $gradeLevel);
        if ($track) {
            $q->where(function ($sub) use ($track) {
                $sub->where('track', $track)->orWhereNull('track');
            });
        }
        return $q;
    }
}
