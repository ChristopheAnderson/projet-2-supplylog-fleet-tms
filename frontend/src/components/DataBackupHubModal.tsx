import { useState, useRef } from 'react';
import { 
  Database, 
  FileSpreadsheet, 
  FileCode2, 
  RotateCcw, 
  Download, 
  Upload, 
  X, 
  CheckCircle2, 
  Truck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Shipment } from '../App';

interface DataBackupHubModalProps {
  shipments: Shipment[];
  initialShipments: Shipment[];
  onUpdateShipments: (updated: Shipment[]) => void;
  onClose: () => void;
}

export default function DataBackupHubModal({
  shipments,
  initialShipments,
  onUpdateShipments,
  onClose
}: DataBackupHubModalProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const excelInputRef = useRef<HTMLInputElement | null>(null);
  const jsonInputRef = useRef<HTMLInputElement | null>(null);

  const notify = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // 1. EXCEL EXPORT (.xlsx)
  const handleExportExcel = () => {
    try {
      const formatted = shipments.map(s => ({
        'ID': s.id,
        'Réf Bordereau Waybill': s.waybill_ref,
        'Plaque Immatriculation': s.truck_plate,
        'Chauffeur': s.driver_name,
        'Téléphone Chauffeur': s.driver_phone,
        'Origine': s.origin,
        'Destination': s.destination,
        'Position Actuelle': s.current_location,
        'Type Fret': s.cargo_type,
        'Description Marchandise': s.cargo_desc,
        'Poids (Tonnes)': s.weight_tons,
        'Valeur Déclarée (XOF)': s.declared_value_xof,
        'Statut Expédition': s.status,
        'ETA Estimée': s.eta,
        'Vitesse Télématique (km/h)': s.speed_kmh,
        'Niveau Réservoir (%)': s.fuel_level_percent,
        'Progression (%)': s.progress_percent
      }));

      const worksheet = XLSX.utils.json_to_sheet(formatted);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Flotte & Convois');
      XLSX.writeFile(workbook, `SupplyLog_Flotte_Fret_Database_${new Date().toISOString().slice(0, 10)}.xlsx`);
      notify(`Export Excel réussi : ${shipments.length} convois de fret exportés en .xlsx !`);
    } catch (err) {
      console.error(err);
      notify('Erreur lors de la génération du fichier Excel.');
    }
  };

  // 2. EXCEL IMPORT (.xlsx)
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(sheet);

        if (rawJson.length === 0) {
          notify('Le fichier Excel importé est vide.');
          return;
        }

        const mapped: Shipment[] = rawJson.map((row, idx) => ({
          id: String(row['ID'] || `shp_imp_${Date.now()}_${idx}`),
          waybill_ref: String(row['Réf Bordereau Waybill'] || row['waybill_ref'] || `SL-IMP-${Date.now()}-${idx}`),
          truck_plate: String(row['Plaque Immatriculation'] || row['truck_plate'] || 'RB 0000 AA'),
          driver_name: String(row['Chauffeur'] || row['driver_name'] || 'Chauffeur Importé'),
          driver_phone: String(row['Téléphone Chauffeur'] || row['driver_phone'] || '+229 97 00 00 00'),
          origin: String(row['Origine'] || row['origin'] || 'Cotonou Port'),
          destination: String(row['Destination'] || row['destination'] || 'Niamey Terminal'),
          current_location: String(row['Position Actuelle'] || row['current_location'] || 'En transit'),
          cargo_type: (row['Type Fret'] || row['cargo_type'] || 'CONTENEUR_40') as any,
          cargo_desc: String(row['Description Marchandise'] || row['cargo_desc'] || 'Marchandise diverse'),
          weight_tons: Number(row['Poids (Tonnes)'] || row['weight_tons'] || 25),
          declared_value_xof: Number(row['Valeur Déclarée (XOF)'] || row['declared_value_xof'] || 50000000),
          status: (row['Statut Expédition'] || row['status'] || 'IN_TRANSIT') as any,
          eta: String(row['ETA Estimée'] || row['eta'] || '2026-09-30 18:00'),
          speed_kmh: Number(row['Vitesse Télématique (km/h)'] || row['speed_kmh'] || 65),
          fuel_level_percent: Number(row['Niveau Réservoir (%)'] || row['fuel_level_percent'] || 80),
          last_gps_ping: 'À l\'instant (Importé)',
          progress_percent: Number(row['Progression (%)'] || row['progress_percent'] || 50),
          logs: [
            { time: new Date().toLocaleTimeString(), stage: 'Import Excel', note: 'Données synchronisées depuis le fichier tableur' }
          ]
        }));

        onUpdateShipments(mapped);
        notify(`Base de données synchronisée : ${mapped.length} convois importés depuis Excel avec succès !`);
      } catch (err) {
        console.error(err);
        notify('Format de fichier Excel non reconnu ou invalide.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // 3. JSON EXPORT
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shipments, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `supplylog_shipments_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify(`Sauvegarde JSON téléchargée (${shipments.length} convois enregistrés).`);
  };

  // 4. JSON IMPORT
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onUpdateShipments(parsed);
          notify(`Flotte restaurée depuis le fichier JSON : ${parsed.length} convois chargés.`);
        } else {
          notify('Structure JSON invalide (un tableau d\'expéditions est attendu).');
        }
      } catch (err) {
        notify('Fichier JSON corrompu ou illisible.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 5. RESTORE INITIAL DATA
  const handleResetToInitial = () => {
    onUpdateShipments([...initialShipments]);
    notify(`Données d'origine restaurées : ${initialShipments.length} convois de référence actifs.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Gestionnaire de Données : Excel & JSON
              </h3>
              <p className="text-xs text-slate-500">
                Synchronisation de la flotte, import/export et sauvegarde réversible
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback message */}
        {feedbackMessage && (
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Current State Info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Convois de Flotte Actifs :</span>
            <span className="text-base font-extrabold text-slate-900 font-display">
              {shipments.length} Expéditions en Suivi
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-900 font-bold text-[11px]">
            État : Dynamique & Connecté
          </span>
        </div>

        {/* Option 1: EXCEL (.xlsx) */}
        <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-700" />
              Option 1 : Base Tableur Excel (.xlsx)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-200 text-teal-900">
              Pratique & Universel
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Éditez vos manifestes de fret, chauffeurs et tonnages directement sous Excel puis réinjectez le fichier pour mise à jour instantanée.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter en Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => excelInputRef.current?.click()}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-teal-100 text-teal-900 font-bold text-xs border border-teal-300 flex items-center justify-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5 text-teal-700" />
              <span>Importer Fichier Excel</span>
            </button>
            <input 
              ref={excelInputRef} 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleImportExcel} 
              className="hidden" 
            />
          </div>
        </div>

        {/* Option 2: JSON (.json) */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-blue-700" />
              Option 2 : Format Télématique JSON (.json)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">
              Données GPS Brutes
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Exportez l'état complet des pings GPS, statuts et journaux pour intégration dans d'autres SI logistiques.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger JSON</span>
            </button>

            <button
              onClick={() => jsonInputRef.current?.click()}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-blue-100 text-blue-900 font-bold text-xs border border-blue-300 flex items-center justify-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5 text-blue-700" />
              <span>Restaurer JSON</span>
            </button>
            <input 
              ref={jsonInputRef} 
              type="file" 
              accept=".json" 
              onChange={handleImportJson} 
              className="hidden" 
            />
          </div>
        </div>

        {/* Option 3: Reset to Factory Start */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleResetToInitial}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Revenir aux Données de Départ</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
