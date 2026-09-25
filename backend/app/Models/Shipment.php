<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_number',
        'origin',
        'destination',
        'cargo_type',
        'weight_kg',
        'status',           // 'PENDING', 'PORT_CLEARANCE', 'IN_TRANSIT', 'CUSTOMS_BORDER', 'DELIVERED'
        'vehicle_id',
        'driver_id',
        'current_latitude',
        'current_longitude',
        'estimated_delivery',
        'actual_delivery',
    ];

    protected $casts = [
        'current_latitude' => 'float',
        'current_longitude' => 'float',
        'estimated_delivery' => 'datetime',
        'actual_delivery' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
