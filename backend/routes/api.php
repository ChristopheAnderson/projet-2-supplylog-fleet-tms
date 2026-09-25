<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ShipmentController;

/*
|--------------------------------------------------------------------------
| SupplyLog TMS API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Gestion des expéditions
    Route::get('/shipments', [ShipmentController::class, 'index']);
    Route::post('/shipments', [ShipmentController::class, 'store']);
    Route::get('/shipments/{tracking_number}', [ShipmentController::class, 'show']);
    Route::patch('/shipments/{id}/status', [ShipmentController::class, 'updateStatus']);

    // Ingestion télématique GPS pour les camions en transit
    Route::post('/telematics/ping', [ShipmentController::class, 'recordGpsPing']);

    // Métriques OTIF (On-Time In-Full) et statistiques de fret
    Route::get('/analytics/fleet-summary', [ShipmentController::class, 'fleetSummary']);
});
