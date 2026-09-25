import { useState, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  Plus, 
  X, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  Gauge, 
  Fuel, 
  FileText, 
  Download, 
  Printer, 
  Radio, 
  Activity, 
  RotateCcw,
  QrCode,
  Layers,
  ChevronRight,
  TrendingUp,
  User,
  Phone
} from 'lucide-react';

export type ShipmentStatus = 'PORT_CLEARANCE' | 'IN_TRANSIT' | 'CUSTOMS_BORDER' | 'DELIVERED';
export type CargoType = 'CONTENEUR_40' | 'CIMENT_VRAC' | 'RIZ_AGRO' | 'HYDROCARBURES' | 'COTON';

export interface Shipment {
  id: string;
  waybill_ref: string;
  truck_plate: string;
  driver_name: string;
  driver_phone: string;
  origin: string;
  destination: string;
  current_location: string;
  cargo_type: CargoType;
  cargo_desc: string;
  weight_tons: number;
  declared_value_xof: number;
  status: ShipmentStatus;
  eta: string;
  speed_kmh: number;
  fuel_level_percent: number;
  last_gps_ping: string;
  progress_percent: number;
  logs: { time: string; stage: string; note: string }[];
}

export interface IncidentAlert {
  id: string;
  shipment_ref: string;
  type: 'PANNE_MECANIQUE' | 'CONTROLE_DOUANE' | 'SURCHARGE_PESAGE' | 'RETARD_METEO';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  description: string;
  created_at: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'telematics' | 'waybills' | 'incidents' | 'otif'>('kanban');

