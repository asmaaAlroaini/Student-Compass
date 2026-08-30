<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'grade_level',
        'track',
        'phone',
        'avatar',
        'is_active',
        'notifications_enabled',
        'dark_mode',
        'preferred_locale',
        'subscription_tier',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'notifications_enabled' => 'boolean',
    ];

    // --- العلاقات (Relationships) ---

    public function lessonProgress(): HasMany
    {
        return $this->hasMany(LessonStudentProgress::class, 'user_id');
    }

    public function progressEntries(): HasMany
    {
        return $this->hasMany(StudentProgress::class, 'user_id');
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class, 'user_id');
    }

    public function questionReports(): HasMany
    {
        return $this->hasMany(QuestionReport::class, 'user_id');
    }

    public function createdQuestions(): HasMany
    {
        return $this->hasMany(Question::class, 'created_by');
    }

    public function createdExams(): HasMany
    {
        return $this->hasMany(Exam::class, 'created_by');
    }

    public function competitionResults(): HasMany
    {
        return $this->hasMany(CompetitionResult::class, 'user_id');
    }

    // --- Scopes ---

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeStudents($query)
    {
        return $query->where('role', 'student');
    }

    public function scopeByGradeLevel($query, string $gradeLevel)
    {
        return $query->where('grade_level', $gradeLevel);
    }
}
