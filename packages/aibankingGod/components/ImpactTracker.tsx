// System: idgafAI
// Component: ImpactTracker.tsx
// Role: Renders a real-time dashboard for simulated global impact metrics.
// This component provides multiple views (summary, details, live feed) into a
// high-frequency stream of simulated environmental and social impact transactions.
import React, { useState, useEffect, useMemo } from 'react';
import Card from './Card';

// Defines the initial state for the impact metrics simulation.
interface ImpactTrackerProps {
  initialTrees: number; // Starting count of trees planted.
  initialCarbonOffsetTonnes: number; // Starting value for carbon offset in tonnes.
  initialBiodiversityIndex: number; // Starting biodiversity score (0-100).
  initialWaterPurityPPM: number; // Starting water purity in parts-per-million.
  initialSocialEquityScore: number; // Starting social equity score (0-100).
  transactionsPerSecond: number; // The rate of simulated impact transactions per second.
}

// Represents a single simulated impact event in the data stream.
type ImpactTransaction = {
  id: string;
  type: 'REFORESTATION' | 'OCEAN_CLEANUP' | 'RENEWABLE_ENERGY' | 'CARBON_CREDIT' | 'BIODIVERSITY_RESTORATION' | 'WATER_PURIFICATION' | 'SOCIAL_IMPACT_BOND' | 'NETWORK_EXPANSION';
  value: number; // The magnitude of the impact event.
  timestamp: number;
  metadata: {
    geo: string; // Geographic coordinates of impact.
    source: string; // Originating node in the network.
    projectID: string; // Correlating impact to specific initiatives.
    validationSignatures: number; // Number of simulated validation signatures.
    geinScore: number; // Global Economic Impact Nexus (GEIN) score for this transaction.
  };
};

// Defines the available display modes for the dashboard.
type ViewMode = 'summary' | 'details' | 'live_feed' | 'geospatial' | 'network' | 'forecasting' | 'settings';

// --- View Components ---

// A stylized SVG icon representing reforestation or growth.
const AdvancedTreeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5V8.5m0 13L8 17.5m4 4l4-4M12 8.5a4 4 0 100-8 4 4 0 000 8z" style={{ filter: 'url(#glow)' }} />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.5h15" className="opacity-50" />
  </svg>
);

// Renders navigation buttons to switch between different `ViewMode`s.
const ViewSwitcher: React.FC<{ activeView: ViewMode; setView: (view: ViewMode) => void }> = ({ activeView, setView }) => (
  <div className="absolute top-4 right-4 flex flex-wrap gap-1 bg-gray-900/50 p-1 rounded-lg border border-gray-700">
    {(['summary', 'details', 'live_feed', 'geospatial', 'network', 'forecasting', 'settings'] as ViewMode[]).map((view) => (
      <button
        key={view}
        onClick={() => setView(view)}
        className={`px-2 py-1 text-xs rounded-md transition-colors duration-300 ${
          activeView === view ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'
        }`}
      >
        {view.charAt(0).toUpperCase() + view.slice(1).replace('_', ' ')}
      </button>
    ))}
  </div>
);

// Displays the primary impact metric (trees planted) and progress towards the next unit.
const SummaryView: React.FC<{ trees: number; progress: number }> = ({ trees, progress }) => (
  <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
    <AdvancedTreeIcon />
    <p className="text-6xl font-bold text-white mt-4 tracking-tighter">{trees.toLocaleString()}</p>
    <p className="text-gray-400 mt-1">Trees Planted via High-Frequency Transactions</p>
    <div className="w-full bg-gray-700 rounded-full h-3 mt-8">
      <div className="bg-gradient-to-r from-green-400 to-cyan-500 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
    </div>
    <p className="text-sm text-gray-500 mt-2">{progress.toFixed(2)}% to the next arboreal unit</p>
  </div>
);

