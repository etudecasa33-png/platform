"use client";
import { useState } from 'react';
import { User, Key, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

   if (res.ok) {
      const data = await res.json();
      // If it's a client, send them to their special portal. If Admin, send to dashboard.
      if (data.role === 'client') {
        window.location.href = '/portal';
      } else {
        window.location.href = '/'; 
      }
    } else { 
      const data = await res.json();
      setError(data.error || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      <div className="bg-white max-w-md w-full p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white/50 relative overflow-hidden">
        
        {/* Decorative background blur effects for a modern look */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          
          {/* REDUCED BLACK BACKGROUND: Slimmer, sleeker, with a subtle gradient */}
          <div className="w-full bg-gradient-to-b from-[#1a1d24] to-[#121419] rounded-2xl flex items-center justify-center py-3.5 mb-6 shadow-lg border border-slate-800">
            <img 
              src="/api/portal?asset=logo.png" 
              onError={(e) => { e.currentTarget.src = '/api/portal?asset=looogo.PNG'; }}
              alt="AutoMondo Logo" 
              className="w-44 object-contain drop-shadow-md"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 text-center tracking-tight">AutoMondo Portal</h1>
          <p className="text-slate-500 font-medium mt-2 text-center text-sm sm:text-base">Please log in to your secure workspace.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold text-center mb-6 flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200">
            <ShieldCheck className="text-red-500 shrink-0" size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-11 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition font-medium text-slate-800 placeholder:text-slate-400"
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key size={18} className="text-slate-400" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-11 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition font-medium text-slate-800 placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200/50 disabled:opacity-70 mt-6 text-base sm:text-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              <>
                <ShieldCheck size={20} /> Secure Login
              </>
            )}
          </button>
        </form>
        
      </div>
    </div>
  );
}