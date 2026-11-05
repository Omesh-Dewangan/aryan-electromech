<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('company_name')->default('Aryan Electromech Engineers');
            $table->string('ceo_name')->default('Madhu Pandey');
            $table->string('phone', 30)->default('+91 92434 93179');
            $table->string('email')->default('aryanelectromechengg@gmail.com');
            $table->string('whatsapp_number', 30)->default('919243493179');
            $table->string('gstin', 20)->nullable();
            $table->text('address')->nullable();
            $table->text('map_embed_url')->nullable();
            $table->string('logo_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
