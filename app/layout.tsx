import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { LayoutDashboard, Wallet, Briefcase, Users } from 'lucide-react';
import LogoutButton from './components/LogoutButton';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Automondo Workspace",
  description: "Secure Finance & CRM Management",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has('admin_auth');
  const isClient = cookieStore.has('client_auth');

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f4f6f9] flex flex-col md:flex-row min-h-screen selection:bg-[#f7b718] selection:text-black`}>
        
        {isAdmin && (
          <aside className="w-full md:w-72 md:sticky md:top-0 md:h-screen bg-[#161616] text-slate-300 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.1)] border-b md:border-b-0 md:border-r border-[#2a2a2a] z-20 shrink-0 relative overflow-hidden">
            
            {/* Effet de lumière discret f l'arrière plan */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f7b718]/5 rounded-full blur-2xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>

            <div className="p-4 md:p-8 border-b border-[#2a2a2a] relative flex justify-center items-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f7b718] to-[#e5a60b]"></div>
              <div className="flex flex-col items-center justify-center w-full pt-2">
                <img 
                  src="/api/portal?asset=logo.png" 
                  onError={(e) => { e.currentTarget.src = '/api/portal?asset=looogo.PNG'; }}
                  alt="Automondo Logo" 
                  className="w-36 md:w-44 object-contain drop-shadow-xl mb-3" 
                />
                <p className="text-[9px] md:text-[10px] text-[#f7b718] uppercase tracking-[0.25em] font-bold bg-[#f7b718]/10 px-3 py-1 rounded-full">
                  Admin Workspace
                </p>
              </div>
            </div>
            
            <nav className="flex md:flex-col gap-2 px-4 py-3 md:py-6 overflow-x-auto md:overflow-y-auto scrollbar-hide relative z-10">
              <Link href="/" className="flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-[#f7b718]/10 hover:text-[#f7b718] transition-all group">
                <LayoutDashboard size={18} className="text-gray-400 group-hover:text-[#f7b718] transition-colors" /> 
                <span className="font-bold text-sm md:text-base">Dashboard</span>
              </Link>
              <Link href="/dinar" className="flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-[#f7b718]/10 hover:text-[#f7b718] transition-all group">
                <Wallet size={18} className="text-gray-400 group-hover:text-[#f7b718] transition-colors" /> 
                <span className="font-bold text-sm md:text-base">Dinar Ledger</span>
              </Link>
              <Link href="/dirham" className="flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-[#f7b718]/10 hover:text-[#f7b718] transition-all group">
                <Briefcase size={18} className="text-gray-400 group-hover:text-[#f7b718] transition-colors" /> 
                <span className="font-bold text-sm md:text-base">Dirham Ledger</span>
              </Link>
              <Link href="/clients" className="flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-[#f7b718]/10 hover:text-[#f7b718] transition-all group">
                <Users size={18} className="text-gray-400 group-hover:text-[#f7b718] transition-colors" /> 
                <span className="font-bold text-sm md:text-base">Client CRM</span>
              </Link>
            </nav>

            <div className="hidden md:block p-6 border-t border-[#2a2a2a] bg-[#111111] mt-auto relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f7b718] to-[#d4980a] rounded-full flex items-center justify-center text-[#161616] font-black shadow-[0_0_15px_rgba(247,183,24,0.3)]">A</div>
                <div>
                  <p className="text-sm font-bold text-white">Admin User</p>
                  <p className="text-xs text-[#f7b718] font-medium">System Manager</p>
                </div>
              </div>
            </div>
            
          </aside>
        )}

        <main className="flex-1 w-full overflow-y-auto relative">
          {children}
          {(isAdmin || isClient) && <LogoutButton />}
        </main>

      </body>
    </html>
  );
}