"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, AlertCircle, Paperclip, Download, Pencil, Trash2, FolderPlus, X, Phone, Mail, MapPin, Building2, Plus } from 'lucide-react';

type Document = {
  id: string; title: string; details: string | null; date: string | null; fileUrls: string; createdAt: string;
};

type Contract = {
  id: string; startDate: string; expirationDate: string; status: string; fileUrls: string;
};

type ClientProfile = {
  id: string; name: string; email: string | null; phone: string | null; address: string | null; notes: string | null; contracts: Contract[]; documents: Document[];
};

export default function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.id;
  const [client, setClient] = useState<ClientProfile | null>(null);

  // UI Organization State (Tabs & Forms)
  const [activeTab, setActiveTab] = useState<'contracts' | 'documents'>('contracts');
  const [isContractFormOpen, setIsContractFormOpen] = useState(false);
  const [isDocFormOpen, setIsDocFormOpen] = useState(false);

  // Contract States
  const [editingContractId, setEditingContractId] = useState<string | null>(null);
  const [contractForm, setContractForm] = useState({ startDate: '', expirationDate: '', status: 'Active' });
  const [contractFiles, setContractFiles] = useState<FileList | null>(null);
  const [retainedContractFiles, setRetainedContractFiles] = useState<string[]>([]);

  // Document States
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docForm, setDocForm] = useState({ title: '', details: '', date: '' });
  const [docFiles, setDocFiles] = useState<FileList | null>(null);
  const [retainedDocFiles, setRetainedDocFiles] = useState<string[]>([]);

  // Removal Functions
  const removeRetainedDocFile = (urlToRemove: string) => {
    setRetainedDocFiles((prevFiles) => prevFiles.filter((url) => url !== urlToRemove));
  };

  const removeRetainedContractFile = (urlToRemove: string) => {
    setRetainedContractFiles((prevFiles) => prevFiles.filter((url) => url !== urlToRemove));
  };

  // Data Fetching
  const fetchClientData = async () => {
    const res = await fetch(`/api/clients/${clientId}`, { cache: 'no-store' });
    const data = await res.json();
    setClient(data);
  };

  useEffect(() => { fetchClientData(); }, [clientId]);

  const getFileName = (url: string) => url.split('-').slice(1).join('-') || url.split('/').pop();

  // --- CONTRACT LOGIC ---
  const handleContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('startDate', contractForm.startDate);
    formData.append('expirationDate', contractForm.expirationDate);
    formData.append('status', contractForm.status);
    if (contractFiles) { for (let i = 0; i < contractFiles.length; i++) formData.append('files', contractFiles[i]); }

    if (editingContractId) {
      formData.append('retainedFiles', JSON.stringify(retainedContractFiles));
      await fetch(`/api/contracts/${editingContractId}`, { method: 'PUT', body: formData });
    } else {
      formData.append('clientId', clientId);
      await fetch('/api/contracts', { method: 'POST', body: formData });
    }
    
    setEditingContractId(null);
    setIsContractFormOpen(false);
    setContractForm({ startDate: '', expirationDate: '', status: 'Active' });
    setContractFiles(null);
    setRetainedContractFiles([]);
    fetchClientData();
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContractId(contract.id);
    setContractForm({
      startDate: new Date(contract.startDate).toISOString().split('T')[0],
      expirationDate: new Date(contract.expirationDate).toISOString().split('T')[0],
      status: contract.status
    });
    try { setRetainedContractFiles(JSON.parse(contract.fileUrls || "[]")); } catch (e) { setRetainedContractFiles([]); }
    setIsContractFormOpen(true);
  };

  const handleDeleteContract = async (id: string) => {
    if (window.confirm("Delete this contract and ALL its files forever?")) {
      await fetch(`/api/contracts/${id}`, { method: 'DELETE' });
      fetchClientData();
    }
  };

  // --- DOCUMENT LOGIC ---
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

    setEditingDocId(null);
    setIsDocFormOpen(false);
    setDocForm({ title: '', details: '', date: '' });
    setDocFiles(null);
    setRetainedDocFiles([]);
    fetchClientData();
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDocId(doc.id);
    setDocForm({
      title: doc.title,
      details: doc.details || '',
      date: doc.date ? new Date(doc.date).toISOString().split('T')[0] : ''
    });
    try { setRetainedDocFiles(JSON.parse(doc.fileUrls || "[]")); } catch (e) { setRetainedDocFiles([]); }
    setIsDocFormOpen(true);
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm("Delete this document box and ALL its files forever?")) {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      fetchClientData();
    }
  };

  if (!client) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      
      {/* 1. TOP NAVIGATION */}
      <Link href="/clients" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors">
        <ArrowLeft size={18} /> Back to Directory
      </Link>

      {/* 2. PROFILE HEADER */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 flex-shrink-0">
          <Building2 size={40} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{client.name}</h1>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-600">
            {client.email && <div className="flex items-center gap-2"><Mail size={16} className="text-gray-400"/> {client.email}</div>}
            {client.phone && <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400"/> {client.phone}</div>}
            {client.address && <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400"/> {client.address}</div>}
          </div>
          {client.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm">
              <span className="font-bold text-gray-500 uppercase text-xs block mb-1">Internal Notes</span>
              {client.notes}
            </div>
          )}
        </div>
      </div>

      {/* 3. TABS SYSTEM */}
      <div className="flex gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('contracts')} 
          className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'contracts' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Contracts ({client.contracts.length})
          {activeTab === 'contracts' && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('documents')} 
          className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'documents' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Documents & Files ({client.documents.length})
          {activeTab === 'documents' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {/* =========================================================================
          TAB 1: CONTRACTS 
          ========================================================================= */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Contract History</h2>
            {!isContractFormOpen && (
              <button onClick={() => setIsContractFormOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-sm">
                <Plus size={18} /> New Contract
              </button>
            )}
          </div>

          {/* HIDDEN CONTRACT FORM */}
          {isContractFormOpen && (
            <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-md relative">
              <button onClick={() => { setIsContractFormOpen(false); setEditingContractId(null); setContractForm({ startDate: '', expirationDate: '', status: 'Active' }); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={20}/></button>
              <h3 className="text-lg font-bold mb-4 text-gray-800">{editingContractId ? 'Edit Contract' : 'Add New Contract'}</h3>
              
              <form onSubmit={handleContractSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" required value={contractForm.startDate} onChange={e => setContractForm({...contractForm, startDate: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                    <input type="date" required value={contractForm.expirationDate} onChange={e => setContractForm({...contractForm, expirationDate: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={contractForm.status} onChange={e => setContractForm({...contractForm, status: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg bg-white">
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>

                {/* Retained Files Management */}
                {editingContractId && retainedContractFiles.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Current Attached Files</p>
                    <div className="flex flex-col gap-2">
                      {retainedContractFiles.map(url => (
                        <div key={url} className="flex justify-between items-center bg-white p-2 border border-gray-100 rounded text-sm text-gray-600">
                          <span>{getFileName(url)}</span>
                          <button type="button" onClick={() => removeRetainedContractFile(url)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-purple-600 mb-1">{editingContractId ? 'Upload Additional Files' : 'Upload Contract Files (Select Multiple)'}</label>
                  <input type="file" multiple onChange={e => setContractFiles(e.target.files)} className="w-full text-sm file:py-2 file:px-4 file:bg-purple-50 file:text-purple-700 file:rounded-lg file:border-0 hover:file:bg-purple-100 cursor-pointer" />
                </div>
                
                <button type="submit" className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium w-full md:w-auto">
                  {editingContractId ? 'Save Changes' : 'Create Contract'}
                </button>
              </form>
            </div>
          )}

          {/* STREAMLINED CONTRACT ROWS */}
          <div className="space-y-3">
            {client.contracts.map((contract) => {
              const isExpired = new Date(contract.expirationDate) < new Date();
              let files: string[] = [];
              try { files = JSON.parse(contract.fileUrls); } catch (e) {}

              return (
                <div key={contract.id} className={`bg-white border p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-shadow hover:shadow-md ${isExpired ? 'border-red-200' : 'border-gray-200'}`}>
                  
                  {/* Info Column */}
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {isExpired ? 'Expired' : contract.status}
                      </span>
                      {isExpired && <span className="flex items-center text-red-500 text-xs font-bold gap-1"><AlertCircle size={14}/> Needs Renewal</span>}
                    </div>
                    <div className="flex items-center gap-2 text-gray-800 font-semibold mt-2">
                      <Calendar size={18} className="text-gray-400" />
                      {new Date(contract.startDate).toLocaleDateString()} &nbsp;➔&nbsp; {new Date(contract.expirationDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Files Column */}
                  <div className="flex-1 max-w-md flex flex-wrap gap-2">
                    {files.map((url, i) => (
                      <a key={i} href={url} target="_blank" className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition">
                        <Paperclip size={14}/> {getFileName(url).substring(0, 15)}...
                      </a>
                    ))}
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditContract(contract)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"><Pencil size={18}/></button>
                    <button onClick={() => handleDeleteContract(contract.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
                  </div>
                </div>
              );
            })}
            {client.contracts.length === 0 && <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">No contracts found.</div>}
          </div>
        </div>
      )}


      {/* =========================================================================
          TAB 2: DOCUMENTS 
          ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Document Archive</h2>
            {!isDocFormOpen && (
              <button onClick={() => setIsDocFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-sm">
                <Plus size={18} /> New Document
              </button>
            )}
          </div>

          {/* HIDDEN DOCUMENT FORM */}
          {isDocFormOpen && (
            <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md relative">
              <button onClick={() => { setIsDocFormOpen(false); setEditingDocId(null); setDocForm({ title: '', details: '', date: '' }); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={20}/></button>
              <h3 className="text-lg font-bold mb-4 text-gray-800">{editingDocId ? 'Edit Document' : 'Upload New Document'}</h3>
              
              <form onSubmit={handleDocSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title / Name *</label>
                    <input type="text" required value={docForm.title} onChange={e => setDocForm({...docForm, title: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg" placeholder="e.g., ID Card" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date (Facultatif)</label>
                    <input type="date" value={docForm.date} onChange={e => setDocForm({...docForm, date: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarques (Facultatif)</label>
                    <textarea value={docForm.details} onChange={e => setDocForm({...docForm, details: e.target.value})} className="w-full border border-gray-300 p-2 rounded-lg h-20" />
                  </div>
                </div>

                {editingDocId && retainedDocFiles.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Current Attached Files</p>
                    <div className="flex flex-col gap-2">
                      {retainedDocFiles.map(url => (
                        <div key={url} className="flex justify-between items-center bg-white p-2 border border-gray-100 rounded text-sm text-gray-600">
                          <span>{getFileName(url)}</span>
                          <button type="button" onClick={() => removeRetainedDocFile(url)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-blue-600 mb-1">{editingDocId ? 'Upload Additional Files' : 'Select Files (Multiple Allowed)'}</label>
                  <input type="file" multiple onChange={e => setDocFiles(e.target.files)} className="w-full text-sm file:py-2 file:px-4 file:bg-blue-50 file:text-blue-700 file:rounded-lg file:border-0 hover:file:bg-blue-100 cursor-pointer" />
                </div>
                
                <button type="submit" className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium w-full md:w-auto">
                  {editingDocId ? 'Save Changes' : 'Upload Files'}
                </button>
              </form>
            </div>
          )}

          {/* STREAMLINED DOCUMENT ROWS */}
          <div className="grid grid-cols-1 gap-4">
            {client.documents.map((doc) => {
              let files: string[] = [];
              try { files = JSON.parse(doc.fileUrls); } catch (e) {}

              return (
                <div key={doc.id} className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col md:flex-row gap-6 transition-shadow hover:shadow-md">
                  
                  {/* Info Column */}
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900">{doc.title}</h4>
                    {doc.date && <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><Calendar size={14}/> {new Date(doc.date).toLocaleDateString()}</p>}
                    {doc.details && <p className="text-sm text-gray-600 mt-3 border-l-2 border-blue-200 pl-3">{doc.details}</p>}
                  </div>

                  {/* Files Column */}
                  <div className="flex-1 flex flex-wrap content-start gap-2">
                    {files.map((url, i) => (
                      <a key={i} href={url} target="_blank" className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition">
                        <Download size={14}/> {getFileName(url).substring(0, 15)}...
                      </a>
                    ))}
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-start gap-2">
                    <button onClick={() => handleEditDocument(doc)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={18}/></button>
                    <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
                  </div>

                </div>
              );
            })}
            {client.documents.length === 0 && <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">No documents found.</div>}
          </div>
        </div>
      )}

    </div>
  );
}
