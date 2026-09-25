import { useState, useRef, useEffect } from 'react';
import { 
  Truck, 
  GripVertical, 
  Package, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Fuel, 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Send, 
  RotateCcw, 
  DollarSign, 
  User,
  Check,
  FileCheck,
  X
} from 'lucide-react';

export interface UnassignedCargo {
  id: string;
  code: string;
  description: string;
  weightTons: number;
  origin: string;
  destination: string;
  distanceKm: number;
  cargoType: 'CIMENT' | 'CONTENEUR' | 'ENGRAIS' | 'AGRO' | 'HYDROCARBURES';
  declaredValueXof: number;
  priority: 'URGENT' | 'STANDARD';
  deadline: string;
}

export interface DispatchTruck {
  id: string;
  plate: string;
  model: string;
  driverName: string;
  driverPhone: string;
  maxPayloadTons: number;
  currentPayloadTons: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_TRANSIT';
  assignedCargos: UnassignedCargo[];
  fuelLevelPercent: number;
  telemetrySpeed: number;
  corridorLocation: string;
  ecoScore: number;
}

export default function DispatchBoardView() {
  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Unassigned freights
  const [unassignedList, setUnassignedList] = useState<UnassignedCargo[]>([
    {
      id: 'cargo-1',
      code: 'FRT-9921',
      description: '28T Ciment Dangote en Sacs',
      weightTons: 28,
      origin: 'Usine Cotonou (PK12)',
      destination: 'Entrepôt Niamey, Niger',
      distanceKm: 1045,
      cargoType: 'CIMENT',
      declaredValueXof: 8500000,
      priority: 'URGENT',
      deadline: '24h max'
    },
    {
      id: 'cargo-2',
      code: 'FRT-8840',
      description: 'Conteneur 40\' High Cube Électronique',
      weightTons: 22,
      origin: 'Port Autonome de Cotonou',
      destination: 'Parakou Zone Industrielle',
      distanceKm: 420,
      cargoType: 'CONTENEUR',
      declaredValueXof: 24000000,
      priority: 'STANDARD',
      deadline: '48h'
    },
    {
      id: 'cargo-3',
      code: 'FRT-7733',
      description: '32T Engrais Vivriers NPK 15-15-15',
      weightTons: 32,
      origin: 'Bohicon Hub Sud',
      destination: 'Malanville Frontière Niger',
      distanceKm: 610,
      cargoType: 'ENGRAIS',
      declaredValueXof: 14500000,
      priority: 'URGENT',
      deadline: '12h'
    },
    {
      id: 'cargo-4',
      code: 'FRT-6612',
      description: '18T Soja & Karité Bio Exportation',
      weightTons: 18,
      origin: 'Djougou Coopérative',
      destination: 'Port Autonome de Cotonou',
      distanceKm: 460,
      cargoType: 'AGRO',
      declaredValueXof: 9800000,
      priority: 'STANDARD',
      deadline: '72h'
    },
    {
      id: 'cargo-5',
      code: 'FRT-5509',
      description: '20T Matériel Télécom & Câbles Fibre',
      weightTons: 20,
      origin: 'Cotonou Aéroport',
      destination: 'Natitingou Dépôt Réseau',
      distanceKm: 540,
      cargoType: 'CONTENEUR',
      declaredValueXof: 35000000,
      priority: 'URGENT',
      deadline: '24h'
    }
  ]);

  // Fleet Trucks available for dispatch
  const [trucks, setTrucks] = useState<DispatchTruck[]>([
    {
      id: 'truck-1',
      plate: 'RB-4421-BD',
      model: 'Volvo FH16 540 Globetrotter',
      driverName: 'Issifou Bio',
      driverPhone: '+229 97 45 88 12',
      maxPayloadTons: 45,
      currentPayloadTons: 0,
      status: 'AVAILABLE',
      assignedCargos: [],
      fuelLevelPercent: 92,
      telemetrySpeed: 0,
      corridorLocation: 'Port de Cotonou (En attente chargement)',
      ecoScore: 94
    },
    {
      id: 'truck-2',
      plate: 'RB-8802-AC',
      model: 'Mercedes-Benz Actros 3340 Heavy',
      driverName: 'Rodrigue Dossou',
      driverPhone: '+229 95 12 33 44',
      maxPayloadTons: 40,
      currentPayloadTons: 0,
      status: 'AVAILABLE',
      assignedCargos: [],
      fuelLevelPercent: 88,
      telemetrySpeed: 0,
      corridorLocation: 'Bohicon Hub Central',
      ecoScore: 91
    },
    {
      id: 'truck-3',
      plate: 'RB-1290-AA',
      model: 'Scania R500 V8 Streamline',
      driverName: 'Yacouba Traoré',
      driverPhone: '+229 96 77 99 00',
      maxPayloadTons: 35,
      currentPayloadTons: 0,
      status: 'AVAILABLE',
      assignedCargos: [],
      fuelLevelPercent: 95,
      telemetrySpeed: 0,
      corridorLocation: 'Parakou Étape Transit',
      ecoScore: 96
    },
    {
      id: 'truck-4',
      plate: 'RB-9931-AF',
      model: 'MAN TGX 440 EfficientLine',
      driverName: 'Marcel Zinsou',
      driverPhone: '+229 94 66 55 44',
      maxPayloadTons: 42,
      currentPayloadTons: 0,
      status: 'AVAILABLE',
      assignedCargos: [],
      fuelLevelPercent: 85,
      telemetrySpeed: 0,
      corridorLocation: 'Cotonou Zone Franche',
      ecoScore: 89
    }
  ]);

  // Drag and Drop state
  const [draggedCargoId, setDraggedCargoId] = useState<string | null>(null);
  const [dragOverTruckId, setDragOverTruckId] = useState<string | null>(null);

  // Live Telemetry Simulation
  const [isSimulatingTrip, setIsSimulatingTrip] = useState<boolean>(false);
  const [simulatedTruckId, setSimulatedTruckId] = useState<string | null>(null);

  // Digital Signature Pad (e-POD)
  const [showPodModal, setShowPodModal] = useState<boolean>(false);
  const [podTargetCargo, setPodTargetCargo] = useState<UnassignedCargo | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState<boolean>(false);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, cargoId: string) => {
    e.dataTransfer.setData('text/plain', cargoId);
    setDraggedCargoId(cargoId);
  };

  const handleDragOver = (e: React.DragEvent, truckId: string) => {
    e.preventDefault();
    if (dragOverTruckId !== truckId) {
      setDragOverTruckId(truckId);
    }
  };

  const handleDropOnTruck = (e: React.DragEvent, truckId: string) => {
    e.preventDefault();
    const cargoId = e.dataTransfer.getData('text/plain') || draggedCargoId;
    if (!cargoId) {
      setDraggedCargoId(null);
      setDragOverTruckId(null);
      return;
    }

    const cargo = unassignedList.find(c => c.id === cargoId);
    const truck = trucks.find(t => t.id === truckId);

    if (cargo && truck) {
      // Check weight overload
      const newPayload = truck.currentPayloadTons + cargo.weightTons;
      if (newPayload > truck.maxPayloadTons) {
        showNotification(`ALERTE SURCHARGE : ${cargo.weightTons}T dépasse la capacité restante du camion (${truck.maxPayloadTons - truck.currentPayloadTons}T disponibles). Règle UEMOA 14 violée !`);
        setDraggedCargoId(null);
        setDragOverTruckId(null);
        return;
      }

      // Assign cargo to truck
      setTrucks(prev => prev.map(t => {
        if (t.id === truckId) {
          return {
            ...t,
            currentPayloadTons: newPayload,
            status: 'ASSIGNED',
            assignedCargos: [...t.assignedCargos, cargo]
          };
        }
        return t;
      }));

      // Remove from unassigned list
      setUnassignedList(prev => prev.filter(c => c.id !== cargoId));
      showNotification(`Mission affectée par glisser-déposer : ${cargo.description} assigné au camion ${truck.plate} (${truck.driverName}) !`);
    }

    setDraggedCargoId(null);
    setDragOverTruckId(null);
  };

  // De-assign cargo
  const handleUnassignCargo = (truckId: string, cargoId: string) => {
    const truck = trucks.find(t => t.id === truckId);
    if (!truck) return;
    const cargo = truck.assignedCargos.find(c => c.id === cargoId);
    if (!cargo) return;

    setTrucks(prev => prev.map(t => {
      if (t.id === truckId) {
        const remaining = t.assignedCargos.filter(c => c.id !== cargoId);
        const newPayload = t.currentPayloadTons - cargo.weightTons;
        return {
          ...t,
          assignedCargos: remaining,
          currentPayloadTons: newPayload,
          status: remaining.length === 0 ? 'AVAILABLE' : 'ASSIGNED'
        };
      }
      return t;
    }));

    setUnassignedList(prev => [...prev, cargo]);
    showNotification(`Ordre ${cargo.code} retiré et réintégré dans la file d'attente.`);
  };

  // Start Live GPS Telemetry Simulation
  const handleToggleSimulation = (truckId: string) => {
    if (isSimulatingTrip && simulatedTruckId === truckId) {
      setIsSimulatingTrip(false);
      setSimulatedTruckId(null);
      showNotification('Simulation télématique arrêtée.');
      return;
    }

    setIsSimulatingTrip(true);
    setSimulatedTruckId(truckId);
    showNotification(`Simulation GPS en direct activée pour le camion ${truckId}. Vitesse et géolocalisation animées !`);
  };

  // Telemetry loop effect
  useEffect(() => {
    if (!isSimulatingTrip || !simulatedTruckId) return;

    const interval = setInterval(() => {
      setTrucks(prev => prev.map(t => {
        if (t.id === simulatedTruckId) {
          const speedVariation = 65 + Math.floor(Math.random() * 15);
          const fuelDrop = Math.max(10, t.fuelLevelPercent - 0.2);
          return {
            ...t,
            status: 'IN_TRANSIT',
            telemetrySpeed: speedVariation,
            fuelLevelPercent: Number(fuelDrop.toFixed(1)),
            corridorLocation: `En transit corridor RNIE2 (Vitesse : ${speedVariation} km/h - GPS Actif)`
          };
        }
        return t;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulatingTrip, simulatedTruckId]);

  // Digital Signature Canvas Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0F766E'; // teal-700
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleOpenPod = (cargo: UnassignedCargo) => {
    setPodTargetCargo(cargo);
    setShowPodModal(true);
    setHasSignature(false);
  };

  const handleConfirmDelivery = () => {
    if (!hasSignature) {
      alert('Veuillez apposer la signature du réceptionnaire avant de valider le bordereau e-POD.');
      return;
    }
    setShowPodModal(false);
    showNotification(`Preuve Électronique de Livraison (e-POD) validée et horodatée avec signature numérique pour ${podTargetCargo?.code} !`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-teal-500/40 animate-slideUp">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-400/30">
              <Truck className="w-3.5 h-3.5" />
              Tour de Contrôle & Dispatch Intelligent
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tableau d'Affectation Flotte & Fret par Glisser-Déposer
            </h2>
            <p className="mt-2 text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
              Glissez-déposez les ordres de fret en attente directement sur les camions disponibles. 
              Le système valide automatiquement le tonnage utile (Norme UEMOA), calcule la consommation de carburant et prépare le bordereau numérique <strong>e-POD</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-center">
              <span className="text-xs text-teal-200 block font-medium">Capacité Flotte Active</span>
              <span className="text-2xl font-black text-teal-300">
                {trucks.reduce((acc, t) => acc + (t.maxPayloadTons - t.currentPayloadTons), 0)} T
              </span>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-center">
              <span className="text-xs text-teal-200 block font-medium">Frets en Attente</span>
              <span className="text-2xl font-black text-amber-300">{unassignedList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Unassigned Cargo (Left) vs Active Trucks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (5 cols): UNASSIGNED FREIGHT ORDERS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-700" />
                Ordres de Fret en Attente ({unassignedList.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Glissez un lot vers un camion à droite pour l'affecter
              </p>
            </div>
          </div>

          {/* Instructions box */}
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>
              <strong>Glisser-Déposer Flotte :</strong> Attrapez une carte de fret et déposez-la sur le camion de votre choix. La jauge de charge se met à jour en temps réel.
            </span>
          </div>

          {/* Cargo Draggable List */}
          <div className="space-y-3">
            {unassignedList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white border border-dashed border-slate-300 text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">Tous les ordres sont affectés !</p>
                <p className="text-xs text-slate-500 mt-1">La flotte est en route sur les corridors.</p>
              </div>
            ) : (
              unassignedList.map((cargo) => {
                const isBeingDragged = draggedCargoId === cargo.id;

                return (
                  <div
                    key={cargo.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, cargo.id)}
                    onDragEnd={() => setDraggedCargoId(null)}
                    className={`p-4 rounded-xl border bg-white shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing select-none group ${
                      isBeingDragged 
                        ? 'opacity-40 scale-95 border-teal-500 bg-teal-50/40' 
                        : 'border-slate-200 hover:border-teal-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1 rounded text-slate-400 group-hover:text-teal-600 transition mt-0.5">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border">
                              {cargo.code}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              cargo.priority === 'URGENT' 
                                ? 'bg-rose-100 text-rose-800' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {cargo.priority}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{cargo.description}</h4>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                          <Scale className="w-3.5 h-3.5" />
                          {cargo.weightTons} Tonnes
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{cargo.origin}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate font-semibold text-slate-700">{cargo.destination}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{cargo.distanceKm} km</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (7 cols): FLEET TRUCKS & DROP TARGETS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-700" />
                Flotte Active & Postes de Chargement
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Déposez un fret dans le réceptacle d'un camion pour valider l'embarquement
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {trucks.filter(t => t.status !== 'IN_TRANSIT').length} Véhicules Prêts
            </span>
          </div>

          {/* Truck Cards (Drop Targets) */}
          <div className="space-y-4">
            {trucks.map((truck) => {
              const isOver = dragOverTruckId === truck.id;
              const payloadPercent = Math.round((truck.currentPayloadTons / truck.maxPayloadTons) * 100);
              const isFull = payloadPercent >= 100;
              const isSimulatingThis = isSimulatingTrip && simulatedTruckId === truck.id;

              return (
                <div
                  key={truck.id}
                  onDragOver={(e) => handleDragOver(e, truck.id)}
                  onDrop={(e) => handleDropOnTruck(e, truck.id)}
                  onDragLeave={() => setDragOverTruckId(null)}
                  className={`p-5 rounded-2xl border bg-white shadow-sm transition-all duration-200 ${
                    isOver 
                      ? 'ring-2 ring-teal-600 border-teal-600 bg-teal-50/50 scale-[1.01]' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar: Plate, Driver, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        truck.status === 'IN_TRANSIT' 
                          ? 'bg-blue-100 text-blue-700 animate-pulse' 
                          : truck.status === 'ASSIGNED' 
                            ? 'bg-teal-100 text-teal-700' 
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{truck.plate}</h4>
                          <span className="text-xs text-slate-500 font-medium">({truck.model})</span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Chauffeur : <strong>{truck.driverName}</strong></span>
                          <span>•</span>
                          <span className="font-mono text-slate-600">{truck.driverPhone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        truck.status === 'IN_TRANSIT' 
                          ? 'bg-blue-100 text-blue-800' 
                          : truck.status === 'ASSIGNED' 
                            ? 'bg-teal-100 text-teal-800' 
                            : 'bg-slate-100 text-slate-700'
                      }`}>
                        {truck.status === 'IN_TRANSIT' ? 'En Route' : truck.status === 'ASSIGNED' ? 'Chargé' : 'Disponible'}
                      </span>

                      {/* Live GPS Telemetry button */}
                      {truck.assignedCargos.length > 0 && (
                        <button
                          onClick={() => handleToggleSimulation(truck.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            isSimulatingThis 
                              ? 'bg-rose-600 text-white shadow-sm' 
                              : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{isSimulatingThis ? 'Arrêter Simulation' : 'Lancer Télématique GPS'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Payload Fill Bar & Metrics */}
                  <div className="py-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-teal-700" />
                        Capacité Utile Embarquée :
                      </span>
                      <span className="font-bold text-slate-900">
                        {truck.currentPayloadTons} T / {truck.maxPayloadTons} T ({payloadPercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          payloadPercent > 95 
                            ? 'bg-rose-600' 
                            : payloadPercent > 70 
                              ? 'bg-teal-600' 
                              : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, payloadPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Assigned Cargo Items Inside Truck */}
                  <div className="pt-2">
                    {truck.assignedCargos.length === 0 ? (
                      <div className={`p-4 rounded-xl border-2 border-dashed text-center transition ${
                        isOver 
                          ? 'border-teal-500 bg-teal-50/80 text-teal-900 font-bold' 
                          : 'border-slate-200 bg-slate-50/60 text-slate-400'
                      }`}>
                        <span className="text-xs">
                          {isOver ? 'Relâchez pour charger le fret dans ce camion !' : 'Déposez un ordre de fret ici par glisser-déposer'}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Cargaisons à bord ({truck.assignedCargos.length}) :
                        </span>
                        {truck.assignedCargos.map((cargo) => (
                          <div 
                            key={cargo.id} 
                            className="p-3 rounded-lg bg-teal-50/70 border border-teal-200 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-teal-900">{cargo.code}</span>
                              <span className="text-slate-800 font-medium">{cargo.description}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white font-bold text-teal-800 border text-[10px]">
                                {cargo.weightTons} T
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Open e-POD Digital Signature Button */}
                              <button
                                onClick={() => handleOpenPod(cargo)}
                                className="px-2 py-1 rounded bg-white hover:bg-teal-100 text-teal-800 font-bold border border-teal-300 text-[11px] flex items-center gap-1 transition shadow-2xs"
                              >
                                <FileCheck className="w-3.5 h-3.5 text-teal-700" />
                                <span>Signer e-POD</span>
                              </button>

                              {/* Unassign button */}
                              <button
                                onClick={() => handleUnassignCargo(truck.id, cargo.id)}
                                title="Retirer du camion"
                                className="w-6 h-6 rounded bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center border border-slate-200 transition"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Telemetry Status Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Fuel className="w-3.5 h-3.5 text-amber-600" />
                        Réservoir : <strong>{truck.fuelLevelPercent}%</strong>
                      </span>
                      <span>•</span>
                      <span>Éco-Score : <strong className="text-emerald-700">{truck.ecoScore}/100</strong></span>
                    </div>

                    <div className="font-medium text-slate-700 text-right">
                      {isSimulatingThis ? (
                        <span className="text-blue-700 font-bold animate-pulse">
                          ⚡ Vitesse GPS : {truck.telemetrySpeed} km/h — En mouvement
                        </span>
                      ) : (
                        <span>{truck.corridorLocation}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FEATURE 4: BILAN CARBONE ESG & ÉCO-CONDUITE FLOTTE */}
      {/* ============================================================== */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Norme ESG & Décarbonation Corridor UEMOA
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display">
              Bilan Carbone & Optimisation Énergétique du Fret
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Réduction systématique des retours à vide et groupage dynamique de fret pour minimiser l'empreinte environnementale.
            </p>
          </div>

          <button
            onClick={() => showNotification("Certificat Vert ESG généré : 4.8T de CO2 évitées sur le corridor Bénin-Niger !")}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>Générer Certificat Vert ESG</span>
          </button>
        </div>

        {/* ESG Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-xs font-semibold text-emerald-800 block">CO₂ Évité (Ce Mois)</span>
            <p className="text-2xl font-black text-emerald-950 mt-1 font-display">18.4 Tonnes</p>
            <span className="text-[10px] text-emerald-700 mt-0.5 block">-24% vs transport non groupé</span>
          </div>
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80">
            <span className="text-xs font-semibold text-teal-800 block">Gasoil Économisé</span>
            <p className="text-2xl font-black text-teal-950 mt-1 font-display">4 850 Litres</p>
            <span className="text-[10px] text-teal-700 mt-0.5 block">Gain carburant certifié</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-600 block">Taux Retour à Vide</span>
            <p className="text-2xl font-black text-slate-900 mt-1 font-display">6.8%</p>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">Excellence opérationnelle</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-600 block">Indice Éco-Conduite</span>
            <p className="text-2xl font-black text-teal-800 mt-1 font-display">94/100</p>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Télématique OBD-II certifiée</span>
          </div>
        </div>
      </div>

      {/* Modal: e-POD Digital Signature Pad */}
      {showPodModal && podTargetCargo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-700" />
                  Bordereau Numérique de Livraison (e-POD)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Référence Fret : {podTargetCargo.code}
                </p>
              </div>
              <button 
                onClick={() => setShowPodModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Marchandise :</span>
                <span className="font-bold text-slate-800">{podTargetCargo.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Poids Certifié :</span>
                <span className="font-mono font-bold text-slate-800">{podTargetCargo.weightTons} Tonnes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Lieu de Destination :</span>
                <span className="font-semibold text-teal-800">{podTargetCargo.destination}</span>
              </div>
            </div>

            {/* Signature Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Signature Digitale du Destinataire :
                </label>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Effacer
                </button>
              </div>

              <div className="border-2 border-dashed border-teal-300 rounded-xl overflow-hidden bg-slate-50/50">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-[150px] cursor-crosshair touch-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 italic text-center">
                Signez ci-dessus avec la souris ou l'écran tactile
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setShowPodModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelivery}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
              >
                <Check className="w-4 h-4" />
                <span>Certifier & Émettre e-POD</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
