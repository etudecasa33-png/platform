"use client";
import { useEffect, useState } from 'react';
import { Users, FileText, Wallet, Coins, TrendingUp, Sparkles, CalendarDays } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDzd: 0,
    totalDirham: 0,
    clientsCount: 0,
    contractsCount: 0
  });

  const [date, setDate] = useState('');

  useEffect(() => {
    fetch('/api/stats', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
      
    // Set today's date
    const today = new Date();
    setDate(today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto font-sans">
      
      {/* --- VIP WELCOME BANNER --- */}
      <div className="bg-[#161616] rounded-[2rem] p-8 sm:p-10 mb-8 shadow-2xl border border-[#2a2a2a] relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f7b718]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Welcome back, <span className="text-[#f7b718]">Admin</span> 👋
            </h1>
            <p className="text-gray-400 font-medium max-w-lg">
              Here is what's happening in your AutoMondo workspace today. Manage your finances and clients efficiently.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3 shrink-0">
            <div className="p-2 bg-white/10 rounded-lg text-gray-300">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Today's Date</p>
              <p className="text-sm font-bold text-white">{date}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- STATS GRID --- */}
      <div className="flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. DINAR BALANCE - Luxury Card with Watermark */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#f7b718]/40 transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Watermark Icon */}
            <Wallet className="absolute -right-6 -bottom-6 w-40 h-40 text-gray-100 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 z-0" />
            
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[#161616] rounded-xl border-b-[3px] border-[#f7b718] shadow-lg">
                  <Wallet className="text-[#f7b718]" size={24} />
                </div>
                <div>
                  <h2 className="text-xl text-gray-800 font-black tracking-tight">Dinar Ledger</h2>
                  <p className="text-sm text-gray-500 font-medium">Total DZD Balance</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-100">
                <TrendingUp size={16} /> 
              </div>
            </div>
            
            <div className="relative z-10 mt-auto">
              <p className="text-4xl lg:text-5xl font-black text-gray-900 break-all font-sans tracking-tight">
                {stats.totalDzd.toLocaleString('en-US')} <span className="text-xl text-[#f7b718] font-bold ml-1">DZD</span>
              </p>
            </div>
          </div>

          {/* 2. DIRHAM BALANCE - Luxury Card with Watermark */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#f7b718]/40 transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Watermark Icon */}
            <Coins className="absolute -right-6 -bottom-6 w-40 h-40 text-gray-100 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 z-0" />
            
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[#161616] rounded-xl border-b-[3px] border-[#f7b718] shadow-lg">
                  <Coins className="text-[#f7b718]" size={24} />
                </div>
                <div>
                  <h2 className="text-xl text-gray-800 font-black tracking-tight">Dirham Ledger</h2>
                  <p className="text-sm text-gray-500 font-medium">Total DH Balance</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-bold border border-blue-100">
                <TrendingUp size={16} /> 
              </div>
            </div>
            
            <div className="relative z-10 mt-auto">
              <p className="text-4xl lg:text-5xl font-black text-gray-900 break-all font-sans tracking-tight">
                {stats.totalDirham.toLocaleString('en-US')} <span className="text-xl text-[#f7b718] font-bold ml-1">DH</span>
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 3. TOTAL CLIENTS */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-[#f7b718]/40 transition-all flex flex-col justify-center group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#161616]"></div>
            <div className="flex items-center justify-between mb-6 pl-4">
              <div>
                <h2 className="text-gray-800 font-black text-lg">Total Clients</h2>
                <p className="text-gray-500 text-sm font-medium">Registered in CRM</p>
              </div>
              <div className="p-3 bg-[#161616] rounded-xl shadow-md border-b-[3px] border-[#f7b718] group-hover:scale-110 transition-transform">
                <Users className="text-[#f7b718]" size={22} />
              </div>
            </div>
            <p className="text-5xl font-black text-gray-900 pl-4">{stats.clientsCount}</p>
          </div>

          {/* 4. ACTIVE CONTRACTS */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-[#f7b718]/40 transition-all flex flex-col justify-center group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f7b718]"></div>
            <div className="flex items-center justify-between mb-6 pl-4">
              <div>
                <h2 className="text-gray-800 font-black text-lg">Active Contracts</h2>
                <p className="text-gray-500 text-sm font-medium">Ongoing operations</p>
              </div>
              <div className="p-3 bg-[#161616] rounded-xl shadow-md border-b-[3px] border-[#f7b718] group-hover:scale-110 transition-transform">
                <FileText className="text-[#f7b718]" size={22} />
              </div>
            </div>
            <p className="text-5xl font-black text-gray-900 pl-4">{stats.contractsCount}</p>
          </div>

        </div>

      </div>
    </div>
  );
}