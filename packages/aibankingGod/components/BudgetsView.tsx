
import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const BudgetsView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { budgets } = context;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {budgets.map(budget => {
        const percent = Math.min(100, (budget.spent / budget.limit) * 100);
        return (
          <Card key={budget.id} title={budget.name || budget.category} subtitle="Fiscal Surveillance">
             <div className="flex flex-col items-center py-6">
                <div className="relative w-48 h-48">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={[{ value: budget.spent }, { value: Math.max(0, budget.limit - budget.spent) }]}
                            innerRadius={70}
                            outerRadius={90}
                            startAngle={90}
                            endAngle={450}
                            dataKey="value"
                            stroke="none"
                         >
                            <Cell fill={budget.color} />
                            <Cell fill="#1e293b" />
                         </Pie>
                      </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-black text-white">{percent.toFixed(0)}%</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Utilized</p>
                   </div>
                </div>
                <div className="w-full mt-10 space-y-4">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Active Expenditure</p>
                         <p className="text-2xl font-mono font-bold text-white">${budget.spent.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Mandate Limit</p>
                         <p className="text-2xl font-mono font-bold text-gray-400">${budget.limit.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className={`p-3 rounded-xl border text-[10px] font-bold text-center uppercase tracking-widest ${
                      percent > 90 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                   }`}>
                      {percent > 90 ? 'Critical Threshold Warning' : 'Nominal Operational State'}
                   </div>
                </div>
             </div>
          </Card>
        );
      })}
    </div>
  );
};

export default BudgetsView;
