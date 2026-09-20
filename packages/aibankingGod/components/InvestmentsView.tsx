
import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import InvestmentsPortfolio from './InvestmentsPortfolio';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InvestmentsView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { simulationData } = context;

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8">
        <InvestmentsPortfolio />
      </div>
      <div className="col-span-12 lg:col-span-4 space-y-8">
         <Card title="Performance Projection" subtitle="Neural market simulations">
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulationData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis dataKey="time" hide />
                     <YAxis hide />
                     <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                     <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.1} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="pt-6 border-t border-gray-800 space-y-4">
               <p className="text-xs text-gray-500 italic">"Based on current volatility vectors, your portfolio exhibits an 84.2% probability of achieving a 12% annualized return."</p>
               <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest rounded-xl transition-all">RECALIBRATE PROJECTION</button>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default InvestmentsView;
