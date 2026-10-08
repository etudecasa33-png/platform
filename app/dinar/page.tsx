"use client";
import { useEffect, useState } from 'react';
import { Pencil, Trash2, History } from 'lucide-react'; 

type Transaction = { id: string; type: string; amount: number; category: string; description: string; date: string; };
// New type for our history logs
type AuditLog = { id: string; action: string; createdAt: string; performedBy: string; newData: any; transaction: any; };

export default function DinarPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]); // State for history
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ type: 'ENTREE', amount: '', category: '', description: '' });

  const fetchData = async () => {
    // Fetch active transactions
    const res = await fetch('/api/transactions?currency=DZD', { cache: 'no-store' });
    const data = await res.json();
    setTransactions(data);

    // Fetch the history logs
    const auditRes = await fetch('/api/audit', { cache: 'no-store' });
    const auditData = await auditRes.json();
    // Filter history to only show DZD related logs
    setAuditLogs(auditData.filter((log: any) => log.transaction?.currency === 'DZD'));
  };

  useEffect(() => { fetchData(); }, []);

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
        body: JSON.stringify({ ...form, currency: 'DZD' })
      });
    }
    setForm({ type: 'ENTREE', amount: '', category: '', description: '' });
    fetchData(); // Refresh everything
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setForm({ type: transaction.type, amount: transaction.amount.toString(), category: transaction.category, description: transaction.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // UPDATED DELETE FUNCTION: Asks for a reason!
  const handleDelete = async (id: string) => {
    const reason = window.prompt("Why are you deleting this transaction? (Reason required)");
    
    if (reason === null) return; // User clicked Cancel
    if (reason.trim() === "") {
      alert("You must provide a reason to delete a transaction.");
      return;
    }

    await fetch(`/api/transactions/${id}`, { 
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reason }) // Send the reason to the backend
    });
    
    fetchData(); // Refresh everything
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dinar Ledger (DZD)</h1>

      {/* --- FORM AREA --- */}
      <div className={`p-6 rounded-xl shadow-sm border mb-8 transition-colors ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{editingId ? 'Edit Transaction' : 'Record Transaction'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm text-gray-600 mb-1">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border p-2 rounded bg-white text-gray-800">
              <option value="ENTREE">Entrée (Income)</option>
              <option value="SORTIE">Sortie (Expense)</option>
            </select>
          </div>
          <div className="w-full md:w-auto flex-1"><label className="block text-sm text-gray-600 mb-1">Amount (DZD)</label><input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full border p-2 rounded bg-white" /></div>
          <div className="w-full md:w-auto flex-1"><label className="block text-sm text-gray-600 mb-1">Category</label><input type="text" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border p-2 rounded bg-white" /></div>
          <div className="w-full md:w-auto flex-2"><label className="block text-sm text-gray-600 mb-1">Description</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded bg-white" /></div>
          <div className="w-full md:w-auto flex gap-2">
            <button type="submit" className={`w-full md:w-auto px-6 py-2 rounded font-medium text-white transition ${editingId ? 'bg-yellow-600' : 'bg-blue-600'}`}>{editingId ? 'Update' : 'Save'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ type: 'ENTREE', amount: '', category: '', description: '' }); }} className="px-4 py-2 rounded bg-gray-200">Cancel</button>}
          </div>
        </form>
      </div>

      {/* --- ACTIVE TRANSACTIONS TABLE --- */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Active Transactions</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full overflow-x-auto mb-12">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
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
              <tr key={t.id} className="text-gray-800 hover:bg-gray-50">
                <td className="p-4 text-sm">{formatDateTime(t.date)}</td>
                <td className="p-4">{t.description || '-'}</td>
                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">{t.category}</span></td>
                <td className={`p-4 text-right font-bold ${t.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'ENTREE' ? '+' : '-'}{t.amount.toLocaleString()} DA</td>
                <td className="p-4 flex justify-center gap-3">
                  <button onClick={() => handleEdit(t)} className="text-blue-500 hover:text-blue-700" title="Edit"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <div className="p-8 text-center text-gray-500">No transactions recorded yet.</div>}
      </div>

      {/* --- PERMANENT HISTORY (AUDIT LOG) TABLE --- */}
      <div className="flex items-center gap-2 mb-4">
        <History className="text-slate-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Permanent Audit History</h2>
      </div>
      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 w-full overflow-x-auto">
        <table className="w-full text-left min-w-[900px] text-sm">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 font-medium">Date/Time</th>
              <th className="p-4 font-medium">Action</th>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Amount Affected</th>
              <th className="p-4 font-medium">Notes / Deletion Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/50">
                <td className="p-4">{formatDateTime(log.createdAt)}</td>
                <td className="p-4">
                  {log.action === 'CREATE' && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold text-xs uppercase tracking-wider">Created</span>}
                  {log.action === 'UPDATE' && <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-bold text-xs uppercase tracking-wider">Modified</span>}
                  {log.action === 'DELETE' && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold text-xs uppercase tracking-wider">Deleted</span>}
                </td>
                <td className="p-4">{log.performedBy}</td>
                <td className="p-4 font-bold">{log.newData?.amount ? `${log.newData.amount.toLocaleString()} DA` : '-'}</td>
                <td className="p-4 text-slate-400">
                  {log.action === 'DELETE' ? (
                     <span className="text-red-400 font-medium">Reason: {log.newData?.reason || 'No reason provided'}</span>
                  ) : (
                     <span>{log.newData?.description || log.newData?.category || '-'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {auditLogs.length === 0 && <div className="p-8 text-center text-slate-500">No history available.</div>}
      </div>

    </div>
  );
}