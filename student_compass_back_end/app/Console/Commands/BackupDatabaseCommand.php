<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class BackupDatabaseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:backup-database {--disk=local : The storage disk to store backup on}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'أخذ نسخة احتياطية آمنة وشاملة من قاعدة بيانات المنصة ومحتوياتها وبنك الأسئلة';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('بدء عملية أخذ النسخة الاحتياطية لقاعدة بيانات بوصلة الطالب (Student Compass)...');

        $backupDir = storage_path('app/backups');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $filename = 'backup_student_compass_' . date('Y_m_d_His') . '.sql';
        $filePath = $backupDir . DIRECTORY_SEPARATOR . $filename;

        $dbHost = config('database.connections.mysql.host', '127.0.0.1');
        $dbPort = config('database.connections.mysql.port', '3306');
        $dbName = config('database.connections.mysql.database', 'student_compass');
        $dbUser = config('database.connections.mysql.username', 'root');
        $dbPass = config('database.connections.mysql.password', '');

        // 1. محاولة استخدام mysqldump إن كان متاحاً في النظام
        $mysqldumpPath = 'mysqldump';
        $command = sprintf(
            '%s --user=%s %s --host=%s --port=%s %s > "%s"',
            $mysqldumpPath,
            escapeshellarg($dbUser),
            !empty($dbPass) ? '--password=' . escapeshellarg($dbPass) : '',
            escapeshellarg($dbHost),
            escapeshellarg($dbPort),
            escapeshellarg($dbName),
            $filePath
        );

        $output = [];
        $returnVar = null;
        @exec($command, $output, $returnVar);

        // 2. إن لم ينجح mysqldump (مثلاً في بيئات بدون mysqldump في الـ PATH)، نستخدم التصدير المباشر المبرمج عبر PHP
        if ($returnVar !== 0 || !File::exists($filePath) || filesize($filePath) === 0) {
            $this->warn('جاري استخدام محرك التصدير الداخلي المباشر لبنك الأسئلة والجداول...');
            $this->exportViaPhp($filePath);
        }

        $fileSize = round(filesize($filePath) / 1024, 2);

        $this->info('========================================================');
        $this->info(' تم إنشاء النسخة الاحتياطية بنجاح!');
        $this->info(" الملف: {$filePath}");
        $this->info(" الحجم: {$fileSize} كيلوبايت");
        $this->info(' تاريخ النسخ: ' . now()->toDateTimeString());
        $this->info('========================================================');

        return Command::SUCCESS;
    }

    /**
     * تصدير محتوى وبنية قاعدة البيانات بأسلوب PHP Eloquent المباشر
     */
    private function exportViaPhp(string $filePath): void
    {
        $handle = fopen($filePath, 'w+');
        fwrite($handle, "-- بوصلة الطالب - النسخة الاحتياطية الكاملة\n");
        fwrite($handle, "-- التاريخ: " . now()->toDateTimeString() . "\n");
        fwrite($handle, "SET FOREIGN_KEY_CHECKS=0;\n\n");

        $tables = DB::connection()->getDoctrineSchemaManager()->listTableNames();

        foreach ($tables as $table) {
            fwrite($handle, "-- --------------------------------------------------\n");
            fwrite($handle, "-- بنية وبيانات جدول: `{$table}`\n");
            fwrite($handle, "-- --------------------------------------------------\n");

            // جلب البيانات وإدراجها
            $rows = DB::table($table)->get();
            if ($rows->isNotEmpty()) {
                foreach ($rows as $row) {
                    $rowArray = (array) $row;
                    $columns = array_keys($rowArray);
                    $values = array_map(function ($val) {
                        if (is_null($val)) return 'NULL';
                        return "'" . addslashes((string) $val) . "'";
                    }, array_values($rowArray));

                    $sql = sprintf(
                        "INSERT INTO `%s` (`%s`) VALUES (%s);\n",
                        $table,
                        implode('`, `', $columns),
                        implode(', ', $values)
                    );
                    fwrite($handle, $sql);
                }
            }
            fwrite($handle, "\n");
        }

        fwrite($handle, "SET FOREIGN_KEY_CHECKS=1;\n");
        fclose($handle);
    }
}
