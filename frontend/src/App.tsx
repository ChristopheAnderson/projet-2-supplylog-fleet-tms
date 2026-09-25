import { useState, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  Plus, 
  X, 
  Search, 
  ArrowRight, 
  Gauge, 
  FileText, 
  Printer, 
  Radio, 
  Activity, 
  RotateCcw,
  QrCode,
  Layers,
  ChevronRight,
  TrendingUp,
  User,
  Menu
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shipments Data
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

  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTruckPlate, setNewTruckPlate] = useState('RB 7741 DD');
  const [newDriverName, setNewDriverName] = useState('Salifou Nouhoum');
  const [newDriverPhone, setNewDriverPhone] = useState('+229 97 10 20 30');
  const [newDestination, setNewDestination] = useState('Niamey Terminal (Niger)');
  const [newCargoDesc, setNewCargoDesc] = useState('Marchandises Générales & Électroménager');
  const [newCargoType] = useState<CargoType>('CONTENEUR_40');
  const [newWeightTons, setNewWeightTons] = useState(24);
  const [newValueXof, setNewValueXof] = useState(45000000);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
              note: `Changement de statut vers ${newStatus}`
            }
          ]
        };
      }
      return shp;
    }));
  };

  const handleSimulateGpsPing = (id: string) => {
    setShipments(prev => prev.map(shp => {
      if (shp.id === id) {
        const newSpeed = Math.floor(55 + Math.random() * 25);
        const newFuel = Math.max(10, shp.fuel_level_percent - 2);
        return {
          ...shp,
          speed_kmh: newSpeed,
          fuel_level_percent: newFuel,
          last_gps_ping: 'À l instant',
        };
      }
      return shp;
    }));
  };

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

  const activeFleetCount = shipments.filter(s => s.status !== 'DELIVERED').length;
  const totalTonnage = shipments.reduce((sum, s) => sum + s.weight_tons, 0);

  // Sober status names & styling (Marine/Teal brand theme)
  const statusLabels: Record<ShipmentStatus, string> = {
    PORT_CLEARANCE: 'Port de Cotonou',
    IN_TRANSIT: 'En Transit Corridor',
    CUSTOMS_BORDER: 'Douane Frontière',
    DELIVERED: 'Livré à Destination',
  };

  const corridorCheckpoints = [
    { name: 'Cotonou', km: 0 },
    { name: 'Allada', km: 55 },
    { name: 'Bohicon', km: 135 },
    { name: 'Dassa', km: 210 },
    { name: 'Parakou', km: 415 },
    { name: 'Bembèrèkè', km: 520 },
    { name: 'Kandi', km: 645 },
    { name: 'Malanville', km: 735 },
    { name: 'Gaya', km: 745 },
    { name: 'Niamey', km: 1040 }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Enterprise Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">SupplyLog Fleet TMS</h1>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Corridor Bénin-Sahel
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Tour de Contrôle Fret Portuaire & Télématique</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>WebSockets : Connecté</span>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="hidden sm:flex px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-lg shadow-sm items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Expédition</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex items-center gap-1 -mb-px overflow-x-auto pt-1 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'kanban'
                  ? 'border-teal-700 text-teal-800 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Tour de Contrôle (Kanban)</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 text-slate-800 font-bold">
                {shipments.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('telematics')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'telematics'
                  ? 'border-teal-700 text-teal-800 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Traceur Télématique GPS</span>
            </button>
            <button
              onClick={() => setActiveTab('waybills')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'waybills'
                  ? 'border-teal-700 text-teal-800 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Manifestes & Bordereaux BSC</span>
            </button>
            <button
              onClick={() => setActiveTab('incidents')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'incidents'
                  ? 'border-teal-700 text-teal-800 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Alertes & Incidents</span>
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
                  ? 'border-teal-700 text-teal-800 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Performance OTIF</span>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden py-3 border-t border-slate-200 space-y-1">
              {[
                { id: 'kanban', label: `Tour de Contrôle (${shipments.length})`, icon: Layers },
                { id: 'telematics', label: 'Traceur Télématique GPS', icon: Navigation },
                { id: 'waybills', label: 'Manifestes & BSC', icon: FileText },
                { id: 'incidents', label: `Alertes (${incidents.length})`, icon: AlertTriangle },
                { id: 'otif', label: 'Performance OTIF', icon: TrendingUp }
              ].map(item => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-left ${
                      activeTab === item.id ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ============================================================== */}
        {/* TAB 1: KANBAN CORRIDOR */}
        {/* ============================================================== */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            {/* Top Stat Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Flotte Active en Convoi</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{activeFleetCount} Camions</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Tonnage Total Mobilisé</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{totalTonnage.toFixed(1)} T</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Ponctualité OTIF</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">94.8%</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Vitesse Moyenne Flotte</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">62 km/h</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Gauge className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {(['PORT_CLEARANCE', 'IN_TRANSIT', 'CUSTOMS_BORDER', 'DELIVERED'] as ShipmentStatus[]).map(statusKey => {
                const columnShipments = shipments.filter(s => s.status === statusKey);

                return (
                  <div key={statusKey} className="rounded-xl bg-white border border-slate-200 flex flex-col min-h-[500px] shadow-sm">
                    {/* Header */}
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{statusLabels[statusKey]}</span>
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">
                        {columnShipments.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="p-3 flex-1 overflow-y-auto space-y-3">
                      {columnShipments.length === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-400 font-medium border border-dashed border-slate-200 rounded-lg">
                          Aucun convoi à cette étape
                        </div>
                      ) : (
                        columnShipments.map(shp => (
                          <div 
                            key={shp.id}
                            className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-teal-600 shadow-xs transition space-y-2.5"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="font-mono text-xs font-semibold text-teal-800 block">{shp.waybill_ref}</span>
                                <span className="text-base font-extrabold text-slate-900">{shp.truck_plate}</span>
                              </div>
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                                {shp.weight_tons} T
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-600 border-t border-b border-slate-200/60 py-1.5">
                              <span className="flex items-center gap-1 font-medium text-slate-800">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {shp.driver_name}
                              </span>
                              <span className="font-mono text-slate-500">{shp.driver_phone}</span>
                            </div>

                            <div className="text-xs space-y-0.5">
                              <div className="flex items-center gap-1 text-slate-800 font-medium truncate">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{shp.destination}</span>
                              </div>
                              <div className="text-slate-500 text-[11px] pl-4">
                                Pos : <span className="text-slate-700 font-semibold">{shp.current_location}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                                <span>Progression</span>
                                <span className="text-teal-700">{shp.progress_percent}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-teal-700 rounded-full" 
                                  style={{ width: `${shp.progress_percent}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                              <button
                                onClick={() => setSelectedShipment(shp)}
                                className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1"
                              >
                                Fiche BSC <ChevronRight className="w-3.5 h-3.5" />
                              </button>

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
                                    className="p-1 rounded bg-white hover:bg-slate-100 text-slate-500 border border-slate-200"
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
                                    className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1 transition"
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
        {/* TAB 2: TÉLÉMATIQUE GPS */}
        {/* ============================================================== */}
        {activeTab === 'telematics' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-teal-700" />
                    Tracé Télématique du Corridor RNIE 2
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Visualisation kilométrique des 1 040 km reliant le Port Autonome de Cotonou à Niamey (Niger)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-teal-700" />
                  Balises GPS Actives
                </span>
              </div>

              {/* Corridor Stepper Map */}
              <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Jalons et Postes de Contrôle
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                  {corridorCheckpoints.map((cp, idx) => {
                    const hasTruck = shipments.some(s => s.current_location.toLowerCase().includes(cp.name.toLowerCase()));
                    return (
                      <div key={cp.name} className="p-2 rounded-lg bg-white border border-slate-200 text-center space-y-1">
                        <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                          hasTruck ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="text-xs font-bold text-slate-900 block truncate">{cp.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 block">{cp.km} km</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Convois Live Feed */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">État Télématique des Convois</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shipments.map(shp => (
                    <div key={shp.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold text-slate-900">{shp.truck_plate}</span>
                            <span className="font-mono text-xs text-slate-500">({shp.waybill_ref})</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">Chauffeur : {shp.driver_name}</p>
                        </div>
                        <button
                          onClick={() => handleSimulateGpsPing(shp.id)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-teal-800 border border-slate-200 rounded-md text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Activity className="w-3.5 h-3.5 text-teal-700" />
                          <span>Simuler Ping GPS</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
                        <div className="p-2 rounded bg-white border border-slate-100">
                          <span className="text-[11px] text-slate-500 block">Vitesse</span>
                          <span className="text-sm font-bold text-slate-900">{shp.speed_kmh} km/h</span>
                        </div>
                        <div className="p-2 rounded bg-white border border-slate-100">
                          <span className="text-[11px] text-slate-500 block">Carburant</span>
                          <span className="text-sm font-bold text-slate-900">{shp.fuel_level_percent}%</span>
                        </div>
                        <div className="p-2 rounded bg-white border border-slate-100">
                          <span className="text-[11px] text-slate-500 block">Dernier Ping</span>
                          <span className="text-xs font-semibold text-slate-700 block mt-0.5">{shp.last_gps_ping}</span>
                        </div>
                      </div>

                      <div className="text-xs flex items-center justify-between text-slate-500 pt-1">
                        <span>Position : <strong className="text-slate-800">{shp.current_location}</strong></span>
                        <span className="text-slate-800 font-semibold">ETA : {shp.eta}</span>
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
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Registre des Manifestes & Waybills</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Bordereaux de Suivi de Cargaison (BSC) conformes au Port Autonome de Cotonou
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Émettre une Lettre de Voiture</span>
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Recherche waybill, plaque, chauffeur..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 font-medium"
                  />
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="ALL">Toutes les Étapes</option>
                    <option value="PORT_CLEARANCE">Port de Cotonou</option>
                    <option value="IN_TRANSIT">En Transit Corridor</option>
                    <option value="CUSTOMS_BORDER">Douane Frontière</option>
                    <option value="DELIVERED">Livré à Destination</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
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
                  <tbody className="divide-y divide-slate-100">
                    {filteredShipments.map(shp => (
                      <tr key={shp.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {shp.waybill_ref}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">{shp.truck_plate}</div>
                          <div className="text-xs text-slate-500">{shp.driver_name}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{shp.cargo_desc}</div>
                          <div className="text-xs text-slate-400">Vers : {shp.destination}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                          {shp.weight_tons} T
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-slate-700">
                          {shp.declared_value_xof.toLocaleString()} XOF
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                            {statusLabels[shp.status]}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedShipment(shp)}
                            className="px-3 py-1 bg-white hover:bg-slate-50 text-teal-800 font-semibold rounded-md text-xs border border-slate-200 transition"
                          >
                            Consulter BSC
                          </button>
                        </td>
                      </tr>
                    ))}
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
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Gestion des Incidents du Corridor
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Suivi des blocages douaniers, pannes mécaniques et perturbations météo
              </p>

              <div className="space-y-3 pt-2">
                {incidents.map(inc => (
                  <div key={inc.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {inc.type.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-900">Convoi : {inc.shipment_ref}</span>
                        <span className="text-xs text-slate-400">• {inc.created_at}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 mt-1">{inc.description}</p>
                      <p className="text-xs text-slate-500">Lieu : <strong>{inc.location}</strong></p>
                    </div>

                    <button
                      onClick={() => setIncidents(prev => prev.filter(i => i.id !== inc.id))}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-md border border-slate-200 transition"
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
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Score Global OTIF</h3>
              <p className="text-3xl font-black text-slate-900 mt-2">94.8%</p>
              <p className="text-xs text-slate-500 mt-1">On-Time In-Full sur 120 convois</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Temps Moyen Dédouanement</h3>
              <p className="text-3xl font-black text-slate-900 mt-2">4.2 h</p>
              <p className="text-xs text-slate-500 mt-1">Port Autonome de Cotonou</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Passage Frontière Malanville</h3>
              <p className="text-3xl font-black text-slate-900 mt-2">2.8 h</p>
              <p className="text-xs text-slate-500 mt-1">Guichet Unique UEMOA</p>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Official BSC Printable */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-6 max-h-[90vh] overflow-y-auto space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bordereau de Suivi de Cargaison (BSC)</h3>
                <p className="font-mono text-xs text-teal-800 font-bold">{selectedShipment.waybill_ref}</p>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">STATUT DE L'EXPÉDITION</span>
                <span className="text-base font-extrabold text-slate-900">
                  {statusLabels[selectedShipment.status]}
                </span>
              </div>
              <div className="w-12 h-12 bg-white rounded-md p-1 border border-slate-200 flex items-center justify-center shadow-xs">
                <QrCode className="w-full h-full text-slate-800" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block font-semibold">Tracteur</span>
                <span className="text-sm font-bold text-slate-900">{selectedShipment.truck_plate}</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block font-semibold">Chauffeur</span>
                <span className="text-sm font-bold text-slate-900">{selectedShipment.driver_name}</span>
                <span className="text-slate-400 block font-mono">{selectedShipment.driver_phone}</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block font-semibold">Origine</span>
                <span className="text-sm font-medium text-slate-800">{selectedShipment.origin}</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block font-semibold">Destination</span>
                <span className="text-sm font-bold text-teal-800">{selectedShipment.destination}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 text-xs">
              <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Spécifications Fret</h4>
              <p className="font-bold text-slate-900 text-sm">{selectedShipment.cargo_desc}</p>
              <div className="flex justify-between pt-1 border-t border-slate-100 text-slate-600">
                <span>Poids Brut : <strong className="text-slate-900">{selectedShipment.weight_tons} Tonnes</strong></span>
                <span>Valeur en Douane : <strong className="text-slate-900">{selectedShipment.declared_value_xof.toLocaleString()} XOF</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
              <button
                onClick={() => setSelectedShipment(null)}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg text-xs transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Waybill */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Émettre une Lettre de Voiture</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Immatriculation Tracteur
                </label>
                <input
                  type="text"
                  value={newTruckPlate}
                  onChange={(e) => setNewTruckPlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Chauffeur
                  </label>
                  <input
                    type="text"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Destination Finale Corridor
                </label>
                <select
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <option value="Niamey Terminal (Niger)">Niamey Terminal (Niger)</option>
                  <option value="Ouagadougou ZAD (Burkina Faso)">Ouagadougou ZAD (Burkina Faso)</option>
                  <option value="Malanville Entrepôt Central">Malanville Entrepôt Central (Bénin)</option>
                  <option value="Parakou Dépôt Hydrocarbures">Parakou Dépôt Hydrocarbures</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description Marchandise
                </label>
                <input
                  type="text"
                  value={newCargoDesc}
                  onChange={(e) => setNewCargoDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Poids (Tonnes)
                  </label>
                  <input
                    type="number"
                    value={newWeightTons}
                    onChange={(e) => setNewWeightTons(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Valeur Déclarée (XOF)
                  </label>
                  <input
                    type="number"
                    value={newValueXof}
                    onChange={(e) => setNewValueXof(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateShipment}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg text-xs transition"
              >
                Créer Expédition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
