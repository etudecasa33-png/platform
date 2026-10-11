"use client";
import React from 'react';

type DocumentProps = {
  type: 'INVOICE' | 'RECEIPT';
  clientName: string;
  clientIdNumber?: string;
  amount: number;
  currency: string;
  itemDescription: string;
  documentNumber: string;
  date: string;
  amountInWords?: string;
  isClientView?: boolean;
};

const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero';
  
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + a[n % 10] : ' ');
    if (n < 1000) return a[Math.floor(n / 100)] + 'hundred ' + (n % 100 !== 0 ? 'and ' + convert(n % 100) : '');
    if (n < 1000000) return convert(Math.floor(n / 1000)) + 'thousand ' + (n % 1000 !== 0 ? convert(n % 1000) : '');
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + 'million ' + (n % 1000000 !== 0 ? convert(n % 1000000) : '');
    return '';
  };

  const result = convert(num).trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function AutoMondoDocument({
  type, clientName, clientIdNumber, amount, currency, itemDescription, documentNumber, date, amountInWords, isClientView = false
}: DocumentProps) {
  
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = String(parsedDate.getFullYear());

  const formattedAmount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const currencySuffix = (currency === 'DA' || currency === 'DZD') ? 'Algerian dinars' : 'Dirhams';
  const dynamicAmountInWords = `${numberToWords(amount)} ${currencySuffix}.`;

  // Dimensions strictes A4 en pixels (96 DPI)
  const exactWidth = type === 'INVOICE' ? '794px' : '1123px';
  const exactHeight = type === 'INVOICE' ? '1123px' : '794px';

  return (
    <div className="flex flex-col items-center w-full relative overflow-auto no-scrollbar">
      
      {/* --- CSS D'IMPRESSION STRICT: Fixe le document pour qu'il soit identique à l'écran --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          ${isClientView ? `
            html, body { display: none !important; }
          ` : `
            @page { 
              size: ${type === 'INVOICE' ? 'A4 portrait' : 'A4 landscape'}; 
              margin: 0 !important; 
            }
            body { 
              background: white !important; 
              margin: 0 !important; 
              padding: 0 !important; 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
            }
            body * { visibility: hidden; }
            #automondo-doc, #automondo-doc * { visibility: visible; }
            
            #automondo-doc { 
              position: absolute !important; 
              left: 0 !important; 
              top: 0 !important; 
              margin: 0 !important; 
              padding: 0 !important; 
              box-shadow: none !important; 
              page-break-after: avoid !important; 
              page-break-before: avoid !important; 
              page-break-inside: avoid !important;
            }
          `}
        }
      `}} />

      {/* --- BOUTON D'IMPRESSION : Caché pour le client --- */}
      {!isClientView && (
        <div className="print:hidden w-full max-w-[1123px] flex justify-end mb-4 pr-4">
          <button 
            onClick={() => window.print()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print / Download PDF
          </button>
        </div>
      )}

      {/* --- CONTENEUR PRINCIPAL DU DOCUMENT --- */}
      {/* On utilise des styles inline (width, height) pour garantir que Tailwind ne modifie jamais la taille */}
      <div 
        id="automondo-doc"
        className="bg-white font-sans select-none relative shadow-2xl print:shadow-none overflow-hidden mx-auto shrink-0" 
        style={{ width: exactWidth, height: exactHeight }}
        onContextMenu={(e) => e.preventDefault()}
      >
        
        {/* --- FILIGRANE CLIENT --- */}
        {isClientView && (
          <div 
            className="absolute inset-0 z-50 pointer-events-none opacity-[0.05]" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' transform='rotate(-45 150 150)' font-size='28' fill='black' font-family='sans-serif' font-weight='900' letter-spacing='4'%3EAUTOMONDO%3C/text%3E%3C/svg%3E")`, 
              backgroundRepeat: 'repeat' 
            }} 
          />
        )}

        {/* ========================================== */}
        {/* ======== FORMAT FACTURE (PORTRAIT) ======= */}
        {/* ========================================== */}
        {type === 'INVOICE' && (
          <div className="w-full h-full relative flex flex-col justify-between pb-8">
            
            <div>
              {/* En-tête Noir et Or */}
              <div className="bg-[#161616] h-24 w-full flex items-center justify-end pr-8 relative">
                <div className="absolute top-0 left-0 h-40 w-[350px] bg-[#1f2229] z-10 flex flex-col items-center pt-6" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}>
                   <img src="/logo.png" className="w-56 mt-2 mr-8 relative z-20" alt="AutoMondo Logo" />
                </div>
                <h1 className="text-[#f7b718] text-2xl font-black tracking-widest uppercase z-0">PROFORMA INVOICE</h1>
              </div>

              <div className="px-10 pt-10"> 
                <h2 className="text-4xl font-black tracking-widest text-[#231f20] mb-4">AUTOMONDO FZ-LLC</h2>
                
                <div className="flex justify-between text-[11px] font-bold text-[#4a4a4a] mb-6 leading-relaxed">
                  <div>
                    <p className="text-right text-lg mb-1 font-black arabic-text">اوتوموندو ش.م.ح</p>
                    <p>Compass Building,</p>
                    <p>Al Shohada Road,</p>
                    <p>AL Hamra Industrial Zone-FZ,</p>
                    <p>Ras Al Khaimah, United Arab Emirates</p>
                  </div>
                  <div className="text-right pt-8">
                    <p>Email : contact@automondodxb.com</p>
                    <p>Mob: +971 54 423 2321</p>
                    <p>Website : www.automondo.net</p>
                  </div>
                </div>

                <div className="flex justify-between text-xs font-black text-black mb-6">
                  <div>
                    <p>INVOICE TO: {clientName.toUpperCase()}</p>
                    <p className="ml-6 mt-0.5">DESTINATION : ALGERIA</p>
                    <p className="ml-6 mt-0.5">ID NUMBER : {clientIdNumber || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p>INVOICE#: <span className="font-medium">{documentNumber}</span></p>
                    <p className="mt-0.5">DATE: <span className="font-medium">{day}.{month}.{year}</span></p>
                  </div>
                </div>

                <table className="w-full text-xs border-collapse mb-2">
                  <thead>
                    <tr className="bg-black text-white text-center">
                      <th className="border-r border-white/30 w-8 py-2"></th>
                      <th className="border-r border-white/30 py-2">ITEM DESCRIPTION</th>
                      <th className="border-r border-white/30 py-2 w-32">PRICE</th>
                      <th className="border-r border-white/30 py-2 w-16">QTY.</th>
                      <th className="py-2 w-32">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#dcdcdc] text-black font-medium">
                    <tr>
                      <td className="border border-black py-4 px-2 text-center text-[10px]">1</td>
                      <td className="border border-black py-4 px-3">{itemDescription.toUpperCase()}</td>
                      <td className="border border-black py-4 px-2 text-right">{formattedAmount}{currency}</td>
                      <td className="border border-black py-4 px-2 text-center">1</td>
                      <td className="border border-black py-4 px-2 text-right">{formattedAmount}{currency}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-between text-xs font-black mb-4 px-1">
                  <p>Thank you for your business</p>
                  <p className="font-normal text-gray-600 mr-20">TAX: 0.00%</p>
                  <p>SUB TOTAL: {formattedAmount} {currency}</p>
                </div>

                <div className="flex justify-end mb-6">
                  <div className="bg-black text-white px-4 py-2 font-black text-sm flex items-center gap-2">
                    TOTAL: <span className="text-[#3b82f6] underline underline-offset-4 decoration-2">{formattedAmount} {currency}</span>
                  </div>
                </div>

                <div className="flex justify-end mb-2 pr-12 h-28 relative">
                   <img src="/stamp.png" className="absolute right-10 top-[-10px] w-40 opacity-90 z-20" alt="AutoMondo Stamp" />
                </div>
              </div>
            </div>

            {/* Section Footer */}
            <div className="px-10 mt-auto">
              <div className="grid grid-cols-2 gap-8 text-[10px] mb-4">
                <div>
                  <p className="font-black text-sm mb-2">Payment Info:</p>
                  <p className="font-bold mb-0.5">Account Iban:</p>
                  <p className="text-gray-600 mb-2">AE190860000009937709383</p>
                  <p className="font-bold mb-0.5">A/C Name:</p>
                  <p className="text-gray-600 mb-2">AutoMondo FZ-LLC</p>
                  <p className="font-bold mb-0.5">Bank Details:</p>
                  <p className="text-gray-600 mb-2">WIOBAEADXXX</p>
                  <p className="font-bold mb-0.5">Business Address:</p>
                  <p className="text-gray-600 mb-4">Etihad Airways Centre 5th Floor, Abu Dhabi, UAE</p>
                  <p className="font-black text-xs mb-1">TERMS AND CONDITIONS :</p>
                  <p className="font-bold">DELIVERY TIME (EXW-JEBEL ALI) : <span className="font-normal text-gray-600">UNITS IN STOCK, SUBJECTED PRIOR SAELS</span></p>
                  <p className="font-bold mt-2">VALIDITY : <span className="font-normal text-gray-600">1 WEEK</span></p>
                </div>
                <div className="pt-2">
                  <p className="font-black text-xs mb-2">PAYMENT TERMS</p>
                  <p className="font-bold mb-4">100% PAYMENT BEFORE DELIVERY<br/>PAYMENT SHOULD BE COMPLETED WITHIN 10 DAYS FROM THE DATE OF DEPOSIT</p>
                  <p className="font-black text-xs mb-2">PAYMENT DELAY</p>
                  <p className="text-gray-600 mb-4">FINANCE CHARGES, VEHICLE MAINTANCE, STORAGE CHARGES WILL BE APPLICABLE IF PAYMENT DELAYED MORE THAN 20 DAYS AS AGREED.</p>
                  <p className="text-gray-600">ALL RIGHTS TO DECIDE THE FINANCE CHARGES WILL REMAIN WITH AUTOMONDO MANAGEMENT</p>
                </div>
              </div>

              <div className="text-[9px] font-bold space-y-2 pt-2 border-t border-gray-200">
                <p>RECEIVING CONFIRMATION FROM THE BUYER THAT THERE IS NO ACTIVITY ASSOCIATED WITH MONEY LAUNDERING FROM THE ORIGIN OF THE MONEY RECEIVED OR ANYTHING SURROUNDING THE DEAL</p>
                <p>NOT VALID FOR RE-EXPORT TO SANCTIONED COUNTRIES, GCC COUNTRIES & LOCAL REGISTRATION INSIDE UAE</p>
                <p><span className="underline text-blue-600">WARRANTY :</span> NO WARRANTY FOR VEHICLE & PARTS FOR RE-EXPORT</p>
              </div>
            </div>
            
          </div>
        )}

        {/* ========================================== */}
        {/* ======== FORMAT REÇU (PAYSAGE) =========== */}
        {/* ========================================== */}
        {type === 'RECEIPT' && (
          <div className="w-full h-full bg-[#f5f5f5] flex flex-col pt-12 pb-0 justify-between">
            
            {/* Section Haut */}
            <div className="bg-white px-12 py-8 flex justify-between items-center shadow-sm z-10 shrink-0">
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none text-black">RECEIPT</h1>
                <h1 className="text-3xl font-black tracking-tight leading-none text-[#ed1c24]">VOUCHER</h1>
                <div className="h-0.5 w-full bg-[#ed1c24] mt-2"></div>
              </div>
              
              <div className="flex items-center gap-6 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <span>Date:</span>
                  <div className="flex gap-2">
                    <div className="border border-gray-300 py-1.5 px-3 text-gray-600 w-12 text-center">{day}</div>
                    <div className="border border-gray-300 py-1.5 px-3 text-gray-600 w-12 text-center">{month}</div>
                    <div className="border border-gray-300 py-1.5 px-3 text-gray-600 w-16 text-center">{year}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">Payment Method:</span>
                  <div className="border border-gray-300 py-1.5 px-4 text-gray-600 bg-white shadow-sm">
                    Normal Credit Transfer (CRED)
                  </div>
                </div>
              </div>
            </div>

            {/* Section Milieu (Lignes Parfaitement Alignées) */}
            <div className="px-12 py-16 flex-1 flex flex-col justify-center relative">
              <div className="flex items-end mb-10 w-full">
                <span className="text-lg font-light text-gray-800 w-48 shrink-0">Payment Received</span>
                <div className="border-b border-gray-400 w-full text-xl text-gray-600 px-4 pb-1">
                  {clientName.toUpperCase()}
                </div>
              </div>

              <div className="flex items-start w-full gap-8">
                <div className="w-full mt-2">
                   {/* LIGNES CORRIGÉES : 3 divs absolues, le texte écrit par dessus */}
                   <div className="relative w-[90%] h-[120px]">
                      <div className="absolute inset-0 pointer-events-none z-0 flex flex-col pt-[35px]">
                         <div className="h-[40px] border-b border-gray-400 w-full"></div>
                         <div className="h-[40px] border-b border-gray-400 w-full"></div>
                         <div className="h-[40px] border-b border-gray-400 w-full"></div>
                      </div>
                      <p className="relative z-10 text-[19px] text-gray-800 capitalize leading-[40px] m-0">
                         {amountInWords || dynamicAmountInWords}
                      </p>
                   </div>
                </div>
                
                <div className="shrink-0 relative z-10 pt-4">
                  <div className="border border-[#ed1c24] bg-white text-[#555] font-black text-xl py-4 px-8 shadow-sm min-w-[280px] text-center">
                    {formattedAmount} {currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Section Footer Sombre */}
            <div className="bg-[#2a2a2a] w-full px-12 py-8 flex justify-between items-start text-white relative overflow-hidden shrink-0">
              <div className="flex items-center gap-3 z-10 mr-8">
                 <img src="/logo.png" className="w-32 relative z-20" alt="AutoMondo Logo" />
                 <h2 className="text-xl font-black leading-tight">AutoMondo<br/>FZ-LLC</h2>
              </div>

              <div className="text-sm text-gray-300 font-light leading-snug z-10">
                <p>Compass Building,</p>
                <p>Al Shohada Road,</p>
                <p>AL Hamra Industrial Zone-FZ,</p>
                <p>Ras Al Khaimah, United Arab Emirates</p>
                <p className="font-bold text-white mt-2">www.automondo.net</p>
              </div>

              <div className="text-center z-10 relative mt-4">
                <p className="text-sm font-light text-gray-300 mb-2">Received By:</p>
                <div className="border-b border-gray-500 w-48 mx-auto relative h-10">
                  <p 
                    className="absolute bottom-1 w-full text-center text-[22px] whitespace-nowrap" 
                    style={{ fontFamily: "'Segoe Script', 'Bradley Hand', 'Caveat', cursive" }}
                  >
                    Takieddine Semmache
                  </p>
                  <img src="/stamp.png" className="absolute -top-12 -right-8 w-40 opacity-90 z-20" alt="AutoMondo Stamp" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}