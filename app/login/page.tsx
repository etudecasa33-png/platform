"use client";
import { useState } from 'react';
import { User, Key, ShieldCheck, LogIn } from 'lucide-react';

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
    <div className="h-screen w-full bg-[#f4f6f9] flex items-center justify-center p-4 selection:bg-[#f7b718] selection:text-black font-sans relative overflow-hidden">
      
      {/* Subtle luxury background elements */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#e5e9f0] to-transparent pointer-events-none"></div>
      
      {/* Card: Removed scroll, increased padding and size */}
      <div className="bg-white max-w-[28rem] w-full p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10">
        
        <div className="flex flex-col items-center mb-8 relative">
          
          {/* SLIM BLACK BACKGROUND WITH GOLDEN ACCENT - Increased logo size */}
          <div className="w-full bg-[#161616] rounded-xl flex items-center justify-center py-3.5 px-4 mb-6 shadow-md border-b-[3px] border-[#f7b718]">
            <img 
              src="/api/portal?asset=logo.png" 
              onError={(e) => { e.currentTarget.src = '/api/portal?asset=looogo.PNG'; }}
              alt="Automondo Logo" 
              className="w-44 h-auto object-contain drop-shadow-lg"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 text-center tracking-tight">
            Automondo <span className="text-[#f7b718]">Portal</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1.5 text-center text-sm sm:text-base">
            Access your secure client workspace
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold text-center mb-6 flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200">
            <ShieldCheck className="text-red-500 shrink-0" size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#f7b718]">
                <User size={18} className="text-gray-400 group-focus-within:text-[#f7b718] transition-colors" />
              </div>
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-11 pr-4 rounded-xl focus:ring-2 focus:ring-[#f7b718] focus:border-[#f7b718] focus:bg-white outline-none transition-all text-base font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-medium shadow-sm"
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#f7b718]">
                <Key size={18} className="text-gray-400 group-focus-within:text-[#f7b718] transition-colors" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-11 pr-4 rounded-xl focus:ring-2 focus:ring-[#f7b718] focus:border-[#f7b718] focus:bg-white outline-none transition-all text-base font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-medium shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#f7b718] to-[#e5a60b] hover:from-[#e5a60b] hover:to-[#d4980a] text-[#161616] font-black py-4 rounded-xl transition-all shadow-[0_8px_20px_-6px_rgba(247,183,24,0.4)] disabled:opacity-70 mt-8 text-base sm:text-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#161616]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              <>
                <LogIn size={20} strokeWidth={2.5} /> Secure Login
              </>
            )}
          </button>
        </form>
        
      </div>
    </div>
  );
}