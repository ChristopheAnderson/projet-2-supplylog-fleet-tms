import { Shipment, ShipmentStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

export interface CreateShipmentPayload {
  origin: string;
  destination: string;
  cargo_type: string;
  weight_kg: number;
  vehicle_id?: number;
  driver_id?: number;
  estimated_delivery?: string;
}

export const logisticsApi = {
  // Obtenir la liste des cargaisons actives
  async getShipments(): Promise<Shipment[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/shipments`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    } catch {
      return [];
    }
  },

  // Mettre à jour l'étape logistique
  async updateStatus(id: number, status: ShipmentStatus): Promise<Shipment> {
    const res = await fetch(`${API_BASE_URL}/shipments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error('Échec de la mise à jour du statut');
    const json = await res.json();
    return json.data;
  },

  // Enregistrer un nouveau convoi
  async createShipment(payload: CreateShipmentPayload): Promise<Shipment> {
    const res = await fetch(`${API_BASE_URL}/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Erreur lors de la création');
    const json = await res.json();
    return json.data;
  },

  // Récupérer la synthèse OTIF
  async getFleetSummary() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/fleet-summary`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return {
        active_trucks: 42,
        in_transit: 28,
        at_customs: 9,
        otif_rate: 96.4,
      };
    }
  }
};
