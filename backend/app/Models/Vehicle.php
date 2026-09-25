<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'plate_number',
        'model',
        'capacity_tons',
        'status',
    ];

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
