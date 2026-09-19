'use client';

import { BarChart, MessageSquare, Users, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import SetupRequired from '@/components/SetupRequired';

const BUSINESS_ID = 'd1b7d59b-134e-4f10-8646-6b2c2eb949b2'; // Demo Business

export default function DashboardOverview() {
  const [setupRequired, setSetupRequired] = useState(false);
  const [counts, setCounts] = useState({
    conversations: 0,
    leads: 0,
    customers: 0
  });
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [convRes, leadsRes, custRes] = await Promise.all([
          supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('business_id', BUSINESS_ID),
          supabase.from('leads').select('id', { count: 'exact', head: true }).eq('business_id', BUSINESS_ID),
          supabase.from('customers').select('id', { count: 'exact', head: true }).eq('business_id', BUSINESS_ID),
        ]);

        if (convRes.error) {
          if (convRes.error.code === '42P01' || convRes.error.message?.includes("Could not find the table")) {
            setSetupRequired(true);
            return;
          }
        }

        setCounts({
          conversations: convRes.count || 0,
          leads: leadsRes.count || 0,
          customers: custRes.count || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [supabase]);

  if (setupRequired) {
    return <SetupRequired />;
  }

  const stats = [
    { name: 'Total Conversations', value: loading ? '-' : counts.conversations.toString(), change: '+12%', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Total Leads', value: loading ? '-' : counts.leads.toString(), change: '+18%', icon: UserPlus, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Total Customers', value: loading ? '-' : counts.customers.toString(), change: '+4%', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'AI Handling Rate', value: '71%', change: '+5%', icon: BarChart, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-gray-400 mt-1">Here's what's happening across all your channels today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="p-6 rounded-2xl bg-[#111] border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-emerald-400 text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#111] border border-white/5 min-h-[300px]">
            <h3 className="text-lg font-semibold mb-6">Channel Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-pink-500" />
                  <span className="text-gray-300">Instagram</span>
                </div>
                <span className="font-medium">41%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-300">WhatsApp</span>
                </div>
                <span className="font-medium">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-300">Website</span>
                </div>
                <span className="font-medium">17%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-300">Gmail</span>
                </div>
                <span className="font-medium">10%</span>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-[#111] border border-white/5 min-h-[300px] flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                <BarChart className="w-8 h-8 text-indigo-400" />
             </div>
             <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
             <p className="text-gray-400 max-w-sm mb-6">Connect more channels to see rich historical data and conversation insights.</p>
             <button className="px-6 py-2 bg-white text-black font-medium rounded-full text-sm hover:bg-gray-200 transition-colors">
               View Reports
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
