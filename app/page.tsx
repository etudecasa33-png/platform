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
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Business Overview</h1>
      
      {/* This is the main container. 
        'flex flex-col' forces EVERYTHING to stack perfectly vertically.
      */}
      <div className="flex flex-col gap-6">
        
        {/* 1. DINAR BALANCE - Horizontal Row */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Wallet className="text-green-500" size={28} />
            </div>
            <h2 className="text-xl text-gray-600 font-medium">Dinar Balance</h2>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-green-600 break-all md:text-right">
            {stats.totalDzd.toLocaleString()} DZD
          </p>
        </div>

        {/* 2. DIRHAM BALANCE - Horizontal Row */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Coins className="text-blue-500" size={28} />
            </div>
            <h2 className="text-xl text-gray-600 font-medium">Dirham Balance</h2>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-blue-600 break-all md:text-right">
            {stats.totalDirham.toLocaleString()} DH
          </p>
        </div>

        {/* 3. TOTAL CLIENTS - Vertical Box */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-500 font-medium">Total Clients</h2>
            <Users className="text-purple-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-gray-800">{stats.clientsCount}</p>
        </div>

        {/* 4. ACTIVE CONTRACTS - Vertical Box */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-500 font-medium">Active Contracts</h2>
            <FileText className="text-orange-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-gray-800">{stats.contractsCount}</p>
        </div>

      </div>
    </div>
  );
}