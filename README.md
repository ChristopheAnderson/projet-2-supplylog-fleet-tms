# 🚚 SupplyLog / AfriFleet — TMS & Suivi Logistique Temps Réel

[![PHP Version](https://img.shields.io/badge/PHP-8.3-777BB4?style=flat&logo=php)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat&logo=laravel)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![WebSockets](https://img.shields.io/badge/Laravel-Reverb%20WebSockets-FF2D20?style=flat)](https://laravel.com/docs/11.x/reverb)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

Plateforme de gestion de flotte, de suivi des expéditions de fret et de traçabilité logistique en temps réel reliant le Port de Cotonou aux corridors intérieurs et régionaux (Bénin, Niger, Burkina Faso, Mali).

---

## 🏛️ Architecture Technique

```mermaid
graph TD
    GPS[Boîtiers GPS / App Mobile Chauffeur] -->|HTTPS REST Ingestion| Laravel[API Laravel 11 Backend]
    Dispatcher[Opérateur Logistique - React Dashboard] <-->|WebSockets Temps Réel| Reverb[Laravel Reverb Server]
    
    subgraph Backend [Backend Laravel 11]
        Controller[Shipment & Fleet Controllers]
        EventBroadcaster[ShipmentStatusUpdated Event]
        GeoService[Geofencing & ETA Calculator]
        
        Controller --> GeoService
        GeoService --> EventBroadcaster
    end

    EventBroadcaster -->|Broadcast Channel| Reverb
    Laravel -->|Données Spatiales & Trajets| DB[(MySQL 8.0 / Spatial Data)]
    Laravel -->|Positions Live & Cache| Redis[(Redis Cache)]

    subgraph Frontend [React Dispatch Control Room]
        ReactUI[React 18 + TypeScript]
        Kanban[Board Kanban Interactif]
        MapTrack[Cartographie & Tracking GPS]
    end

    Reverb -->|Push Notifications & GPS Updates| ReactUI
```

---

## 📂 Structure du Répertoire

```text
projet-2-supplylog-fleet-tms/
├── docker-compose.yml          # Backend + Reverb + MySQL + Redis + React
├── README.md                   # Documentation technique
├── backend/                    # API Laravel 11 avec WebSockets
│   ├── app/
│   │   ├── Events/             # ShipmentStatusUpdated.php (Broadcast)
│   │   ├── Http/Controllers/   # ShipmentController, FleetController
│   │   └── Models/             # Shipment, Vehicle, Driver, Waybill
│   ├── routes/api.php          # Endpoints logistiques
│   ├── composer.json
│   └── Dockerfile
└── frontend/                   # Tour de Contrôle React
    ├── src/
    │   ├── components/         # Board Kanban, Carte de suivi, Alertes
    │   ├── types/              # Types expéditions, véhicules, statuts
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Démarrage Rapide

```bash
cd projet-2-supplylog-fleet-tms
docker-compose up -d --build
# Dashboard disponible sur http://localhost:3001
# Backend API sur http://localhost:8001/api/v1
```
