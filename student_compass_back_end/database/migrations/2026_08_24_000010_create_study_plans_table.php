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
        Schema::create('study_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('plan_date')->index();
            $table->integer('total_tasks')->default(0);
            $table->integer('completed_tasks')->default(0);
            $table->decimal('progress_percentage', 5, 2)->default(0.00);
            $table->timestamps();

            $table->unique(['user_id', 'plan_date']);
        });

        Schema::create('study_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_plan_id')->constrained('study_plans')->cascadeOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->nullOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->string('task_name');
            $table->enum('task_type', ['review_lesson', 'watch_video', 'solve_questions', 'short_quiz', 'review_errors'])->default('solve_questions');
            $table->integer('estimated_minutes')->default(30);
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_tasks');
        Schema::dropIfExists('study_plans');
    }
};
