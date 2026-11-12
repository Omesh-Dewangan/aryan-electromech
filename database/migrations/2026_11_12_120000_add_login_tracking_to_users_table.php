<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('login_id')->nullable()->unique();
            $table->unsignedInteger('login_count')->default(0);
            $table->timestamp('last_login_at')->nullable();
        });

        DB::table('users')->orderBy('id')->each(function (object $user): void {
            DB::table('users')->where('id', $user->id)->update([
                'login_id' => 'AE-'.str_pad((string) $user->id, 6, '0', STR_PAD_LEFT),
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['login_id']);
            $table->dropColumn(['login_id', 'login_count', 'last_login_at']);
        });
    }
};
