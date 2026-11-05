<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    protected $fillable = ['name', 'mobile', 'company', 'product_name', 'message', 'status'];
}
