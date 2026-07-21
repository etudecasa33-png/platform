"use client";
import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react'; 

type Transaction = {
  id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

export default function DirhamPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ 
    type: 'ENTREE', 
    amount: '', 
    category: '', 
    description: '' 
  });

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions?currency=DIRHAM', { cache: 'no-store' });
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await fetch(`/api/transactions/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditingId(null); 
    } else {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, currency: 'DIRHAM' }) 
      });
    }
    
    setForm({ type: 'ENTREE', amount: '', category: '', description: '' });
    fetchTransactions(); 
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setForm({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      fetchTransactions();
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Dirham Ledger (DH)</h1>

      {/* Form Area */}
      <div className={`p-6 rounded-xl shadow-sm border mb-8 transition-colors ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editingId ? 'Edit Transaction' : 'Record Transaction'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm text-gray-600 mb-1">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border p-2 rounded bg-white text-gray-800">
              <option value="ENTREE">Entrée (Income)</option>
              <option value="SORTIE">Sortie (Expense)</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm text-gray-600 mb-1">Amount (DH)</label>
            <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full border p-2 rounded bg-white text-gray-800" placeholder="e.g., 5000" />
          </div>
          
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <input type="text" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border p-2 rounded bg-white text-gray-800" placeholder="e.g., Supplier Payment" />
          </div>
          
          <div className="w-full md:w-auto flex-2">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded bg-white text-gray-800" placeholder="Optional details..." />
          </div>
          
          <div className="w-full md:w-auto flex gap-2">
            <button type="submit" className={`w-full md:w-auto px-6 py-2 rounded font-medium text-white transition ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {editingId ? 'Update' : 'Save'}
            </button>
            
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ type: 'ENTREE', amount: '', category: '', description: '' }); }} className="w-full md:w-auto px-4 py-2 rounded font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Area with Mobile Scroll Wrapper */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium whitespace-nowrap">Date & Time</th>
              <th className="p-4 font-medium whitespace-nowrap">Description</th>
              <th className="p-4 font-medium whitespace-nowrap">Category</th>
              <th className="p-4 font-medium text-right whitespace-nowrap">Amount (DH)</th>
              <th className="p-4 font-medium text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr key={t.id} className="text-gray-800 hover:bg-blue-50 transition-colors">
                <td className="p-4 text-sm whitespace-nowrap">{formatDateTime(t.date)}</td>
                <td className="p-4 whitespace-nowrap">{t.description || '-'}</td>
                <td className="p-4 whitespace-nowrap">
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">{t.category}</span>
                </td>
                <td className={`p-4 text-right font-bold whitespace-nowrap ${t.type === 'ENTREE' ? 'text-blue-600' : 'text-red-600'}`}>
                  {t.type === 'ENTREE' ? '+' : '-'}{t.amount.toLocaleString()} DH
                </td>
                <td className="p-4 flex justify-center gap-3 whitespace-nowrap">
                  <button onClick={() => handleEdit(t)} className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 transition" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {transactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">No Dirham transactions recorded yet.</div>
        )}
      </div>
    </div>
  );
}