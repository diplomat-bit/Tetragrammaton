import React, { useState, useMemo } from 'react';
import { 
  Vote, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  PlusCircle, 
  Clock, 
  FileText, 
  ChevronRight, 
  Coins, 
  Percent, 
  ArrowUpRight,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';

export interface Proposal {
  id: string;
  title: string;
  category: 'Treasury' | 'Grants' | 'Protocol' | 'Ethics' | 'Liquidity';
  proposer: string;
  proposerRole: string;
  description: string;
  requestedFunds: number;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorumNeeded: number;
  deadline: string;
  status: 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED';
  userVoted?: 'FOR' | 'AGAINST' | 'ABSTAIN';
}

const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'PROP-2026-084',
    title: 'Democratized Small-Business Micro-Credit Facility',
    category: 'Grants',
    proposer: 'Elena Rostova',
    proposerRole: 'Community Delegate #442',
    description: 'Allocate $2,500,000 from the Sovereign Community Pool into zero-interest working capital loans for verified local cooperatives and green supply chain initiatives.',
    requestedFunds: 2500000,
    votesFor: 142300,
    votesAgainst: 18400,
    votesAbstain: 5200,
    quorumNeeded: 150000,
    deadline: '2 days left',
    status: 'ACTIVE',
  },
  {
    id: 'PROP-2026-083',
    title: 'Cross-Border Open Banking Fee Abolition Protocol',
    category: 'Protocol',
    proposer: 'Marcus Vance',
    proposerRole: 'Citibank Nexus Core Architect',
    description: 'Eliminate secondary intermediary transaction tariffs for all citizen-to-citizen settlements across Latin American and Euro-Atlantic corridors.',
    requestedFunds: 450000,
    votesFor: 289400,
    votesAgainst: 12000,
    votesAbstain: 8400,
    quorumNeeded: 200000,
    deadline: 'Passed',
    status: 'PASSED',
  },
  {
    id: 'PROP-2026-082',
    title: 'Algorithmic Liquidity Backstop for High-Volatility Swaps',
    category: 'Liquidity',
    proposer: 'Sovereign Quant Collective',
    proposerRole: 'Quant Analyst Node',
    description: 'Deploy $5,000,000 reserve into the dynamic automated market-maker vault to stabilize credit note spreads during peak market movements.',
    requestedFunds: 5000000,
    votesFor: 98200,
    votesAgainst: 104500,
    votesAbstain: 15000,
    quorumNeeded: 180000,
    deadline: 'Ended',
    status: 'REJECTED',
  },
  {
    id: 'PROP-2026-081',
    title: 'Automated AI Ethical Compliance Audit Layer',
    category: 'Ethics',
    proposer: 'Dr. Sarah Chen',
    proposerRole: 'Ethics Committee Lead',
    description: 'Implement independent continuous neural validation hooks into all automated credit underwriting engines to prevent systemic demographic bias.',
    requestedFunds: 850000,
    votesFor: 340000,
    votesAgainst: 6200,
    votesAbstain: 3100,
    quorumNeeded: 200000,
    deadline: 'Executed',
    status: 'EXECUTED',
  }
];

