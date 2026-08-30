<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bookmark extends Model
{
    use HasFactory;

    protected $table = 'bookmarks';

    protected $fillable = [
        'user_id',
        'question_id',
        'notes',
    ];

    // --- العلاقات (Relationships) ---

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    // --- Scopes ---

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
