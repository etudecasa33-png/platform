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
};

// --- Helper function to automatically convert numbers to words ---
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
  type, clientName, clientIdNumber, amount, currency, itemDescription, documentNumber, date, amountInWords
}: DocumentProps) {
  
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = String(parsedDate.getFullYear());

  const formattedAmount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const currencySuffix = (currency === 'DA' || currency === 'DZD') ? 'Algerian dinars' : 'Dirhams';
  const dynamicAmountInWords = `${numberToWords(amount)} ${currencySuffix}.`;

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* --- SMART PRINT CSS: Locks to exactly 1 page and prevents 3-page repeating bug --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: ${type === 'INVOICE' ? 'A4 portrait' : 'A4 landscape'}; margin: 0; }
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
          body * { visibility: hidden; }
          #automondo-doc, #automondo-doc * { visibility: visible; }
          #automondo-doc { 
            position: fixed; 
            left: 0; 
            top: 0; 
            margin: 0; 
            padding: 0;
            width: 100vw; 
            height: 100vh;
            box-shadow: none !important; 
            overflow: hidden !important;
          }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />

      {/* --- PRINT / DOWNLOAD PDF BUTTON --- */}
      <div className="print:hidden w-full max-w-[1123px] flex justify-end mb-4">
        <button 
          onClick={() => window.print()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Print / Download as PDF
        </button>
      </div>

      <div 
        id="automondo-doc"
        className={`bg-white font-sans select-none relative shadow-2xl overflow-hidden print:shadow-none mx-auto w-full ${type === 'RECEIPT' ? 'max-w-[1123px] h-[794px]' : 'max-w-[794px] h-[1123px]'}`} 
        onContextMenu={(e) => e.preventDefault()}
      >
        
        {/* ========================================== */}
        {/* ======== EXACT INVOICE TEMPLATE (1.PNG) == */}
        {/* ========================================== */}
        {type === 'INVOICE' && (
          <div className="bg-white h-[1123px] relative pb-12 w-full">
            
            {/* Top Black/Gold Header Bar */}
            <div className="bg-[#161616] h-24 w-full flex items-center justify-end pr-8 relative">
              <div className="absolute top-0 left-0 h-40 w-[350px] bg-[#1f2229] z-10 flex flex-col items-center pt-6" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}>
                 <img src="/logo.png" className="w-56 mt-2 mr-8" alt="AutoMondo Logo" />
              </div>
              <h1 className="text-[#f7b718] text-2xl font-black tracking-widest uppercase z-0">PROFORMA INVOICE</h1>
            </div>

            <div className="px-10 pt-20"> 
              
              {/* Company Info Header */}
              <h2 className="text-4xl font-black tracking-widest text-[#231f20] mb-4">AUTOMONDO FZ-LLC</h2>
              
              <div className="flex justify-between text-[11px] font-bold text-[#4a4a4a] mb-12 leading-relaxed">
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

              {/* Client Info & Invoice Number */}
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

              {/* The Exact Table */}
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

              {/* Sub Totals */}
              <div className="flex justify-between text-xs font-black mb-4 px-1">
                <p>Thank you for your business</p>
                <p className="font-normal text-gray-600 mr-20">TAX: 0.00%</p>
                <p>SUB TOTAL: {formattedAmount} {currency}</p>
              </div>

              {/* Black Total Box */}
              <div className="flex justify-end mb-8">
                <div className="bg-black text-white px-4 py-2 font-black text-sm flex items-center gap-2">
                  TOTAL: <span className="text-[#3b82f6] underline underline-offset-4 decoration-2">{formattedAmount} {currency}</span>
                </div>
              </div>

              {/* Stamp Placeholder */}
              <div className="flex justify-end mb-4 pr-12 h-32 relative">
                 <img src="/stamp.png" className="absolute right-10 top-[-10px] w-40 opacity-90 mix-blend-multiply" alt="AutoMondo Stamp" />
              </div>

              {/* Footer Text Sections */}
              <div className="grid grid-cols-2 gap-8 text-[10px] mt-8">
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

              {/* Bottom Warning */}
              <div className="text-[9px] font-bold mt-4 space-y-2 pb-8 border-b-8 border-gray-200">
                <p>RECEIVING CONFIRMATION FROM THE BUYER THAT THERE IS NO ACTIVITY ASSOCIATED WITH MONEY LAUNDERING FROM THE ORIGIN OF THE MONEY RECEIVED OR ANYTHING SURROUNDING THE DEAL</p>
                <p>NOT VALID FOR RE-EXPORT TO SANCTIONED COUNTRIES, GCC COUNTRIES & LOCAL REGISTRATION INSIDE UAE</p>
                <p><span className="underline text-blue-600">WARRANTY :</span> NO WARRANTY FOR VEHICLE & PARTS FOR RE-EXPORT</p>
              </div>
              
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ======== EXACT RECEIPT TEMPLATE (2.PNG) == */}
        {/* ========================================== */}
        {type === 'RECEIPT' && (
          <div className="bg-[#f5f5f5] w-full flex flex-col pt-12 pb-0 h-[794px] justify-between">
            
            {/* Top Section */}
            <div className="bg-white px-12 py-8 flex justify-between items-center shadow-sm z-10">
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

            {/* Middle Content Section */}
            <div className="px-12 py-16 flex-1 flex flex-col justify-center">
              
              <div className="flex items-end mb-10 w-full">
                <span className="text-lg font-light text-gray-800 w-48 shrink-0">Payment Received</span>
                <div className="border-b border-gray-400 w-full text-xl text-gray-600 px-4 pb-1">
                  {clientName.toUpperCase()}
                </div>
              </div>

              <div className="flex items-end w-full gap-8">
                <div className="w-full">
                   {/* DYNAMIC UNDERLINE */}
                   <div 
                     className="w-[90%] text-lg text-gray-800 capitalize"
                     style={{ 
                       lineHeight: '40px', 
                       minHeight: '80px', 
                       backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 39px, #9ca3af 39px, #9ca3af 40px)',
                       backgroundPosition: '0 0'
                     }}
                   >
                     {amountInWords || dynamicAmountInWords}
                   </div>
                </div>
                
                <div className="shrink-0 pt-4">
                  <div className="border border-[#ed1c24] bg-white text-[#555] font-black text-lg py-4 px-8 shadow-sm min-w-[280px]">
                    {formattedAmount} {currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Footer Section */}
            <div className="bg-[#2a2a2a] w-full px-12 py-10 flex justify-between items-start text-white relative overflow-hidden">
              
              <div className="flex items-center gap-3 z-10 mr-8">
                 <img src="/logo.png" className="w-32" alt="AutoMondo Logo" />
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
                    className="absolute bottom-1 w-full text-center text-[19px] whitespace-nowrap" 
                    style={{ fontFamily: "'Segoe Script', 'Bradley Hand', 'Caveat', cursive" }}
                  >
                    Takieddine Semmache
                  </p>
                  <img src="/stamp.png" className="absolute -top-12 -right-8 w-40 opacity-90 mix-blend-screen" alt="AutoMondo Stamp" />
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}