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
        Schema::create('question_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            $table->enum('report_type', ['typo', 'wrong_answer', 'unclear_image', 'other'])->default('other');
            $table->text('description');
            $table->enum('status', ['pending', 'reviewed', 'resolved', 'rejected'])->default('pending')->index();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_reports');
    }
};