export const FinancialDemocracyView: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'PASSED' | 'EXECUTED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isNewProposalModalOpen, setIsNewProposalModalOpen] = useState<boolean>(false);
  const [userVotingWeight] = useState<number>(2500); // 2,500 citizen governance tokens
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New proposal form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Treasury' | 'Grants' | 'Protocol' | 'Ethics' | 'Liquidity'>('Grants');
  const [requestedFunds, setRequestedFunds] = useState('');
  const [description, setDescription] = useState('');

  // Dividend yield calculation simulator
  const [stakeAmount, setStakeAmount] = useState<number>(10000);
  const estimatedAnnualYield = useMemo(() => {
    return (stakeAmount * 0.0845).toFixed(2);
  }, [stakeAmount]);

  const handleVote = (proposalId: string, voteType: 'FOR' | 'AGAINST' | 'ABSTAIN') => {
    setProposals(prev => prev.map(prop => {
      if (prop.id !== proposalId) return prop;
      if (prop.userVoted) return prop; // Already voted

      return {
        ...prop,
        userVoted: voteType,
        votesFor: voteType === 'FOR' ? prop.votesFor + userVotingWeight : prop.votesFor,
        votesAgainst: voteType === 'AGAINST' ? prop.votesAgainst + userVotingWeight : prop.votesAgainst,
        votesAbstain: voteType === 'ABSTAIN' ? prop.votesAbstain + userVotingWeight : prop.votesAbstain,
      };
    }));

    setSuccessMessage(`Successfully registered your ${voteType} vote with ${userVotingWeight.toLocaleString()} voting power!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !requestedFunds) return;

    const newProp: Proposal = {
      id: `PROP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      category,
      proposer: 'Current Citizen Operator',
      proposerRole: 'Verified Citizen Delegate',
      description,
      requestedFunds: parseFloat(requestedFunds) || 0,
      votesFor: userVotingWeight,
      votesAgainst: 0,
      votesAbstain: 0,
      quorumNeeded: 120000,
      deadline: '7 days left',
      status: 'ACTIVE',
      userVoted: 'FOR',
    };

    setProposals([newProp, ...proposals]);
    setIsNewProposalModalOpen(false);
    setTitle('');
    setDescription('');
    setRequestedFunds('');
    setSuccessMessage(`Proposal "${newProp.title}" created successfully and live for community voting!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const filteredProposals = useMemo(() => {
    return proposals.filter(prop => {
      const matchesStatus = selectedFilter === 'ALL' || prop.status === selectedFilter;
      const matchesCategory = selectedCategory === 'ALL' || prop.category === selectedCategory;
      return matchesStatus && matchesCategory;
    });
  }, [proposals, selectedFilter, selectedCategory]);

  return (
    <div id="financial-democracy-view" className="space-y-8 text-gray-100 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Financial Democracy & Sovereign Governance
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Decentralized capital allocation, transparent community voting, and collective treasury stewardship.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="create-proposal-btn"
            onClick={() => setIsNewProposalModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-900/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Proposal
          </button>
        </div>
      </div>

      {/* Alert / Notification Feedback */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Democratic Treasury</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">$48,250,000</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +12.4% yield distributed YTD
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Your Voting Power</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{userVotingWeight.toLocaleString()} <span className="text-xs font-normal text-gray-400">VE-CITI</span></div>
            <div className="text-xs text-cyan-400 mt-1 font-medium">
              Tier II Verified Citizen Weight
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Referendums</span>
            <Vote className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{proposals.filter(p => p.status === 'ACTIVE').length} Active</div>
            <div className="text-xs text-purple-300 mt-1 font-medium">
              3 closing in &lt; 48 hours
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Citizen Participation</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">84.2%</div>
            <div className="text-xs text-amber-300 mt-1 font-medium">
              42,819 sovereign voters active
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Proposals List & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Proposals List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-900/60 p-3 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {(['ALL', 'ACTIVE', 'PASSED', 'EXECUTED'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedFilter === tab
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {tab === 'ALL' ? 'All Referendums' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-xs text-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Grants">Grants</option>
                <option value="Protocol">Protocol</option>
                <option value="Liquidity">Liquidity</option>
                <option value="Ethics">Ethics</option>
                <option value="Treasury">Treasury</option>
              </select>
            </div>
          </div>

          {/* Proposals Feed */}
          <div className="space-y-4">
            {filteredProposals.length === 0 ? (
              <div className="p-12 text-center bg-gray-900/40 rounded-2xl border border-gray-800">
                <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No proposals found matching the selected filters.</p>
                <button
                  onClick={() => { setSelectedFilter('ALL'); setSelectedCategory('ALL'); }}
                  className="mt-3 text-xs text-cyan-400 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredProposals.map(prop => {
                const totalVotes = prop.votesFor + prop.votesAgainst + prop.votesAbstain;
                const forPercent = totalVotes > 0 ? Math.round((prop.votesFor / totalVotes) * 100) : 0;
                const againstPercent = totalVotes > 0 ? Math.round((prop.votesAgainst / totalVotes) * 100) : 0;
                const quorumPercent = Math.min(100, Math.round((totalVotes / prop.quorumNeeded) * 100));

                return (
                  <div
                    key={prop.id}
                    className="p-6 bg-gray-900/80 border border-gray-800 hover:border-gray-700/80 rounded-2xl transition-all space-y-4"
                  >
                    {/* Top Row: Category, ID, Status, Deadline */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-gray-800 text-cyan-400 border border-gray-700">
                          {prop.id}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/50 font-medium">
                          {prop.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {prop.deadline}
                        </span>

                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          prop.status === 'ACTIVE' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          prop.status === 'PASSED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          prop.status === 'EXECUTED' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                          'bg-red-950 text-red-300 border border-red-800'
                        }`}>
                          {prop.status}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1.5">{prop.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{prop.description}</p>
                    </div>

                    {/* Funding Request & Proposer Details */}
                    <div className="flex flex-wrap items-center justify-between text-xs py-2 px-3 bg-gray-950/60 rounded-xl border border-gray-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Author:</span>
                        <span className="text-white font-medium">{prop.proposer}</span>
                        <span className="text-gray-500">({prop.proposerRole})</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Requested: ${prop.requestedFunds.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Quorum and Voting Breakdown Progress */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Quorum: {totalVotes.toLocaleString()} / {prop.quorumNeeded.toLocaleString()} required ({quorumPercent}%)</span>
                        <span className="text-emerald-400 font-medium">{forPercent}% In Favor</span>
                      </div>

                      {/* Vote Split Bar */}
                      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
                        <div style={{ width: `${forPercent}%` }} className="h-full bg-emerald-500 transition-all duration-500" />
                        <div style={{ width: `${againstPercent}%` }} className="h-full bg-red-500 transition-all duration-500" />
                        <div style={{ width: `${100 - forPercent - againstPercent}%` }} className="h-full bg-gray-600 transition-all duration-500" />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                        <span className="text-emerald-400">For: {prop.votesFor.toLocaleString()}</span>
                        <span className="text-red-400">Against: {prop.votesAgainst.toLocaleString()}</span>
                        <span className="text-gray-400">Abstain: {prop.votesAbstain.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action Voting Buttons */}
                    {prop.status === 'ACTIVE' && (
                      <div className="pt-2 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3">
                        {prop.userVoted ? (
                          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/50">
                            <Check className="w-4 h-4" />
                            You voted {prop.userVoted} with {userVotingWeight.toLocaleString()} power
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleVote(prop.id, 'FOR')}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-semibold transition"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Vote For
                            </button>

                            <button
                              onClick={() => handleVote(prop.id, 'AGAINST')}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-700/50 rounded-xl text-xs font-semibold transition"
                            >
                              <XCircle className="w-4 h-4 text-red-400" />
                              Vote Against
                            </button>

                            <button
                              onClick={() => handleVote(prop.id, 'ABSTAIN')}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-xl text-xs font-semibold transition"
                            >
                              <MinusCircle className="w-4 h-4 text-gray-400" />
                              Abstain
                            </button>
                          </div>
                        )}

                        <span className="text-[11px] text-gray-500">
                          Power: {userVotingWeight.toLocaleString()} VE-CITI
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Democratic Yield Simulator & Treasury Pools */}
        <div className="space-y-6">
          {/* Democratic Capital Pools */}
          <div className="p-6 bg-gray-900/80 border border-gray-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-cyan-400" />
              Democratic Capital Allocation
            </h2>
            <p className="text-xs text-gray-400">
              Community assets reserved under collective democratic discretion.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Community Grants Pool', balance: '$18,500,000', share: '38%', color: 'bg-cyan-500' },
                { name: 'SME Micro-Credit Vault', balance: '$14,200,000', share: '29%', color: 'bg-emerald-500' },
                { name: 'Protocol R&D Reserve', balance: '$9,100,000', share: '19%', color: 'bg-purple-500' },
                { name: 'Systemic Stability Buffer', balance: '$6,450,000', share: '14%', color: 'bg-amber-500' },
              ].map((pool, idx) => (
                <div key={idx} className="p-3 bg-gray-950/60 border border-gray-800/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-200">{pool.name}</span>
                    <span className="font-bold text-white">{pool.balance}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div style={{ width: pool.share }} className={`h-full ${pool.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Dividend Yield Simulator */}
          <div className="p-6 bg-gray-900/80 border border-gray-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" />
                Citizen Dividend Calculator
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                8.45% APY
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Citizens participating in governance receive monthly dividends from protocol surpluses and loan repayments.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-gray-400 flex justify-between">
                  <span>Staked Capital ($)</span>
                  <span className="text-white font-mono font-medium">${stakeAmount.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={stakeAmount}
                  onChange={e => setStakeAmount(Number(e.target.value))}
                  className="w-full mt-2 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Est. Annual Democratic Dividend</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">+${estimatedAnnualYield}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Monthly Payout</span>
                  <span className="text-sm font-semibold text-white font-mono">
                    +${(parseFloat(estimatedAnnualYield) / 12).toFixed(2)}/mo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Governance Principles Guide */}
          <div className="p-5 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl space-y-3 text-xs text-gray-400">
            <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              Sovereign Charter Principles
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>1 citizen = 1 cryptographic identity weight base.</li>
              <li>Quorum requires at least 60% affirmative majority.</li>
              <li>Funds release occurs automatically via smart contract escrow.</li>
              <li>Zero hidden fees or private bank board veto power.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* New Proposal Modal */}
      {isNewProposalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-400" />
                Submit Sovereign Referendum
              </h2>
              <button
                onClick={() => setIsNewProposalModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Expand High-Yield Community Green Energy Bonds"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Grants">Grants</option>
                    <option value="Protocol">Protocol</option>
                    <option value="Liquidity">Liquidity</option>
                    <option value="Ethics">Ethics</option>
                    <option value="Treasury">Treasury</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Requested Funds ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={requestedFunds}
                    onChange={e => setRequestedFunds(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">Detailed Description & Execution Milestones</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Outline the operational justification, recipient accounts, risk mitigations, and community ROI..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProposalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-900/30 transition"
                >
                  Publish for Voting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDemocracyView;
