"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Building2, ChevronRight, Mail, Phone, Pencil, Trash2, X, Key, AlignLeft } from 'lucide-react';

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  password: string | null;
  notes: string | null; // or remarques, matching your Prisma schema
};

export default function ClientsDirectoryPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // --- MODAL STATES ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  
  // The restored form state including password and remarques
  const defaultForm = { name: '', email: '', phone: '', address: '', password: '', remarques: '' };
  const [formState, setFormState] = useState(defaultForm);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (Array.isArray(data)) setClients(data);
      else setClients([]);
    } catch (error) {
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  // --- CREATE NEW CLIENT ---
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState)
    });
    setIsCreateModalOpen(false);
    setFormState(defaultForm);
    fetchClients();
  };

  // --- EDIT CLIENT ---
  const openEditModal = (client: Client) => {
    setEditingClientId(client.id);
    setFormState({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      password: client.password || '',
      remarques: client.notes || '' 
    });
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClientId) return;
    await fetch(`/api/clients/${editingClientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState)
    });
    setEditingClientId(null);
    setFormState(defaultForm);
    fetchClients();
  };

  // --- DELETE CLIENT ---
  const handleDeleteClient = async (id: string, name: string) => {
    if (window.confirm(`Delete ${name} and all their data permanently?`)) {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      fetchClients();
    }
  };

  // --- SEARCH FILTER ---
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen relative">
      
      {/* HEADER & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Client Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your clients, contracts, and billing.</p>
        </div>
        
        {/* RESTORED: This now opens a modal instead of going to a dead link */}
        <button 
          onClick={() => { setFormState(defaultForm); setIsCreateModalOpen(true); }}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Plus size={18} /> New Client
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search clients by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
        </div>
      </div>

      {/* CLIENTS LIST (Card Grid) */}
      {!isLoading && filteredClients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredClients.map((client) => (
            <div key={client.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition group flex flex-col h-full relative">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4 min-w-0 pr-12">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0"><Building2 size={24} /></div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 truncate">{client.name}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">ID: {client.id.substring(client.id.length - 6)}</p>
                  </div>
                </div>
                <div className="absolute top-5 right-5 flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(client)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={16}/></button>
                  <button onClick={() => handleDeleteClient(client.id, client.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                </div>
              </div>

              <div className="space-y-2 mt-auto pt-4 border-t border-gray-100 mb-5">
                {client.email && <p className="text-sm text-gray-600 flex items-center gap-2 truncate"><Mail size={14} className="text-gray-400 shrink-0" /> {client.email}</p>}
                {client.phone && <p className="text-sm text-gray-600 flex items-center gap-2 truncate"><Phone size={14} className="text-gray-400 shrink-0" /> {client.phone}</p>}
                {client.password && <p className="text-sm text-gray-600 flex items-center gap-2 truncate"><Key size={14} className="text-gray-400 shrink-0" /> {client.password}</p>}
              </div>

              <Link href={`/clients/${client.id}`} className="mt-auto bg-gray-50 text-gray-600 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 hover:bg-blue-50 hover:text-blue-700 transition">
                View Full Profile <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ====================================================
          CREATE / EDIT CLIENT MODAL (Restored all fields)
          ==================================================== */}
      {(isCreateModalOpen || editingClientId) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
              <h3 className="text-xl font-bold">{editingClientId ? 'Edit Client' : 'Create New Client'}</h3>
              <button onClick={() => { setIsCreateModalOpen(false); setEditingClientId(null); }} className="text-slate-400 hover:text-white transition"><X size={24}/></button>
            </div>

            <form onSubmit={editingClientId ? handleUpdateClient : handleCreateClient} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Company / Client Name *</label>
                  <input type="text" required value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input type="email" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                  <input type="text" value={formState.phone} onChange={e => setFormState({...formState, phone: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                  <input type="text" value={formState.address} onChange={e => setFormState({...formState, address: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  {/* RESTORED PASSWORD FIELD */}
                  <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                  <input type="text" value={formState.password} onChange={e => setFormState({...formState, password: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="sm:col-span-2">
                  {/* RESTORED REMARQUES FIELD */}
                  <label className="block text-sm font-bold text-gray-700 mb-1">Remarques / Notes</label>
                  <textarea value={formState.remarques} onChange={e => setFormState({...formState, remarques: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end shrink-0">
                <button type="button" onClick={() => { setIsCreateModalOpen(false); setEditingClientId(null); }} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">{editingClientId ? 'Save Changes' : 'Create Client'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}