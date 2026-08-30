<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('exam_id')->nullable()->constrained('exams')->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->decimal('score', 5, 2)->index();
            $table->decimal('total_possible_score', 5, 2);
            $table->decimal('percentage', 5, 2)->index();
            $table->integer('time_spent_seconds')->default(0);
            $table->json('answers')->nullable();
            $table->enum('status', ['passed', 'failed', 'in_progress'])->default('in_progress')->index();
            $table->timestamp('completed_at')->nullable()->index();
            $table->timestamps();

            // الفهارس المركبة لتسريع تقارير الطالب وتتبع أدائه
            $table->index(['user_id', 'exam_id']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_progress');
    }
};
