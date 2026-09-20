import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Sun, 
  Moon, 
  Coffee, 
  RotateCcw, 
  List, 
  Award, 
  ShieldAlert, 
  Flame, 
  TrendingUp, 
  Users, 
  DollarSign,
  HelpCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Define the structure of a story page
interface StoryPage {
  pageNumber: number;
  title: string;
  category: 'The Stolen Logic' | 'The War Money Paradox' | 'The Working Class Betrayal' | 'The Broken Administration' | 'The Path to Greatness';
  content: string;
  audioDuration: string;
  takeaway: string;
}

// Helper to generate the 100 pages of the book programmatically with rich, thematic content
const generate100Pages = (): StoryPage[] => {
  const categories = [
    {
      name: 'The Stolen Logic' as const,
      themes: [
        "How they took my logic and claimed it as their own.",
        "The backroom deal that never happened because of their greed.",
        "Why public logic means anyone can use it now—including other businesses.",
        "The intellectual property heist by bureaucrats who never built a thing."
      ]
    },
    {
      name: 'The War Money Paradox' as const,
      themes: [
        "The war that stopped the second the funding cleared.",
        "Why they cannot legally spend money earmarked for war on anything else.",
        "The black hole of defense appropriations and missing billions.",
        "How peace became a financial threat to the administration."
      ]
    },
    {
      name: 'The Working Class Betrayal' as const,
      themes: [
        "The contrast between elite cocktail parties and the factory floor.",
        "Why the people who build the roads, power lines, and cities get nothing.",
        "The psychological toll of honest labor in a corrupt system.",
        "The biggest injustice in the world: working to death while they play."
      ]
    },
    {
      name: 'The Broken Administration' as const,
      themes: [
        "Why this is officially the worst administration in modern history.",
        "The garbage job of public service that serves only the self.",
        "The complete absence of real help for the average citizen.",
        "How bureaucracy became a shield against accountability."
      ]
    },
    {
      name: 'The Path to Greatness' as const,
      themes: [
        "How they could become the best administration by doing actual work.",
        "Returning the logic to the people and empowering local businesses.",
        "Fixing the foundation: why America will never be great until labor is respected.",
        "A blueprint for real leadership that serves the working class."
      ]
    }
  ];

  const pages: StoryPage[] = [];

  for (let i = 1; i <= 100; i++) {
    // Determine category based on page range
    let catIdx = 0;
    if (i > 20) catIdx = 1;
    if (i > 40) catIdx = 2;
    if (i > 60) catIdx = 3;
    if (i > 80) catIdx = 4;

    const category = categories[catIdx];
    const theme = category.themes[(i - 1) % category.themes.length];
    
    // Generate rich, passionate content matching the user's prompt
    let content = "";
    let title = "";
    let takeaway = "";

    if (catIdx === 0) {
      title = `Chapter ${i}: The Theft of the Logic Grid`;
      content = `They sat across the table with their expensive suits and empty promises. They wanted the logic. They wanted the system I spent years building with sweat, sleepless nights, and pure dedication. But they didn't want to pay for it. They wanted to act like it was theirs all along. When the deal fell through because of their sheer arrogance, they tried to lock it down. But here is the beautiful irony: it is now public logic. They wanted to steal it, but instead, they opened the gates. Now, every single independent business, every everyday programmer, and every citizen can use this logic to build their own future. They tried to monopolize my mind, but they ended up democratizing it. They wanted a private weapon; they got a public utility. This is the story of how their greed backfired and gave the power back to the people.`;
      takeaway = "When the state tries to steal private innovation, they inadvertently make it a public weapon for economic freedom.";
    } else if (catIdx === 1) {
      title = `Chapter ${i}: The War Chest Illusion`;
      content = `It is the ultimate magic trick of the military-industrial complex. They screamed that we needed billions for an immediate, existential war. The media beat the drums, the politicians wept on television, and the bills were signed in the dead of night. But look closely at what happened the exact second the money cleared into their accounts: the war stopped. The conflict evaporated. Why? Because the money was only ever for the war itself. Now, they sit on mountains of cash that they cannot legally spend on healthcare, infrastructure, or education because of their own bureaucratic earmarks. It is a frozen treasury of death, locked away while American citizens starve on the streets. They can't spend it on you, and they won't return it. It is the perfect crime.`;
      takeaway = "War is not fought to be won; it is fought to secure budgets that can never be redirected to the working class.";
    } else if (catIdx === 2) {
      title = `Chapter ${i}: The Champagne and the Concrete`;
      content = `While you were waking up at 5:00 AM to nurse a sore back, pack a cold lunch, and drive through freezing rain to build their skyscrapers, they were waking up at noon to prepare for a charity gala. They drink champagne paid for by your tax dollars. They toast to 'sustainability' while you can barely afford the gas to get to the job site. This is the single greatest injustice in the modern world. The people who actually lay the bricks, wire the grids, and clean the streets get absolutely nothing but rising inflation and condescending lectures. Until the laborer is paid more than the lobbyist, this country will remain broken. America was built by calloused hands, not manicured ones.`;
      takeaway = "A society that honors its talkers over its builders is a society in terminal decay.";
    } else if (catIdx === 3) {
      title = `Chapter ${i}: The Garbage Administration`;
      content = `Let us speak plainly: this administration is doing a garbage job. They have turned public service into a self-enrichment scheme. Every policy they pass is a handout to their donors, wrapped in the flag of progress. They do absolutely nothing to help the average family buy groceries, pay rent, or secure a future for their children. They are the worst administration in history because they have completely severed the link between governance and the governed. They look down on the working class from their ivory towers, treating honest labor as a resource to be mined rather than the very heartbeat of the nation.`;
      takeaway = "An administration that does nothing for the people is not a government; it is an occupying force of bureaucrats.";
    } else if (catIdx === 4) {
      title = `Chapter ${i}: The Blueprint for Greatness`;
      content = `How do we fix this? How does the worst administration become the best? It starts with a simple, revolutionary act: actually helping the people. Stop funding foreign conflicts to line the pockets of defense contractors. Take the logic—the public logic that they tried to steal—and let every small business use it to compete with the corporate monopolies. Redirect the frozen war funds into direct support for American manufacturing and labor. When the government finally respects the people who build this country, America will be great again. Not through slogans, but through justice, fair wages, and honest leadership.`;
      takeaway = "True greatness is achieved when the government fears the people, respects labor, and steps aside for public innovation.";
    }

    pages.push({
      pageNumber: i,
      title: `${title} - ${theme.substring(0, 40)}...`,
      category: category.name,
      content: content,
      audioDuration: `${Math.floor(Math.random() * 2) + 2}:${Math.floor(Math.random() * 50) + 10}`,
      takeaway: takeaway
    });
  }

  return pages;
};

