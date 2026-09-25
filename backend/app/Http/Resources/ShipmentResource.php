<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShipmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tracking_number' => $this->tracking_number,
            'origin' => $this->origin,
            'destination' => $this->destination,
            'cargo' => [
                'type' => $this->cargo_type,
                'weight_kg' => (float) $this->weight_kg,
                'weight_tons' => round($this->weight_kg / 1000, 2),
            ],
            'status' => $this->status,
            'vehicle' => $this->vehicle ? [
                'id' => $this->vehicle->id,
                'plate_number' => $this->vehicle->plate_number,
                'model' => $this->vehicle->model,
            ] : null,
            'driver' => $this->driver ? [
                'id' => $this->driver->id,
                'full_name' => "{$this->driver->first_name} {$this->driver->last_name}",
                'phone' => $this->driver->phone,
            ] : null,
            'location' => [
                'latitude' => $this->current_latitude,
                'longitude' => $this->current_longitude,
            ],
            'estimated_delivery' => $this->estimated_delivery?->toIso8601String(),
            'actual_delivery' => $this->actual_delivery?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