// Displays a detailed breakdown of all tracked environmental and social metrics.
const DetailedView: React.FC<{ 
    carbonOffset: number; 
    oceanPlasticsRemoved: number;
    biodiversityIndex: number;
    waterPurity: number;
    socialEquityScore: number;
}> = ({ carbonOffset, oceanPlasticsRemoved, biodiversityIndex, waterPurity, socialEquityScore }) => (
    <div className="text-left p-4 h-full animate-fadeIn overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Holistic Impact Ledger</h3>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm text-gray-400">Carbon Offset (Tonnes)</p>
                <p className="text-2xl font-mono text-cyan-400">{carbonOffset.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">Ocean Plastics Removed (kg)</p>
                <p className="text-2xl font-mono text-green-400">{oceanPlasticsRemoved.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">Biodiversity Index</p>
                <p className="text-2xl font-mono text-purple-400">{biodiversityIndex.toFixed(2)} / 100</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">Water Purity (avg. PPM)</p>
                <p className="text-2xl font-mono text-blue-400">{waterPurity.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
                <p className="text-sm text-gray-400">Social Equity Score</p>
                <p className="text-2xl font-mono text-yellow-400">{socialEquityScore.toFixed(2)} / 100</p>
            </div>
            <div className="pt-4 col-span-2">
                <p className="text-sm text-gray-400 mb-2">GEIN Impact Distribution</p>
                <div className="w-full h-4 bg-gray-700 rounded-full flex text-xs text-white text-center">
                    <div className="bg-green-500 h-full rounded-l-full flex items-center justify-center" style={{width: '40%'}} title="Ecological">Eco</div>
                    <div className="bg-cyan-500 h-full flex items-center justify-center" style={{width: '25%'}} title="Carbon">CO2</div>
                    <div className="bg-blue-500 h-full flex items-center justify-center" style={{width: '15%'}} title="Oceanic">H2O</div>
                    <div className="bg-yellow-500 h-full flex items-center justify-center" style={{width: '15%'}} title="Social">Soc</div>
                    <div className="bg-purple-500 h-full rounded-r-full flex items-center justify-center" style={{width: '5%'}} title="Network">Net</div>
                </div>
            </div>
        </div>
    </div>
);

// Renders a real-time list of incoming impact transactions.
const LiveFeedView: React.FC<{ transactions: ImpactTransaction[] }> = ({ transactions }) => (
    <div className="h-full flex flex-col animate-fadeIn">
        <h3 className="text-lg font-semibold text-white p-4 pb-2">Live GEIN Transaction Feed</h3>
        <div className="overflow-y-auto flex-grow p-4 pt-2 space-y-2">
            {transactions.length === 0 && <p className="text-gray-500 text-center pt-8">Awaiting network synchronization...</p>}
            {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between text-xs font-mono bg-gray-800/50 p-2 rounded-md">
                    <span className="text-green-400 w-1/3 truncate">{tx.type}</span>
                    <span className="text-gray-400 w-1/3 text-center">{tx.metadata.geo}</span>
                    <span className="text-white w-1/3 text-right">+{tx.value.toFixed(4)} | {tx.metadata.geinScore.toFixed(2)} GEIN</span>
                </div>
            ))}
        </div>
    </div>
);

// Placeholder for a geospatial visualization of impact transaction locations.
const GeospatialView: React.FC<{ transactions: ImpactTransaction[] }> = ({ transactions }) => (
    <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Geospatial Impact Matrix</h3>
        <div className="w-full h-4/5 bg-gray-900 border border-cyan-500/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Geospatial projection rendering... [Feature Pending]</p>
            {/* In a real implementation, this would be a WebGL globe */}
        </div>
        <p className="text-xs text-gray-500 mt-2">Displaying latest {transactions.length} impact coordinates.</p>
    </div>
);

// Displays simulated network statistics like node count and health.
const NetworkView: React.FC<{ nodes: number; health: number }> = ({ nodes, health }) => (
    <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn p-4">
        <h3 className="text-lg font-semibold text-white mb-4">GEIN Status</h3>
        <div className="flex space-x-8">
            <div>
                <p className="text-sm text-gray-400">Active Nodes</p>
                <p className="text-4xl font-mono text-cyan-400">{nodes.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">Network Health</p>
                <p className="text-4xl font-mono text-green-400">{health.toFixed(2)}%</p>
            </div>
        </div>
        <div className="w-full h-1/2 bg-gray-900 border border-cyan-500/30 rounded-lg mt-8 flex items-center justify-center">
            <p className="text-gray-500">Network topology visualization... [Feature Pending]</p>
        </div>
    </div>
);

// Displays a simple, linear forecast of future impact based on current rates.
const ForecastingView: React.FC<{ trees: number; carbonOffset: number }> = ({ trees, carbonOffset }) => (
    <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn p-4">
        <h3 className="text-lg font-semibold text-white mb-4">5-Year Impact Forecast</h3>
        <div className="space-y-4 text-left">
            <p className="text-gray-400">Based on current GEIN velocity, the system projects:</p>
            <ul className="list-disc list-inside text-green-400">
                <li><span className="text-white">{(trees * 5 * 365).toLocaleString()}</span> additional trees planted.</li>
                <li><span className="text-white">{(carbonOffset * 5).toLocaleString(undefined, {maximumFractionDigits: 0})}</span> tonnes of additional carbon offset.</li>
                <li><span className="text-white">75% reduction</span> in oceanic microplastics in monitored zones.</li>
                <li><span className="text-white">15 point increase</span> in global social equity index.</li>
            </ul>
        </div>
         <div className="w-full h-1/2 bg-gray-900 border border-cyan-500/30 rounded-lg mt-8 flex items-center justify-center">
            <p className="text-gray-500">Predictive model graph... [Feature Pending]</p>
        </div>
    </div>
);

// Provides controls to adjust simulation parameters, such as transactions per second.
const SettingsView: React.FC<{ tps: number; setTps: (tps: number) => void }> = ({ tps, setTps }) => (
    <div className="p-4 animate-fadeIn">
        <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
                <label htmlFor="tps-slider" className="block text-sm text-gray-400 mb-2">
                    Simulated Transactions/Second: <span className="font-bold text-white">{tps}</span>
                </label>
                <input
                    id="tps-slider"
                    type="range"
                    min="1"
                    max="1000"
                    value={tps}
                    onChange={(e) => setTps(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <p className="text-xs text-gray-500">Adjust the frequency of the GEIN simulation. Higher values demonstrate the system's throughput capacity.</p>
        </form>
    </div>
);


// The main component that orchestrates the state, simulation, and rendering of the impact dashboard.
const ImpactTracker: React.FC<ImpactTrackerProps> = ({ initialTrees, initialCarbonOffsetTonnes, initialBiodiversityIndex, initialWaterPurityPPM, initialSocialEquityScore, transactionsPerSecond: initialTps }) => {

  const [view, setView] = useState<ViewMode>('summary');
  const [totalTrees, setTotalTrees] = useState(initialTrees);
  const [progress, setProgress] = useState(Math.random() * 100); // Start with a random progress for visual effect.
  const [carbonOffset, setCarbonOffset] = useState(initialCarbonOffsetTonnes);
  const [oceanPlasticsRemoved, setOceanPlasticsRemoved] = useState(initialCarbonOffsetTonnes * 1.5); // Derived metric for visualization.
  const [biodiversityIndex, setBiodiversityIndex] = useState(initialBiodiversityIndex);
  const [waterPurity, setWaterPurity] = useState(initialWaterPurityPPM);
  const [socialEquityScore, setSocialEquityScore] = useState(initialSocialEquityScore);
  const [networkNodes, setNetworkNodes] = useState(1000);
  const [geinHealth, setGeinHealth] = useState(99.9);
  const [liveTransactions, setLiveTransactions] = useState<ImpactTransaction[]>([]);
  const [tps, setTps] = useState(initialTps);

  // Main simulation loop. Generates a stream of impact transactions at a rate
  // determined by the `tps` state. Updates metrics based on transaction type.
  useEffect(() => {
    if (tps === 0) return;
    const interval = setInterval(() => {
      const randomFactor = Math.random();
      let type: ImpactTransaction['type'];
      // Distribute transaction types based on a random factor.
      if (randomFactor > 0.95) type = 'NETWORK_EXPANSION';
      else if (randomFactor > 0.85) type = 'SOCIAL_IMPACT_BOND';
      else if (randomFactor > 0.75) type = 'WATER_PURIFICATION';
      else if (randomFactor > 0.65) type = 'BIODIVERSITY_RESTORATION';
      else if (randomFactor > 0.5) type = 'OCEAN_CLEANUP';
      else if (randomFactor > 0.3) type = 'RENEWABLE_ENERGY';
      else if (randomFactor > 0.1) type = 'CARBON_CREDIT';
      else type = 'REFORESTATION';

      const newTransaction: ImpactTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        value: Math.random() * 0.05,
        timestamp: Date.now(),
        metadata: {
          geo: `${(Math.random() * 180 - 90).toFixed(4)}, ${(Math.random() * 360 - 180).toFixed(4)}`,
          source: `node_${Math.floor(Math.random() * networkNodes)}`,
          projectID: `proj_${Math.random().toString(36).substr(2, 12)}`,
          validationSignatures: Math.floor(Math.random() * 100) + 50,
          geinScore: Math.random() * 10,
        },
      };

      setLiveTransactions(prev => [newTransaction, ...prev.slice(0, 99)]); // Keep last 100 transactions for performance.

      // Update global state based on the type of the new transaction.
      switch (newTransaction.type) {
        case 'REFORESTATION':
          setProgress(prev => {
            const newProgress = prev + newTransaction.value * 200; // Value is a fraction of a tree, amplified for viz.
            if (newProgress >= 100) {
              setTotalTrees(t => t + Math.floor(newProgress / 100));
              return newProgress % 100;
            }
            return newProgress;
          });
          break;
        case 'CARBON_CREDIT':
          setCarbonOffset(c => c + newTransaction.value * 10);
          break;
        case 'OCEAN_CLEANUP':
          setOceanPlasticsRemoved(p => p + newTransaction.value * 5);
          break;
        case 'BIODIVERSITY_RESTORATION':
            setBiodiversityIndex(b => Math.min(100, b + newTransaction.value * 0.1));
            break;
        case 'WATER_PURIFICATION':
            setWaterPurity(w => Math.max(0, w - newTransaction.value * 0.5)); // Lower PPM is better
            break;
        case 'SOCIAL_IMPACT_BOND':
            setSocialEquityScore(s => Math.min(100, s + newTransaction.value * 0.08));
            break;
        case 'NETWORK_EXPANSION':
            setNetworkNodes(n => n + 1);
            setGeinHealth(h => Math.min(99.99, h + 0.01));
            break;
        // RENEWABLE_ENERGY does not directly update a primary metric in this view, but is part of the transaction log.
      }
      // Simulate a minor, continuous network health decay.
      setGeinHealth(h => Math.max(90, h - 0.001));
    }, 1000 / tps);

    return () => clearInterval(interval);
  }, [tps, networkNodes]);

  // Memoizes the current view component to prevent re-rendering when unrelated state changes.
  const CurrentView = useMemo(() => {
    switch (view) {
      case 'summary':
        return <SummaryView trees={totalTrees} progress={progress} />;
      case 'details':
        return <DetailedView 
                    carbonOffset={carbonOffset} 
                    oceanPlasticsRemoved={oceanPlasticsRemoved} 
                    biodiversityIndex={biodiversityIndex}
                    waterPurity={waterPurity}
                    socialEquityScore={socialEquityScore}
                />;
      case 'live_feed':
        return <LiveFeedView transactions={liveTransactions} />;
      case 'geospatial':
        return <GeospatialView transactions={liveTransactions} />;
      case 'network':
        return <NetworkView nodes={networkNodes} health={geinHealth} />;
      case 'forecasting':
        return <ForecastingView trees={totalTrees} carbonOffset={carbonOffset} />;
      case 'settings':
        return <SettingsView tps={tps} setTps={setTps} />;
      default:
        return null;
    }
  }, [view, totalTrees, progress, carbonOffset, oceanPlasticsRemoved, liveTransactions, tps, biodiversityIndex, waterPurity, socialEquityScore, networkNodes, geinHealth]);

  return (
    <Card title="Global Economic Impact Nexus [LIVE]" className="h-full relative">
      <ViewSwitcher activeView={view} setView={setView} />
      <div className="h-full pt-12">
        {CurrentView}
      </div>
    </Card>
  );
};

export default ImpactTracker;