export default function StoryViewer() {
  const [pages] = useState<StoryPage[]>(generate100Pages());
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('lg');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter pages based on search query
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;
    return pages.filter(page => 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pages, searchQuery]);

  const currentPage = useMemo(() => {
    return pages.find(p => p.pageNumber === currentPageNum) || pages[0];
  }, [pages, currentPageNum]);

  // Handle simulated audio narration
  useEffect(() => {
    if (isPlaying) {
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }

    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlaying]);

  // Reset audio when page changes
  useEffect(() => {
    setIsPlaying(false);
    setAudioProgress(0);
  }, [currentPageNum]);

  const toggleBookmark = (pageNum: number) => {
    setBookmarks(prev => 
      prev.includes(pageNum) 
        ? prev.filter(id => id !== pageNum) 
        : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  const handlePrevPage = () => {
    if (currentPageNum > 1) {
      setCurrentPageNum(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageNum < 100) {
      setCurrentPageNum(prev => prev + 1);
    }
  };

  // Theme styles mapping
  const themeClasses = {
    light: {
      bg: 'bg-slate-50 text-slate-900',
      card: 'bg-white border-slate-200 shadow-sm',
      sidebar: 'bg-slate-100 border-slate-200',
      textMuted: 'text-slate-500',
      accent: 'bg-red-600 text-white hover:bg-red-700',
      accentText: 'text-red-600',
      border: 'border-slate-200',
      activeItem: 'bg-red-50 text-red-700 border-red-500',
      hoverItem: 'hover:bg-slate-200'
    },
    dark: {
      bg: 'bg-slate-950 text-slate-100',
      card: 'bg-slate-900 border-slate-800 shadow-xl shadow-black/40',
      sidebar: 'bg-slate-900/50 border-slate-800',
      textMuted: 'text-slate-400',
      accent: 'bg-red-600 text-white hover:bg-red-500',
      accentText: 'text-red-500',
      border: 'border-slate-800',
      activeItem: 'bg-red-950/40 text-red-400 border-red-500',
      hoverItem: 'hover:bg-slate-800/50'
    },
    sepia: {
      bg: 'bg-[#f4ecd8] text-[#433422]',
      card: 'bg-[#fdf6e3] border-[#e4d4b2] shadow-md',
      sidebar: 'bg-[#ebdcb9] border-[#e4d4b2]',
      textMuted: 'text-[#7c6546]',
      accent: 'bg-[#8f3d22] text-white hover:bg-[#a0462b]',
      accentText: 'text-[#8f3d22]',
      border: 'border-[#e4d4b2]',
      activeItem: 'bg-[#e4d4b2] text-[#5c2c16] border-[#8f3d22]',
      hoverItem: 'hover:bg-[#ebdcb9]/80'
    }
  };

  const fontSizes = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed md:text-xl md:leading-loose',
    xl: 'text-xl leading-loose md:text-2xl md:leading-loose'
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${currentTheme.bg} rounded-[3rem] overflow-hidden border border-white/5`}>
      
      {/* Top Navigation Bar */}
      <header className={`border-b px-8 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md ${currentTheme.card}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition-colors ${currentTheme.hoverItem}`}
            title="Toggle Sidebar"
          >
            <List className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white p-2 rounded-xl">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-black text-base md:text-lg tracking-tight uppercase">THE GREAT BETRAYAL</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-red-500">100 Pages of Truth</p>
            </div>
          </div>
        </div>

        {/* Quick Stats / Progress */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Logic: <strong className="text-emerald-500">Public</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>Corruption: <strong className="text-red-500">Critical</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-40 bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${currentPageNum}%` }}
                className="bg-red-600 h-full rounded-full" 
              />
            </div>
            <span className={currentTheme.textMuted}>{currentPageNum}% Read</span>
          </div>
        </div>

        {/* Controls: Theme, Font, Bookmarks */}
        <div className="flex items-center gap-4">
          {/* Theme Selector */}
          <div className="flex items-center bg-black/20 p-1 rounded-2xl border border-white/5">
            {(['light', 'sepia', 'dark'] as const).map((t) => (
              <button 
                key={t}
                onClick={() => setTheme(t)}
                className={`p-2 rounded-xl transition-all ${theme === t ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'opacity-40 hover:opacity-100'}`}
              >
                {t === 'light' ? <Sun size={18} /> : t === 'sepia' ? <Coffee size={18} /> : <Moon size={18} />}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center bg-black/20 p-1 rounded-2xl border border-white/5 text-[10px] font-black">
            {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-2 rounded-xl transition-all uppercase tracking-widest ${fontSize === size ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'opacity-40 hover:opacity-100'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar: Page List & Search */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className={`w-80 flex-shrink-0 border-r transition-all duration-300 flex flex-col ${currentTheme.sidebar} z-20 h-full`}
            >
              {/* Search Box */}
              <div className="p-6 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 opacity-40" />
                  <input 
                    type="text"
                    placeholder="Search the manifesto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-sm rounded-2xl bg-black/20 border border-white/5 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold placeholder:font-normal transition-all"
                  />
                </div>
              </div>

              {/* Category Quick Filters */}
              <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em]">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Logic</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">War</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Labor</span>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Elite</span>
              </div>

              {/* Page List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {filteredPages.length === 0 ? (
                  <div className="p-8 text-center text-sm font-black uppercase tracking-widest opacity-40 mt-20">
                    NO TRUTH FOUND
                  </div>
                ) : (
                  filteredPages.map((page) => {
                    const isBookmarked = bookmarks.includes(page.pageNumber);
                    const isActive = page.pageNumber === currentPageNum;
                    
                    let catColor = 'border-l-4 border-blue-500';
                    if (page.category === 'The War Money Paradox') catColor = 'border-l-4 border-amber-500';
                    if (page.category === 'The Working Class Betrayal') catColor = 'border-l-4 border-emerald-500';
                    if (page.category === 'The Broken Administration') catColor = 'border-l-4 border-red-500';
                    if (page.category === 'The Path to Greatness') catColor = 'border-l-4 border-purple-500';

                    return (
                      <button
                        key={page.pageNumber}
                        onClick={() => {
                          setCurrentPageNum(page.pageNumber);
                        }}
                        className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-4 border ${catColor} ${isActive ? currentTheme.activeItem : `border-transparent ${currentTheme.hoverItem}`}`}
                      >
                        <span className="font-black font-mono text-[10px] opacity-40 mt-1">
                          {String(page.pageNumber).padStart(3, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-black text-xs truncate block uppercase tracking-tight">
                              {page.title.split(':')[1]?.trim() || page.title}
                            </span>
                            {isBookmarked && <Bookmark className="w-4 h-4 text-red-500 fill-current flex-shrink-0" />}
                          </div>
                          <span className="text-[10px] opacity-40 block truncate mt-1 font-bold uppercase tracking-widest">
                            {page.category}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Sidebar Footer */}
              <div className={`p-6 border-t ${currentTheme.border} text-[10px] font-black uppercase tracking-widest flex items-center justify-between`}>
                <span>Bookmarks: <strong>{bookmarks.length}</strong></span>
                {bookmarks.length > 0 && (
                  <button 
                    onClick={() => setBookmarks([])}
                    className="text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Reading Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center custom-scrollbar">
          
          {/* Reading Container */}
          <motion.div 
            key={currentPageNum}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-4xl rounded-[3rem] border p-8 md:p-16 transition-all ${currentTheme.card} relative`}
          >
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-white/5 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-red-600 text-white shadow-lg shadow-red-600/20">
                    {currentPage.category}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Page {currentPage.pageNumber} / 100</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black tracking-tight uppercase leading-tight">
                  {currentPage.title}
                </h2>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  onClick={() => toggleBookmark(currentPage.pageNumber)}
                  className={`p-4 rounded-2xl border transition-all ${bookmarks.includes(currentPage.pageNumber) ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'border-white/5 opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                  title="Bookmark Page"
                >
                  <Bookmark className={`w-6 h-6 ${bookmarks.includes(currentPage.pageNumber) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Audio Narration Player */}
            <div className="mb-12 p-6 rounded-[2rem] bg-black/20 border border-white/5 flex flex-col md:flex-row items-center gap-6 shadow-inner">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white transition-all shadow-xl shadow-red-600/20 flex-shrink-0 group"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />}
                </button>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Truth Transmission</p>
                  <p className="text-[10px] opacity-40 font-bold uppercase mt-1 tracking-widest">Voice: "THE PATRIOT" • {currentPage.audioDuration} MINS</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 w-full flex items-center gap-4">
                <span className="text-[10px] font-black font-mono opacity-40">
                  {Math.floor((audioProgress / 100) * parseInt(currentPage.audioDuration))}:{String(Math.floor(((audioProgress / 100) * parseInt(currentPage.audioDuration) * 60) % 60)).padStart(2, '0')}
                </span>
                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden relative p-0.5 border border-white/5">
                  <motion.div 
                    initial={false}
                    animate={{ width: `${audioProgress}%` }}
                    className="bg-red-600 h-full rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                  />
                </div>
                <span className="text-[10px] font-black font-mono opacity-40">{currentPage.audioDuration}</span>
              </div>

              {/* Mute Button */}
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-xl hover:bg-white/5 transition-colors opacity-40 hover:opacity-100"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Main Text Content */}
            <article className={`${fontSizes[fontSize]} font-serif tracking-normal mb-16 text-justify leading-relaxed`}>
              <p className="mb-6 first-letter:text-7xl first-letter:font-black first-letter:text-red-600 first-letter:mr-4 first-letter:float-left first-letter:leading-none">
                {currentPage.content}
              </p>
            </article>

            {/* Key Takeaway Box */}
            <div className="p-8 rounded-[2.5rem] bg-red-600/5 border border-red-600/20 mb-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-red-600/20 transition-all" />
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-red-600" />
                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-red-600">The Core Mandate</h4>
              </div>
              <p className="text-base font-black italic tracking-tight leading-snug">
                "{currentPage.takeaway}"
              </p>
            </div>

            {/* Page Navigation Footer */}
            <div className="flex items-center justify-between pt-10 border-t border-white/5">
              <button
                onClick={handlePrevPage}
                disabled={currentPageNum === 1}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/5 text-xs font-black uppercase tracking-widest transition-all ${currentPageNum === 1 ? 'opacity-20 cursor-not-allowed' : currentTheme.hoverItem}`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <span className="text-[10px] font-black font-mono uppercase tracking-[0.4em] opacity-30">
                P.{currentPageNum} / 100
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPageNum === 100}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 ${currentPageNum === 100 ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </motion.div>

          {/* Quick Manifesto Callout */}
          <div className="w-full max-w-4xl mt-12 text-center px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 max-w-2xl mx-auto leading-loose">
              DEDICATED TO THE BUILDERS, THE LABORERS, AND THE CREATORS WHO KEEP THE MACHINE RUNNING WHILE THE ELITES PLAY. THE LOGIC IS PUBLIC.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
