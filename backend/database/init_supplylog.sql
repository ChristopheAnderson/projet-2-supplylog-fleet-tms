-- ==========================================================
-- Database Schema Initialization : SUPPLYLOG FLEET TMS
-- Target DBMS : PostgreSQL 16
-- ==========================================================

CREATE TYPE shipment_stage AS ENUM ('PORT_CLEARANCE', 'IN_TRANSIT', 'CUSTOMS_BORDER', 'DELIVERED');
CREATE TYPE vehicle_status AS ENUM ('AVAILABLE', 'ASSIGNED', 'IN_MAINTENANCE');
CREATE TYPE driver_status AS ENUM ('AVAILABLE', 'ON_TRIP', 'OFF_DUTY');

-- 1. Table des Chauffeurs Routiers
CREATE TABLE IF NOT EXISTS drivers (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL UNIQUE,
    license_number VARCHAR(60) NOT NULL UNIQUE,
    status driver_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des Véhicules & Poids Lourds
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGSERIAL PRIMARY KEY,
    plate_number VARCHAR(30) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    capacity_tons NUMERIC(6, 2) NOT NULL,
    status vehicle_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table des Cargaisons & Expéditions de Fret
CREATE TABLE IF NOT EXISTS shipments (
    id BIGSERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    origin VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    cargo_type VARCHAR(150) NOT NULL,
    weight_kg NUMERIC(10, 2) NOT NULL,
    status shipment_stage DEFAULT 'PORT_CLEARANCE',
    vehicle_id BIGINT REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id BIGINT REFERENCES drivers(id) ON DELETE SET NULL,
    current_latitude NUMERIC(10, 7),
    current_longitude NUMERIC(10, 7),
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table des Pings GPS & Télématique
CREATE TABLE IF NOT EXISTS gps_trackings (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    vehicle_id BIGINT REFERENCES vehicles(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    speed_kmh NUMERIC(5, 2) DEFAULT 0.00,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Journal d'Audit des Étapes Fret
CREATE TABLE IF NOT EXISTS shipment_logs (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_by VARCHAR(100) DEFAULT 'System Dispatcher',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index d'optimisation
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_gps_shipment_time ON gps_trackings(shipment_id, recorded_at DESC);

-- Données initiales
INSERT INTO drivers (id, first_name, last_name, phone, license_number, status)
VALUES
(1, 'Moussa', 'Kora', '+229 97 11 22 33', 'BEN-PERM-88910', 'ON_TRIP'),
(2, 'Alassane', 'Bio', '+229 95 44 55 66', 'BEN-PERM-33412', 'AVAILABLE'),
(3, 'Gérard', 'Dossou', '+229 96 77 88 99', 'BEN-PERM-77123', 'ON_TRIP'),
(4, 'Salifou', 'Adamou', '+229 40 12 34 56', 'BEN-PERM-55611', 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, plate_number, model, capacity_tons, status)
VALUES
(1, 'BJ 4829 RB', 'Mercedes-Benz Actros 3340', 40.00, 'ASSIGNED'),
(2, 'BJ 1102 RA', 'Renault Trucks Kerax', 35.00, 'AVAILABLE'),
(3, 'BJ 7731 RC', 'Volvo FMX 440', 38.00, 'ASSIGNED'),
(4, 'BJ 3390 RB', 'Scania G420', 42.00, 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO shipments (id, tracking_number, origin, destination, cargo_type, weight_kg, status, vehicle_id, driver_id, current_latitude, current_longitude, estimated_delivery)
VALUES
(1, 'SL-CTN-9021', 'Port Autonome de Cotonou', 'Niamey, Niger', 'Matériaux de Construction & Ciment', 34000.00, 'IN_TRANSIT', 1, 1, 9.3524, 2.6189, CURRENT_TIMESTAMP + INTERVAL '2 days'),
(2, 'SL-CTN-8843', 'Zone Portuaire Cotonou', 'Ouagadougou, Burkina Faso', 'Produits Agroalimentaires & Riz', 28000.00, 'PORT_CLEARANCE', 2, 2, 6.3654, 2.4183, CURRENT_TIMESTAMP + INTERVAL '4 days'),
(3, 'SL-CTN-7612', 'Dépôt SOBEBRA Cotonou', 'Parakou (Dépôt Nord)', 'Boissons & Consommables', 19500.00, 'CUSTOMS_BORDER', 3, 3, 11.8654, 3.3845, CURRENT_TIMESTAMP + INTERVAL '12 hours'),
(4, 'SL-CTN-6540', 'Terminal Conteneurs Bénin', 'Malanville Entrepôt', 'Équipements Solaires & Batteries', 14000.00, 'DELIVERED', 4, 4, 11.8700, 3.3850, CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
