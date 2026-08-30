<?php

namespace App\Domain\Repositories;

use Illuminate\Database\Eloquent\Collection;

interface StudentProgressRepositoryInterface
{
    public function recordProgress(array $data);

    public function getStudentHistory(int $userId): Collection;
}
