"use client";
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// This tells the library how to process PDFs securely in the browser
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function SecurePdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>();

  return (
    // 1. CHANGED TO 'absolute inset-0' to force the scrollbar to work properly inside the popup!
    <div 
      className="absolute inset-0 overflow-y-auto bg-slate-200 py-8 flex flex-col items-center z-10"
      onContextMenu={(e) => e.preventDefault()} // Still blocks right-clicking globally
    >
      <Document 
        file={url} 
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<div className="font-bold text-gray-500 mt-10">Loading secure document...</div>}
        className="flex flex-col items-center w-full"
      >
        {Array.from(new Array(numPages || 0), (el, index) => (
          <div key={`page_${index + 1}`} className="mb-8 relative shadow-2xl max-w-full">
            
            {/* 2. REMOVED pointer-events-none so the scroll wheel actually registers! */}
            <Page 
              pageNumber={index + 1} 
              renderTextLayer={false}       // Prevents highlighting and copying text
              renderAnnotationLayer={false} // Hides interactive PDF links
              className="select-none max-w-full" 
              width={800}                   // Prevents the PDF from stretching too wide on big screens
            />
            
            {/* Watermark baked directly onto EVERY single page */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-10 pointer-events-none mix-blend-multiply">
              <span className="text-[60px] md:text-[80px] font-black text-slate-900 -rotate-45 tracking-widest">
                AUTOMONDO
              </span>
            </div>

          </div>
        ))}
      </Document>
    </div>
  );
}