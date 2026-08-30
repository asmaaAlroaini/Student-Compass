<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\Repositories\SubjectRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentSubjectRepository;
use App\Domain\Repositories\QuestionRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentQuestionRepository;
use App\Domain\Repositories\ExamRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentExamRepository;
use App\Domain\Repositories\StudentProgressRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentStudentProgressRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(SubjectRepositoryInterface::class, EloquentSubjectRepository::class);
        $this->app->bind(QuestionRepositoryInterface::class, EloquentQuestionRepository::class);
        $this->app->bind(ExamRepositoryInterface::class, EloquentExamRepository::class);
        $this->app->bind(StudentProgressRepositoryInterface::class, EloquentStudentProgressRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
