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
  Menu,
  Calculator,
  ShieldCheck,
  Fuel,
  DollarSign,
  GripVertical,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Database,
  Scale
} from 'lucide-react';
import DispatchBoardView from './components/DispatchBoardView';
import DataBackupHubModal from './components/DataBackupHubModal';

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

export interface VehicleCompliance {
  id: string;
  truck_plate: string;
  driver_name: string;
  cedeao_card_status: 'VALID' | 'WARNING' | 'EXPIRED';
  cedeao_card_expiry: string;
  anatt_inspection_status: 'VALID' | 'WARNING' | 'EXPIRED';
  anatt_inspection_expiry: string;
  medical_check_status: 'VALID' | 'EXPIRED';
  adr_safety_kit: boolean;
  tachograph_calibrated: boolean;
}

const INITIAL_SHIPMENTS: Shipment[] = [
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
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'kanban' | 'telematics' | 'calculator' | 'compliance' | 'waybills' | 'incidents' | 'otif'>('dispatch');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDataHub, setShowDataHub] = useState(false);

  // Drag and Drop States for Kanban
  const [draggedShipmentId, setDraggedShipmentId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<ShipmentStatus | null>(null);

  // Shipments Data (Dynamic state, Excel & JSON bidirectional sync)
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);

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

  // Compliance Registry Data
  const [compliances, setCompliances] = useState<VehicleCompliance[]>([
    {
      id: 'comp_1',
      truck_plate: 'RB 4512 AK',
      driver_name: 'Bio Bio Sékou',
      cedeao_card_status: 'VALID',
      cedeao_card_expiry: '2026-12-31',
      anatt_inspection_status: 'VALID',
      anatt_inspection_expiry: '2026-11-15',
      medical_check_status: 'VALID',
      adr_safety_kit: true,
      tachograph_calibrated: true
    },
    {
      id: 'comp_2',
      truck_plate: 'RB 8920 BF',
      driver_name: 'Koffi Tossou',
      cedeao_card_status: 'WARNING',
      cedeao_card_expiry: '2026-10-05',
      anatt_inspection_status: 'VALID',
      anatt_inspection_expiry: '2026-12-01',
      medical_check_status: 'VALID',
      adr_safety_kit: true,
      tachograph_calibrated: false
    },
    {
      id: 'comp_3',
      truck_plate: 'RB 1209 CC',
      driver_name: 'Moussa Harouna',
      cedeao_card_status: 'VALID',
      cedeao_card_expiry: '2027-02-28',
      anatt_inspection_status: 'VALID',
      anatt_inspection_expiry: '2027-01-10',
      medical_check_status: 'VALID',
      adr_safety_kit: true,
      tachograph_calibrated: true
    },
    {
      id: 'comp_4',
      truck_plate: 'RN 6741 NI',
      driver_name: 'Abdoul-Karim Zada',
      cedeao_card_status: 'VALID',
      cedeao_card_expiry: '2026-11-20',
      anatt_inspection_status: 'WARNING',
      anatt_inspection_expiry: '2026-10-02',
      medical_check_status: 'VALID',
      adr_safety_kit: true,
      tachograph_calibrated: true
    }
  ]);

  // Calculator State
  const [calcCorridor, setCalcCorridor] = useState<'niamey' | 'ouaga' | 'malanville' | 'parakou'>('niamey');
  const [calcAxles, setCalcAxles] = useState<number>(5);
  const [calcTonnage, setCalcTonnage] = useState<number>(30);
  const [calcEscort, setCalcEscort] = useState<boolean>(true);
  const [calcDieselPrice, setCalcDieselPrice] = useState<number>(680);
  const [calcConsumptionRate, setCalcConsumptionRate] = useState<number>(35); // L/100km

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
              stage: newStatus === 'IN_TRANSIT' ? 'Transit Corridor' : (newStatus === 'CUSTOMS_BORDER' ? 'Poste Frontière' : (newStatus === 'DELIVERED' ? 'Destination' : 'Port de Cotonou')),
              note: `Changement d'étape vers ${statusLabels[newStatus]}`
            }
          ]
        };
      }
      return shp;
    }));
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedShipmentId(id);
  };

  const handleDragOver = (e: React.DragEvent, stage: ShipmentStatus) => {
    e.preventDefault();
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stage: ShipmentStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedShipmentId;
    if (id) {
      handleUpdateStatus(id, stage);
    }
    setDraggedShipmentId(null);
    setDragOverStage(null);
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

  // Status Labels
  const statusLabels: Record<ShipmentStatus, string> = {
    PORT_CLEARANCE: 'Port de Cotonou',
    IN_TRANSIT: 'En Transit Corridor',
    CUSTOMS_BORDER: 'Douane Frontière',
    DELIVERED: 'Livré à Destination',
  };

  // Corridor route specifications for calculator
  const corridorSpecs = {
    niamey: { name: 'Cotonou ➔ Malanville ➔ Niamey (RNIE 2)', distanceKm: 1040, tollGates: 6, tollFeePerGate: 7500 },
    ouaga: { name: 'Cotonou ➔ Djougou ➔ Ouagadougou (RNIE 3)', distanceKm: 1020, tollGates: 5, tollFeePerGate: 7500 },
    malanville: { name: 'Cotonou ➔ Malanville Terminus (Bénin Nord)', distanceKm: 735, tollGates: 4, tollFeePerGate: 7500 },
    parakou: { name: 'Cotonou ➔ Dépôt Parakou (Centre-Nord)', distanceKm: 415, tollGates: 2, tollFeePerGate: 7500 }
  };

  const activeCorridorSpec = corridorSpecs[calcCorridor];
  const calculatedFuelLiters = Math.round((activeCorridorSpec.distanceKm / 100) * calcConsumptionRate);
  const calculatedFuelCostXof = calculatedFuelLiters * calcDieselPrice;
  const calculatedTollTotalXof = activeCorridorSpec.tollGates * activeCorridorSpec.tollFeePerGate * (calcAxles >= 5 ? 1.5 : 1);
  const calculatedEscortFeeXof = calcEscort ? 120000 : 0;
  const calculatedWeighBridgeFeeXof = 35000;
  const calculatedTotalBudgetXof = calculatedFuelCostXof + calculatedTollTotalXof + calculatedEscortFeeXof + calculatedWeighBridgeFeeXof;
  const calculatedCostPerKm = Math.round(calculatedTotalBudgetXof / activeCorridorSpec.distanceKm);

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

            {/* Quick Actions & Metric */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-700 animate-pulse"></div>
                <span className="font-semibold text-slate-700">Port Autonome : Quai Opérationnel</span>
              </div>

              {/* Data Management Hub (Excel / JSON / Reset) */}
              <button
                onClick={() => setShowDataHub(true)}
                className="hidden sm:flex px-3.5 py-2.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 font-bold text-xs sm:text-sm items-center gap-2 transition shadow-xs"
                title="Gérer la flotte : Excel (.xlsx), JSON ou Réinitialisation"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-700" />
                <span>Base Données (Excel/JSON)</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouveau Convoi</span>
                <span className="sm:hidden">Créer</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="hidden sm:flex items-center gap-1 overflow-x-auto border-t border-slate-200/80 -mb-px">
            <button
              onClick={() => setActiveTab('dispatch')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'dispatch'
                  ? 'border-teal-700 text-teal-800 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-4 h-4 text-teal-700" />
              <span>Dispatch Flotte & Fret (Drag & Drop)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-teal-100 text-teal-800 animate-pulse">NOUVEAU</span>
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'kanban'
                  ? 'border-teal-700 text-teal-800 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Tour de Contrôle ({shipments.length})</span>
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
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'border-teal-700 text-teal-800 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Calculateur Frais & Péages</span>
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'compliance'
                  ? 'border-teal-700 text-teal-800 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Conformité Chauffeurs & Flotte</span>
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
              <span>Manifestes & BSC</span>
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
                { id: 'dispatch', label: 'Dispatch Flotte & Fret (Drag & Drop)', icon: Truck },
                { id: 'kanban', label: `Tour de Contrôle (${shipments.length})`, icon: Layers },
                { id: 'telematics', label: 'Traceur Télématique GPS', icon: Navigation },
                { id: 'calculator', label: 'Calculateur Frais & Péages', icon: Calculator },
                { id: 'compliance', label: 'Conformité Chauffeurs & Flotte', icon: ShieldCheck },
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
        {/* TAB 0: DISPATCH BOARD WITH DRAG AND DROP & e-POD */}
        {/* ============================================================== */}
        {activeTab === 'dispatch' && <DispatchBoardView />}

        {/* ============================================================== */}
        {/* TAB 1: KANBAN CORRIDOR WITH DRAG AND DROP */}
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

            {/* Drag & Drop Explanation Notice */}
            <div className="p-3.5 rounded-lg bg-teal-50/60 border border-teal-200 flex items-center justify-between text-xs text-teal-900">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  <strong>Glisser-Déposer Opérationnel :</strong> Déplacez directement les fiches de cargaison d'une colonne à l'autre pour actualiser l'avancement kilométrique et l'audit de transit.
                </span>
              </div>
              <span className="hidden md:inline font-mono font-bold text-teal-800">HTML5 Drag & Drop Natif</span>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {(['PORT_CLEARANCE', 'IN_TRANSIT', 'CUSTOMS_BORDER', 'DELIVERED'] as ShipmentStatus[]).map(statusKey => {
                const columnShipments = shipments.filter(s => s.status === statusKey);
                const isOver = dragOverStage === statusKey;

                return (
                  <div 
                    key={statusKey} 
                    onDragOver={(e) => handleDragOver(e, statusKey)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, statusKey)}
                    className={`rounded-xl bg-white border transition-all duration-200 flex flex-col min-h-[520px] shadow-sm ${
                      isOver 
                        ? 'border-2 border-dashed border-teal-700 bg-teal-50/30 ring-2 ring-teal-500/20' 
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{statusLabels[statusKey]}</span>
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">
                        {columnShipments.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div className="p-3 flex-1 overflow-y-auto space-y-3">
                      {columnShipments.length === 0 ? (
                        <div className={`py-14 text-center text-xs font-medium rounded-lg border border-dashed transition ${
                          isOver ? 'border-teal-400 bg-teal-50/60 text-teal-800' : 'border-slate-200 text-slate-400'
                        }`}>
                          {isOver ? 'Déposer ici pour actualiser' : 'Aucun convoi à cette étape'}
                        </div>
                      ) : (
                        columnShipments.map(shp => {
                          const isBeingDragged = draggedShipmentId === shp.id;
                          return (
                            <div 
                              key={shp.id}
                              draggable={true}
                              onDragStart={(e) => handleDragStart(e, shp.id)}
                              onDragEnd={() => {
                                setDraggedShipmentId(null);
                                setDragOverStage(null);
                              }}
                              className={`p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-teal-600 shadow-xs transition space-y-2.5 cursor-grab active:cursor-grabbing ${
                                isBeingDragged ? 'opacity-40 scale-95 border-teal-500' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-1.5">
                                  <GripVertical className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                  <div>
                                    <span className="font-mono text-xs font-semibold text-teal-800 block">{shp.waybill_ref}</span>
                                    <span className="text-base font-extrabold text-slate-900">{shp.truck_plate}</span>
                                  </div>
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
                                    className="h-full bg-teal-700 rounded-full transition-all duration-300" 
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
                                      className="p-1 rounded bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 transition"
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
                          );
                        })
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
        {/* TAB 3: CALCULATEUR DE FRAIS DE ROUTE & CARBURANT (NEW) */}
        {/* ============================================================== */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-teal-700" />
                    Calculateur Budgétaire de Route & Carburant Corridor
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Estimation prévisionnelle des postes de dépenses : Gazole, Postes de Péage RNIE, Pesage ANATT et Escortes Douanières
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer Devis de Route</span>
                </button>
              </div>

              {/* Input Form & Real-time Cost Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Controls */}
                <div className="lg:col-span-6 space-y-4 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Paramètres du Convoi & Trajet</h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Axe Routier / Corridor</label>
                    <select
                      value={calcCorridor}
                      onChange={(e) => setCalcCorridor(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-700"
                    >
                      <option value="niamey">Cotonou ➔ Malanville ➔ Niamey (RNIE 2, 1 040 km)</option>
                      <option value="ouaga">Cotonou ➔ Djougou ➔ Ouagadougou (RNIE 3, 1 020 km)</option>
                      <option value="malanville">Cotonou ➔ Malanville Terminus (Bénin Nord, 735 km)</option>
                      <option value="parakou">Cotonou ➔ Dépôt Parakou (Centre-Nord, 415 km)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Configuration Essieux</label>
                      <select
                        value={calcAxles}
                        onChange={(e) => setCalcAxles(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-700"
                      >
                        <option value={3}>Porteur 3 Essieux (≤ 26 Tonnes)</option>
                        <option value={4}>Ensemble 4 Essieux (≤ 38 Tonnes)</option>
                        <option value={5}>Semi-remorque 5 Essieux (≤ 44 Tonnes)</option>
                        <option value={6}>Semi-remorque 6+ Essieux (Cargaison Lourde)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Poids Brut Marchandise (T)</label>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={calcTonnage}
                        onChange={(e) => setCalcTonnage(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Conso Moyenne (L / 100km)</label>
                      <input
                        type="number"
                        min="25"
                        max="55"
                        value={calcConsumptionRate}
                        onChange={(e) => setCalcConsumptionRate(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Prix Gazole (XOF / Litre)</label>
                      <input
                        type="number"
                        min="500"
                        max="1000"
                        value={calcDieselPrice}
                        onChange={(e) => setCalcDieselPrice(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcEscort}
                        onChange={(e) => setCalcEscort(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700 border-slate-300"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        Inclure l'Escorte Douanière et Suivi GPS Scellé (+120 000 XOF)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Real-time Financial Breakdown */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-5 rounded-lg bg-teal-50/50 border border-teal-200 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                      Synthèse Prévisionnelle d'Exploitation
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Distance Totale</span>
                        <span className="text-lg font-black text-slate-900">{activeCorridorSpec.distanceKm} km</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Carburant Requis</span>
                        <span className="text-lg font-black text-teal-800">{calculatedFuelLiters} Litres</span>
                      </div>
                    </div>

                    {/* Breakdown items */}
                    <div className="divide-y divide-teal-100 text-xs text-slate-700 pt-1">
                      <div className="py-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Fuel className="w-3.5 h-3.5 text-teal-700" />
                          Coût Gazole Tracteur
                        </span>
                        <span className="font-extrabold text-slate-900">{calculatedFuelCostXof.toLocaleString()} XOF</span>
                      </div>

                      <div className="py-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-teal-700" />
                          Péages RNIE ({activeCorridorSpec.tollGates} Postes)
                        </span>
                        <span className="font-extrabold text-slate-900">{calculatedTollTotalXof.toLocaleString()} XOF</span>
                      </div>

                      <div className="py-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 text-teal-700" />
                          Pesage & Gabarit ANATT
                        </span>
                        <span className="font-extrabold text-slate-900">{calculatedWeighBridgeFeeXof.toLocaleString()} XOF</span>
                      </div>

                      {calcEscort && (
                        <div className="py-2 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                            Escorte Douanière Bénin-Sahel
                          </span>
                          <span className="font-extrabold text-slate-900">{calculatedEscortFeeXof.toLocaleString()} XOF</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-teal-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-500 block">BUDGET TOTAL ESTIMÉ</span>
                        <span className="text-2xl font-black text-teal-900">{calculatedTotalBudgetXof.toLocaleString()} XOF</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Coût kilométrique</span>
                        <span className="text-sm font-bold text-slate-800">{calculatedCostPerKm} XOF / km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CONFORMITÉ CHAUFFEURS & VÉHICULES (NEW) */}
        {/* ============================================================== */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-700" />
                    Registre de Conformité Réglementaire & Sécurité Transfrontalière
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Suivi des Assurances Carte Brune CEDEAO, Visites Techniques ANATT, Visites Médicales et Homologations ADR
                  </p>
                </div>
                <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-md text-xs font-bold">
                  {compliances.filter(c => c.cedeao_card_status === 'VALID' && c.anatt_inspection_status === 'VALID').length} / {compliances.length} Véhicules 100% Homologués
                </span>
              </div>

              {/* Table of Fleet Compliance */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Tracteur / Plaque</th>
                      <th className="py-3 px-4">Chauffeur Titulaire</th>
                      <th className="py-3 px-4">Carte Brune CEDEAO</th>
                      <th className="py-3 px-4">Contrôle ANATT</th>
                      <th className="py-3 px-4 text-center">Visite Médicale</th>
                      <th className="py-3 px-4 text-center">Kit Sécurité ADR</th>
                      <th className="py-3 px-4 text-center">Tachygraphe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {compliances.map(comp => (
                      <tr key={comp.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 whitespace-nowrap">
                          {comp.truck_plate}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {comp.driver_name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-xs font-semibold inline-flex items-center gap-1 ${
                            comp.cedeao_card_status === 'VALID' 
                              ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {comp.cedeao_card_status === 'VALID' ? <CheckCircle2 className="w-3 h-3 text-teal-700" /> : <AlertCircle className="w-3 h-3 text-amber-700" />}
                            Exp : {comp.cedeao_card_expiry}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-xs font-semibold inline-flex items-center gap-1 ${
                            comp.anatt_inspection_status === 'VALID' 
                              ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {comp.anatt_inspection_status === 'VALID' ? <CheckCircle2 className="w-3 h-3 text-teal-700" /> : <AlertTriangle className="w-3 h-3 text-rose-700" />}
                            Exp : {comp.anatt_inspection_expiry}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                            {comp.medical_check_status === 'VALID' ? 'Apte' : 'À Renouveler'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            comp.adr_safety_kit ? 'bg-teal-100 text-teal-900' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {comp.adr_safety_kit ? 'Conforme' : 'Incomplet'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            comp.tachograph_calibrated ? 'bg-teal-100 text-teal-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {comp.tachograph_calibrated ? 'Étalonné' : 'À Calibrer'}
                          </span>
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
        {/* TAB 5: MANIFESTES & WAYBILLS */}
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
        {/* TAB 6: ALERTES & INCIDENTS */}
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
        {/* TAB 7: OTIF & PERFORMANCE */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">Émettre une Lettre de Voiture</h3>
                  <p className="text-xs text-slate-500">Manifeste de fret officiel corridor UEMOA</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Immatriculation Tracteur</span>
                </label>
                <input
                  type="text"
                  value={newTruckPlate}
                  onChange={(e) => setNewTruckPlate(e.target.value)}
                  placeholder="Ex: RB 4512 AK"
                  className="input-shadcn font-bold font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Nom du Chauffeur</span>
                  </label>
                  <input
                    type="text"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    placeholder="Nom & Prénom"
                    className="input-shadcn"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-slate-500" />
                    <span>Téléphone / GSM</span>
                  </label>
                  <input
                    type="text"
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                    placeholder="+229 97 00 00 00"
                    className="input-shadcn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Destination Finale Corridor</span>
                </label>
                <select
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="select-shadcn"
                >
                  <option value="Niamey Terminal (Niger)">Niamey Terminal (Niger)</option>
                  <option value="Ouagadougou ZAD (Burkina Faso)">Ouagadougou ZAD (Burkina Faso)</option>
                  <option value="Malanville Entrepôt Central">Malanville Entrepôt Central (Bénin)</option>
                  <option value="Parakou Dépôt Hydrocarbures">Parakou Dépôt Hydrocarbures</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Description de la Marchandise</span>
                </label>
                <input
                  type="text"
                  value={newCargoDesc}
                  onChange={(e) => setNewCargoDesc(e.target.value)}
                  placeholder="Ex: 2x Conteneurs 40ft Équipements Télécoms"
                  className="input-shadcn"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-slate-500" />
                    <span>Poids Fret (Tonnes)</span>
                  </label>
                  <input
                    type="number"
                    value={newWeightTons}
                    onChange={(e) => setNewWeightTons(Number(e.target.value))}
                    className="input-shadcn font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Valeur Déclarée (XOF)</span>
                  </label>
                  <input
                    type="number"
                    value={newValueXof}
                    onChange={(e) => setNewValueXof(Number(e.target.value))}
                    className="input-shadcn font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateShipment}
                className="btn-teal-gradient text-xs px-5 py-2.5"
              >
                Émettre le Bordereau Officiel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Data Backup Hub (Excel / JSON / Factory Reset) */}
      {showDataHub && (
        <DataBackupHubModal
          shipments={shipments}
          initialShipments={INITIAL_SHIPMENTS}
          onUpdateShipments={setShipments}
          onClose={() => setShowDataHub(false)}
        />
      )}
    </div>
  );
}
