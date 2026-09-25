<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Table Chauffeurs
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('phone', 30)->unique();
            $table->string('license_number', 60)->unique();
            $table->enum('status', ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY'])->default('AVAILABLE');
            $table->timestamps();
        });

        // 2. Table Véhicules
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('plate_number', 30)->unique();
            $table->string('model', 100);
            $table->decimal('capacity_tons', 6, 2);
            $table->enum('status', ['AVAILABLE', 'ASSIGNED', 'IN_MAINTENANCE'])->default('AVAILABLE');
            $table->timestamps();
        });

        // 3. Table Expéditions Fret
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number', 50)->unique();
            $table->string('origin', 150);
            $table->string('destination', 150);
            $table->string('cargo_type', 150);
            $table->decimal('weight_kg', 10, 2);
            $table->enum('status', ['PORT_CLEARANCE', 'IN_TRANSIT', 'CUSTOMS_BORDER', 'DELIVERED'])->default('PORT_CLEARANCE');
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->decimal('current_latitude', 10, 7)->nullable();
            $table->decimal('current_longitude', 10, 7)->nullable();
            $table->timestamp('estimated_delivery')->nullable();
            $table->timestamp('actual_delivery')->nullable();
            $table->timestamps();

            $table->index('status');
        });

        // 4. Table Télématique GPS
        Schema::create('gps_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained('shipments')->onDelete('cascade');
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->decimal('speed_kmh', 5, 2)->default(0.00);
            $table->timestamp('recorded_at')->useCurrent();

            $table->index(['shipment_id', 'recorded_at']);
        });

        // 5. Table Logs d'étapes
        Schema::create('shipment_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained('shipments')->onDelete('cascade');
            $table->string('previous_status', 50)->nullable();
            $table->string('new_status', 50);
            $table->text('notes')->nullable();
            $table->string('created_by', 100)->default('Dispatcher');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_logs');
        Schema::dropIfExists('gps_trackings');
        Schema::dropIfExists('shipments');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('drivers');
    }
};
