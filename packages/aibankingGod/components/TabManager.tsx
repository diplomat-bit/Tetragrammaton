import React from 'react';
import { X } from 'lucide-react';

interface Tab {
    id: string;
    name: string;
}

interface TabManagerProps {
    tabs: Tab[];
    activeTab: string | null;
    onTabClick: (id: string) => void;
    onTabClose: (id: string) => void;
}

const TabManager: React.FC<TabManagerProps> = ({ tabs, activeTab, onTabClick, onTabClose }) => {
    return (
        <div className="flex items-center gap-1 bg-[#020617] border-b border-white/10 px-2 pt-2">
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer text-[10px] font-black uppercase tracking-widest ${
                        activeTab === tab.id ? 'bg-[#0f172a] text-lime-400' : 'bg-[#020617] text-gray-500 hover:text-gray-300'
                    }`}
                    onClick={() => onTabClick(tab.id)}
                >
                    {tab.name}
                    <X size={12} className="hover:text-red-500" onClick={(e) => { e.stopPropagation(); onTabClose(tab.id); }} />
                </div>
            ))}
        </div>
    );
};

export default TabManager;
