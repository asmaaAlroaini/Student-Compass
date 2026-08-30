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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained('lessons')->cascadeOnDelete();
            $table->text('question_text');
            $table->string('question_image')->nullable();
            $table->enum('type', ['mcq', 'true_false', 'essay'])->default('mcq')->index();
            $table->json('options')->nullable();
            $table->text('correct_answer');
            $table->text('explanation')->nullable();
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium')->index();
            $table->integer('year')->nullable()->index(); // السنة الوزارية (مثل 2024)
            $table->integer('points')->default(1);
            $table->boolean('is_active')->default(true)->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            // الفهارس المركبة الاستراتيجية لدعم استعلامات أداء عالي لبنك أسئلة يزيد عن 50,000 سؤال
            $table->index(['lesson_id', 'difficulty', 'is_active']);
            $table->index(['subject_id', 'unit_id', 'lesson_id']);
            $table->index(['subject_id', 'year']);
            $table->index(['type', 'difficulty']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
