<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homepage_contents', function (Blueprint $table): void {
            $table->id();
            $table->string('hero_kicker')->default('Low-voltage panel specialists');
            $table->string('hero_title')->default('Power systems,');
            $table->string('hero_highlight')->default('built for uptime.');
            $table->text('hero_description');
            $table->string('hero_image_path')->nullable();
            $table->string('about_heading');
            $table->text('about_paragraph_one');
            $table->text('about_paragraph_two');
            $table->string('about_image_path')->nullable();
            $table->string('catalogue_heading');
            $table->text('catalogue_intro');
            $table->string('services_heading');
            $table->text('services_intro');
            $table->string('industries_heading');
            $table->text('industries_intro');
            $table->string('process_heading');
            $table->text('process_intro');
            $table->string('contact_heading');
            $table->text('contact_intro');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage_contents');
    }
};
