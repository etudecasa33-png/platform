"use client";
import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react'; // We added icons for Edit and Delete

type Transaction = {
  id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

export default function DinarPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // We added 'editingId' to know if we are creating a new record or fixing an old one
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ 
    type: 'ENTREE', 
    amount: '', 
    category: '', 
    description: '' 
  });

  const fetchTransactions = async () => {
    // We added { cache: 'no-store' } to force Next.js to give us fresh data every time!
    const res = await fetch('/api/transactions?currency=DZD', { cache: 'no-store' });
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handles both SAVING new and UPDATING existing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // If we are editing, send a PUT request to the specific ID
      await fetch(`/api/transactions/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditingId(null); // Turn off edit mode
    } else {
      // If we are creating new, send a POST request
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, currency: 'DZD' })
      });
    }
    
    setForm({ type: 'ENTREE', amount: '', category: '', description: '' });
    fetchTransactions(); 
  };

  // Puts the transaction data back into the form so you can change it
  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setForm({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description || ''
    });
    // Scroll to top so the user sees the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Deletes the transaction after asking for confirmation
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      fetchTransactions();
    }
  };

  // Formats the date to include Time (e.g., 24/05/2026, 14:30)
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dinar Ledger (DZD)</h1>

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
            <label className="block text-sm text-gray-600 mb-1">Amount (DZD)</label>
            <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full border p-2 rounded bg-white text-gray-800" placeholder="e.g., 50000" />
          </div>
          
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <input type="text" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border p-2 rounded bg-white text-gray-800" placeholder="e.g., Client Payment" />
          </div>
          
          <div className="w-full md:w-auto flex-2">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded bg-white text-gray-800" placeholder="Optional details..." />
          </div>
          
          <div className="w-full md:w-auto flex gap-2">
            <button type="submit" className={`px-6 py-2 rounded font-medium text-white transition ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {editingId ? 'Update' : 'Save'}
            </button>
            
            {/* Show a Cancel button if we are in Edit Mode */}
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ type: 'ENTREE', amount: '', category: '', description: '' }); }} className="px-4 py-2 rounded font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 font-medium">Date & Time</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium text-right">Amount (DZD)</th>
              <th className="p-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr key={t.id} className="text-gray-800 hover:bg-gray-50 transition-colors">
                {/* Notice we are using formatDateTime here now */}
                <td className="p-4 text-sm">{formatDateTime(t.date)}</td>
                <td className="p-4">{t.description || '-'}</td>
                <td className="p-4">
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">{t.category}</span>
                </td>
                <td className={`p-4 text-right font-bold ${t.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'ENTREE' ? '+' : '-'}{t.amount.toLocaleString()} DA
                </td>
                <td className="p-4 flex justify-center gap-3">
                  {/* Edit Button */}
                  <button onClick={() => handleEdit(t)} className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                    <Pencil size={18} />
                  </button>
                  {/* Delete Button */}
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 transition" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {transactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">No transactions recorded yet.</div>
        )}
      </div>
    </div>
  );
}