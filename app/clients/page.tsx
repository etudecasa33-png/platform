"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Pencil, Trash2, Plus, X, Building2 } from 'lucide-react';

type Client = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  password: string | null; // <-- We added the password to the blueprint here
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Added password to the form state
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', notes: '', password: '' });

  const fetchClients = async () => {
    const res = await fetch('/api/clients', { cache: 'no-store' });
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/clients/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    
    // Reset form including password
    setForm({ name: '', phone: '', email: '', address: '', notes: '', password: '' });
    setEditingId(null);
    setIsFormOpen(false);
    fetchClients();
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setForm({
      name: client.name,
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      notes: client.notes || '',
      password: client.password || '' // <-- THIS grabs their existing password so you can see it!
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("WARNING: Are you sure you want to delete this client?")) {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      fetchClients();
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm({ name: '', phone: '', email: '', address: '', notes: '', password: '' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Directory</h1>
          <p className="text-gray-500 mt-1">Manage your {clients.length} active client profiles.</p>
        </div>
        
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Add New Client
          </button>
        )}
      </div>

      {/* The Form */}
      {isFormOpen && (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-purple-100 mb-8 relative">
          <button onClick={closeForm} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition">
            <X size={24} />
          </button>
          
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            {editingId ? 'Edit Client Profile' : 'Register New Client'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company / Full Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-600 mb-1">Client Portal Password *</label>
              <input 
                type="text" 
                required 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                className="w-full border border-purple-300 bg-purple-50 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-medium" 
                placeholder="Give them a password to log in" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Used for Login)</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24" />
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="bg-gray-900 hover:bg-black text-white px-8 py-2.5 rounded-lg font-medium transition-colors">
                {editingId ? 'Save Changes' : 'Save Client'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* The Organized Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">Client Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Contact Details</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Location</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                  
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <Building2 size={20} />
                      </div>
                      <Link href={`/clients/${client.id}`} className="font-bold text-gray-900 hover:text-purple-600 hover:underline">
                        {client.name}
                      </Link>
                    </div>
                  </td>
                  
                  <td className="p-4 align-middle">
                    <div className="space-y-1">
                      {client.phone ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" /> {client.phone}
                        </div>
                      ) : null}
                      {client.email ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" /> {client.email}
                        </div>
                      ) : null}
                      {!client.phone && !client.email && <span className="text-sm text-gray-400">-</span>}
                    </div>
                  </td>

                  <td className="p-4 align-middle">
                    {client.address ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600 max-w-[200px] truncate" title={client.address}>
                        <MapPin size={14} className="text-gray-400 flex-shrink-0" /> <span className="truncate">{client.address}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(client)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" title="Edit">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          
          {clients.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              Your directory is currently empty. Click "Add New Client" to start.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}