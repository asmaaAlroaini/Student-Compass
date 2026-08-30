<?php

namespace App\Domain\Repositories;

use Illuminate\Database\Eloquent\Collection;

interface SubjectRepositoryInterface
{
    public function getActiveSubjectsForGrade(string $gradeLevel, ?string $track = null): Collection;
    
    public function findById(int $id);
}
