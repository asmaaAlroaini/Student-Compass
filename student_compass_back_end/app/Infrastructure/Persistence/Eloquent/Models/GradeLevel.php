<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class GradeLevel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'grade_levels';

    protected $fillable = [
        'name',
        'code',
        'order',
        'tracks',
        'description',
        'is_active',
    ];

    protected $casts = [
        'tracks' => 'array',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    // --- العلاقات (Relationships) ---

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class, 'grade_level', 'name');
    }

    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'grade_level', 'name')->where('role', 'student');
    }

    // --- Scopes ---

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('id', 'asc');
    }
}
