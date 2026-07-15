"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, AlertCircle, Eye, Pencil, Trash2, X, Phone, Mail, MapPin, Building2, Plus, CreditCard } from 'lucide-react';
import dynamic from 'next/dynamic';

const SecurePdfViewer = dynamic(() => import('../../components/SecurePdfViewer'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center font-bold text-gray-400">Loading secure viewer...</div>
});

// --- TYPES ---
type ClientDocument = { id: string; title: string; details: string | null; date: string | null; fileUrls: string; createdAt: string; };
type Contract = { id: string; startDate: string; expirationDate: string; status: string; fileUrls: string; };
type Invoice = { id: string; title: string; currency: string; totalAmount: number; paidAmount: number; createdAt: string; };
type ClientProfile = { id: string; name: string; email: string | null; phone: string | null; address: string | null; notes: string | null; contracts?: Contract[]; documents?: ClientDocument[]; invoices?: Invoice[]; };

export default function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.id;
  const [client, setClient] = useState<ClientProfile | null>(null);
  
  // Added strict status tracking so it doesn't get stuck loading forever
  const [pageStatus, setPageStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const [activeTab, setActiveTab] = useState<'contracts' | 'documents'>('contracts');
  const [isContractFormOpen, setIsContractFormOpen] = useState(false);
  const [isDocFormOpen, setIsDocFormOpen] = useState(false);
  const [secureFileUrl, setSecureFileUrl] = useState<string | null>(null);

  // --- INVOICE STATES ---
  const [invoiceTitle, setInvoiceTitle] = useState<string>('');
  const [currency, setCurrency] = useState<string>('DZD');
  const [invoiceTotal, setInvoiceTotal] = useState<string>('');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

  const totalNum = parseFloat(invoiceTotal) || 0;
  const receivedNum = parseFloat(amountReceived) || 0;
  const remainingNum = Math.max(0, totalNum - receivedNum);
  const isFullyPaid = totalNum > 0 && remainingNum <= 0;

  // --- CONTRACT & DOC STATES ---
  const [editingContractId, setEditingContractId] = useState<string | null>(null);
  const [contractForm, setContractForm] = useState({ startDate: '', expirationDate: '', status: 'Active' });
  const [contractFiles, setContractFiles] = useState<FileList | null>(null);
  const [retainedContractFiles, setRetainedContractFiles] = useState<string[]>([]);

  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docForm, setDocForm] = useState({ title: '', details: '', date: '' });
  const [docFiles, setDocFiles] = useState<FileList | null>(null);
  const [retainedDocFiles, setRetainedDocFiles] = useState<string[]>([]);

  const removeRetainedDocFile = (url: string) => setRetainedDocFiles(prev => prev.filter(u => u !== url));
  const removeRetainedContractFile = (url: string) => setRetainedContractFiles(prev => prev.filter(u => u !== url));
  const getFileName = (url: string) => url.split('-').slice(1).join('-') || url.split('/').pop() || "Document";

  // --- BULLETPROOF FETCH ---
  const fetchClientData = async () => {
    setPageStatus('loading');
    try {
      const res = await fetch(`/api/clients/${clientId}`, { cache: 'no-store' });
      const data = await res.json();
      
      // If the API returns an error message instead of a client, catch it!
      if (data.error || !data.name) {
        setPageStatus('error');
        return;
      }
      
      setClient(data);
      setPageStatus('success');
    } catch (error) {
      setPageStatus('error');
    }
  };

  useEffect(() => { fetchClientData(); }, [clientId]);

  useEffect(() => {
    if (secureFileUrl) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [secureFileUrl]);

  // ==========================================
  // API HANDLERS (Invoices, Contracts, Docs)
  // ==========================================
  const handleSaveInvoice = async () => {
    if (totalNum <= 0) return alert("Please enter a total amount!");
    const payload = { clientId, title: invoiceTitle || "Standard Invoice", currency, totalAmount: totalNum, paidAmount: receivedNum };
    if (editingInvoiceId) await fetch(`/api/invoices/${editingInvoiceId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    else await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setInvoiceTitle(''); setInvoiceTotal(''); setAmountReceived(''); setEditingInvoiceId(null); fetchClientData();
  };

  const handleEditInvoice = (inv: Invoice) => {
    setEditingInvoiceId(inv.id); setInvoiceTitle(inv.title || ''); setCurrency(inv.currency); setInvoiceTotal(inv.totalAmount.toString()); setAmountReceived(inv.paidAmount.toString()); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm("Delete this payment record forever?")) { await fetch(`/api/invoices/${id}`, { method: 'DELETE' }); fetchClientData(); }
  };

  const handleContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('startDate', contractForm.startDate); formData.append('expirationDate', contractForm.expirationDate); formData.append('status', contractForm.status);
    if (contractFiles) { for (let i = 0; i < contractFiles.length; i++) formData.append('files', contractFiles[i]); }

    if (editingContractId) {
      formData.append('retainedFiles', JSON.stringify(retainedContractFiles));
      await fetch(`/api/contracts/${editingContractId}`, { method: 'PUT', body: formData });
    } else {
      formData.append('clientId', clientId);
      await fetch('/api/contracts', { method: 'POST', body: formData });
    }
    setEditingContractId(null); setIsContractFormOpen(false); setContractForm({ startDate: '', expirationDate: '', status: 'Active' }); setContractFiles(null); setRetainedContractFiles([]); fetchClientData();
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContractId(contract.id); setContractForm({ startDate: new Date(contract.startDate).toISOString().split('T')[0], expirationDate: new Date(contract.expirationDate).toISOString().split('T')[0], status: contract.status });
    try { setRetainedContractFiles(JSON.parse(contract.fileUrls || "[]")); } catch (e) { setRetainedContractFiles([]); } setIsContractFormOpen(true);
  };

  const handleDeleteContract = async (id: string) => {
    if (window.confirm("Delete this contract and ALL its files forever?")) { await fetch(`/api/contracts/${id}`, { method: 'DELETE' }); fetchClientData(); }
  };

  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', docForm.title);
    if (docForm.details) formData.append('details', docForm.details);
    if (docForm.date) formData.append('date', docForm.date);
    if (docFiles) { for (let i = 0; i < docFiles.length; i++) formData.append('files', docFiles[i]); }

    if (editingDocId) {
      formData.append('retainedFiles', JSON.stringify(retainedDocFiles));
      await fetch(`/api/documents/${editingDocId}`, { method: 'PUT', body: formData });
    } else {
      formData.append('clientId', clientId);
      await fetch('/api/documents', { method: 'POST', body: formData });
    }
    setEditingDocId(null); setIsDocFormOpen(false); setDocForm({ title: '', details: '', date: '' }); setDocFiles(null); setRetainedDocFiles([]); fetchClientData();
  };

  const handleEditDocument = (doc: ClientDocument) => {
    setEditingDocId(doc.id); setDocForm({ title: doc.title, details: doc.details || '', date: doc.date ? new Date(doc.date).toISOString().split('T')[0] : '' });
    try { setRetainedDocFiles(JSON.parse(doc.fileUrls || "[]")); } catch (e) { setRetainedDocFiles([]); } setIsDocFormOpen(true);
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm("Delete this document box and ALL its files forever?")) { await fetch(`/api/documents/${id}`, { method: 'DELETE' }); fetchClientData(); }
  };

  // --- UI STATUS RENDERERS ---
  if (pageStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="font-bold tracking-wider uppercase text-sm">Accessing Secure Profile...</p>
      </div>
    );
  }

  if (pageStatus === 'error' || !client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 p-6">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-center mb-6 max-w-md">We couldn't load this client's profile. It may have been deleted, or the database connection failed.</p>
        <Link href="/clients" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition">Return to Directory</Link>
      </div>
    );
  }

  // --- CRASH PREVENTION ARRAYS ---
  // If the database sends null for these, we force them to be empty arrays so React never crashes!
  const safeContracts = client.contracts || [];
  const safeInvoices = client.invoices || [];
  const safeDocuments = client.documents || [];

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-6xl mx-auto bg-gray-50 min-h-screen">
      
      <Link href="/clients" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 font-medium transition-colors text-sm sm:text-base">
        <ArrowLeft size={18} /> Back to Directory
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 mb-6 sm:mb-8 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left">
        <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 flex-shrink-0">
          <Building2 size={40} className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">{client.name}</h1>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-600">
            {client.email && <div className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400"/> {client.email}</div>}
            {client.phone && <div className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400"/> {client.phone}</div>}
            {client.address && <div className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400"/> {client.address}</div>}
          </div>
        </div>
      </div>

      <div className="mb-6 sm:mb-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-6 pb-6 border-b border-gray-100">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
              <CreditCard className="text-purple-600" size={24} />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {editingInvoiceId ? 'Edit Payment Record' : 'Record New Payment'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Title / Description</label>
                <input type="text" value={invoiceTitle} onChange={(e) => setInvoiceTitle(e.target.value)} placeholder="e.g., Website Deposit" className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                  <option value="DZD">DZD (Dinar)</option>
                  <option value="AED">AED (Emirati Dirham)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Total Amount</label>
                <input type="number" value={invoiceTotal} onChange={(e) => setInvoiceTotal(e.target.value)} placeholder="0.00" className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Amount Received</label>
                <input type="number" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} placeholder="0.00" className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 flex flex-col justify-center items-center">
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">Remaining Balance</p>
            <p className={`text-3xl sm:text-4xl font-extrabold text-center ${isFullyPaid ? 'text-green-600' : 'text-red-500'}`}>
              {remainingNum.toLocaleString()} <span className="text-lg sm:text-xl">{currency}</span>
            </p>
            <button onClick={handleSaveInvoice} className="mt-4 w-full bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-lg font-bold transition shadow-sm text-sm sm:text-base">
              {editingInvoiceId ? 'Update Record' : 'Save Payment'}
            </button>
            {editingInvoiceId && (
               <button onClick={() => { setEditingInvoiceId(null); setInvoiceTitle(''); setInvoiceTotal(''); setAmountReceived(''); }} className="mt-2 text-xs sm:text-sm text-gray-500 hover:text-gray-800 font-medium">Cancel Edit</button>
            )}
          </div>
        </div>

        <div>
          {/* SAFE LENGTH */}
          <h4 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Payment History ({safeInvoices.length})</h4>
          {safeInvoices.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No payments recorded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* SAFE MAP */}
              {safeInvoices.map((inv) => {
                const isPaidOff = (inv.totalAmount - inv.paidAmount) <= 0;
                return (
                  <div key={inv.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white relative group">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isPaidOff ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isPaidOff ? 'Fully Paid' : 'Pending'}
                      </span>
                      <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition flex gap-2">
                        <button onClick={() => handleEditInvoice(inv)} className="p-1 sm:p-0 text-gray-400 hover:text-purple-600"><Pencil size={14}/></button>
                        <button onClick={() => handleDeleteInvoice(inv.id)} className="p-1 sm:p-0 text-gray-400 hover:text-red-600"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    <h5 className="font-bold text-gray-800 mb-1 text-sm sm:text-base truncate" title={inv.title}>{inv.title}</h5>
                    <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">{inv.totalAmount.toLocaleString()} <span className="text-xs sm:text-sm text-gray-500">{inv.currency}</span></p>
                    <div className="flex justify-between text-xs sm:text-sm mt-3 border-t border-gray-100 pt-3">
                      <span className="text-gray-500 font-medium">Paid: <span className="text-green-600 font-bold">{inv.paidAmount.toLocaleString()}</span></span>
                      <span className="text-gray-500 font-medium">Owes: <span className="text-red-500 font-bold">{Math.max(0, inv.totalAmount - inv.paidAmount).toLocaleString()}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide snap-x border-b border-gray-200">
        <button onClick={() => setActiveTab('contracts')} className={`shrink-0 snap-start pb-3 sm:pb-4 px-2 text-base sm:text-lg font-bold transition-colors relative ${activeTab === 'contracts' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}>
          {/* SAFE LENGTH */}
          Contracts ({safeContracts.length})
          {activeTab === 'contracts' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('documents')} className={`shrink-0 snap-start pb-3 sm:pb-4 px-2 text-base sm:text-lg font-bold transition-colors relative ${activeTab === 'documents' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          {/* SAFE LENGTH */}
          Documents ({safeDocuments.length})
          {activeTab === 'documents' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'contracts' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Contract History</h2>
            {!isContractFormOpen && (
              <button onClick={() => setIsContractFormOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium flex items-center gap-2 transition shadow-sm">
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> <span className="hidden sm:inline">New Contract</span>
              </button>
            )}
          </div>

          {isContractFormOpen && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-purple-200 shadow-md relative">
              <button onClick={() => { setIsContractFormOpen(false); setEditingContractId(null); setContractForm({ startDate: '', expirationDate: '', status: 'Active' }); }} className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-700"><X size={20}/></button>
              <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800">{editingContractId ? 'Edit Contract' : 'Add New Contract'}</h3>
              <form onSubmit={handleContractSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" required value={contractForm.startDate} onChange={e => setContractForm({...contractForm, startDate: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Expiration Date</label><input type="date" required value={contractForm.expirationDate} onChange={e => setContractForm({...contractForm, expirationDate: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label><select value={contractForm.status} onChange={e => setContractForm({...contractForm, status: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg bg-white text-sm"><option value="Active">Active</option><option value="Pending">Pending</option><option value="Expired">Expired</option></select></div>
                </div>
                {editingContractId && retainedContractFiles.length > 0 && (
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase mb-2">Current Attached Files</p>
                    <div className="flex flex-col gap-2">
                      {retainedContractFiles.map(url => (
                        <div key={url} className="flex justify-between items-center bg-white p-2 border border-gray-100 rounded text-xs sm:text-sm text-gray-600">
                          <span className="truncate pr-2">{getFileName(url)}</span>
                          <button type="button" onClick={() => removeRetainedContractFile(url)} className="text-red-500 hover:bg-red-50 p-1 rounded shrink-0"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div><label className="block text-xs sm:text-sm font-bold text-purple-600 mb-1">{editingContractId ? 'Upload Additional Files' : 'Upload Contract Files (Select Multiple)'}</label><input type="file" multiple onChange={e => setContractFiles(e.target.files)} className="w-full text-xs sm:text-sm file:py-2 file:px-4 file:bg-purple-50 file:text-purple-700 file:rounded-lg file:border-0 hover:file:bg-purple-100 cursor-pointer" /></div>
                <button type="submit" className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium w-full sm:w-auto text-sm sm:text-base">{editingContractId ? 'Save Changes' : 'Create Contract'}</button>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {/* SAFE MAP */}
            {safeContracts.map((contract) => {
              const isExpired = new Date(contract.expirationDate) < new Date();
              let files: string[] = []; try { files = JSON.parse(contract.fileUrls); } catch (e) {}
              return (
                <div key={contract.id} className={`bg-white border p-4 sm:p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-shadow hover:shadow-md ${isExpired ? 'border-red-200' : 'border-gray-200'}`}>
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{isExpired ? 'Expired' : contract.status}</span>
                      {isExpired && <span className="flex items-center text-red-500 text-[10px] sm:text-xs font-bold gap-1"><AlertCircle size={12} className="sm:w-3.5 sm:h-3.5"/> Needs Renewal</span>}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-800 font-semibold mt-1.5 sm:mt-2 text-sm sm:text-base">
                      <Calendar size={16} className="text-gray-400 sm:w-[18px] sm:h-[18px]" />
                      {new Date(contract.startDate).toLocaleDateString()} ➔ {new Date(contract.expirationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex-1 max-w-md flex flex-wrap gap-2 w-full md:w-auto">
                    {files.map((url, i) => (
                      <button key={i} onClick={() => setSecureFileUrl(url)} className="flex flex-1 sm:flex-none justify-center sm:justify-start items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition">
                        <Eye size={14}/> View File {files.length > 1 ? i+1 : ''}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t border-gray-100 md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 w-full md:w-auto">
                    <button onClick={() => handleEditContract(contract)} className="p-2 sm:p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"><Pencil size={16} className="sm:w-[18px] sm:h-[18px]"/></button>
                    <button onClick={() => handleDeleteContract(contract.id)} className="p-2 sm:p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} className="sm:w-[18px] sm:h-[18px]"/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Document Archive</h2>
            {!isDocFormOpen && (
              <button onClick={() => setIsDocFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium flex items-center gap-2 transition shadow-sm">
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> <span className="hidden sm:inline">New Document</span>
              </button>
            )}
          </div>

          {isDocFormOpen && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-blue-200 shadow-md relative">
              <button onClick={() => { setIsDocFormOpen(false); setEditingDocId(null); setDocForm({ title: '', details: '', date: '' }); }} className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-700"><X size={20}/></button>
              <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800">{editingDocId ? 'Edit Document' : 'Upload New Document'}</h3>
              <form onSubmit={handleDocSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Title / Name *</label><input type="text" required value={docForm.title} onChange={e => setDocForm({...docForm, title: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg text-sm" placeholder="e.g., ID Card" /></div>
                  <div><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date (Facultatif)</label><input type="date" value={docForm.date} onChange={e => setDocForm({...docForm, date: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg text-sm" /></div>
                  <div className="md:col-span-2"><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Remarques (Facultatif)</label><textarea value={docForm.details} onChange={e => setDocForm({...docForm, details: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg h-20 text-sm" /></div>
                </div>
                {editingDocId && retainedDocFiles.length > 0 && (
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase mb-2">Current Attached Files</p>
                    <div className="flex flex-col gap-2">
                      {retainedDocFiles.map(url => (
                        <div key={url} className="flex justify-between items-center bg-white p-2 border border-gray-100 rounded text-xs sm:text-sm text-gray-600">
                          <span className="truncate pr-2">{getFileName(url)}</span>
                          <button type="button" onClick={() => removeRetainedDocFile(url)} className="text-red-500 hover:bg-red-50 p-1 rounded shrink-0"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div><label className="block text-xs sm:text-sm font-bold text-blue-600 mb-1">{editingDocId ? 'Upload Additional Files' : 'Select Files (Multiple Allowed)'}</label><input type="file" multiple onChange={e => setDocFiles(e.target.files)} className="w-full text-xs sm:text-sm file:py-2 file:px-4 file:bg-blue-50 file:text-blue-700 file:rounded-lg file:border-0 hover:file:bg-blue-100 cursor-pointer" /></div>
                <button type="submit" className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium w-full sm:w-auto text-sm sm:text-base">{editingDocId ? 'Save Changes' : 'Upload Files'}</button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {/* SAFE MAP */}
            {safeDocuments.map((doc) => {
              let files: string[] = []; try { files = JSON.parse(doc.fileUrls); } catch (e) {}
              return (
                <div key={doc.id} className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xl flex flex-col md:flex-row gap-4 sm:gap-6 transition-shadow hover:shadow-md">
                  <div className="flex-1">
                    <h4 className="font-bold text-base sm:text-lg text-gray-900">{doc.title}</h4>
                    {doc.date && <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1"><Calendar size={14}/> {new Date(doc.date).toLocaleDateString()}</p>}
                    {doc.details && <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 border-l-2 border-blue-200 pl-3">{doc.details}</p>}
                  </div>
                  <div className="flex-1 flex flex-wrap content-start gap-2 w-full md:w-auto">
                    {files.map((url, i) => (
                      <button key={i} onClick={() => setSecureFileUrl(url)} className="flex flex-1 sm:flex-none justify-center sm:justify-start items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition">
                        <Eye size={14}/> View File {files.length > 1 ? i+1 : ''}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-start justify-end gap-2 border-t border-gray-100 md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 w-full md:w-auto">
                    <button onClick={() => handleEditDocument(doc)} className="p-2 sm:p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={16} className="sm:w-[18px] sm:h-[18px]"/></button>
                    <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 sm:p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} className="sm:w-[18px] sm:h-[18px]"/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {secureFileUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-sm h-[100dvh]">
          <button onClick={() => setSecureFileUrl(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-red-600 hover:bg-red-700 text-white p-2.5 sm:p-3 rounded-full flex items-center gap-2 font-bold shadow-lg transition-transform hover:scale-105 z-50 text-sm sm:text-base">
            <X size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Close File</span>
          </button>
          <div className="relative w-full max-w-5xl h-[80dvh] sm:h-[85vh] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center mt-12 sm:mt-0">
            <div className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' transform='rotate(-45 100 100)' font-size='20' fill='black' font-family='sans-serif' font-weight='900' letter-spacing='2'%3EAUTOMONDO%3C/text%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }} />
            {secureFileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 z-30 cursor-default" onContextMenu={(e) => e.preventDefault()} style={{ touchAction: 'none' }} />
                <img src={secureFileUrl} alt="Secure Document" className="max-w-full max-h-full object-contain z-10 select-none p-2 sm:p-4 pointer-events-none" draggable={false} />
              </div>
            ) : (
              <SecurePdfViewer url={secureFileUrl} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}