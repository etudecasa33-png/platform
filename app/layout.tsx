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
  title: "AUTOMONDO Workspace",
  description: "Secure Finance & CRM Management",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has('admin_auth');
  const isClient = cookieStore.has('client_auth');

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 flex flex-col md:flex-row min-h-screen`}>
        
        {isAdmin && (
          <aside className="w-full md:w-72 md:h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-300 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.05)] border-b md:border-b-0 md:border-r border-slate-800 z-20 shrink-0">
            
            <div className="p-4 md:p-8 border-b border-slate-800/60 relative overflow-hidden flex justify-between items-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div>
                <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter">
                  AUTO<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MONDO</span>
                </h1>
                <p className="text-[9px] md:text-[10px] text-slate-500 mt-1 uppercase tracking-[0.25em] font-bold">
                  Workspace
                </p>
              </div>
            </div>
            
            <nav className="flex md:flex-col gap-2 px-4 py-3 md:py-6 overflow-x-auto md:overflow-y-auto scrollbar-hide">
              <Link href="/" className="flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-slate-800/50 hover:text-white hover:shadow-inner transition-all group">
                <LayoutDashboard size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" /> 
                <span className="font-medium text-sm md:text-base">Dashboard</span>
              </Link>
              <Link href="/dinar" className="flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-slate-800/50 hover:text-white hover:shadow-inner transition-all group">
                <Wallet size={18} className="text-slate-400 group-hover:text-emerald-400 transition-colors" /> 
                <span className="font-medium text-sm md:text-base">Dinar Ledger</span>
              </Link>
              <Link href="/dirham" className="flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-slate-800/50 hover:text-white hover:shadow-inner transition-all group">
                <Briefcase size={18} className="text-slate-400 group-hover:text-purple-400 transition-colors" /> 
                <span className="font-medium text-sm md:text-base">Dirham Ledger</span>
              </Link>
              <Link href="/clients" className="flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-slate-800/50 hover:text-white hover:shadow-inner transition-all group">
                <Users size={18} className="text-slate-400 group-hover:text-orange-400 transition-colors" /> 
                <span className="font-medium text-sm md:text-base">Client CRM</span>
              </Link>
            </nav>

            <div className="hidden md:block p-6 border-t border-slate-800/60 bg-slate-950/50 mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">A</div>
                <div>
                  <p className="text-sm font-bold text-white">Admin User</p>
                  <p className="text-xs text-slate-400">System Manager</p>
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