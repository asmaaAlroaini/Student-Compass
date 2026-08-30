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
        Schema::create('lesson_student_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained('lessons')->cascadeOnDelete();
            $table->unsignedTinyInteger('current_stage')->default(1); // 1: فيديو الشرح, 2: الملخص, 3: أسئلة التثبيت, 4: الاختبار القصير, 5: تحليل النتيجة
            $table->json('completed_stages')->nullable(); // [1, 2, 3...]
            $table->unsignedTinyInteger('progress_percentage')->default(0);
            $table->boolean('is_completed')->default(false)->index();
            $table->timestamp('last_accessed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']);
            $table->index(['user_id', 'is_completed']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_student_progress');
    }
};
