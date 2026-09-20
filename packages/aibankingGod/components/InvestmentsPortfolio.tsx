
import React, { useContext, useMemo, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { PortfolioAsset } from '../types';

const COLORS = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const InvestmentsPortfolio: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { assets } = context;

  const totalValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

  return (
    <Card title="Institutional Portfolio" subtitle="Multi-asset classification and risk vectors">
      <div className="space-y-8">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assets}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {assets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Asset Allocation Ledger</h4>
          {assets.map((asset, i) => (
            <div key={asset.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: asset.color || COLORS[i % COLORS.length] }}></div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{asset.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono uppercase">{asset.assetClass}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-white">${asset.value.toLocaleString()}</p>
                <p className={`text-[10px] font-bold ${asset.performanceYTD >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.performanceYTD >= 0 ? '+' : ''}{asset.performanceYTD}% YTD
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-800">
           <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Portfolio Beta</p>
                <p className="text-2xl font-mono font-bold text-white">1.12</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Sharpe Ratio</p>
                <p className="text-2xl font-mono font-bold text-indigo-400">2.45</p>
              </div>
           </div>
        </div>
      </div>
    </Card>
  );
};

export default InvestmentsPortfolio;
