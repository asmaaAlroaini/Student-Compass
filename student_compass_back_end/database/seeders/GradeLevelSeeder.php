<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\GradeLevel;
use Illuminate\Database\Seeder;

class GradeLevelSeeder extends Seeder
{
    public function run(): void
    {
        $grades = [
            [
                'name' => 'الثالث الثانوي',
                'code' => 'G12',
                'order' => 1,
                'tracks' => ['علمي', 'أدبي'],
                'description' => 'المرحلة الثانوية العامة - الصف الثالث الثانوي (الشهادة الثانوية العامة)',
                'is_active' => true,
            ],
            [
                'name' => 'الثاني الثانوي',
                'code' => 'G11',
                'order' => 2,
                'tracks' => ['علمي', 'أدبي'],
                'description' => 'المرحلة الثانوية - الصف الثاني الثانوي وتوزيع المسارات التخصصية',
                'is_active' => true,
            ],
            [
                'name' => 'الأول الثانوي',
                'code' => 'G10',
                'order' => 3,
                'tracks' => ['عام'],
                'description' => 'المرحلة الثانوية - الصف الأول الثانوي (المسار العام الأساسي المشترك)',
                'is_active' => true,
            ],
        ];

        foreach ($grades as $grade) {
            GradeLevel::updateOrCreate(
                ['name' => $grade['name']],
                $grade
            );
        }
    }
}
