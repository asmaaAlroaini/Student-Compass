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
        Schema::table('questions', function (Blueprint $table) {
            $table->string('source')->nullable()->after('year')->index(); // المصدر: وزاري صنعاء، وزاري عدن، كتاب مدرسي، نماذج تجريبية
        });

        Schema::table('users', function (Blueprint $table) {
            $table->boolean('notifications_enabled')->default(true)->after('is_active');
            $table->string('dark_mode')->default('system')->after('notifications_enabled'); // light, dark, system
            $table->string('preferred_locale', 10)->default('ar')->after('dark_mode'); // ar, en
            $table->string('subscription_tier')->default('free')->after('preferred_locale'); // free, premium, annual (Future Roadmap)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('source');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['notifications_enabled', 'dark_mode', 'preferred_locale', 'subscription_tier']);
        });
    }
};
