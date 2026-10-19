"use client";
import { useEffect, useState } from 'react';
import { Users, FileText, Wallet, Coins } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDzd: 0,
    totalDirham: 0,
    clientsCount: 0,
    contractsCount: 0
  });

  useEffect(() => {
    fetch('/api/stats', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-[#f7b718] rounded-full"></div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Business Overview</h1>
      </div>
      
      <div className="flex flex-col gap-6">
        
        {/* 1. DINAR BALANCE - Premium Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#f7b718]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-[#161616] rounded-xl border-b-[3px] border-[#f7b718] shadow-lg group-hover:scale-105 transition-transform">
              <Wallet className="text-[#f7b718]" size={28} />
            </div>
            <h2 className="text-xl text-gray-800 font-bold">Dinar Ledger</h2>
          </div>
          <div className="bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
            <p className="text-3xl lg:text-4xl font-black text-gray-900 break-all md:text-right font-sans">
              {stats.totalDzd.toLocaleString('en-US')} <span className="text-lg text-[#f7b718] ml-1">DZD</span>
            </p>
          </div>
        </div>

        {/* 2. DIRHAM BALANCE - Premium Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#f7b718]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-[#161616] rounded-xl border-b-[3px] border-[#f7b718] shadow-lg group-hover:scale-105 transition-transform">
              <Coins className="text-[#f7b718]" size={28} />
            </div>
            <h2 className="text-xl text-gray-800 font-bold">Dirham Ledger</h2>
          </div>
          <div className="bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
            <p className="text-3xl lg:text-4xl font-black text-gray-900 break-all md:text-right font-sans">
              {stats.totalDirham.toLocaleString('en-US')} <span className="text-lg text-[#f7b718] ml-1">DH</span>
            </p>
          </div>
        </div>

        {/* BOTTOM METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 3. TOTAL CLIENTS */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#f7b718]/40 transition-all flex flex-col justify-center group">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-600 font-bold uppercase tracking-wider text-sm">Total Clients</h2>
              <div className="p-2.5 bg-[#161616] rounded-lg shadow-md border-b-2 border-[#f7b718] group-hover:scale-110 transition-transform">
                <Users className="text-[#f7b718]" size={20} />
              </div>
            </div>
            <p className="text-4xl lg:text-5xl font-black text-gray-900">{stats.clientsCount}</p>
          </div>

          {/* 4. ACTIVE CONTRACTS */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#f7b718]/40 transition-all flex flex-col justify-center group">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-600 font-bold uppercase tracking-wider text-sm">Active Contracts</h2>
              <div className="p-2.5 bg-[#161616] rounded-lg shadow-md border-b-2 border-[#f7b718] group-hover:scale-110 transition-transform">
                <FileText className="text-[#f7b718]" size={20} />
              </div>
            </div>
            <p className="text-4xl lg:text-5xl font-black text-gray-900">{stats.contractsCount}</p>
          </div>

        </div>

      </div>
    </div>
  );
}