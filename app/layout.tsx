import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { LayoutDashboard, Wallet, Briefcase, Users } from 'lucide-react';
import LogoutButton from './components/LogoutButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "AUTOMONDO Workspace",
  description: "Secure Finance & CRM Management",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Check the security keys!
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has('admin_auth');
  const isClient = cookieStore.has('client_auth');

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 flex h-screen overflow-hidden`}>
        
        {/* ONLY RENDER SIDEBAR IF IT IS THE ADMIN (YOU) */}
       {/* ONLY RENDER SIDEBAR IF IT IS THE ADMIN (YOU) */}
        {isAdmin && (
          <aside className="w-72 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-300 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.05)] border-r border-slate-800 z-10">
            
            {/* Upgraded Logo Section */}
            <div className="p-8 border-b border-slate-800/60 relative overflow-hidden">
              {/* Subtle background glow effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              
              <h1 className="text-3xl font-black text-white tracking-tighter">
                AUTO<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MONDO</span>
              </h1>
              <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-[0.25em] font-bold">
                Workspace
              </p>
            </div>
            
            {/* Upgraded Navigation Menu */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white hover:shadow-inner transition-all group">
                <LayoutDashboard size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" /> 
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link href="/dinar" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white hover:shadow-inner transition-all group">
                <Wallet size={20} className="text-slate-400 group-hover:text-emerald-400 transition-colors" /> 
                <span className="font-medium">Dinar Ledger</span>
              </Link>
              <Link href="/dirham" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white hover:shadow-inner transition-all group">
                <Briefcase size={20} className="text-slate-400 group-hover:text-purple-400 transition-colors" /> 
                <span className="font-medium">Dirham Ledger</span>
              </Link>
              <Link href="/clients" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white hover:shadow-inner transition-all group">
                <Users size={20} className="text-slate-400 group-hover:text-orange-400 transition-colors" /> 
                <span className="font-medium">Client CRM</span>
              </Link>
            </nav>

            {/* Upgraded User Profile Section */}
         {/* Upgraded User Profile Section */}
            <div className="p-6 border-t border-slate-800/60 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                  A
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Admin User</p>
                  <p className="text-xs text-slate-400">System Manager</p>
                </div>
              </div>
            </div>
            
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {children}
          
          {/* Show the Logout button for BOTH Admin and Clients */}
          {(isAdmin || isClient) && <LogoutButton />}
        </main>

      </body>
    </html>
  );
}