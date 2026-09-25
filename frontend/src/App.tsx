import { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Radio, 
  Plus, 
  Navigation, 
  ChevronRight, 
  ArrowRight, 
  X, 
  Search, 
  Activity, 
  FileText, 
  Printer
} from 'lucide-react';
import { Shipment, ShipmentStatus } from './types';
import { logisticsApi, CreateShipmentPayload } from './api/client';

const COLUMNS: { id: ShipmentStatus; title: string; badge: string }[] = [
  { id: 'PORT_CLEARANCE', title: 'Port de Cotonou (Dédouanement)', badge: 'Dédouanement' },
  { id: 'IN_TRANSIT', title: 'Corridor en Transit (Route)', badge: 'En Route' },
  { id: 'CUSTOMS_BORDER', title: 'Poste Frontière (Malanville)', badge: 'Frontière' },
  { id: 'DELIVERED', title: 'Livré à Destination', badge: 'Livré' },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewShipmentModal, setShowNewShipmentModal] = useState<boolean>(false);
  const [selectedGpsShipment, setSelectedGpsShipment] = useState<Shipment | null>(null);
  const [selectedWaybill, setSelectedWaybill] = useState<Shipment | null>(null);

  const [newShipmentForm, setNewShipmentForm] = useState<CreateShipmentPayload>({
    origin: 'Port Autonome de Cotonou (Quai 4)',
    destination: 'Niamey, Niger (Zone Industrielle)',
    cargo_type: 'Clinker & Matériaux de Construction',
    weight_kg: 32000,
  });

  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 1,
      tracking_number: 'SL-CTN-9021',
      origin: 'Port Autonome de Cotonou',
      destination: 'Niamey, Niger',
      cargo_type: 'Matériaux de Construction & Ciment',
      weight_kg: 34000,
      status: 'IN_TRANSIT',
      truck_plate: 'BJ 4829 RB',
      driver_name: 'Moussa Kora',
      eta: '22 Sept 2026'
    },
    {
      id: 2,
      tracking_number: 'SL-CTN-8843',
      origin: 'Zone Portuaire Cotonou',
      destination: 'Ouagadougou, Burkina',
      cargo_type: 'Produits Agroalimentaires & Riz',
      weight_kg: 28000,
      status: 'PORT_CLEARANCE',
      truck_plate: 'BJ 1102 RA',
      driver_name: 'Alassane Bio',
      eta: '24 Sept 2026'
    },
    {
      id: 3,
      tracking_number: 'SL-CTN-7612',
      origin: 'Dépôt SOBEBRA Cotonou',
      destination: 'Parakou (Dépôt Nord)',
      cargo_type: 'Boissons & Consommables',
      weight_kg: 19500,
      status: 'CUSTOMS_BORDER',
      truck_plate: 'BJ 7731 RC',
      driver_name: 'Gérard Dossou',
      eta: '20 Sept 2026'
    },
    {
      id: 4,
      tracking_number: 'SL-CTN-6540',
      origin: 'Terminal Conteneurs Bénin',
      destination: 'Malanville Entrepôt',
      cargo_type: 'Équipements Solaires & Batteries',
      weight_kg: 14000,
      status: 'DELIVERED',
      truck_plate: 'BJ 3390 RB',
      driver_name: 'Salifou Adamou',
      eta: 'Livré avec succès'
    }
  ]);

  const advanceShipment = async (id: number, currentStatus: ShipmentStatus) => {
    const statusFlow: ShipmentStatus[] = ['PORT_CLEARANCE', 'IN_TRANSIT', 'CUSTOMS_BORDER', 'DELIVERED'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      try {
        await logisticsApi.updateStatus(id, nextStatus);
      } catch {
        // Fallback local
      }
      setShipments(shipments.map(s => s.id === id ? { ...s, status: nextStatus } : s));
    }
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Shipment = {
      id: Date.now(),
      tracking_number: `SL-CTN-${Math.floor(1000 + Math.random() * 9000)}`,
      origin: newShipmentForm.origin,
      destination: newShipmentForm.destination,
      cargo_type: newShipmentForm.cargo_type,
      weight_kg: Number(newShipmentForm.weight_kg),
      status: 'PORT_CLEARANCE',
      truck_plate: 'BJ ' + Math.floor(1000 + Math.random() * 9000) + ' RB',
      driver_name: 'Chauffeur Assigné',
      eta: 'Dans 3 jours'
    };
    setShipments([newEntry, ...shipments]);
    setShowNewShipmentModal(false);
  };

  const filteredShipments = shipments.filter(s => 
    s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cargo_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">SupplyLog TMS</h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
                WebSockets Reverb
              </span>
            </div>
            <p className="text-xs text-slate-400">Tour de Contrôle &amp; Fret Port Autonome de Cotonou • PostgreSQL</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block pr-2">
            <span className="text-[11px] text-slate-400 block">Taux Ponctualité (OTIF)</span>
            <span className="text-sm font-bold text-emerald-400">96.4%</span>
          </div>
          <button 
            onClick={() => setShowNewShipmentModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvelle Expédition
          </button>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 space-y-6">
        
        {/* Quick Corridor Metrics (3-Color System: Slate + Blue + Emerald) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-400 font-medium">Corridor Cotonou ➔ Niamey</span>
              <p className="text-xl font-bold text-slate-100 mt-1">18 Convois Actifs</p>
              <span className="text-[11px] text-slate-400">Transit moy. : 3.2 jours</span>
            </div>
            <Navigation className="w-6 h-6 text-blue-400" />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-400 font-medium">Corridor Cotonou ➔ Ouagadougou</span>
              <p className="text-xl font-bold text-slate-100 mt-1">12 Convois Actifs</p>
              <span className="text-[11px] text-slate-400">Transit moy. : 4.1 jours</span>
            </div>
            <Truck className="w-6 h-6 text-slate-400" />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-400 font-medium">Fret Interne (Nord-Bénin)</span>
              <p className="text-xl font-bold text-slate-100 mt-1">12 Livraisons</p>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Trafic fluide
              </span>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrer convoi (SL-CTN, Niamey, clinker...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">
            {filteredShipments.length} cargaisons suivies en temps réel
          </span>
        </div>

        {/* Live Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const columnShipments = filteredShipments.filter(s => s.status === col.id);
            return (
              <div key={col.id} className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden min-h-[550px]">
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200">
                    {col.title}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    {columnShipments.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                  {columnShipments.map((s) => (
                    <div key={s.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-lg shadow-sm transition space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {s.tracking_number}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {s.truck_plate}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-100">{s.cargo_type}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Poids : {(s.weight_kg / 1000).toFixed(1)} tonnes</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{s.origin}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <ArrowRight className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="truncate">{s.destination}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedGpsShipment(s)}
                            className="text-slate-400 hover:text-blue-400 flex items-center gap-1 font-medium transition"
                            title="Voir les coordonnées GPS en direct"
                          >
                            <Activity className="w-3 h-3 text-blue-400" /> GPS
                          </button>
                          <button 
                            onClick={() => setSelectedWaybill(s)}
                            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium transition"
                            title="Afficher la Lettre de Voiture / Bordereau officiel"
                          >
                            <FileText className="w-3 h-3 text-slate-400" /> Bordereau
                          </button>
                        </div>

                        {col.id !== 'DELIVERED' ? (
                          <button 
                            onClick={() => advanceShipment(s.id, s.status)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition text-[11px] font-medium"
                            title="Avancer à l'étape suivante"
                          >
                            Étape <ChevronRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Livré
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {columnShipments.length === 0 && (
                    <div className="text-center py-12 text-xs text-slate-600">
                      Aucun convoi à cette étape
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL 1 : NOUVELLE EXPÉDITION */}
      {showNewShipmentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                Créer un Ordre de Fret (Manifeste)
              </h3>
              <button onClick={() => setShowNewShipmentModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Origine / Quai de chargement</label>
                <input
                  type="text"
                  value={newShipmentForm.origin}
                  onChange={(e) => setNewShipmentForm({ ...newShipmentForm, origin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Destination Finale</label>
                <input
                  type="text"
                  value={newShipmentForm.destination}
                  onChange={(e) => setNewShipmentForm({ ...newShipmentForm, destination: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nature de la Cargaison</label>
                <input
                  type="text"
                  value={newShipmentForm.cargo_type}
                  onChange={(e) => setNewShipmentForm({ ...newShipmentForm, cargo_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Poids de la Marchandise (kg)</label>
                <input
                  type="number"
                  value={newShipmentForm.weight_kg}
                  onChange={(e) => setNewShipmentForm({ ...newShipmentForm, weight_kg: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewShipmentModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                >
                  Enregistrer Convoi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2 : DÉTAIL TÉLÉMATIQUE GPS */}
      {selectedGpsShipment && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Télématique GPS en Direct ({selectedGpsShipment.tracking_number})
              </h3>
              <button onClick={() => setSelectedGpsShipment(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordonnées GPS Actuelles :</span>
                  <span className="font-mono text-blue-400">9.3524° N, 2.6189° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vitesse du Véhicule :</span>
                  <span className="font-mono text-slate-100">68.4 km/h (Nominale)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Corridor :</span>
                  <span className="text-slate-200 font-medium">{selectedGpsShipment.origin} ➔ {selectedGpsShipment.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Immatriculation :</span>
                  <span className="font-mono text-slate-200">{selectedGpsShipment.truck_plate}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 text-center">
                Pings transmis via protocole MQTT / Ingestion Laravel REST API
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3 : LETTRE DE VOITURE / BORDEREAU DE TRANSPORT OFFICIEL */}
      {selectedWaybill && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 text-slate-100 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-800">
            {/* Header Document */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-slate-100">SUPPLYLOG FLEET TMS</span>
                  <span className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                    Bordereau Validé CEDEAO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Corridor Port Autonome de Cotonou (PAC) ➔ Hinterland</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Réf Manifeste : MAN-PAC-{selectedWaybill.id}-2026</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">N° de Suivi Unique</span>
                <span className="font-mono text-sm font-bold text-blue-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 block mt-1">
                  {selectedWaybill.tracking_number}
                </span>
              </div>
            </div>

            {/* Corps du Bordereau */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[10px]">1. Expéditeur &amp; Origine</span>
                <p className="font-medium text-slate-200">{selectedWaybill.origin}</p>
                <p className="text-slate-400 text-[11px]">Terminal Portuaire de Cotonou, Quai Sud</p>
                <p className="text-slate-500 text-[11px]">Régime Douanier : D15 - Transit</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[10px]">2. Destinataire &amp; Arrivée</span>
                <p className="font-medium text-slate-200">{selectedWaybill.destination}</p>
                <p className="text-slate-400 text-[11px]">Entrepôt Sous Douane Agréé</p>
                <p className="text-slate-500 text-[11px]">Délai estimé : {selectedWaybill.eta}</p>
              </div>
            </div>

            {/* Spécifications du fret et véhicule */}
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Désignation Fret</th>
                    <th className="p-2.5">Poids Net</th>
                    <th className="p-2.5">Tracteur</th>
                    <th className="p-2.5">Chauffeur</th>
                    <th className="p-2.5">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-medium text-slate-200">{selectedWaybill.cargo_type}</td>
                    <td className="p-2.5 font-mono">{(selectedWaybill.weight_kg / 1000).toFixed(1)} T</td>
                    <td className="p-2.5 font-mono font-medium text-blue-400">{selectedWaybill.truck_plate}</td>
                    <td className="p-2.5">{selectedWaybill.driver_name}</td>
                    <td className="p-2.5 font-medium text-slate-300">{selectedWaybill.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedWaybill(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                Imprimer Bordereau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        SupplyLog TMS Platform • Tour de Contrôle Port de Cotonou • Laravel 11 Backend + React 18 TypeScript
      </footer>
    </div>
  );
}
