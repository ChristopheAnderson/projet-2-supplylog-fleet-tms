<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Shipment;

class SupplyLogDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $d1 = Driver::firstOrCreate(
            ['license_number' => 'BEN-PERM-88910'],
            ['first_name' => 'Moussa', 'last_name' => 'Kora', 'phone' => '+229 97 11 22 33', 'status' => 'ON_TRIP']
        );
        $d2 = Driver::firstOrCreate(
            ['license_number' => 'BEN-PERM-33412'],
            ['first_name' => 'Alassane', 'last_name' => 'Bio', 'phone' => '+229 95 44 55 66', 'status' => 'AVAILABLE']
        );
        $d3 = Driver::firstOrCreate(
            ['license_number' => 'BEN-PERM-77123'],
            ['first_name' => 'Gérard', 'last_name' => 'Dossou', 'phone' => '+229 96 77 88 99', 'status' => 'ON_TRIP']
        );
        $d4 = Driver::firstOrCreate(
            ['license_number' => 'BEN-PERM-55611'],
            ['first_name' => 'Salifou', 'last_name' => 'Adamou', 'phone' => '+229 40 12 34 56', 'status' => 'AVAILABLE']
        );

        $v1 = Vehicle::firstOrCreate(
            ['plate_number' => 'BJ 4829 RB'],
            ['model' => 'Mercedes-Benz Actros 3340', 'capacity_tons' => 40.00, 'status' => 'ASSIGNED']
        );
        $v2 = Vehicle::firstOrCreate(
            ['plate_number' => 'BJ 1102 RA'],
            ['model' => 'Renault Trucks Kerax', 'capacity_tons' => 35.00, 'status' => 'AVAILABLE']
        );
        $v3 = Vehicle::firstOrCreate(
            ['plate_number' => 'BJ 7731 RC'],
            ['model' => 'Volvo FMX 440', 'capacity_tons' => 38.00, 'status' => 'ASSIGNED']
        );
        $v4 = Vehicle::firstOrCreate(
            ['plate_number' => 'BJ 3390 RB'],
            ['model' => 'Scania G420', 'capacity_tons' => 42.00, 'status' => 'AVAILABLE']
        );

        $shipments = [
            [
                'tracking_number' => 'SL-CTN-9021',
                'origin' => 'Port Autonome de Cotonou',
                'destination' => 'Niamey, Niger',
                'cargo_type' => 'Matériaux de Construction & Ciment',
                'weight_kg' => 34000.00,
                'status' => 'IN_TRANSIT',
                'vehicle_id' => $v1->id,
                'driver_id' => $d1->id,
                'current_latitude' => 9.3524,
                'current_longitude' => 2.6189,
                'estimated_delivery' => now()->addDays(2),
            ],
            [
                'tracking_number' => 'SL-CTN-8843',
                'origin' => 'Zone Portuaire Cotonou',
                'destination' => 'Ouagadougou, Burkina Faso',
                'cargo_type' => 'Produits Agroalimentaires & Riz',
                'weight_kg' => 28000.00,
                'status' => 'PORT_CLEARANCE',
                'vehicle_id' => $v2->id,
                'driver_id' => $d2->id,
                'current_latitude' => 6.3654,
                'current_longitude' => 2.4183,
                'estimated_delivery' => now()->addDays(4),
            ],
            [
                'tracking_number' => 'SL-CTN-7612',
                'origin' => 'Dépôt SOBEBRA Cotonou',
                'destination' => 'Parakou (Dépôt Nord)',
                'cargo_type' => 'Boissons & Consommables',
                'weight_kg' => 19500.00,
                'status' => 'CUSTOMS_BORDER',
                'vehicle_id' => $v3->id,
                'driver_id' => $d3->id,
                'current_latitude' => 11.8654,
                'current_longitude' => 3.3845,
                'estimated_delivery' => now()->addHours(12),
            ],
            [
                'tracking_number' => 'SL-CTN-6540',
                'origin' => 'Terminal Conteneurs Bénin',
                'destination' => 'Malanville Entrepôt',
                'cargo_type' => 'Équipements Solaires & Batteries',
                'weight_kg' => 14000.00,
                'status' => 'DELIVERED',
                'vehicle_id' => $v4->id,
                'driver_id' => $d4->id,
                'current_latitude' => 11.8700,
                'current_longitude' => 3.3850,
                'actual_delivery' => now()->subDay(),
            ]
        ];

        foreach ($shipments as $s) {
            Shipment::firstOrCreate(['tracking_number' => $s['tracking_number']], $s);
        }
    }
}
