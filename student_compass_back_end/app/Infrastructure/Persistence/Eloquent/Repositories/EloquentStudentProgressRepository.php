<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\Repositories\StudentProgressRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\StudentProgress;
use Illuminate\Database\Eloquent\Collection;

class EloquentStudentProgressRepository implements StudentProgressRepositoryInterface
{
    public function recordProgress(array $data)
    {
        return StudentProgress::create($data);
    }

    public function getStudentHistory(int $userId): Collection
    {
        return StudentProgress::query()
            ->byUser($userId)
            ->with(['exam:id,title,type', 'lesson:id,title'])
            ->latest()
            ->get();
    }
}
