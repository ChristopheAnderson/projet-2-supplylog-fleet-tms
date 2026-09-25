<?php

namespace App\Events;

use App\Models\Shipment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShipmentStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Shipment $shipment, public string $previousStatus)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('logistics-control-room'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'shipment.status_changed';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->shipment->id,
            'tracking_number' => $this->shipment->tracking_number,
            'origin' => $this->shipment->origin,
            'destination' => $this->shipment->destination,
            'status' => $this->shipment->status,
            'previous_status' => $this->previousStatus,
            'updated_at' => now()->toIso8601String(),
        ];
    }
}
