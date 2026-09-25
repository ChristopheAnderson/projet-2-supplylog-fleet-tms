<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Shipment;
use App\Events\ShipmentStatusUpdated;
use Illuminate\Support\Facades\Event;

class ShipmentApiTest extends TestCase
{
    /**
     * Teste la création d'une nouvelle expédition de fret.
     */
    public function test_can_create_freight_shipment(): void
    {
        $payload = [
            'origin' => 'Port Autonome de Cotonou',
            'destination' => 'Niamey, Niger',
            'cargo_type' => 'Clinker & Ciment',
            'weight_kg' => 38000,
        ];

        $response = $this->postJson('/api/v1/shipments', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'status',
                     'data' => [
                         'id',
                         'tracking_number',
                         'origin',
                         'destination',
                         'status',
                     ]
                 ]);

        $this->assertStringStartsWith('SL-', $response->json('data.tracking_number'));
        $this->assertEquals('PORT_CLEARANCE', $response->json('data.status'));
    }

    /**
     * Teste la transition d'étape et la diffusion de l'événement WebSocket Reverb.
     */
    public function test_can_update_status_and_broadcast_event(): void
    {
        Event::fake([ShipmentStatusUpdated::class]);

        $shipment = Shipment::create([
            'tracking_number' => 'SL-TEST-1234',
            'origin' => 'Cotonou Port',
            'destination' => 'Parakou',
            'cargo_type' => 'Boissons',
            'weight_kg' => 18000,
            'status' => 'PORT_CLEARANCE',
        ]);

        $response = $this->patchJson("/api/v1/shipments/{$shipment->id}/status", [
            'status' => 'IN_TRANSIT',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'data' => [
                         'status' => 'IN_TRANSIT',
                     ]
                 ]);

        Event::assertDispatched(ShipmentStatusUpdated::class, function ($event) use ($shipment) {
            return $event->shipment->id === $shipment->id && $event->previousStatus === 'PORT_CLEARANCE';
        });
    }
}
