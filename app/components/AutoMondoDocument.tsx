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

// --- MODIFICATION 1: Helper function to automatically convert numbers to words ---
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

  // Helper to format amount to 2 decimal places (e.g., 2,450,000.00)
  const formattedAmount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // --- MODIFICATION 1 (Continued): Setup dynamic words based on currency ---
  const currencySuffix = (currency === 'DA' || currency === 'DZD') ? 'Algerian dinars' : 'Dirhams';
  const dynamicAmountInWords = `${numberToWords(amount)} ${currencySuffix}.`;

  return (
    <div className="w-full max-w-[900px] mx-auto bg-white font-sans select-none relative shadow-2xl overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
      
      {/* ========================================== */}
      {/* ======== EXACT INVOICE TEMPLATE (1.PNG) == */}
      {/* ========================================== */}
      {type === 'INVOICE' && (
        <div className="bg-white min-h-[1050px] relative pb-12">
          
          {/* Top Black/Gold Header Bar */}
          <div className="bg-[#161616] h-24 w-full flex items-center justify-end pr-8 relative">
            {/* The diagonal dark overlay on the left - z-10 brings it above the text */}
            <div className="absolute top-0 left-0 h-40 w-[350px] bg-[#1f2229] z-10 flex flex-col items-center pt-6" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}>
               {/* Fixed Logo: Removed the white border and centered it nicely */}
               <img src="/logo.png" className="w-56 mt-2 mr-8" alt="AutoMondo Logo" />
            </div>
            <h1 className="text-[#f7b718] text-2xl font-black tracking-widest uppercase z-0">PROFORMA INVOICE</h1>
          </div>

          {/* Fixed Overlap: Changed pt-10 to pt-20 so it pushes the text safely below the logo */}
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
                <p>Website : www.automondodxb.com</p>
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

            {/* Fixed Stamp: Removed the blue CSS border and adjusted size/position */}
            <div className="flex justify-end mb-4 pr-12 h-32 relative">
               <img 
                 src="/stamp.png" 
                 className="absolute right-10 top-[-10px] w-40 opacity-90 mix-blend-multiply" 
                 alt="AutoMondo Stamp" 
               />
            </div>

            {/* Footer Text Sections */}
            <div className="grid grid-cols-2 gap-8 text-[10px] mt-8">
              {/* Left Column */}
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

              {/* Right Column */}
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
        <div className="bg-[#f5f5f5] w-full flex flex-col pt-12 pb-0">
          
          {/* Top Section (White Background) */}
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

          {/* Middle Content Section (Gray Background) */}
          <div className="px-12 py-16 flex-1">
            
            <div className="flex items-end mb-8 w-full">
              <span className="text-lg font-light text-gray-800 w-48 shrink-0">Payment Received</span>
              <div className="border-b border-gray-400 w-full text-xl text-gray-600 px-4 pb-1">
                {clientName.toUpperCase()}
              </div>
            </div>

            <div className="flex items-end w-full gap-8">
              <div className="w-full">
                 <div className="border-b border-gray-400 text-lg text-gray-800 pb-1 w-[90%] capitalize">
                   {/* MODIFICATION 1: Replaced hardcoded string with dynamic generated string */}
                   {amountInWords || dynamicAmountInWords}
                 </div>
                 <div className="border-b border-gray-400 w-[90%] h-8 mt-2"></div>
              </div>
              
              <div className="shrink-0 pt-4">
                <div className="border border-[#ed1c24] bg-white text-[#555] font-black text-lg py-4 px-8 shadow-sm min-w-[280px]">
                  {formattedAmount} {currency}
                </div>
              </div>
            </div>
          </div>

          {/* Dark Footer Section */}
          <div className="bg-[#2a2a2a] w-full px-12 py-8 mt-12 flex justify-between items-start text-white relative overflow-hidden">
            
            <div className="flex items-center gap-4 z-10">
               {/* Fixed Logo: Removed the white border */}
               <img src="/logo.png" className="w-40" alt="AutoMondo Logo" />
               <h2 className="text-2xl font-black leading-none">AutoMondo<br/>FZ-LLC</h2>
            </div>

            <div className="text-sm text-gray-300 font-light leading-snug z-10">
              <p>Compass Building,</p>
              <p>Al Shohada Road,</p>
              <p>AL Hamra Industrial Zone-FZ,</p>
              <p>Ras Al Khaimah, United Arab Emirates</p>
              <p className="font-bold text-white mt-2">www.automond.net</p>
            </div>

            <div className="text-center z-10 relative mt-4">
              <p className="text-sm font-light text-gray-300 mb-2">Received By:</p>
              <div className="border-b border-gray-500 w-64 mx-auto relative h-10">
                {/* MODIFICATION 2: One line, clean, professional script font */}
                <p 
                  className="absolute bottom-1 w-full text-center text-[22px] whitespace-nowrap" 
                  style={{ fontFamily: "'Segoe Script', 'Bradley Hand', 'Caveat', cursive" }}
                >
                  Takieddine Semmache
                </p>
                {/* Fixed Stamp: Removed the CSS blue circle border, positioned the pure image perfectly */}
                <img 
                  src="/stamp.png" 
                  className="absolute -top-12 -right-8 w-40 opacity-90 mix-blend-screen" 
                  alt="AutoMondo Stamp" 
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}