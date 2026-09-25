export type ShipmentStatus = 
  | 'PORT_CLEARANCE' 
  | 'IN_TRANSIT' 
  | 'CUSTOMS_BORDER' 
  | 'DELIVERED';

export interface Shipment {
  id: number;
  tracking_number: string;
  origin: string;
  destination: string;
  cargo_type: string;
  weight_kg: number;
  status: ShipmentStatus;
  driver_name?: string;
  truck_plate?: string;
  eta: string;
}
