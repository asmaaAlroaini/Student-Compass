<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\Repositories\SubjectRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Subject;
use Illuminate\Database\Eloquent\Collection;

class EloquentSubjectRepository implements SubjectRepositoryInterface
{
    public function getActiveSubjectsForGrade(string $gradeLevel, ?string $track = null): Collection
    {
        return Subject::query()
            ->active()
            ->forGrade($gradeLevel, $track)
            ->withCount(['units', 'lessons'])
            ->get();
    }

    public function findById(int $id)
    {
        return Subject::query()->with('units.lessons')->findOrFail($id);
    }
}
