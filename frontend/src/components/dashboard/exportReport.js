"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { createPortal } from "react-dom";
import { FaFilePdf } from "react-icons/fa6";

const ExportPdfComponent = ({ fileName = "Laporan_Survey", children }) => {
  const exportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const exportToPdf = async () => {
    if (!exportRef.current) return;

    setExporting(true);
    
  try {
    await new Promise((r) => setTimeout(r, 500));

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 15;

    // Ambil semua elemen section di dalam exportRef
    const sections = exportRef.current.querySelectorAll("[data-page-break]");
    let pageIndex = 0;

    for (const section of sections) {
      const canvas = await html2canvas(section, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
    
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
      let heightLeft = imgHeight;
      let position = margin;
    
      let pageCanvas = 1;
      while (heightLeft > 0) {
        if (pageIndex > 0 || pageCanvas > 1) pdf.addPage();
    
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          position - imgHeight + heightLeft,
          imgWidth,
          imgHeight
        );
    
        heightLeft -= pdfHeight - margin * 2;
        position = margin;
        pageCanvas++;
        pageIndex++;
      }
    }    

    pdf.save(`${fileName}.pdf`);
  } catch (err) {
    console.error("Gagal export PDF:", err);
    alert("Terjadi kesalahan saat export PDF.");
  } finally {
    setTimeout(() => setExporting(false), 800);
  }
  };

  // Loading overlay full screen
  const exportingOverlay = exporting
    ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg text-red-600"></span>
            <p className="text-gray-700 font-medium">Mengekspor laporan PDF...</p>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {/* Tombol export PDF */}
      <div className="flex flex-col gap-3 relative">
        <button
          onClick={exportToPdf}
          disabled={exporting}
          className={`btn btn-sm bg-green-600 text-white flex items-center gap-2 self-start ${
            exporting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FaFilePdf />
          {exporting ? "Mengekspor..." : "Export PDF"}
        </button>

        {/* Area tersembunyi di luar layar (tidak pernah muncul di UI) */}
        <div
          ref={exportRef}
          className="fixed top-[99999] left-[99999] w-[210mm] min-h-[297mm] bg-white text-black p-4"
        >
          {children}
        </div>
      </div>

      {exportingOverlay}
    </>
  );
};

export default ExportPdfComponent;