<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'units';

    protected $fillable = [
        'subject_id',
        'title',
        'unit_number',
        'order',
        'description',
    ];

    protected $casts = [
        'unit_number' => 'integer',
        'order' => 'integer',
    ];

    // --- العلاقات (Relationships) ---

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class, 'unit_id')->orderBy('order', 'asc');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'unit_id');
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class, 'unit_id');
    }

    // --- Scopes ---

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
