"use client"

import React, { useRef } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import Image from 'next/image';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import HourVehicleTable from './HourVehicleTable';
import ClasificationTable from "@/components/clasificationTable";

const ExportSurveyTable = ({ vehicleData, activeClassification }) => {
  const tableRef = useRef(null);

  const exportToPdfAdvanced = async () => {
    if (tableRef.current) {
      try {
        const A4_WIDTH = 210;
        const A4_HEIGHT = 297;
        const MARGIN = 15;
        const HEADER_HEIGHT = 25;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = A4_WIDTH - (MARGIN * 2);
        const pageHeight = A4_HEIGHT - (MARGIN * 2) - HEADER_HEIGHT;

        // Dapatkan semua elemen tabel yang bisa dipisah
        const tableElements = tableRef.current.querySelectorAll('table, .table-section, .page-break');

        let currentPage = 0;
        let currentY = 0;

        const drawHeader = (pageNumber) => {
          pdf.setFillColor(248, 249, 250);
          pdf.rect(MARGIN, MARGIN, pageWidth, HEADER_HEIGHT, 'F');
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(MARGIN, MARGIN, pageWidth, HEADER_HEIGHT);

          pdf.setFontSize(10);
          pdf.setTextColor(60, 60, 60);
          pdf.text('Survey Lalu Lintas Simpang Apill', MARGIN + 5, MARGIN + 8);

          pdf.setFontSize(8);
          const date = new Date().toLocaleDateString();
          const simpangCode = vehicleData?.surveyInfo?.simpangCode || '-';
          const direction = vehicleData?.surveyInfo?.direction || '-';

          pdf.text(`Tanggal: ${date}`, MARGIN + 5, MARGIN + 15);
          pdf.text(`Kode Simpang: ${simpangCode}`, MARGIN + 5, MARGIN + 20);
          pdf.text(`Arah: ${direction}`, MARGIN + 80, MARGIN + 15);
          pdf.text(`Halaman: ${pageNumber}`, MARGIN + 80, MARGIN + 20);
        };

        // Gambar header halaman pertama
        drawHeader(currentPage);

        // Capture dan proses setiap elemen
        for (let element of tableElements) {
          const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
          });

          const imgData = canvas.toDataURL('image/png');
          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = pageWidth;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

          // Cek apakah elemen muat di halaman saat ini
          if (currentY + imgHeight > pageHeight) {
            // Pindah ke halaman baru
            pdf.addPage();
            currentPage++;
            currentY = 0;
            drawHeader(currentPage);
          }

          const contentStartY = MARGIN + HEADER_HEIGHT + 5;
          pdf.addImage(
            imgData,
            'PNG',
            MARGIN,
            contentStartY + currentY,
            imgWidth,
            imgHeight
          );

          currentY += imgHeight + 5; // Tambahkan sedikit spacing
        }

        const fileName = `SurveyLalulintas_${vehicleData?.surveyInfo?.simpangCode || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

      } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Terjadi kesalahan saat mengexport PDF. Silakan coba lagi.');
      }
    }
  };

  const exportToPdf = async () => {
    if (tableRef.current) {
      try {
        const A4_WIDTH = 210;
        const A4_HEIGHT = 297;
        const MARGIN = 10;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = A4_WIDTH - (MARGIN * 2);
        const pageHeight = A4_HEIGHT - (MARGIN * 2);

        // Simpan overflow original
        const originalOverflow = tableRef.current.style.overflow;
        tableRef.current.style.overflow = 'visible';

        // Capture canvas
        const canvas = await html2canvas(tableRef.current, {
          scale: 4,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: tableRef.current.scrollWidth,
          height: tableRef.current.scrollHeight,
        });

        // Kembalikan overflow
        tableRef.current.style.overflow = originalOverflow;

        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);

        // Hitung ukuran gambar
        const imgWidth = pageWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        // Metode sederhana: bagi tinggi gambar dengan tinggi halaman
        const totalPages = Math.ceil(imgHeight / pageHeight);

        for (let i = 0; i < totalPages; i++) {
          if (i > 0) {
            pdf.addPage();
          }

          const yPosition = -(i * pageHeight);

          pdf.addImage(
            imgData,
            'PNG',
            MARGIN,
            MARGIN + yPosition,
            imgWidth,
            imgHeight
          );
        }

        pdf.save('SurveyLalulintas.pdf');

      } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Terjadi kesalahan saat mengexport PDF. Silakan coba lagi.');
      }
    } else {
      console.error('Table reference is null or not available.');
      alert('Tabel tidak ditemukan. Silakan refresh halaman.');
    }
  };

  return (
    <div className="relative w-[100%] m-auto">
      <button
        onClick={exportToPdf}
        className="btn btn-sm w-full bg-green-500 rounded-lg text-white flex items-center gap-2"
      >
        <FaFilePdf />
        Export PDF
      </button>

      {/* <button
        onClick={exportToPdfAdvanced}
        className="btn btn-md flex-1 bg-blue-500 rounded-lg text-white flex items-center justify-center gap-2"
      >
        <FaFilePdf />
        Export PDF (Advanced)
      </button> */}

      <div
        ref={tableRef}
        className="fixed left-[-999px] top-[-999px] w-[210mm] bg-white p-4"
      >
        {/* Header */}
        <div className="header flex items-center border-b-2 border-gray-300 pb-2">
          <div className="logo-container w-16">
            <Image
              src="/image/logo-yogyakarta.png"
              alt="Background"
              width={80}
              height={80}
              className="w-full"
            />
          </div>
          <div className="title-container ml-4">
            <h2 className="text-lg font-bold uppercase text-gray-800">
              Dinas Perhubungan Daerah Istimewa Yogyakarta
            </h2>
            <h3 className="text-base font-semibold text-gray-700">
              Formulir Survey Lalu Lintas Simpang Apill
            </h3>
          </div>
          <div className="info-container ml-auto text-sm">
            <div className="grid grid-cols-2 gap-x-2">
              <span className="font-semibold">Tanggal</span>
              <span>: {new Date().toLocaleDateString()}</span>
              <span className="font-semibold">Kode Simpang</span>
              <span>: {vehicleData?.surveyInfo?.simpangCode || '-'}</span>
              <span className="font-semibold">Arah Pergerakan</span>
              <span>: {vehicleData?.surveyInfo?.direction || '-'}</span>
              <span className="font-semibold">Nama Surveyor</span>
              <span>: {vehicleData?.surveyInfo?.surveyor || '-'}</span>
            </div>
          </div>
        </div>

        <HourVehicleTable statusHour={true} vehicleData={vehicleData} classification={activeClassification} customSize={true} pdf={true} />
        <ClasificationTable typeClass={activeClassification} customSize={true} />
      </div>
    </div>
  );
};

export default ExportSurveyTable;