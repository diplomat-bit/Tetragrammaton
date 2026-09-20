import React, { useState } from 'react';
import {
  MapPin, Compass, Search, Navigation, Layers, Plus, Trash2,
  Sparkles, RefreshCw, ZoomIn, ZoomOut, CheckCircle2, Globe, Flag
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { getGoogleWorkspaceToken } from '../../firebase';

interface MarkerLocation {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description: string;
}

export const GoogleMapsWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [centerLat, setCenterLat] = useState<number>(40.7128);
  const [centerLng, setCenterLng] = useState<number>(74.0060);
  const [zoom, setZoom] = useState<number>(14);
  const [mapStyle, setMapStyle] = useState<'dark' | 'standard' | 'satellite'>('dark');
  const [searchQuery, setSearchQuery] = useState('');

  const [markers, setMarkers] = useState<MarkerLocation[]>([
    {
      id: 'm-1',
      name: 'Citigroup Global Headquarters',
      category: 'Settlement Escrow',
      lat: 40.7209,
      lng: -74.0118,
      description: 'Primary Fedwire and JWE Open Banking gateway terminal.'
    },
    {
      id: 'm-2',
      name: 'Federal Reserve Bank of New York',
      category: 'Central Banking Rail',
      lat: 40.7077,
      lng: -74.0089,
      description: 'Fedwire Funds Service IMAD verification center.'
    },
    {
      id: 'm-3',
      name: 'New York Stock Exchange (NYSE)',
      category: 'Market Data Feed',
      lat: 40.7069,
      lng: -74.0090,
      description: 'Real-time equity and option volatility skew feeds.'
    }
  ]);

  const [selectedMarker, setSelectedMarker] = useState<MarkerLocation | null>(markers[0]);

  // Route / Directions state
  const [routeFrom, setRouteFrom] = useState('Citigroup Global Headquarters');
  const [routeTo, setRouteTo] = useState('Federal Reserve Bank of NY');
  const [routeCalculated, setRouteCalculated] = useState(true);

  // New Marker State
  const [newMarkerName, setNewMarkerName] = useState('');
  const [newMarkerLat, setNewMarkerLat] = useState('40.7580');
  const [newMarkerLng, setNewMarkerLng] = useState('-73.9855');

  const handleAddMarker = () => {
    if (!newMarkerName) return;
    const m: MarkerLocation = {
      id: `m-${Date.now()}`,
      name: newMarkerName,
      category: 'Custom Node',
      lat: parseFloat(newMarkerLat) || 40.7128,
      lng: parseFloat(newMarkerLng) || -74.0060,
      description: 'Custom geocoded location pin.'
    };
    setMarkers([...markers, m]);
    setSelectedMarker(m);
    setNewMarkerName('');
  };

  const deleteMarker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMarkers(markers.filter((m) => m.id !== id));
    if (selectedMarker?.id === id) setSelectedMarker(null);
  };

  return (
    <div id="google-maps-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Maps Platform"
        scopeDescription="Connect your Google Account to access spatial routing, places search, and custom telemetry overlays."
        onTokenChange={(t) => setToken(t)}
      />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 shadow-inner">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Google Maps & Spatial Geocoding Hub</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                MAPS JS & DIRECTIONS API
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive spatial routing, custom telemetry pins, turn-by-turn directions & satellite imagery
            </p>
          </div>
        </div>

        {/* Style & Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['dark', 'standard', 'satellite'] as const).map((style) => (
              <button
                key={style}
                onClick={() => setMapStyle(style)}
                className={`px-3 py-1 text-xs capitalize font-bold rounded-md transition-all cursor-pointer ${
                  mapStyle === style ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setZoom((prev) => Math.min(prev + 1, 20))}
              className="p-1 text-slate-400 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((prev) => Math.max(prev - 1, 1))}
              className="p-1 text-slate-400 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Spatial Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Interactive Map Canvas Visualizer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-[16/10] bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden shadow-2xl p-6 flex flex-col justify-between">
            {/* Map Grid Pattern Graphic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

            {/* Simulated Map Roads & Nodes Canvas Graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full relative opacity-60">
                <svg className="w-full h-full text-slate-800" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 50 150 Q 250 80 450 200 T 800 350" fill="none" stroke="currentColor" strokeWidth="6" />
                  <path d="M 120 450 Q 350 300 650 120 T 900 180" fill="none" stroke="currentColor" strokeWidth="4" />
                  {routeCalculated && (
                    <path d="M 220 180 Q 400 240 580 320" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="6,6" className="animate-pulse" />
                  )}
                </svg>
              </div>
            </div>

            {/* Pins on the Map */}
            <div className="absolute inset-0 p-12">
              {markers.map((m, idx) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMarker(m)}
                  style={{
                    top: `${30 + (idx * 22)}%`,
                    left: `${25 + (idx * 24)}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                >
                  <div className={`p-2 rounded-full border shadow-lg transition-all transform group-hover:scale-125 ${
                    selectedMarker?.id === m.id
                      ? 'bg-red-600 border-white text-white ring-4 ring-red-500/40'
                      : 'bg-slate-900 border-red-500 text-red-400'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded bg-slate-950/90 text-[10px] font-mono font-bold text-white border border-slate-800 whitespace-nowrap shadow-md">
                    {m.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Top Overlay: Coordinates Status */}
            <div className="relative z-20 flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 backdrop-blur">
              <span className="flex items-center gap-1.5 text-white">
                <Compass className="w-4 h-4 text-red-400 animate-spin" /> Lat: {centerLat.toFixed(4)}, Lng: -{centerLng.toFixed(4)}
              </span>
              <span>Zoom: {zoom}x</span>
              <span className="text-emerald-400">Layer: {mapStyle.toUpperCase()}</span>
            </div>

            {/* Bottom Overlay: Selected Marker Details */}
            {selectedMarker && (
              <div className="relative z-20 p-4 bg-slate-900/95 border border-slate-800 rounded-xl backdrop-blur shadow-xl space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-red-400" /> {selectedMarker.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300">
                    {selectedMarker.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{selectedMarker.description}</p>
                <p className="text-[11px] font-mono text-slate-500">Coordinates: {selectedMarker.lat}, {selectedMarker.lng}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Directions & Custom Pins */}
        <div className="space-y-4">
          {/* Turn-by-Turn Directions Widget */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-red-400" /> ROUTING & DIRECTIONS
            </span>

            <div className="space-y-2">
              <input
                type="text"
                value={routeFrom}
                onChange={(e) => setRouteFrom(e.target.value)}
                placeholder="Origin"
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg focus:outline-none focus:border-red-500"
              />
              <input
                type="text"
                value={routeTo}
                onChange={(e) => setRouteTo(e.target.value)}
                placeholder="Destination"
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Distance: <b className="text-white">1.4 miles</b></span>
                <span>Duration: <b className="text-emerald-400">6 mins (Driving)</b></span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px] pt-1 border-t border-slate-800">
                <p>1. Head south on Greenwich St toward Murray St (0.4 mi)</p>
                <p>2. Turn left onto Liberty St toward Federal Reserve (0.8 mi)</p>
                <p>3. Destination will be on the right (0.2 mi)</p>
              </div>
            </div>
          </div>

          {/* Add Custom Marker */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-red-400" /> ADD GEOLOCATION PIN
            </span>

            <input
              type="text"
              placeholder="Location Name"
              value={newMarkerName}
              onChange={(e) => setNewMarkerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Latitude"
                value={newMarkerLat}
                onChange={(e) => setNewMarkerLat(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 p-2 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={newMarkerLng}
                onChange={(e) => setNewMarkerLng(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 p-2 rounded-lg focus:outline-none"
              />
            </div>
            <button
              onClick={handleAddMarker}
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer"
            >
              Pin On Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
