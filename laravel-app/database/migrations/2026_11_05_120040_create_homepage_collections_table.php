<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->text('detail');
            $table->string('icon_name', 60)->default('Wrench');
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('industries', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('process_steps', function (Blueprint $table): void {
            $table->id();
            $table->unsignedTinyInteger('step_number')->unique();
            $table->string('title');
            $table->text('detail');
            $table->string('icon_name', 60)->default('Check');
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('enquiries', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('mobile', 30);
            $table->string('company')->nullable();
            $table->string('product_name')->nullable();
            $table->text('message')->nullable();
            $table->string('status', 20)->default('new')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquiries');
        Schema::dropIfExists('process_steps');
        Schema::dropIfExists('industries');
        Schema::dropIfExists('services');
    }
};
