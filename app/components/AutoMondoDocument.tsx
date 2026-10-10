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

export default function AutoMondoDocument({
  type, clientName, clientIdNumber, amount, currency, itemDescription, documentNumber, date, amountInWords
}: DocumentProps) {
  
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = String(parsedDate.getFullYear());

  const formattedAmount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white font-sans select-none shadow-2xl overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
      
      {/* ========================================== */}
      {/* ======== EXACT INVOICE TEMPLATE (1.PNG) == */}
      {/* ========================================== */}
      {type === 'INVOICE' && (
        <div className="bg-white min-h-[1050px] relative pb-12">
          
          {/* Top Black/Gold Header Bar */}
          <div className="bg-[#1a1a1a] h-[100px] w-full flex items-center justify-end pr-10 relative">
            
            {/* The diagonal dark overlay on the left */}
            <div className="absolute top-0 left-0 h-[160px] w-[350px] bg-[#2a2d34] z-10 flex flex-col items-center pt-6" style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)' }}>
               {/* Professional Vector Car Logo */}
               <svg viewBox="0 0 400 120" className="w-56 fill-white opacity-90 mr-12 mt-2">
                 <path d="M 50 80 Q 90 60 150 50 Q 250 40 320 60 L 350 75 Q 360 80 370 70 Q 340 30 250 20 Q 150 10 70 40 Z"/>
                 <path d="M 60 85 Q 150 75 250 80 Q 300 85 340 95 L 340 105 Q 250 95 150 90 Q 70 90 40 100 Z"/>
                 <text x="190" y="115" fontFamily="sans-serif" fontSize="32" fontWeight="900" textAnchor="middle" letterSpacing="4">AUTOMONDO</text>
                 {/* 5 Stars */}
                 <g fill="#f7b718" transform="translate(190, 45)">
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(-60, 10) scale(0.6)"/>
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(-30, 0) scale(0.8)"/>
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(0, -5) scale(1)"/>
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(30, 0) scale(0.8)"/>
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(60, 10) scale(0.6)"/>
                 </g>
               </svg>
            </div>

            <h1 className="text-[#f7b718] text-[26px] font-black tracking-widest uppercase z-0">PROFORMA INVOICE</h1>
          </div>

          <div className="px-12 pt-20"> {/* pt-20 Ensures content clears the logo overlay */}
            
            {/* Company Info Header */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-[28px] font-black tracking-widest text-[#231f20] leading-none mb-1">AUTOMONDO FZ-LLC</h2>
                <h3 className="text-xl font-black text-[#231f20] arabic-text tracking-wider">اوتوموندو ش.م.ح</h3>
                <div className="text-[11px] font-bold text-[#555] mt-3 leading-relaxed">
                  <p>Compass Building,</p>
                  <p>Al Shohada Road,</p>
                  <p>AL Hamra Industrial Zone-FZ,</p>
                  <p>Ras Al Khaimah, United Arab Emirates</p>
                </div>
              </div>
              <div className="text-[11px] font-bold text-[#555] text-right mt-12 leading-relaxed">
                <p>Email : contact@automondodxb.com</p>
                <p>Mob: +971 54 423 2321</p>
                <p>Website : www.automondodxb.com</p>
              </div>
            </div>

            {/* Client Info & Invoice Number */}
            <div className="flex justify-between text-[11px] font-black text-black mb-6">
              <div>
                <p>INVOICE TO: {clientName.toUpperCase()}</p>
                <p className="ml-16 mt-0.5"><span className="underline decoration-blue-600 decoration-2 underline-offset-2">DESTINATION :</span> ALGERIA</p>
                <p className="ml-16 mt-0.5"><span className="underline decoration-blue-600 decoration-2 underline-offset-2">ID NUMBER :</span> {clientIdNumber || 'N/A'}</p>
              </div>
              <div className="text-right text-[12px]">
                <p>INVOICE#: <span className="font-medium text-gray-700">{documentNumber}</span></p>
                <p className="mt-0.5">DATE: <span className="font-medium text-gray-700">{day}.{month}.{year}</span></p>
              </div>
            </div>

            {/* The Exact Table */}
            <table className="w-full text-[11px] border-collapse mb-2 border border-black">
              <thead>
                <tr className="bg-black text-white text-center">
                  <th className="border-r border-white/50 w-8 py-2.5"></th>
                  <th className="border-r border-white/50 py-2.5">ITEM DESCRIPTION</th>
                  <th className="border-r border-white/50 py-2.5 w-32">PRICE</th>
                  <th className="border-r border-white/50 py-2.5 w-16">QTY.</th>
                  <th className="py-2.5 w-32">TOTAL</th>
                </tr>
              </thead>
              <tbody className="bg-[#ccc] text-black font-medium">
                <tr>
                  <td className="border-r border-black py-5 px-2 text-center text-[10px]">1</td>
                  <td className="border-r border-black py-5 px-3 uppercase">{itemDescription}</td>
                  <td className="border-r border-black py-5 px-2 text-right">{formattedAmount}{currency}</td>
                  <td className="border-r border-black py-5 px-2 text-center">1</td>
                  <td className="py-5 px-2 text-right">{formattedAmount}{currency}</td>
                </tr>
              </tbody>
            </table>

            {/* Sub Totals */}
            <div className="flex justify-between text-[12px] font-black mb-4 px-1">
              <p>Thank you for your business</p>
              <p className="font-normal text-gray-700 mr-16">TAX: 0.00%</p>
              <p>SUB TOTAL: {formattedAmount} {currency}</p>
            </div>

            {/* Black Total Box */}
            <div className="flex justify-end mb-4">
              <div className="bg-black text-white px-5 py-2.5 font-black text-sm flex items-center gap-2">
                TOTAL: <span className="text-[#3b82f6] underline underline-offset-4 decoration-2">{formattedAmount} {currency}</span>
              </div>
            </div>

            {/* Professional Vector Stamp (No ugly CSS borders) */}
            <div className="flex justify-end mb-2 pr-6 h-32 relative">
               <svg viewBox="0 0 200 200" className="w-32 h-32 absolute right-8 top-[-20px] opacity-80 mix-blend-multiply" style={{ transform: 'rotate(-15deg)' }}>
                  <circle cx="100" cy="100" r="94" fill="none" stroke="#2563eb" strokeWidth="3"/>
                  <circle cx="100" cy="100" r="86" fill="none" stroke="#2563eb" strokeWidth="1"/>
                  <text x="100" y="105" textAnchor="middle" fill="#2563eb" fontWeight="900" fontSize="16" fontFamily="sans-serif">RAK - U.A.E.</text>
                  <path id="curve-top" d="M 30,100 A 70,70 0 0,1 170,100" fill="transparent" />
                  <text fill="#2563eb" fontWeight="bold" fontSize="13" letterSpacing="2">
                     <textPath href="#curve-top" startOffset="50%" textAnchor="middle">AUTOMONDO FZ-LLC</textPath>
                  </text>
                  <path id="curve-bottom" d="M 170,100 A 70,70 0 0,1 30,100" fill="transparent" />
                  <text fill="#2563eb" fontWeight="bold" fontSize="14" letterSpacing="1">
                     <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">اوتوموندو ش.م.ح</textPath>
                  </text>
                  <circle cx="35" cy="100" r="3" fill="#2563eb"/>
                  <circle cx="165" cy="100" r="3" fill="#2563eb"/>
               </svg>
            </div>

            {/* Footer Text Sections */}
            <div className="grid grid-cols-2 gap-8 text-[10px] mt-2">
              <div>
                <p className="font-black text-[13px] mb-2 text-black">Payment Info:</p>
                <p className="font-black mb-0.5 text-black">Account Iban:</p>
                <p className="text-gray-600 mb-2">AE190860000009937709383</p>
                
                <p className="font-black mb-0.5 text-black">A/C Name:</p>
                <p className="text-gray-600 mb-2 underline decoration-red-500 decoration-wavy underline-offset-4">AutoMondo FZ-LLC</p>
                
                <p className="font-black mb-0.5 text-black mt-3">Bank Details:</p>
                <p className="text-gray-600 mb-2">WIOBAEADXXX</p>
                
                <p className="font-black mb-0.5 text-black">Business Address:</p>
                <p className="text-gray-600 mb-4">Etihad Airways Centre 5th Floor, Abu Dhabi, UAE</p>
                
                <p className="font-black text-[11px] mb-1 text-black">TERMS AND <span className="underline decoration-blue-600 decoration-2 underline-offset-2">CONDITIONS :</span></p>
                <p className="font-black text-black">DELIVERY TIME (EXW-JEBEL ALI) : <span className="font-medium text-gray-600">UNITS IN STOCK, SUBJECTED PRIOR SAELS</span></p>
                <p className="font-black mt-2 text-black"><span className="underline decoration-blue-600 decoration-2 underline-offset-2">VALIDITY :</span> <span className="font-medium text-gray-600">1 WEEK</span></p>
              </div>

              <div className="pt-2 pr-4">
                <p className="font-black text-[11px] mb-2 text-black">PAYMENT TERMS</p>
                <p className="font-black mb-4 text-black leading-relaxed">100% PAYMENT BEFORE DELIVERY<br/>PAYMENT SHOULD BE COMPLETED WITHIN 10 DAYS FROM THE DATE OF DEPOSIT</p>
                
                <p className="font-black text-[11px] mb-2 text-black">PAYMENT DELAY</p>
                <p className="text-gray-600 mb-4 font-medium leading-relaxed">FINANCE CHARGES, VEHICLE MAINTANCE, STORAGE CHARGES WILL BE APPLICABLE IF PAYMENT DELAYED MORE THAN 20 DAYS AS AGREED.</p>
                <p className="text-gray-600 font-medium leading-relaxed">ALL RIGHTS TO DECIDE THE FINANCE CHARGES WILL REMAIN WITH AUTOMONDO MANAGEMENT</p>
              </div>
            </div>

            {/* Bottom Warning */}
            <div className="text-[10px] font-black text-black mt-6 space-y-3 pb-8 border-b-8 border-gray-200">
              <p>RECEIVING CONFIRMATION FROM THE BUYER THAT THERE IS NO ACTIVITY ASSOCIATED WITH MONEY LAUNDERING FROM THE ORIGIN OF THE MONEY RECEIVED OR ANYTHING SURROUNDING THE DEAL</p>
              <p>NOT VALID FOR RE-EXPORT TO SANCTIONED COUNTRIES, GCC COUNTRIES & LOCAL REGISTRATION INSIDE UAE</p>
              <p><span className="underline decoration-blue-600 decoration-2 underline-offset-2">WARRANTY :</span> <span className="font-medium text-gray-600">NO WARRANTY FOR VEHICLE & PARTS FOR RE-EXPORT</span></p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* ======== EXACT RECEIPT TEMPLATE (2.PNG) == */}
      {/* ========================================== */}
      {type === 'RECEIPT' && (
        <div className="bg-[#f5f5f5] w-full flex flex-col min-h-[500px]">
          
          {/* Top Section (White Background) */}
          <div className="bg-white px-10 py-10 flex justify-between items-center shadow-sm z-10">
            <div>
              <h1 className="text-4xl font-black tracking-tight leading-none text-black">RECEIPT</h1>
              <h1 className="text-4xl font-black tracking-tight leading-none text-[#ed1c24]">VOUCHER</h1>
              <div className="h-[2px] w-[110%] bg-[#ed1c24] mt-2"></div>
            </div>
            
            <div className="flex items-center gap-6 text-[15px] font-bold text-gray-900">
              <div className="flex items-center gap-2">
                <span>Date:</span>
                <div className="flex gap-2">
                  <div className="border border-gray-300 py-1.5 px-3 text-gray-500 w-12 text-center">{day}</div>
                  <div className="border border-gray-300 py-1.5 px-3 text-gray-500 w-12 text-center">{month}</div>
                  <div className="border border-gray-300 py-1.5 px-3 text-gray-500 w-16 text-center">{year}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-lg">Payment Method:</span>
                <div className="border border-gray-300 py-1.5 px-4 text-gray-600 bg-white">
                  Normal <span className="underline decoration-red-500 decoration-wavy underline-offset-4">Credit</span> Transfer (CRED)
                </div>
              </div>
            </div>
          </div>

          {/* Middle Content Section (Gray Background) */}
          <div className="px-12 py-16 flex-1 bg-[#f5f5f5]">
            
            <div className="flex items-end mb-8 w-full gap-2">
              <span className="text-[17px] font-light text-gray-600 shrink-0 mb-0.5">Payment Received</span>
              <div className="border-b border-gray-400 w-full text-xl text-gray-600 px-4 pb-1">
                {clientName.toUpperCase()}
              </div>
            </div>

            <div className="flex items-end w-full gap-8">
              <div className="w-full">
                 <div className="border-b border-gray-400 text-[17px] text-gray-700 pb-1 w-[90%]">
                   {amountInWords || 'Two million two hundred and forty thousand Algerian dinars.'}
                 </div>
                 <div className="border-b border-gray-400 w-[90%] h-10 mt-2"></div>
              </div>
              
              <div className="shrink-0 pt-4">
                <div className="border border-[#ed1c24] bg-white text-[#444] font-black text-lg py-4 px-8 min-w-[280px]">
                  {formattedAmount} {currency}
                </div>
              </div>
            </div>
          </div>

          {/* Dark Footer Section */}
          <div className="bg-[#2a2a2a] w-full px-10 py-8 flex justify-between items-center text-white relative overflow-hidden">
            
            <div className="flex items-center gap-4 z-10">
               {/* AutoMondo Car Logo (White Version) */}
               <svg viewBox="0 0 400 120" className="w-40 fill-white opacity-90">
                 <path d="M 50 80 Q 90 60 150 50 Q 250 40 320 60 L 350 75 Q 360 80 370 70 Q 340 30 250 20 Q 150 10 70 40 Z"/>
                 <path d="M 60 85 Q 150 75 250 80 Q 300 85 340 95 L 340 105 Q 250 95 150 90 Q 70 90 40 100 Z"/>
                 <text x="190" y="115" fontFamily="sans-serif" fontSize="32" fontWeight="900" textAnchor="middle" letterSpacing="4">AUTOMONDO</text>
                 <g fill="#f7b718" transform="translate(190, 45)">
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(-60, 10) scale(0.6)"/>
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(-30, 0) scale(0.8)"/>
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(0, -5) scale(1)"/>
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(30, 0) scale(0.8)"/>
                    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" transform="translate(60, 10) scale(0.6)"/>
                 </g>
               </svg>
              <h2 className="text-[22px] font-black leading-tight tracking-wide">
                AutoMondo<br/>
                <span className="underline decoration-red-500 decoration-wavy underline-offset-4">FZ-LLC</span>
              </h2>
            </div>

            <div className="text-[13px] text-gray-300 font-light leading-snug z-10 pl-4 border-l border-gray-600">
              <p>Compass Building,</p>
              <p>Al Shohada Road,</p>
              <p>AL <span className="underline decoration-red-500 decoration-wavy underline-offset-4">Hamra</span> Industrial Zone-FZ,</p>
              <p>Ras Al Khaimah, United Arab Emirates</p>
              <p className="font-bold text-white mt-3 text-sm">www.automond.net</p>
            </div>

            <div className="text-center z-10 relative">
              <p className="text-sm font-light text-gray-300 mb-4 text-left pl-4">Received By:</p>
              <div className="border-b border-gray-500 w-56 mx-auto relative h-8">
                {/* Signature text matching the image */}
                <p className="absolute bottom-1 w-full text-center text-lg font-normal tracking-wide text-white underline decoration-red-500 decoration-wavy underline-offset-4">Takieddine Semmache</p>
                
                {/* Exact Blue Stamp overlaid on the signature */}
                <svg viewBox="0 0 200 200" className="absolute -top-12 -right-4 w-32 h-32 opacity-70 mix-blend-screen" style={{ transform: 'rotate(15deg)' }}>
                  <circle cx="100" cy="100" r="94" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                  <circle cx="100" cy="100" r="86" fill="none" stroke="#3b82f6" strokeWidth="1"/>
                  <text x="100" y="105" textAnchor="middle" fill="#3b82f6" fontWeight="900" fontSize="16" fontFamily="sans-serif">RAK - U.A.E.</text>
                  <path id="curve-top2" d="M 30,100 A 70,70 0 0,1 170,100" fill="transparent" />
                  <text fill="#3b82f6" fontWeight="bold" fontSize="13" letterSpacing="2"><textPath href="#curve-top2" startOffset="50%" textAnchor="middle">AUTOMONDO FZ-LLC</textPath></text>
                  <path id="curve-bottom2" d="M 170,100 A 70,70 0 0,1 30,100" fill="transparent" />
                  <text fill="#3b82f6" fontWeight="bold" fontSize="14" letterSpacing="1"><textPath href="#curve-bottom2" startOffset="50%" textAnchor="middle">اوتوموندو ش.م.ح</textPath></text>
                  <circle cx="35" cy="100" r="3" fill="#3b82f6"/>
                  <circle cx="165" cy="100" r="3" fill="#3b82f6"/>
                  {/* Faux Signature lines inside stamp */}
                  <path d="M 70 120 Q 100 90 130 110" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M 60 110 L 140 100" fill="none" stroke="#3b82f6" strokeWidth="1"/>
               </svg>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}