"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Building2, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

// --- TYPES ---
type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export default function ClientsDirectoryPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH CLIENTS ---
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients');
        const data = await res.json();
        // Check if data is an array (to prevent `.filter` crashes if the API returns an error object)
        if (Array.isArray(data)) {
          setClients(data);
        } else {
          setClients([]);
        }
      } catch (error) {
        console.error("Failed to fetch clients", error);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  // --- THE MAGIC SEARCH FILTER ---
  // This instantly filters the list as you type!
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER SECTION (Responsive stack on mobile) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Client Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your clients, contracts, and billing.</p>
        </div>
        
        {/* ADD CLIENT BUTTON */}
        <Link 
          href="/clients/new" 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Plus size={18} /> New Client
        </Link>
      </div>

      {/* SEARCH BAR SECTION */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search clients by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* CLIENTS LIST (Loading State) */}
      {isLoading && (
        <div className="flex justify-center items-center py-20 text-gray-400 font-bold">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          Loading clients...
        </div>
      )}

      {/* CLIENTS LIST (Empty / No Results State) */}
      {!isLoading && filteredClients.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No clients found</h3>
          <p className="text-gray-500">
            {searchQuery ? `We couldn't find anyone named "${searchQuery}".` : "You haven't added any clients yet."}
          </p>
        </div>
      )}

      {/* CLIENTS LIST (The Responsive Card Grid) */}
      {!isLoading && filteredClients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredClients.map((client) => (
            <Link 
              href={`/clients/${client.id}`} 
              key={client.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition group flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Building2 size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">{client.name}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">ID: {client.id.substring(client.id.length - 6)}</p>
                </div>
              </div>

              <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                {client.email && (
                  <p className="text-sm text-gray-600 flex items-center gap-2 truncate">
                    <Mail size={14} className="text-gray-400 shrink-0" /> {client.email}
                  </p>
                )}
                {client.phone && (
                  <p className="text-sm text-gray-600 flex items-center gap-2 truncate">
                    <Phone size={14} className="text-gray-400 shrink-0" /> {client.phone}
                  </p>
                )}
                {!client.email && !client.phone && (
                  <p className="text-sm text-gray-400 italic">No contact info provided</p>
                )}
              </div>

              {/* View Profile Button at the bottom of the card */}
              <div className="mt-5 bg-gray-50 text-gray-600 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                View Profile <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}