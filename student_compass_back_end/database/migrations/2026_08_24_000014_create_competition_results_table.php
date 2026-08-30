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
        Schema::create('competition_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competition_id')->constrained('competitions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->float('score_percentage')->default(0);
            $table->integer('correct_answers')->default(0);
            $table->integer('total_questions')->default(0);
            $table->integer('time_spent_seconds')->default(0);
            $table->integer('points_earned')->default(0);
            $table->timestamp('completed_at')->nullable()->index();
            $table->timestamps();

            $table->unique(['competition_id', 'user_id']);
            $table->index(['competition_id', 'score_percentage', 'time_spent_seconds'], 'comp_res_rank_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_results');
    }
};
