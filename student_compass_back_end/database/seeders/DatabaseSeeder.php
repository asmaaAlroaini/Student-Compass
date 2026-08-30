<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            GradeLevelSeeder::class,
            UserSeeder::class,
            CurriculumSeeder::class,
            QuestionBankSeeder::class,
            ExamSeeder::class,
            StudyPlanSeeder::class,
            NotificationSeeder::class,
            CompetitionSeeder::class,
            BookmarkSeeder::class,
        ]);
    }
}
