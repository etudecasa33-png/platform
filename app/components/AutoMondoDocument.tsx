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
  // For receipt specific
  amountInWords?: string;
};

export default function AutoMondoDocument({
  type, clientName, clientIdNumber, amount, currency, itemDescription, documentNumber, date, amountInWords
}: DocumentProps) {
  
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = String(parsedDate.getFullYear());

  return (
    // The wrapper prevents text selection and right-clicking for clients
    <div className="relative bg-white text-black p-8 md:p-12 w-full max-w-4xl mx-auto shadow-2xl font-sans select-none" onContextMenu={(e) => e.preventDefault()}>
      
      {/* 1. THE AUTOMONDO WATERMARK */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' transform='rotate(-45 200 200)' font-size='48' fill='black' font-family='sans-serif' font-weight='900' letter-spacing='4'%3EAUTOMONDO%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="relative z-20">
        
        {/* --- HEADER (Used for both) --- */}
        <div className="flex justify-between items-start mb-10 border-b-2 border-blue-800 pb-6">
          <div>
            <h1 className="text-4xl font-black text-blue-900 tracking-tighter">AUTOMONDO <span className="font-light">FZ-LLC</span></h1>
            <p className="text-sm font-bold text-gray-600 mt-1">RAK - U.A.E.</p>
            <p className="text-xs text-gray-500 mt-2 max-w-xs">Compass Building, Al Shohada Road, AL Hamra Industrial Zone-FZ, Ras Al Khaimah, United Arab Emirates</p>
            <p className="text-xs text-blue-600 font-bold mt-1">www.automond.net</p>
          </div>
          <div className="text-right">
            <div className="w-24 h-24 border-4 border-blue-800 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs text-center p-2 opacity-80">
              Company<br/>Stamp<br/>Placeholder
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* ============ INVOICE TEMPLATE ============ */}
        {/* ========================================== */}
        {type === 'INVOICE' && (
          <>
            <div className="flex justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold bg-blue-800 text-white px-3 py-1 inline-block mb-2">INVOICE TO:</h2>
                <p className="font-black text-lg">{clientName.toUpperCase()}</p>
                <p className="text-sm font-bold text-gray-700">DESTINATION : ALGERIA</p>
                <p className="text-sm font-bold text-gray-700">ID NUMBER : {clientIdNumber || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">INVOICE#: <span className="text-blue-800">{documentNumber}</span></p>
                <p className="text-sm font-bold mt-1">DATE: {day}.{month}.{year}</p>
              </div>
            </div>

            <table className="w-full mb-8 border-collapse">
              <thead>
                <tr className="bg-blue-800 text-white text-sm">
                  <th className="p-3 text-left border border-blue-900">ITEM DESCRIPTION</th>
                  <th className="p-3 text-center border border-blue-900">QTY.</th>
                  <th className="p-3 text-right border border-blue-900">PRICE</th>
                  <th className="p-3 text-right border border-blue-900">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-2 border-gray-200">
                  <td className="p-4 font-bold text-gray-800 border-l-2 border-gray-200">{itemDescription.toUpperCase()}</td>
                  <td className="p-4 text-center font-bold border-l-2 border-gray-200">1</td>
                  <td className="p-4 text-right font-bold border-l-2 border-gray-200">{amount.toLocaleString('en-US')} {currency}</td>
                  <td className="p-4 text-right font-black border-l-2 border-r-2 border-gray-200 bg-gray-50">{amount.toLocaleString('en-US')} {currency}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-end mb-10">
              <p className="font-bold text-lg text-blue-900 italic">Thank you for your business</p>
              <div className="w-1/2">
                <div className="flex justify-between py-2 border-b border-gray-300">
                  <span className="font-bold">TAX:</span>
                  <span className="font-bold">0.00%</span>
                </div>
                <div className="flex justify-between py-2 border-b-2 border-blue-800 bg-blue-50 px-2">
                  <span className="font-black text-lg">SUB TOTAL:</span>
                  <span className="font-black text-lg">{amount.toLocaleString('en-US')} {currency}</span>
                </div>
                <div className="flex justify-between py-3 bg-blue-800 text-white px-2 mt-1">
                  <span className="font-black text-xl">TOTAL:</span>
                  <span className="font-black text-xl">{amount.toLocaleString('en-US')} {currency}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs">
              <div className="bg-gray-50 p-4 border border-gray-200">
                <h3 className="font-black text-sm mb-2 uppercase border-b pb-1">Payment Info:</h3>
                <p><span className="font-bold">Account Iban:</span> AE190860000009937709383</p>
                <p><span className="font-bold">A/C Name:</span> AutoMondo FZ-LLC</p>
                <p><span className="font-bold">Bank Details:</span> WIOBAEADXXX</p>
                <p><span className="font-bold">Business Address:</span> Etihad Airways Centre 5th Floor, Abu Dhabi, UAE</p>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200">
                <h3 className="font-black text-sm mb-2 uppercase border-b pb-1">Terms and Conditions:</h3>
                <ul className="list-disc pl-4 space-y-1 font-bold text-gray-700">
                  <li>100% PAYMENT BEFORE DELIVERY</li>
                  <li>PAYMENT SHOULD BE COMPLETED WITHIN 10 DAYS FROM THE DATE OF DEPOSIT</li>
                  <li>DELIVERY TIME (EXW-JEBEL ALI) : UNITS IN STOCK, SUBJECTED PRIOR SAELS</li>
                  <li>WARRANTY : NO WARRANTY FOR VEHICLE & PARTS FOR RE-EXPORT</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-[10px] font-bold text-justify">
              PAYMENT DELAY: FINANCE CHARGES, VEHICLE MAINTANCE, STORAGE CHARGES WILL BE APPLICABLE IF PAYMENT DELAYED MORE THAN 20 DAYS AS AGREED. ALL RIGHTS TO DECIDE THE FINANCE CHARGES WILL REMAIN WITH AUTOMONDO MANAGEMENT. NOT VALID FOR RE-EXPORT TO SANCTIONED COUNTRIES, GCC COUNTRIES & LOCAL REGISTRATION INSIDE UAE.
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* ============ RECEIPT TEMPLATE ============ */}
        {/* ========================================== */}
        {type === 'RECEIPT' && (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black tracking-widest border-y-4 border-blue-800 py-2 inline-block">RECEIPT VOUCHER</h2>
              <p className="mt-2 font-bold text-gray-600">Voucher No: <span className="text-blue-800">{documentNumber}</span></p>
            </div>

            <div className="space-y-6 text-lg">
              <div className="flex items-end gap-4">
                <span className="font-bold whitespace-nowrap min-w-[150px]">Payment Received from:</span>
                <div className="flex-1 border-b-2 border-dotted border-gray-400 pb-1 font-black px-2">{clientName.toUpperCase()}</div>
              </div>
              
              <div className="flex items-end gap-4">
                <span className="font-bold whitespace-nowrap min-w-[150px]">The sum of:</span>
                <div className="flex-1 border-b-2 border-dotted border-gray-400 pb-1 font-bold px-2 italic text-gray-700">{amountInWords || `${amount.toLocaleString('en-US')} ${currency}`}</div>
              </div>

              <div className="flex items-end gap-4">
                <span className="font-bold whitespace-nowrap min-w-[150px]">Amount:</span>
                <div className="flex-1 border-b-2 border-dotted border-gray-400 pb-1 font-black text-2xl px-2">{amount.toLocaleString('en-US')} {currency}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mt-12">
              <div>
                <p className="font-bold mb-1">Payment Method:</p>
                <div className="p-3 bg-gray-50 border border-gray-300 font-black text-blue-900 text-center">
                  Normal Credit Transfer (CRED)
                </div>
              </div>
              
              <div>
                <p className="font-bold mb-1">Date:</p>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-gray-50 border border-gray-300 font-black text-center">{day}</div>
                  <div className="flex-1 p-3 bg-gray-50 border border-gray-300 font-black text-center">{month}</div>
                  <div className="flex-1 p-3 bg-gray-50 border border-gray-300 font-black text-center">{year}</div>
                </div>
              </div>
            </div>

            <div className="mt-16 flex justify-between items-end border-t-2 border-gray-200 pt-8">
              <div>
                <p className="font-bold text-gray-500 mb-8">Customer Signature:</p>
                <div className="w-48 border-b-2 border-gray-800"></div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-500 mb-8">Received By:</p>
                <div className="w-48 border-b-2 border-gray-800 mx-auto"></div>
                <p className="font-black mt-2 text-blue-900">Takieddine Semmache</p>
              </div>
            </div>
          </>
        )}
        
        <div className="text-center mt-8 text-xs font-bold text-gray-400">
          | WWW.AUTOMONDODXB.COM |
        </div>
      </div>
    </div>
  );
}