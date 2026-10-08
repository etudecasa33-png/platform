"use client";
import { useEffect, useState } from 'react';
import { Pencil, Trash2, History, Plus, RefreshCw, AlertCircle } from 'lucide-react'; 

type Transaction = { id: string; type: string; amount: number; category: string; description: string; date: string; };
type AuditLog = { id: string; action: string; createdAt: string; performedBy: string; newData: any; previousData: any; transaction: any; };

export default function DinarPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ type: 'ENTREE', amount: '', category: '', description: '' });

  const fetchData = async () => {
    // 1. Fetch active DZD transactions
    const res = await fetch('/api/transactions?currency=DZD', { cache: 'no-store' });
    const data = await res.json();
    setTransactions(data);

    // 2. Fetch Audit History & filter for DZD
    const auditRes = await fetch('/api/audit', { cache: 'no-store' });
    const auditData = await auditRes.json();
    setAuditLogs(auditData.filter((log: any) => 
      (log.transaction?.currency === 'DZD') || 
      (log.previousData?.currency === 'DZD') ||
      (log.newData?.currency === 'DZD')
    ));
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
    fetchData(); 
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setForm({ type: transaction.type, amount: transaction.amount.toString(), category: transaction.category, description: transaction.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const reason = window.prompt("Why are you deleting this transaction? (Reason required)");
    
    if (reason === null) return; 
    if (reason.trim() === "") {
      alert("You must provide a reason to delete a transaction.");
      return;
    }

    await fetch(`/api/transactions/${id}`, { 
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reason }) 
    });
    
    fetchData(); 
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dinar Ledger (DZD)</h1>

      {/* --- FORM AREA --- */}
      <div className={`p-6 rounded-2xl shadow-sm border mb-10 transition-colors ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
        <h2 className="text-xl font-bold mb-5 text-gray-800">{editingId ? 'Edit Transaction' : 'Record Transaction'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5 items-end">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="ENTREE">Entrée (Income)</option>
              <option value="SORTIE">Sortie (Expense)</option>
            </select>
          </div>
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (DZD)</label>
            <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="w-full md:w-auto flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <input type="text" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="w-full md:w-auto flex-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="w-full md:w-auto flex gap-3">
            <button type="submit" className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-bold text-white transition shadow-sm ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>{editingId ? 'Update' : 'Save'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ type: 'ENTREE', amount: '', category: '', description: '' }); }} className="px-5 py-2.5 rounded-lg font-bold bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>}
          </div>
        </form>
      </div>

      {/* --- ACTIVE TRANSACTIONS TABLE --- */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Active Transactions</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full overflow-x-auto mb-14">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-200 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-5 font-bold">Date & Time</th>
              <th className="p-5 font-bold">Description</th>
              <th className="p-5 font-bold">Category</th>
              <th className="p-5 font-bold text-right">Amount (DZD)</th>
              <th className="p-5 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr key={t.id} className="text-gray-800 hover:bg-gray-50 transition">
                <td className="p-5 text-sm font-medium">{formatDateTime(t.date)}</td>
                <td className="p-5">{t.description || '-'}</td>
                <td className="p-5"><span className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600">{t.category}</span></td>
                <td className={`p-5 text-right text-lg font-black ${t.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'ENTREE' ? '+' : '-'}{t.amount.toLocaleString()} DA</td>
                <td className="p-5 flex justify-center gap-2">
                  <button onClick={() => handleEdit(t)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="Edit"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <div className="p-10 text-center text-gray-500 font-medium">No transactions recorded yet.</div>}
      </div>

      {/* --- HIGHLY OPTIMIZED AUDIT HISTORY TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Audit Header */}
        <div className="bg-slate-50 border-b border-gray-200 p-6 flex items-center gap-4">
          <div className="bg-slate-200 p-3 rounded-xl text-slate-700">
             <History size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">Permanent Audit Log</h2>
            <p className="text-sm text-gray-500 font-medium">Secure, unalterable history of all modifications and deletions.</p>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-white text-gray-400 border-b border-gray-200 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-5 font-bold">Timestamp</th>
                <th className="p-5 font-bold">Action Taken</th>
                <th className="p-5 font-bold">Admin User</th>
                <th className="p-5 font-bold text-right">Amount Affected</th>
                <th className="p-5 font-bold">Reason / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {auditLogs.map((log) => {
                
                // SMART LOGIC: If the amount isn't in newData (because it was deleted), pull it from previousData!
                const amount = log.newData?.amount ?? log.previousData?.amount;
                const type = log.newData?.type ?? log.previousData?.type;

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition group">
                    <td className="p-5 text-gray-500 font-medium">{formatDateTime(log.createdAt)}</td>
                    
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        {log.action === 'CREATE' && <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><Plus size={16} strokeWidth={3}/></div>}
                        {log.action === 'UPDATE' && <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><RefreshCw size={16} strokeWidth={3}/></div>}
                        {log.action === 'DELETE' && <div className="bg-rose-100 text-rose-600 p-2 rounded-lg"><Trash2 size={16} strokeWidth={3}/></div>}
                        <span className="font-bold text-gray-800">{log.action}</span>
                      </div>
                    </td>

                    <td className="p-5 font-medium text-gray-700">{log.performedBy}</td>
                    
                    <td className="p-5 text-right font-black text-gray-900">
                      {amount ? (
                        <span className={log.action === 'DELETE' ? 'text-gray-400 line-through decoration-rose-500 decoration-2' : ''}>
                          {type === 'ENTREE' ? '+' : '-'}{amount.toLocaleString()} DA
                        </span>
                      ) : '-'}
                    </td>

                    <td className="p-5">
                      {log.action === 'DELETE' ? (
                         <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100 w-fit">
                           <AlertCircle size={16} />
                           <span className="font-bold">Reason:</span> <span className="font-medium">{log.newData?.reason || 'No reason provided'}</span>
                         </div>
                      ) : (
                         <span className="text-gray-500 font-medium">
                           {log.newData?.description ? log.newData.description : `Logged ${log.newData?.category || 'transaction'}`}
                         </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {auditLogs.length === 0 && <div className="p-10 text-center text-gray-400 font-medium">No system activity logged yet.</div>}
        </div>
      </div>

    </div>
  );
}