  // Convois State
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 'shp_1',
      waybill_ref: 'SL-CTN-2026-0891',
      truck_plate: 'RB 4512 AK',
      driver_name: 'Bio Bio Sékou',
      driver_phone: '+229 97 22 33 44',
      origin: 'Port Autonome de Cotonou',
      destination: 'Niamey Terminal (Niger)',
      current_location: 'Parakou (RNIE 2)',
      cargo_type: 'CONTENEUR_40',
      cargo_desc: '2x Conteneurs 40ft Équipements Télécoms',
      weight_tons: 28.5,
      declared_value_xof: 185000000,
      status: 'IN_TRANSIT',
      eta: '2026-09-27 14:00',
      speed_kmh: 68,
      fuel_level_percent: 74,
      last_gps_ping: 'Il y a 3 min',
      progress_percent: 45,
      logs: [
        { time: '2026-09-24 08:30', stage: 'Port de Cotonou', note: 'Sortie quai validée après scan douanier' },
        { time: '2026-09-24 16:45', stage: 'Bohicon', note: 'Arrêt ravitaillement et contrôle essieux conforme' },
        { time: '2026-09-25 11:20', stage: 'Parakou', note: 'Passage péage RNIE 2 en cours' }
      ]
    },
    {
      id: 'shp_2',
      waybill_ref: 'SL-CTN-2026-0904',
      truck_plate: 'RB 8920 BF',
      driver_name: 'Koffi Tossou',
      driver_phone: '+229 95 66 77 88',
      origin: 'Port Autonome de Cotonou',
      destination: 'Malanville Entrepôt Central',
      current_location: 'Malanville Poste Frontière',
      cargo_type: 'CIMENT_VRAC',
      cargo_desc: 'Ciment Haute Résistance en Sacs (NOCIBE)',
      weight_tons: 35.0,
      declared_value_xof: 42000000,
      status: 'CUSTOMS_BORDER',
      eta: '2026-09-25 18:30',
      speed_kmh: 0,
      fuel_level_percent: 52,
      last_gps_ping: 'Il y a 1 min',
      progress_percent: 85,
      logs: [
        { time: '2026-09-23 10:00', stage: 'Port de Cotonou', note: 'Chargement en zone franche' },
        { time: '2026-09-24 14:10', stage: 'Kandi', note: 'Halte nocturne sécurisée' },
        { time: '2026-09-25 09:30', stage: 'Malanville', note: 'Vérification documents d exportation transit' }
      ]
    },
    {
      id: 'shp_3',
      waybill_ref: 'SL-CTN-2026-0912',
      truck_plate: 'RB 1209 CC',
      driver_name: 'Moussa Harouna',
      driver_phone: '+229 94 88 99 11',
      origin: 'Port Autonome de Cotonou',
      destination: 'Ouagadougou ZAD (Burkina)',
      current_location: 'Terre-plein Port de Cotonou',
      cargo_type: 'RIZ_AGRO',
      cargo_desc: 'Riz Blanc Parfumé 25kg (500 sacs)',
      weight_tons: 12.5,
      declared_value_xof: 16500000,
      status: 'PORT_CLEARANCE',
      eta: '2026-09-28 11:00',
      speed_kmh: 0,
      fuel_level_percent: 95,
      last_gps_ping: 'Il y a 8 min',
      progress_percent: 5,
      logs: [
        { time: '2026-09-25 07:15', stage: 'Port de Cotonou', note: 'Positionné en attente d empotage quai 4' }
      ]
    },
    {
      id: 'shp_4',
      waybill_ref: 'SL-CTN-2026-0865',
      truck_plate: 'RN 6741 NI',
      driver_name: 'Abdoul-Karim Zada',
      driver_phone: '+227 90 44 55 66',
      origin: 'Port Autonome de Cotonou',
      destination: 'Niamey Rive Droite',
      current_location: 'Niamey Déchargé',
      cargo_type: 'HYDROCARBURES',
      cargo_desc: 'Citerne Carburant Aérien Jet A-1',
      weight_tons: 32.0,
      declared_value_xof: 78000000,
      status: 'DELIVERED',
      eta: 'Livré le 24/09 17:15',
      speed_kmh: 0,
      fuel_level_percent: 30,
      last_gps_ping: 'Il y a 2h',
      progress_percent: 100,
      logs: [
        { time: '2026-09-21 09:00', stage: 'Port de Cotonou', note: 'Départ escorté' },
        { time: '2026-09-23 11:45', stage: 'Frontière Gaya', note: 'Validation tampon douanier Niger' },
        { time: '2026-09-24 17:15', stage: 'Niamey', note: 'Dépotage certifié sans perte' }
      ]
    }
  ]);

  // Incidents State
  const [incidents, setIncidents] = useState<IncidentAlert[]>([
    {
      id: 'inc_1',
      shipment_ref: 'SL-CTN-2026-0904',
      type: 'CONTROLE_DOUANE',
      severity: 'MEDIUM',
      location: 'Malanville Guichet Unique',
      description: 'Attente du certificat phytosanitaire de conformité douanière',
      created_at: '2026-09-25 10:15',
      status: 'ACTIVE'
    }
  ]);

  // Selected Shipment for Detail Drawer / BSC Printable
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // New Shipment Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTruckPlate, setNewTruckPlate] = useState('RB 7741 DD');
  const [newDriverName, setNewDriverName] = useState('Salifou Nouhoum');
  const [newDriverPhone, setNewDriverPhone] = useState('+229 97 10 20 30');
  const [newDestination, setNewDestination] = useState('Niamey Terminal (Niger)');
  const [newCargoDesc, setNewCargoDesc] = useState('Marchandises Générales & Électroménager');
  const [newCargoType, setNewCargoType] = useState<CargoType>('CONTENEUR_40');
  const [newWeightTons, setNewWeightTons] = useState(24);
  const [newValueXof, setNewValueXof] = useState(45000000);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Move status handler
  const handleUpdateStatus = (id: string, newStatus: ShipmentStatus) => {
    setShipments(prev => prev.map(shp => {
      if (shp.id === id) {
        let progress = shp.progress_percent;
        if (newStatus === 'PORT_CLEARANCE') progress = 10;
        if (newStatus === 'IN_TRANSIT') progress = 50;
        if (newStatus === 'CUSTOMS_BORDER') progress = 85;
        if (newStatus === 'DELIVERED') progress = 100;

        return {
          ...shp,
          status: newStatus,
          progress_percent: progress,
          logs: [
            ...shp.logs,
            {
              time: new Date().toISOString().replace('T', ' ').substring(0, 16),
              stage: newStatus === 'IN_TRANSIT' ? 'Transit Corridor' : (newStatus === 'CUSTOMS_BORDER' ? 'Poste Frontière' : 'Destination'),
              note: `Changement de statut en direct vers ${newStatus}`
            }
          ]
        };
      }
      return shp;
    }));
  };

  // Telematics Ping Simulation
  const handleSimulateGpsPing = (id: string) => {
    setShipments(prev => prev.map(shp => {
      if (shp.id === id) {
        const newSpeed = Math.floor(55 + Math.random() * 25);
        const newFuel = Math.max(10, shp.fuel_level_percent - 2);
        return {
          ...shp,
          speed_kmh: newSpeed,
          fuel_level_percent: newFuel,
          last_gps_ping: 'À l instant (Balise OK)',
        };
      }
      return shp;
    }));
  };

  // Create Shipment
  const handleCreateShipment = () => {
    const newShp: Shipment = {
      id: `shp_${Date.now()}`,
      waybill_ref: `SL-CTN-2026-0${Math.floor(100 + Math.random() * 900)}`,
      truck_plate: newTruckPlate,
      driver_name: newDriverName,
      driver_phone: newDriverPhone,
      origin: 'Port Autonome de Cotonou',
      destination: newDestination,
      current_location: 'Zone Franche Port de Cotonou',
      cargo_type: newCargoType,
      cargo_desc: newCargoDesc,
      weight_tons: Number(newWeightTons),
      declared_value_xof: Number(newValueXof),
      status: 'PORT_CLEARANCE',
      eta: '2026-09-29 18:00',
      speed_kmh: 0,
      fuel_level_percent: 100,
      last_gps_ping: 'À l instant',
      progress_percent: 5,
      logs: [
        { time: new Date().toISOString().replace('T', ' ').substring(0, 16), stage: 'Port de Cotonou', note: 'Création du manifeste de chargement' }
      ]
    };

    setShipments(prev => [newShp, ...prev]);
    setShowCreateModal(false);
  };

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const matchSearch = 
        s.waybill_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.truck_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.driver_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [shipments, searchQuery, statusFilter]);

  // Aggregate Metrics
  const activeFleetCount = shipments.filter(s => s.status !== 'DELIVERED').length;
  const totalTonnage = shipments.reduce((sum, s) => sum + s.weight_tons, 0);

  // Status Styles Config
  const statusMeta: Record<ShipmentStatus, { label: string; badgeBg: string; text: string; border: string }> = {
    PORT_CLEARANCE: { label: 'Port Cotonou (Dédouanement)', badgeBg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/40' },
    IN_TRANSIT: { label: 'En Transit (Corridor RNIE)', badgeBg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/40' },
    CUSTOMS_BORDER: { label: 'Douane Frontière (Malanville)', badgeBg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/40' },
    DELIVERED: { label: 'Livré à Destination', badgeBg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  };

  // 10 Checkpoints on the Cotonou-Niamey Corridor
  const corridorCheckpoints = [
    { name: 'Cotonou Port', km: 0, status: 'Depart' },
    { name: 'Allada', km: 55, status: 'Peage' },
    { name: 'Bohicon', km: 135, status: 'Relais' },
    { name: 'Dassa-Zoumé', km: 210, status: 'Controle' },
    { name: 'Parakou', km: 415, status: 'Hub Central' },
    { name: 'Bembèrèkè', km: 520, status: 'Escale' },
    { name: 'Kandi', km: 645, status: 'Pesage' },
    { name: 'Malanville', km: 735, status: 'Douane Bénin' },
    { name: 'Gaya', km: 745, status: 'Entrée Niger' },
    { name: 'Niamey', km: 1040, status: 'Terminus' }
  ];

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800 bg-[#0C1322] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Platform Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-600/30 border border-cyan-400/30">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">SupplyLog Fleet TMS</h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Corridor Bénin-Sahel
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">Tour de Contrôle Fret Portuaire & Télématique Temps Réel</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-[#101A2E] px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Canal Reverb WebSockets : Connecté</span>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-cyan-900/30 border border-cyan-400/30 flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Expédition</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 -mb-px overflow-x-auto pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'kanban'
                  ? 'border-cyan-500 text-white bg-cyan-500/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Tour de Contrôle (Kanban Corridor)</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-200 font-bold">
                {shipments.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('telematics')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'telematics'
                  ? 'border-cyan-500 text-white bg-cyan-500/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Navigation className="w-4 h-4 text-blue-400" />
              <span>Traceur Télématique GPS (RNIE 2)</span>
            </button>
            <button
              onClick={() => setActiveTab('waybills')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'waybills'
                  ? 'border-cyan-500 text-white bg-cyan-500/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Manifestes & Bordereaux BSC</span>
            </button>
            <button
              onClick={() => setActiveTab('incidents')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'incidents'
                  ? 'border-cyan-500 text-white bg-cyan-500/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Alertes & Aléas de Route</span>
              {incidents.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-rose-600 text-white font-bold">
                  {incidents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('otif')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'otif'
                  ? 'border-cyan-500 text-white bg-cyan-500/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Performance OTIF & Métriques</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============================================================== */}
        {/* TAB 1: KANBAN CORRIDOR */}
        {/* ============================================================== */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            {/* Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Flotte Active en Convoi</p>
                  <p className="text-2xl font-black text-white mt-1">{activeFleetCount} Camions</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Tonnage Total Mobilisé</p>
                  <p className="text-2xl font-black text-white mt-1">{totalTonnage.toFixed(1)} Tonnes</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/30">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Ponctualité OTIF Globale</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">94.8%</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Vitesse Moyenne Flotte</p>
                  <p className="text-2xl font-black text-cyan-300 mt-1">62 km/h</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                  <Gauge className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Kanban Columns (4 étapes clés) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {(['PORT_CLEARANCE', 'IN_TRANSIT', 'CUSTOMS_BORDER', 'DELIVERED'] as ShipmentStatus[]).map(statusKey => {
                const columnShipments = shipments.filter(s => s.status === statusKey);
                const meta = statusMeta[statusKey];

                return (
                  <div key={statusKey} className="rounded-2xl bg-[#0F172A] border border-slate-700/80 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
                    {/* Column Header */}
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{meta.label}</span>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-[#1E293B] text-slate-200 text-xs font-bold flex items-center justify-center border border-slate-700">
                        {columnShipments.length}
                      </span>
                    </div>

                    {/* Column Body / Cards List */}
                    <div className="p-3 flex-1 overflow-y-auto space-y-3.5">
                      {columnShipments.length === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-400 font-semibold border-2 border-dashed border-slate-800 rounded-xl">
                          Aucun convoi à cette étape
                        </div>
                      ) : (
                        columnShipments.map(shp => (
                          <div 
                            key={shp.id}
                            className="p-4 rounded-xl bg-[#131D33] border border-slate-700 hover:border-cyan-500/60 shadow-md transition space-y-3"
                          >
                            {/* Card Top: Waybill Ref & ETA */}
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="font-mono text-xs font-bold text-cyan-300 block">{shp.waybill_ref}</span>
                                <span className="text-base font-extrabold text-white tracking-wide">{shp.truck_plate}</span>
                              </div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {shp.weight_tons} T
                              </span>
                            </div>

                            {/* Driver & Phone */}
                            <div className="flex items-center justify-between text-xs text-slate-300 border-t border-b border-slate-800/80 py-2">
                              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {shp.driver_name}
                              </span>
                              <span className="font-mono text-slate-400">{shp.driver_phone}</span>
                            </div>

                            {/* Destination & Location */}
                            <div className="text-xs space-y-1">
                              <div className="flex items-center gap-1.5 text-slate-200">
                                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="font-bold truncate">{shp.destination}</span>
                              </div>
                              <div className="text-slate-400 pl-5 text-[11px]">
                                Pos : <span className="text-slate-200 font-semibold">{shp.current_location}</span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                <span>Avancement corridor</span>
                                <span className="text-cyan-400">{shp.progress_percent}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                                  style={{ width: `${shp.progress_percent}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Actions bar */}
                            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                              <button
                                onClick={() => setSelectedShipment(shp)}
                                className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                              >
                                Fiche BSC <ChevronRight className="w-3.5 h-3.5" />
                              </button>

                              {/* Status Step Changers */}
                              <div className="flex items-center gap-1">
                                {statusKey !== 'PORT_CLEARANCE' && (
                                  <button
                                    title="Reculer d'étape"
                                    onClick={() => {
                                      const prevStatus: Record<ShipmentStatus, ShipmentStatus> = {
                                        PORT_CLEARANCE: 'PORT_CLEARANCE',
                                        IN_TRANSIT: 'PORT_CLEARANCE',
                                        CUSTOMS_BORDER: 'IN_TRANSIT',
                                        DELIVERED: 'CUSTOMS_BORDER'
                                      };
                                      handleUpdateStatus(shp.id, prevStatus[statusKey]);
                                    }}
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </button>
                                )}

                                {statusKey !== 'DELIVERED' && (
                                  <button
                                    onClick={() => {
                                      const nextStatus: Record<ShipmentStatus, ShipmentStatus> = {
                                        PORT_CLEARANCE: 'IN_TRANSIT',
                                        IN_TRANSIT: 'CUSTOMS_BORDER',
                                        CUSTOMS_BORDER: 'DELIVERED',
                                        DELIVERED: 'DELIVERED'
                                      };
                                      handleUpdateStatus(shp.id, nextStatus[statusKey]);
                                    }}
                                    className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                                  >
                                    <span>Avancer</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: TÉLÉMATIQUE GPS & CARTE DU CORRIDOR */}
        {/* ============================================================== */}
        {activeTab === 'telematics' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-400" />
                    Tracé Télématique du Corridor Nord Bénin (RNIE 2)
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                    Visualisation kilométrique des 1 040 km reliant le Port Autonome de Cotonou à Niamey (Niger)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
                    Balises GPS Actives
                  </span>
                </div>
              </div>

              {/* Corridor Interactive Stepper Map */}
              <div className="p-6 rounded-xl bg-[#080D1A] border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Jalons et Postes de Contrôle du Corridor
                </h3>
                <div className="relative pt-6 pb-2">
                  {/* Line */}
                  <div className="absolute top-10 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 z-0 hidden lg:block"></div>
                  
                  {/* Step Points */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 relative z-10">
                    {corridorCheckpoints.map((cp, idx) => {
                      const hasTruck = shipments.some(s => s.current_location.toLowerCase().includes(cp.name.toLowerCase()));
                      return (
                        <div key={cp.name} className="flex flex-col items-center text-center space-y-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                            hasTruck 
                              ? 'bg-cyan-500 text-white border-cyan-300 ring-4 ring-cyan-500/30 shadow-lg' 
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className="text-xs font-bold text-white mt-1">{cp.name}</span>
                          <span className="text-[10px] font-mono text-cyan-400">{cp.km} km</span>
                          <span className="text-[10px] text-slate-400">{cp.status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Live Vehicle Telematics Stream */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">État Télématique des Convois en Roulage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shipments.map(shp => (
                    <div key={shp.id} className="p-4 rounded-xl bg-[#131D33] border border-slate-700 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold text-white">{shp.truck_plate}</span>
                            <span className="font-mono text-xs text-cyan-300 font-semibold">({shp.waybill_ref})</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">Chauffeur : {shp.driver_name} • {shp.driver_phone}</p>
                        </div>
                        <button
                          onClick={() => handleSimulateGpsPing(shp.id)}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Activity className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Simuler Ping GPS</span>
                        </button>
                      </div>

                      {/* Gauges Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                        <div className="p-2 rounded-lg bg-[#0C1322]">
                          <span className="text-[11px] font-semibold text-slate-400 block">Vitesse</span>
                          <span className="text-base font-black text-white">{shp.speed_kmh} km/h</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#0C1322]">
                          <span className="text-[11px] font-semibold text-slate-400 block">Carburant</span>
                          <span className="text-base font-black text-emerald-400">{shp.fuel_level_percent}%</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#0C1322]">
                          <span className="text-[11px] font-semibold text-slate-400 block">Dernier Ping</span>
                          <span className="text-xs font-bold text-slate-300 block mt-1">{shp.last_gps_ping}</span>
                        </div>
                      </div>

                      <div className="text-xs flex items-center justify-between text-slate-400 pt-1">
                        <span>Position actuelle : <strong className="text-white">{shp.current_location}</strong></span>
                        <span className="text-amber-400 font-semibold">ETA : {shp.eta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MANIFESTES & WAYBILLS */}
        {/* ============================================================== */}
        {activeTab === 'waybills' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Registre Officiel des Manifestes & Waybills</h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-300">
                    Bordereaux de Suivi de Cargaison (BSC) conformes aux exigences du Port Autonome de Cotonou
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-md border border-cyan-400/30 flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Émettre une Lettre de Voiture</span>
                </button>
              </div>

              {/* Search & Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Recherche par n° de waybill, plaque, chauffeur, destination..."
                    className="w-full bg-[#080D1A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-[#080D1A] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="ALL">Toutes les Étapes</option>
                    <option value="PORT_CLEARANCE">Port de Cotonou (Dédouanement)</option>
                    <option value="IN_TRANSIT">En Transit Corridor</option>
                    <option value="CUSTOMS_BORDER">Douane Malanville</option>
                    <option value="DELIVERED">Livré à Destination</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#131D33] text-slate-300 font-bold border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Bordereau (Waybill)</th>
                      <th className="py-3 px-4">Camion & Chauffeur</th>
                      <th className="py-3 px-4">Nature Cargaison</th>
                      <th className="py-3 px-4 text-right">Tonnage</th>
                      <th className="py-3 px-4 text-right">Valeur Déclarée</th>
                      <th className="py-3 px-4 text-center">Étape</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredShipments.map(shp => {
                      const meta = statusMeta[shp.status];
                      return (
                        <tr key={shp.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                            {shp.waybill_ref}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-white">{shp.truck_plate}</div>
                            <div className="text-xs text-slate-400">{shp.driver_name} ({shp.driver_phone})</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-200">{shp.cargo_desc}</div>
                            <div className="text-xs text-slate-400">Vers : {shp.destination}</div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-extrabold text-white">
                            {shp.weight_tons} T
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-200">
                            {shp.declared_value_xof.toLocaleString()} XOF
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${meta.badgeBg} ${meta.text} ${meta.border}`}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedShipment(shp)}
                              className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 font-bold rounded-lg text-xs border border-cyan-500/40 transition flex items-center gap-1 ml-auto"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Consulter BSC</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: ALERTES & INCIDENTS */}
        {/* ============================================================== */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Centre de Gestion des Incidents & Aléas du Corridor
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                Suivi proactif des blocages douaniers, pannes mécaniques et perturbations météorologiques
              </p>

              <div className="mt-6 space-y-4">
                {incidents.map(inc => (
                  <div key={inc.id} className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/40 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {inc.type.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-xs font-bold text-white">Convoi : {inc.shipment_ref}</span>
                        <span className="text-xs text-slate-400">• {inc.created_at}</span>
                      </div>
                      <p className="text-sm font-bold text-white mt-1">{inc.description}</p>
                      <p className="text-xs text-slate-300">Localisation constatée : <strong>{inc.location}</strong></p>
                    </div>

                    <button
                      onClick={() => setIncidents(prev => prev.filter(i => i.id !== inc.id))}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                    >
                      Clôturer Aléa
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: OTIF & PERFORMANCE */}
        {/* ============================================================== */}
        {activeTab === 'otif' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Score Global OTIF</h3>
              <p className="text-4xl font-black text-emerald-400 mt-2">94.8%</p>
              <p className="text-xs text-slate-400 mt-1">On-Time In-Full sur 120 convois ce trimestre</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Temps Moyen Dédouanement Port</h3>
              <p className="text-4xl font-black text-cyan-300 mt-2">4.2 h</p>
              <p className="text-xs text-slate-400 mt-1">Objectif Port Autonome de Cotonou : &lt; 6 h</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Franchissement Frontière Malanville</h3>
              <p className="text-4xl font-black text-amber-300 mt-2">2.8 h</p>
              <p className="text-xs text-slate-400 mt-1">Guichet Unique UEMOA</p>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* DRAWER / MODAL : FICHE OFFICIELLE BSC (BORDEREAU) */}
      {/* ============================================================== */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">Bordereau de Suivi de Cargaison (BSC)</h3>
                <p className="font-mono text-xs text-cyan-300 font-bold">{selectedShipment.waybill_ref}</p>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Badge Banner */}
            <div className="p-4 rounded-xl bg-[#131D33] border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block">STATUT DU CONVOI</span>
                <span className="text-base font-extrabold text-white">
                  {statusMeta[selectedShipment.status].label}
                </span>
              </div>
              <div className="w-14 h-14 bg-white rounded-lg p-1.5 flex items-center justify-center shadow">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-[#080D1A] border border-slate-800">
                <span className="text-slate-400 block font-semibold">Tracteur / Plaque</span>
                <span className="text-sm font-extrabold text-white">{selectedShipment.truck_plate}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#080D1A] border border-slate-800">
                <span className="text-slate-400 block font-semibold">Chauffeur Titulaire</span>
                <span className="text-sm font-extrabold text-white">{selectedShipment.driver_name}</span>
                <span className="text-slate-400 block font-mono">{selectedShipment.driver_phone}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#080D1A] border border-slate-800">
                <span className="text-slate-400 block font-semibold">Origine de Chargement</span>
                <span className="text-sm font-bold text-slate-200">{selectedShipment.origin}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#080D1A] border border-slate-800">
                <span className="text-slate-400 block font-semibold">Destination Finale</span>
                <span className="text-sm font-bold text-cyan-300">{selectedShipment.destination}</span>
              </div>
            </div>

            {/* Cargo Details */}
            <div className="p-4 rounded-xl bg-[#080D1A] border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spécifications Marchandise</h4>
              <p className="text-sm font-bold text-white">{selectedShipment.cargo_desc}</p>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-800 text-slate-300">
                <span>Poids Total Brut : <strong className="text-white">{selectedShipment.weight_tons} Tonnes</strong></span>
                <span>Valeur Déclarée en Douane : <strong className="text-emerald-400">{selectedShipment.declared_value_xof.toLocaleString()} XOF</strong></span>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Journal d'Audit de Convoi</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedShipment.logs.map((log, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#080D1A] border border-slate-800/80 text-xs flex items-start gap-2">
                    <span className="font-mono text-slate-400 shrink-0">{log.time}</span>
                    <span className="font-bold text-cyan-400 shrink-0">[{log.stage}]</span>
                    <span className="text-slate-200">{log.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Bordereau</span>
              </button>
              <button
                onClick={() => setSelectedShipment(null)}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL : NOUVELLE EXPÉDITION */}
      {/* ============================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Émettre une Nouvelle Expédition de Fret</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Immatriculation Tracteur
                </label>
                <input
                  type="text"
                  value={newTruckPlate}
                  onChange={(e) => setNewTruckPlate(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Nom du Chauffeur
                  </label>
                  <input
                    type="text"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    className="w-full bg-[#080D1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Téléphone Chauffeur
                  </label>
                  <input
                    type="text"
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                    className="w-full bg-[#080D1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Destination Finale Corridor
                </label>
                <select
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Niamey Terminal (Niger)">Niamey Terminal (Niger)</option>
                  <option value="Ouagadougou ZAD (Burkina Faso)">Ouagadougou ZAD (Burkina Faso)</option>
                  <option value="Malanville Entrepôt Central">Malanville Entrepôt Central (Bénin)</option>
                  <option value="Parakou Dépôt Hydrocarbures">Parakou Dépôt Hydrocarbures</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Description Marchandise
                </label>
                <input
                  type="text"
                  value={newCargoDesc}
                  onChange={(e) => setNewCargoDesc(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Poids (Tonnes)
                  </label>
                  <input
                    type="number"
                    value={newWeightTons}
                    onChange={(e) => setNewWeightTons(Number(e.target.value))}
                    className="w-full bg-[#080D1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Valeur Déclarée (XOF)
                  </label>
                  <input
                    type="number"
                    value={newValueXof}
                    onChange={(e) => setNewValueXof(Number(e.target.value))}
                    className="w-full bg-[#080D1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateShipment}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                Valider et Créer Expédition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
