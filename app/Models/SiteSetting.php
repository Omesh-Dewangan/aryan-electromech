<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'company_name', 'ceo_name', 'phone', 'email', 'whatsapp_number', 'gstin', 'address', 'map_embed_url', 'logo_path',
    ];
}
