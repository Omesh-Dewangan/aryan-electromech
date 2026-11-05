<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageContent extends Model
{
    protected $fillable = [
        'hero_kicker', 'hero_title', 'hero_highlight', 'hero_description', 'hero_image_path',
        'about_heading', 'about_paragraph_one', 'about_paragraph_two', 'about_image_path',
        'catalogue_heading', 'catalogue_intro', 'services_heading', 'services_intro',
        'industries_heading', 'industries_intro', 'process_heading', 'process_intro',
        'contact_heading', 'contact_intro',
    ];
}
