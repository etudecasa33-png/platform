"use client";
import { useEffect, useState } from 'react';
import { FileText, Calendar, Eye, FolderOpen, ShieldCheck, X, Globe, FileCheck, Map, MapPin } from 'lucide-react';
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
type ClientProfile = { id: string; name: string; trackingLink?: string | null; contracts: Contract[]; documents: ClientDocument[]; invoices: Invoice[]; };

const translations = {
  en: {
    loadingPortal: "Loading your secure portal...",
    secureConnection: "Automondo Workspace",
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
    secureConnection: "مساحة عمل أوتوموندو",
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

  const displayInvoices: Invoice[] = (client.invoices && client.invoices.length > 0)
    ? client.invoices
    : [{
        id: 'default-doc',
        title: client.name,
        currency: 'AED',
        totalAmount: 0,
        paidAmount: 0,
        createdAt: new Date().toISOString(),
        invoiceNumber: 'PENDING',
        metadata: {}
      }];

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-[#f4f6f9] p-4 sm:p-6 md:p-12 select-none overflow-x-hidden ${lang === 'ar' ? cairo.className : 'font-sans'}`} 
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="max-w-5xl mx-auto relative">
        
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className={`flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition text-sm font-bold text-gray-700 ${lang === 'en' ? cairo.className : 'font-sans'}`}
          >
            <Globe size={18} className="text-[#f7b718]" />
            {t.langToggle}
          </button>
        </div>

        {/* --- HEADER WITH AUTOMONDO LOGO (NOIR) --- */}
        <div className="bg-[#161616] p-6 sm:p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center md:items-center text-center md:text-start gap-6 mb-8 border border-[#2a2a2a] text-white relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f7b718]/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="shrink-0 flex items-center justify-center relative z-10 w-full md:w-auto mx-auto md:mx-0">
            <img 
              src="/api/portal?asset=logo.png" 
              onError={(e) => { e.currentTarget.src = '/api/portal?asset=looogo.PNG'; }}
              alt="Automondo Logo" 
              className="w-40 sm:w-48 h-auto object-contain drop-shadow-2xl"
            />
          </div>

          <div className="w-full relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <ShieldCheck size={18} className="text-[#f7b718]" />
              <span className="text-[#f7b718] font-bold text-xs sm:text-sm tracking-widest uppercase">{t.secureConnection}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1">{t.welcome} <span className="text-white">{client.name}</span></h1>
          </div>
        </div>

        {/* --- TRACKING BANNER (NOIR AVEC TOUCHES GOLD) --- */}
        {client.trackingLink && (
          <div className="mb-10 bg-[#161616] rounded-[2rem] p-6 sm:p-8 shadow-xl border border-[#f7b718]/20 text-white flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start relative overflow-hidden group hover:border-[#f7b718]/40 transition-colors">
            
            {/* Effet de lumière gold f l'arrière-plan */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#f7b718]/5 to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#f7b718]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
              <div className="bg-[#f7b718]/10 p-4 rounded-full shrink-0 border border-[#f7b718]/20 shadow-[0_0_15px_rgba(247,183,24,0.1)]">
                <MapPin size={32} className="text-[#f7b718] sm:w-8 sm:h-8" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-1 text-white flex items-center justify-center md:justify-start gap-3">
                  {t.trackVehicle}
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f7b718] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f7b718]"></span>
                  </span>
                </h3>
                <p className="text-gray-400 text-sm sm:text-base font-medium">{t.trackDesc}</p>
              </div>
            </div>
            <a
              href={client.trackingLink}
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-[#f7b718] to-[#e5a60b] hover:from-[#e5a60b] hover:to-[#d4980a] text-[#161616] px-8 py-3.5 rounded-xl font-black text-base sm:text-lg transition-all shadow-[0_8px_20px_-6px_rgba(247,183,24,0.4)] whitespace-nowrap flex items-center justify-center gap-2 w-full md:w-auto relative z-10 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Map size={20} strokeWidth={2.5} />
              {t.trackBtn}
            </a>
          </div>
        )}

        {client.invoices && client.invoices.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-5 px-1">{t.billing}</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {client.invoices.map((inv) => {
                const remaining = Math.max(0, inv.totalAmount - inv.paidAmount);
                const isPaidOff = remaining <= 0;

                return (
                  <div key={inv.id} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden transition hover:shadow-md">
                    <div className={`absolute top-0 start-0 w-full h-1.5 ${isPaidOff ? 'bg-green-500' : 'bg-amber-400'}`} />
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4 mt-2">
                      <div className="pe-0 sm:pe-4 border-b sm:border-0 border-gray-100 pb-4 sm:pb-0 w-full">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${isPaidOff ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          {isPaidOff ? t.fullyPaid : t.pendingPayment}
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-lg sm:truncate whitespace-normal" title={inv.title}>
                          {inv.title}
                        </h4>
                      </div>
                      <div className="text-start sm:text-end shrink-0 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-lg w-full sm:w-auto">
                        <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">{t.total}</p>
                        <p className="text-xl sm:text-2xl font-black text-gray-900 font-sans break-words">
                          {inv.totalAmount.toLocaleString('en-US')} <span className="text-sm font-semibold text-gray-500">{inv.currency}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-100 gap-3 sm:gap-0">
                      <div className="flex justify-between items-center w-full sm:w-auto sm:block">
                        <p className="text-xs text-gray-500 font-medium mb-0 sm:mb-0.5">{t.amountPaid}</p>
                        <p className="text-sm font-bold text-green-600 font-sans">
                          {inv.paidAmount.toLocaleString('en-US')} <span className="text-xs">{inv.currency}</span>
                        </p>
                      </div>
                      <div className="w-full h-px bg-gray-200 sm:hidden"></div>
                      <div className="flex justify-between items-center w-full sm:w-auto sm:block sm:text-end">
                        <p className="text-xs text-gray-500 font-medium mb-0 sm:mb-0.5">{t.remainingBalance}</p>
                        <p className={`text-base font-black font-sans ${isPaidOff ? 'text-gray-400' : 'text-red-500'}`}>
                          {remaining.toLocaleString('en-US')} <span className="text-xs">{inv.currency}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button onClick={() => setActiveTab('contracts')} className={`flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-xl font-bold transition-all w-full sm:w-auto ${activeTab === 'contracts' ? 'bg-[#161616] text-[#f7b718] shadow-lg shadow-black/10' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
            <FileText size={18} /> {t.myContracts}
          </button>
          <button onClick={() => setActiveTab('documents')} className={`flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-xl font-bold transition-all w-full sm:w-auto ${activeTab === 'documents' ? 'bg-[#161616] text-[#f7b718] shadow-lg shadow-black/10' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
            <FolderOpen size={18} /> {t.otherDocs}
          </button>
        </div>

        {activeTab === 'contracts' && (
          <div className="space-y-6">

            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">AutoMondo Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayInvoices.map((inv) => (
                  <div key={inv.id} className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-[#f7b718]/50 transition-colors">
                    <div className="mb-4">
                      <p className="font-bold text-gray-900 truncate">{inv.title}</p>
                      <p className="text-sm text-gray-500 font-sans">{inv.totalAmount.toLocaleString('en-US')} {inv.currency}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto border-t border-gray-100 pt-4">
                      <button 
                        onClick={() => setGeneratedDoc({ type: 'INVOICE', data: inv })} 
                        className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition"
                      >
                        <FileText size={16}/> {t.viewInvoice}
                      </button>
                      <button 
                        onClick={() => setGeneratedDoc({ type: 'RECEIPT', data: inv })} 
                        className="flex items-center justify-center gap-1.5 bg-[#f7b718]/10 hover:bg-[#f7b718]/20 text-[#b5820a] py-2.5 rounded-xl text-xs sm:text-sm font-bold transition"
                      >
                        <FileCheck size={16}/> {t.viewReceipt}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {client.contracts && client.contracts.map((contract) => {
              let files: string[] = [];
              try { files = JSON.parse(contract.fileUrls); } catch (e) {}

              return (
                <div key={contract.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-sans">{contract.status}</span>
                    <div className="flex items-center gap-2 text-gray-800 font-bold mt-3 text-sm sm:text-base font-sans">
                      <Calendar size={18} className="text-gray-400 shrink-0" />
                      {new Date(contract.startDate).toLocaleDateString()} {lang === 'ar' ? ' ⬅ ' : ' ➔ '} {new Date(contract.expirationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    {files.map((url, i) => (
                      <button key={i} onClick={() => setSecureFileUrl(url)} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-5 py-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-bold hover:bg-slate-200 transition border border-slate-200 w-full">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {client.documents && client.documents.map((doc) => {
              let files: string[] = [];
              try { files = JSON.parse(doc.fileUrls); } catch (e) {}

              return (
                <div key={doc.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2">{doc.title}</h3>
                  {doc.date && <p className="text-sm text-gray-500 mb-4 flex items-center gap-1 font-sans"><Calendar size={14}/> {new Date(doc.date).toLocaleDateString()}</p>}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row flex-wrap gap-2">
                    {files.map((url, i) => (
                      <button key={i} onClick={() => setSecureFileUrl(url)} className="flex items-center justify-center gap-1.5 bg-slate-100 text-slate-700 px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-bold hover:bg-slate-200 transition border border-slate-200 w-full sm:w-auto">
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

      {/* --- MODAL (PDF / INVOICE VIEWER) --- */}
      {(secureFileUrl || generatedDoc) && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 flex flex-col items-center justify-center p-2 sm:p-6 backdrop-blur-md">
          
          <button 
            onClick={() => { setSecureFileUrl(null); setGeneratedDoc(null); }} 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:p-3 rounded-full flex items-center gap-2 font-bold shadow-lg transition-transform hover:scale-105 z-[110]"
          >
            <X size={20} /> <span className="hidden sm:inline">{t.closeFile}</span>
          </button>

          <div className="relative w-full max-w-5xl h-[92vh] sm:h-[85vh] bg-gray-200 rounded-xl sm:rounded-2xl overflow-auto shadow-2xl" dir="ltr">
            
            <div className="min-h-max w-fit min-w-full flex justify-start lg:justify-center items-start p-2 sm:p-8 overflow-x-auto">
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
                <div className="relative w-full h-full flex items-center justify-start lg:justify-center min-w-fit">
                  <div className="absolute inset-0 z-30 cursor-default" onContextMenu={(e) => e.preventDefault()} />
                  <img src={secureFileUrl} alt="Secure Document" className="max-w-none lg:max-w-full max-h-full object-contain z-10 select-none p-2 sm:p-4" draggable={false} />
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