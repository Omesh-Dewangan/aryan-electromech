<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcessStep extends Model
{
    protected $fillable = ['step_number', 'title', 'detail', 'icon_name', 'is_active'];

    protected function casts(): array
    {
        return ['step_number' => 'integer', 'is_active' => 'boolean'];
    }
}
