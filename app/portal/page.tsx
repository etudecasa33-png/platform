"use client";
import { useEffect, useState } from 'react';
import { FileText, Calendar, Building2, Eye, FolderOpen, ShieldCheck, X, Globe, FileCheck, Map, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Cairo } from 'next/font/google';

import AutoMondoDocument from '../components/AutoMondoDocument';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '600', '700', '900'] });

const SecurePdfViewer = dynamic(() => import('../components/SecurePdfViewer'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center font-bold text-gray-400">Initializing secure viewer...</div>
});

type ClientDocument = { id: string; title: string; details: string | null; date: string | null; fileUrls: string; createdAt: string; };
type Contract = { id: string; startDate: string; expirationDate: string; status: string; fileUrls: string; };
type Invoice = { id: string; title: string; currency: string; totalAmount: number; paidAmount: number; createdAt: string; invoiceNumber?: string; metadata?: any; };
// NOUVEAU: Ajout de trackingLink
type ClientProfile = { id: string; name: string; trackingLink?: string | null; contracts: Contract[]; documents: ClientDocument[]; invoices: Invoice[]; };

const translations = {
  en: {
    loadingPortal: "Loading your secure portal...",
    secureConnection: "Client Workspace",
    welcome: "Welcome,",
    billing: "Billing & Invoices",
    fullyPaid: "Fully Paid",
    pendingPayment: "Pending Payment",
    total: "Total",
    amountPaid: "Amount Paid",
    remainingBalance: "Remaining Balance",
    myContracts: "My Contracts",
    otherDocs: "Other Documents",
    viewSecurely: "View",
    viewDoc: "View Document",
    closeFile: "Close Document",
    langToggle: "عربي",
    viewInvoice: "View AutoMondo Invoice", 
    viewReceipt: "View Receipt Voucher",
    trackVehicle: "Track Your Vehicle",
    trackDesc: "Follow your shipment in real-time",
    trackBtn: "Live Tracking"
  },
  ar: {
    loadingPortal: "جاري تحميل بوابتك الآمنة...",
    secureConnection: "مساحة عمل العميل",
    welcome: "مرحباً،",
    billing: "الفواتير والمدفوعات",
    fullyPaid: "مدفوع بالكامل",
    pendingPayment: "في انتظار الدفع",
    total: "الإجمالي",
    amountPaid: "المبلغ المدفوع",
    remainingBalance: "الرصيد المتبقي",
    myContracts: "عقودي",
    otherDocs: "مستندات أخرى",
    viewSecurely: "عرض",
    viewDoc: "عرض المستند",
    closeFile: "إغلاق المستند",
    langToggle: "English",
    viewInvoice: "عرض فاتورة أوتوموندو", 
    viewReceipt: "عرض إيصال الدفع",
    trackVehicle: "تتبع سيارتك",
    trackDesc: "تابع مسار شحنتك في الوقت الفعلي",
    trackBtn: "تتبع مباشر"
  }
};

