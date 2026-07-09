"use client";
import { useEffect, useState } from 'react';
import { FileText, Calendar, Building2, Eye, FolderOpen, ShieldCheck, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const SecurePdfViewer = dynamic(() => import('../components/SecurePdfViewer'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center font-bold text-gray-400">Initializing secure viewer...</div>
});

export default function ClientPortal() {
  const [client, setClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'contracts' | 'documents'>('contracts');
  const [secureFileUrl, setSecureFileUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portal').then(res => res.json()).then(setClient);
  }, []);

  const getFileName = (url: string) => url.split('-').slice(1).join('-') || url.split('/').pop();

  if (!client) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">Loading your secure portal...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 select-none" onContextMenu={(e) => e.preventDefault()}>
      <div className="max-w-5xl mx-auto">
        
        {/* Portal Header */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6 mb-8 border border-slate-800 text-white">
          <div className="bg-blue-500/20 p-5 rounded-2xl text-blue-400">
            <Building2 size={48} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Secure Portal Connection</span>
            </div>
            <h1 className="text-3xl font-black mb-1">Welcome, {client.name}</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('contracts')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'contracts' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
            <FileText size={18} /> My Contracts
          </button>
          <button onClick={() => setActiveTab('documents')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'documents' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
            <FolderOpen size={18} /> Other Documents
          </button>
        </div>

        {/* CONTRACTS VIEW */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            {client.contracts.map((contract: any) => {
              let files: string[] = [];
              try { files = JSON.parse(contract.fileUrls); } catch (e) {}

              return (
                <div key={contract.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{contract.status}</span>
                    <div className="flex items-center gap-2 text-gray-800 font-bold mt-3">
                      <Calendar size={18} className="text-gray-400" />
                      {new Date(contract.startDate).toLocaleDateString()} &nbsp;➔&nbsp; {new Date(contract.expirationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {files.map((url, i) => (
                      <button key={i} onClick={() => setSecureFileUrl(url)} className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-100 transition border border-purple-200">
                        <Eye size={16}/> View Securely
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DOCUMENTS VIEW */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.documents.map((doc: any) => {
              let files: string[] = [];
              try { files = JSON.parse(doc.fileUrls); } catch (e) {}

              return (
                <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{doc.title}</h3>
                  {doc.date && <p className="text-sm text-gray-500 mb-4 flex items-center gap-1"><Calendar size={14}/> {new Date(doc.date).toLocaleDateString()}</p>}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    {files.map((url, i) => (
                      <button key={i} onClick={() => setSecureFileUrl(url)} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition border border-blue-200 w-full justify-center">
                        <Eye size={16}/> View Document {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =======================================================
          UPGRADED: THE SMART SECURE IN-APP FILE VIEWER
          ======================================================= */}
   {secureFileUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          
          <button 
            onClick={() => setSecureFileUrl(null)} 
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full flex items-center gap-2 font-bold shadow-lg transition-transform hover:scale-105 z-50"
          >
            <X size={20} /> Close File
          </button>

          <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
            
            {/* 1. The Repeating Grid Watermark (pointer-events-none lets the scroll pass through it) */}
            <div 
              className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-multiply"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' transform='rotate(-45 150 150)' font-size='32' fill='black' font-family='sans-serif' font-weight='900' letter-spacing='2'%3EAUTOMONDO%3C/text%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            />

            {/* 2. The Smart File Renderer */}
            {secureFileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
              
              // IMAGE VIEWER: Has its own specific glass shield
              <div className="relative w-full h-full flex items-center justify-center">
                <div 
                  className="absolute inset-0 z-30 cursor-default" 
                  onContextMenu={(e) => e.preventDefault()} 
                />
                <img 
                  src={secureFileUrl} 
                  alt="Secure Document" 
                  className="max-w-full max-h-full object-contain z-10 select-none p-4" 
                  draggable={false} 
                />
              </div>

            ) : (
              
              // THE NEW SECURE PDF VIEWER: Handles its own scrolling and right-click blocking!
              <SecurePdfViewer url={secureFileUrl} />

            )}
            
          </div>
        </div>
      )}
    </div>
  );
}