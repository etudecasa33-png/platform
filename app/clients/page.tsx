"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Building2, ChevronRight, Mail, Phone, Pencil, Trash2, X, Key, FileText, FileCheck } from 'lucide-react';

import AutoMondoDocument from '../components/AutoMondoDocument';

type Invoice = { id: string; title: string; currency: string; totalAmount: number; paidAmount: number; createdAt: string; invoiceNumber?: string; metadata?: any; };
type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  password: string | null;
  notes: string | null; 
  invoices?: Invoice[]; 
};

export default function ClientsDirectoryPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  
  const [generatedDoc, setGeneratedDoc] = useState<{type: 'INVOICE' | 'RECEIPT', data: Invoice, clientName: string} | null>(null);

  const defaultForm = { name: '', email: '', phone: '', address: '', password: '', notes: '', idNumber: '', amount: '', currency: 'DZD', itemDescription: '' };
  const [formState, setFormState] = useState(defaultForm);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch { setClients([]); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchClients(); }, []);

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

  const openEditModal = (client: Client) => {
    setEditingClientId(client.id);
    setFormState({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      password: client.password || '',
      notes: client.notes || '',
      idNumber: '', amount: '', currency: 'DZD', itemDescription: '' 
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

  const handleDeleteClient = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${name} permanently?`)) {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      fetchClients();
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen bg-[#f4f6f9] font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-10 bg-[#f7b718] rounded-full hidden sm:block"></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Client Directory</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your clients, contracts, and billing.</p>
          </div>
        </div>
        <button 
          onClick={() => { setFormState(defaultForm); setIsCreateModalOpen(true); }} 
          className="w-full sm:w-auto bg-[#161616] hover:bg-black text-[#f7b718] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus size={18} strokeWidth={3} /> New Client
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="relative w-full max-w-xl group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#f7b718]">
            <Search size={20} className="text-gray-400 group-focus-within:text-[#f7b718] transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search clients by name..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#f7b718] focus:border-[#f7b718] outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400 shadow-sm" 
          />
        </div>
      </div>

      {/* CLIENT CARDS GRID */}
      {!isLoading && filteredClients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredClients.map((client) => (
            <div 
              key={client.id} 
              onClick={() => router.push(`/clients/${client.id}`)}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#f7b718]/60 transition-all duration-300 group flex flex-col h-full relative cursor-pointer overflow-hidden"
            >
              
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-start gap-4 min-w-0 pr-12">
                    {/* VIP AutoMondo Icon */}
                    <div className="bg-[#161616] p-3 rounded-xl border-b-[3px] border-[#f7b718] text-[#f7b718] shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <Building2 size={24} />
                    </div>
                    <div className="min-w-0 pt-1">
                      <h2 className="text-lg font-black text-gray-900 truncate tracking-tight">{client.name}</h2>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {client.id.substring(client.id.length - 6)}</p>
                    </div>
                  </div>
                  
                  {/* Colorful Action Buttons */}
                  <div className="absolute top-5 right-5 flex gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(client); }} className="p-2 bg-gray-50 text-blue-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-500 hover:text-white rounded-lg transition-colors z-10 shadow-sm">
                      <Pencil size={16}/>
                    </button>
                    <button onClick={(e) => handleDeleteClient(e, client.id, client.name)} className="p-2 bg-gray-50 text-red-600 border border-gray-200 hover:border-red-300 hover:bg-red-500 hover:text-white rounded-lg transition-colors z-10 shadow-sm">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 mt-auto pt-4 border-t border-gray-100 mb-4">
                  {client.email && <p className="text-sm text-gray-600 flex items-center gap-2.5 truncate font-medium"><Mail size={16} className="text-gray-400 shrink-0" /> {client.email}</p>}
                  {client.phone && <p className="text-sm text-gray-600 flex items-center gap-2.5 truncate font-medium"><Phone size={16} className="text-gray-400 shrink-0" /> {client.phone}</p>}
                  {client.password && <p className="text-sm text-gray-600 flex items-center gap-2.5 truncate font-medium"><Key size={16} className="text-gray-400 shrink-0" /> {client.password}</p>}
                </div>

                {/* --- COLORFUL INVOICE & RECEIPT BUTTONS --- */}
                {client.invoices && client.invoices.length > 0 && (
                  <div className="mb-2 flex flex-col gap-2.5">
                    {client.invoices.map((inv) => (
                      <div key={inv.id} className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setGeneratedDoc({ type: 'INVOICE', data: inv, clientName: client.name }); }} 
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                        >
                          <FileText size={14}/> Invoice
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setGeneratedDoc({ type: 'RECEIPT', data: inv, clientName: client.name }); }} 
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                        >
                          <FileCheck size={14}/> Receipt
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* VIP Footer */}
              <div className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold py-3.5 flex items-center justify-center gap-2 group-hover:bg-[#161616] group-hover:text-[#f7b718] transition-colors border-t border-gray-100 group-hover:border-[#161616]">
                View Full Profile <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CREATE / EDIT MODAL --- */}
      {(isCreateModalOpen || editingClientId) && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col border border-gray-200">
            
            {/* VIP MODAL HEADER */}
            <div className="bg-[#161616] p-6 flex justify-between items-center text-white shrink-0 border-b-[3px] border-[#f7b718]">
              <h3 className="text-xl font-black tracking-tight">{editingClientId ? 'Edit Client Details' : 'Create New Client'}</h3>
              <button onClick={() => { setIsCreateModalOpen(false); setEditingClientId(null); }} className="text-gray-400 hover:text-[#f7b718] transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={editingClientId ? handleUpdateClient : handleCreateClient} className="p-6 md:p-8 space-y-4 overflow-y-auto custom-scrollbar">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Company / Client Name *</label>
                  <input type="text" required value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f7b718] focus:border-[#f7b718] outline-none font-medium bg-gray-50 focus:bg-white transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Email</label>
                  <input type="email" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f7b718] focus:border-[#f7b718] outline-none font-medium bg-gray-50 focus:bg-white transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Phone</label>
                  <input type="text" value={formState.phone} onChange={e => setFormState({...formState, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f7b718] focus:border-[#f7b718] outline-none font-medium bg-gray-50 focus:bg-white transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Address</label>
                  <input type="text" value={formState.address} onChange={e => setFormState({...formState, address: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f7b718] focus:border-[#f7b718] outline-none font-medium bg-gray-50 focus:bg-white transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Password</label>
                  <input type="text" value={formState.password} onChange={e => setFormState({...formState, password: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f7b718] focus:border-[#f7b718] outline-none font-medium bg-gray-50 focus:bg-white transition-all shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Remarques / Notes</label>
                  <textarea value={formState.notes} onChange={e => setFormState({...formState, notes: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f7b718] focus:border-[#f7b718] outline-none h-24 font-medium bg-gray-50 focus:bg-white transition-all shadow-sm resize-none" />
                </div>
              </div>

              {!editingClientId && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <div className="bg-[#f4f6f9] p-5 sm:p-6 rounded-2xl border border-gray-200 relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-blue-500"></div>
                    <h4 className="font-black text-gray-900 flex items-center gap-2.5 mb-5 text-sm sm:text-base">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><FileText size={18}/></div> 
                      Auto-Generate First Invoice (Optional)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Vehicle / Item Description</label>
                        <input type="text" value={formState.itemDescription} onChange={e => setFormState({...formState, itemDescription: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm font-medium" placeholder="e.g. COOLRAY MANUAL (GREY)"/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">ID Number (Carte Nationale)</label>
                        <input type="text" value={formState.idNumber} onChange={e => setFormState({...formState, idNumber: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm font-medium" placeholder="e.g. 204188745"/>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Amount</label>
                          <input type="number" value={formState.amount} onChange={e => setFormState({...formState, amount: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm font-medium" placeholder="2450000"/>
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">Cur.</label>
                          <select value={formState.currency} onChange={e => setFormState({...formState, currency: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-center">
                            <option value="DZD">DA</option>
                            <option value="DH">DH</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-100 flex gap-3 justify-end shrink-0 mt-8">
                <button type="button" onClick={() => { setIsCreateModalOpen(false); setEditingClientId(null); }} className="px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 text-sm font-black text-[#161616] bg-gradient-to-r from-[#f7b718] to-[#e5a60b] hover:from-[#e5a60b] hover:to-[#d4980a] rounded-xl transition-all shadow-[0_8px_20px_-6px_rgba(247,183,24,0.4)] flex items-center gap-2 transform hover:-translate-y-0.5">
                  {editingClientId ? 'Save Changes' : (formState.amount ? <><FileCheck size={18}/> Create & Generate Invoice</> : 'Create Client')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SCROLLING FIXED DOCUMENT VIEWER MODAL --- */}
      {generatedDoc && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 flex flex-col items-center justify-center p-2 sm:p-6 backdrop-blur-md">
          <button onClick={(e) => { e.stopPropagation(); setGeneratedDoc(null); }} className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:p-3 rounded-full flex items-center gap-2 font-bold shadow-lg transition-transform hover:scale-105 z-[110]">
            <X size={20} /> <span className="hidden sm:inline">Close Document</span>
          </button>

          <div className="relative w-full max-w-5xl h-[92vh] sm:h-[85vh] bg-gray-200 rounded-xl sm:rounded-2xl overflow-auto shadow-2xl" dir="ltr">
            <div className="min-h-max w-fit min-w-full flex justify-start lg:justify-center items-start p-2 sm:p-8 overflow-x-auto">
              <AutoMondoDocument 
                type={generatedDoc.type}
                clientName={generatedDoc.clientName}
                clientIdNumber={generatedDoc.data.metadata?.idNumber}
                amount={generatedDoc.data.totalAmount}
                currency={generatedDoc.data.currency}
                itemDescription={generatedDoc.data.metadata?.itemDescription || generatedDoc.data.title}
                documentNumber={generatedDoc.data.invoiceNumber || 'PENDING'}
                date={generatedDoc.data.createdAt}
              />
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}