export default function ClientPortal() {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'contracts' | 'documents'>('contracts');
  const [secureFileUrl, setSecureFileUrl] = useState<string | null>(null);
  const [generatedDoc, setGeneratedDoc] = useState<{type: 'INVOICE' | 'RECEIPT', data: Invoice} | null>(null);

  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = translations[lang];

  useEffect(() => {
    fetch('/api/portal').then(res => res.json()).then(setClient);
  }, []);

  if (!client) return <div className={`min-h-screen flex items-center justify-center text-gray-500 font-bold ${lang === 'ar' ? cairo.className : 'font-sans'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{t.loadingPortal}</div>;

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-slate-50 p-6 md:p-12 select-none ${lang === 'ar' ? cairo.className : 'font-sans'}`} 
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="max-w-5xl mx-auto relative">
        
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className={`flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm font-bold text-gray-700 ${lang === 'en' ? cairo.className : 'font-sans'}`}
          >
            <Globe size={18} className="text-blue-600" />
            {t.langToggle}
          </button>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6 mb-8 border border-slate-800 text-white">
          <div className="bg-blue-500/20 p-5 rounded-2xl text-blue-400">
            <Building2 size={48} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">{t.secureConnection}</span>
            </div>
            <h1 className="text-3xl font-black mb-1">{t.welcome} {client.name}</h1>
          </div>
        </div>

        {/* --- NOUVEAU : BANNIÈRE DE TRACKING --- */}
        {client.trackingLink && (
          <div className="mb-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-full shrink-0">
                <MapPin size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-1">{t.trackVehicle}</h3>
                <p className="text-blue-100 font-medium">{t.trackDesc}</p>
              </div>
            </div>
            <a
              href={client.trackingLink}
              target="_blank"
              rel="noreferrer"
              className="bg-white text-blue-700 hover:bg-gray-50 px-8 py-3.5 rounded-xl font-black text-lg transition-transform hover:scale-105 shadow-lg whitespace-nowrap flex items-center justify-center gap-2"
            >

<Map size={20} />
{t.trackBtn}
            </a>
          </div>
        )}

        {client.invoices && client.invoices.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-5 px-1">{t.billing}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {client.invoices.map((inv) => {
                const remaining = Math.max(0, inv.totalAmount - inv.paidAmount);
                const isPaidOff = remaining <= 0;

                return (
                  <div key={inv.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative overflow-hidden transition hover:shadow-md">
                    <div className={`absolute top-0 start-0 w-full h-1.5 ${isPaidOff ? 'bg-green-500' : 'bg-amber-400'}`} />
                    
                    <div className="flex justify-between items-start mb-4 mt-1">
                      <div className="pe-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${isPaidOff ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          {isPaidOff ? t.fullyPaid : t.pendingPayment}
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-lg truncate" title={inv.title}>
                          {inv.title}
                        </h4>
                      </div>
                      <div className="text-end shrink-0">
                        <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">{t.total}</p>
                        <p className="text-xl font-black text-gray-900 font-sans">
                          {inv.totalAmount.toLocaleString()} <span className="text-sm font-semibold text-gray-500">{inv.currency}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-0.5">{t.amountPaid}</p>
                        <p className="text-sm font-bold text-green-600 font-sans">
                          {inv.paidAmount.toLocaleString()} <span className="text-xs">{inv.currency}</span>
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">{t.remainingBalance}</p>
                        <p className={`text-base font-black font-sans ${isPaidOff ? 'text-gray-400' : 'text-red-500'}`}>
                          {remaining.toLocaleString()} <span className="text-xs">{inv.currency}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('contracts')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'contracts' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
            <FileText size={18} /> {t.myContracts}
          </button>
          <button onClick={() => setActiveTab('documents')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'documents' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
            <FolderOpen size={18} /> {t.otherDocs}
          </button>
        </div>

        {activeTab === 'contracts' && (
          <div className="space-y-6">

            {client.invoices && client.invoices.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">AutoMondo Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {client.invoices.map((inv) => (
                    <div key={inv.id} className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="mb-4">
                        <p className="font-bold text-gray-900 truncate">{inv.title}</p>
                        <p className="text-sm text-gray-500 font-sans">{inv.totalAmount.toLocaleString()} {inv.currency}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-auto border-t border-gray-100 pt-4">
                        <button 
                          onClick={() => setGeneratedDoc({ type: 'INVOICE', data: inv })} 
                          className="flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl text-xs font-bold transition"
                        >
                          <FileText size={16}/> {t.viewInvoice}
                        </button>
                        <button 
                          onClick={() => setGeneratedDoc({ type: 'RECEIPT', data: inv })} 
                          className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-xs font-bold transition"
                        >
                          <FileCheck size={16}/> {t.viewReceipt}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {client.contracts.map((contract) => {
              let files: string[] = [];
              try { files = JSON.parse(contract.fileUrls); } catch (e) {}

              return (
                <div key={contract.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-sans">{contract.status}</span>
                    <div className="flex items-center gap-2 text-gray-800 font-bold mt-3 font-sans">
                      <Calendar size={18} className="text-gray-400" />
                      {new Date(contract.startDate).toLocaleDateString()} {lang === 'ar' ? ' ⬅ ' : ' ➔ '} {new Date(contract.expirationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {files.map((url, i) => (
                      <button key={i} onClick={() => setSecureFileUrl(url)} className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-100 transition border border-purple-200">
                        <Eye size={16}/> {t.viewSecurely}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.documents.map((doc) => {
              let files: string[] = [];
              try { files = JSON.parse(doc.fileUrls); } catch (e) {}

              return (
                <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{doc.title}</h3>
                  {doc.date && <p className="text-sm text-gray-500 mb-4 flex items-center gap-1 font-sans"><Calendar size={14}/> {new Date(doc.date).toLocaleDateString()}</p>}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    {files.map((url, i) => (
                      <button key={i} onClick={() => setSecureFileUrl(url)} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition border border-blue-200 w-full justify-center">
                        <Eye size={16}/> {t.viewDoc} {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(secureFileUrl || generatedDoc) && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          
          <button 
            onClick={() => { setSecureFileUrl(null); setGeneratedDoc(null); }} 
            className="absolute top-6 end-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full flex items-center gap-2 font-bold shadow-lg transition-transform hover:scale-105 z-50"
          >
            <X size={20} /> {t.closeFile}
          </button>

          <div className="relative w-full max-w-5xl h-[85vh] bg-gray-200 rounded-2xl overflow-y-auto shadow-2xl flex justify-center no-scrollbar" dir="ltr">
            
            <div className="min-h-max w-full flex justify-center items-start p-4 md:p-8">
              {generatedDoc ? (
                <AutoMondoDocument 
                  type={generatedDoc.type}
                  clientName={client.name}
                  clientIdNumber={generatedDoc.data.metadata?.idNumber}
                  amount={generatedDoc.data.totalAmount}
                  currency={generatedDoc.data.currency}
                  itemDescription={generatedDoc.data.metadata?.itemDescription || generatedDoc.data.title}
                  documentNumber={generatedDoc.data.invoiceNumber || 'PENDING'}
                  date={generatedDoc.data.createdAt}
                  isClientView={true}
                />
              ) : secureFileUrl && secureFileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
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
              ) : secureFileUrl ? (
                <SecurePdfViewer url={secureFileUrl} />
              ) : null}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}