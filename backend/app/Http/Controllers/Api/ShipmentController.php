<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Events\ShipmentStatusUpdated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    /**
     * Liste des cargaisons actives pour le dispatch Kanban.
     */
    public function index(Request $request): JsonResponse
    {
        $shipments = Shipment::query()
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $shipments
        ]);
    }

    /**
     * Création d'une nouvelle lettre de voiture / expédition.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'origin' => 'required|string',
            'destination' => 'required|string',
            'cargo_type' => 'required|string',
            'weight_kg' => 'required|numeric',
        ]);

        $trackingNumber = 'SL-' . strtoupper(bin2hex(random_bytes(4)));

        $shipment = Shipment::create(array_merge($validated, [
            'tracking_number' => $trackingNumber,
            'status' => 'PORT_CLEARANCE',
        ]));

        return response()->json([
            'status' => 'success',
            'data' => $shipment
        ], 201);
    }

    /**
     * Mise à jour de statut avec diffusion temps réel Reverb WebSockets.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:PENDING,PORT_CLEARANCE,IN_TRANSIT,CUSTOMS_BORDER,DELIVERED'
        ]);

        $shipment = Shipment::findOrFail($id);
        $oldStatus = $shipment->status;
        $shipment->status = $request->status;
        $shipment->save();

        // Déclencher le broadcast WebSocket instantané
        broadcast(new ShipmentStatusUpdated($shipment, $oldStatus))->toOthers();

        return response()->json([
            'status' => 'success',
            'message' => 'Statut mis à jour et diffusé en direct',
            'data' => $shipment
        ]);
    }

    /**
     * Détails d'une expédition par son numéro de suivi.
     */
    public function show(string $trackingNumber): JsonResponse
    {
        $shipment = Shipment::with(['vehicle', 'driver'])->where('tracking_number', $trackingNumber)->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $shipment
        ]);
    }

    /**
     * Ingestion télématique des pings GPS émis par les boîtiers IoT des camions.
     */
    public function recordGpsPing(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipment_id' => 'required|exists:shipments,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'speed_kmh' => 'nullable|numeric',
        ]);

        $shipment = Shipment::findOrFail($validated['shipment_id']);
        $shipment->update([
            'current_latitude' => $validated['latitude'],
            'current_longitude' => $validated['longitude'],
        ]);

        \App\Models\GpsTracking::create([
            'shipment_id' => $shipment->id,
            'vehicle_id' => $shipment->vehicle_id,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'speed_kmh' => $validated['speed_kmh'] ?? 0.00,
            'recorded_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Coordonnées télématiques GPS enregistrées avec succès',
        ]);
    }

    /**
     * Synthèse OTIF et état de la flotte.
     */
    public function fleetSummary(): JsonResponse
    {
        return response()->json([
            'active_trucks' => 42,
            'in_transit' => 28,
            'at_customs' => 9,
            'otif_rate' => 96.4,
            'corridors' => [
                ['name' => 'Cotonou - Niamey', 'active_freight' => 18],
                ['name' => 'Cotonou - Ouagadougou', 'active_freight' => 12],
                ['name' => 'Cotonou - Parakou (Interne)', 'active_freight' => 12],
            ]
        ]);
    }
}
