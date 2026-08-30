<?php

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. حساب مدير النظام الرئيسي (Admin)
        User::updateOrCreate(
            ['email' => 'admin@studentcompass.com'],
            [
                'name' => 'المدير الرئيسي',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // 2. حساب المعلم (Teacher)
        User::updateOrCreate(
            ['email' => 'teacher@studentcompass.com'],
            [
                'name' => 'أ. أحمد المعلم العلمي',
                'password' => Hash::make('password123'),
                'role' => 'teacher',
                'is_active' => true,
            ]
        );

        // 3. حساب المشرف العلمي (Supervisor)
        User::updateOrCreate(
            ['email' => 'supervisor@studentcompass.com'],
            [
                'name' => 'د. خالد المشرف التربوي',
                'password' => Hash::make('password123'),
                'role' => 'supervisor',
                'is_active' => true,
            ]
        );

        // 4. حسابات الطلاب المتنوعة للوحة المتصدرين (Diverse Student Roster)
        $students = [
            [
                'name' => 'محمد الطالب المتفوق',
                'email' => 'student@studentcompass.com',
                'grade_level' => 'الثالث الثانوي',
                'track' => 'علمي',
                'phone' => '0500000001',
            ],
            [
                'name' => 'سارة أحمد العبدلي',
                'email' => 'sara@studentcompass.com',
                'grade_level' => 'الثالث الثانوي',
                'track' => 'علمي',
                'phone' => '0500000002',
            ],
            [
                'name' => 'عمر خالد الصالح',
                'email' => 'omar@studentcompass.com',
                'grade_level' => 'الثالث الثانوي',
                'track' => 'علمي',
                'phone' => '0500000003',
            ],
            [
                'name' => 'فاطمة الزهراء الشامي',
                'email' => 'fatima@studentcompass.com',
                'grade_level' => 'الثالث الثانوي',
                'track' => 'علمي',
                'phone' => '0500000004',
            ],
            [
                'name' => 'عبدالرحمن باوزير',
                'email' => 'abdulrahman@studentcompass.com',
                'grade_level' => 'الثالث الثانوي',
                'track' => 'علمي',
                'phone' => '0500000005',
            ],
            [
                'name' => 'مريم يحيى القدسي',
                'email' => 'mariam@studentcompass.com',
                'grade_level' => 'الثالث الثانوي',
                'track' => 'علمي',
                'phone' => '0500000006',
            ],
            [
                'name' => 'يوسف إبراهيم الحكيمي',
                'email' => 'youssef@studentcompass.com',
                'grade_level' => 'الثالث الثانوي',
                'track' => 'علمي',
                'phone' => '0500000007',
            ],
        ];

        foreach ($students as $st) {
            User::updateOrCreate(
                ['email' => $st['email']],
                [
                    'name' => $st['name'],
                    'password' => Hash::make('password123'),
                    'role' => 'student',
                    'grade_level' => $st['grade_level'],
                    'track' => $st['track'],
                    'phone' => $st['phone'],
                    'is_active' => true,
                ]
            );
        }
    }
}
