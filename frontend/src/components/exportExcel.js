import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaDownload } from "react-icons/fa6";

export const exportVehicleDataToExcel = (vehicleData, fileName, classification) => {
  // Membuat workbook dan worksheet baru
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([]);
  const classificationOptions = ['PKJI 2023 Luar Kota', 'PKJI 2023 Dalam Kota', 'Tipikal'];

  // Debug: log untuk memeriksa classification yang diterima
  console.log('Classification received:', classification);
  console.log('Available options:', classificationOptions);

  let headers = [];
  let merges = [];

  if (classification === classificationOptions[0]) {
    console.log(classificationOptions[0]);
    headers = [
      ['Periode', 'Status Camera', 'Waktu', 'Kendaraan Bermotor (Lih. kend/jam)', '', '', '', '', '', '', '', 'Kend. Tak Bermotor', '', 'Total (Lih. kend/jam)'],
      ['', '', 'Interval 15 menit', 'SM', 'MP', '', '', 'TR', 'BS', 'TS', 'BB', 'TB', 'Gandeng / Semitrailer', 'KTB', ''],
      ['', '', '', '', 'MP', 'AUP', 'TR', '', '', '', '', '', '', '', '']
    ];
  } else if (classification === classificationOptions[1]) {
    console.log(classificationOptions[1]);
    headers = [
      ['Periode', 'Status Camera', 'Waktu', 'Kendaraan Bermotor (Lih. kend/jam)', '', '', '', '', '', '', '', '', 'Kend. Tak Bermotor'],
      ['', '', 'Interval', 'SM', 'MP', '', '', 'KS', '', '', '', '', 'KTB'],
      ['', '', '', '', 'MP', 'AUP', 'TR', 'BS', 'TS', 'BB', 'TB', 'Gandeng / Semitrailer', '']
    ];
  } else if (classification === classificationOptions[2]) {
    console.log(classificationOptions[2]);
    headers = [
      ['Periode', 'Status Camera', 'Waktu', 'Kendaraan Bermotor (Lih. kend/jam)', '', '', '', '', '', '', '', '', 'Kend. Tak Bermotor'],
      ['', '', 'Interval', 'SM', 'MP', '', '', 'Bus', '', 'Truk', '', '', 'KTB'],
      ['', '', '', '', 'MP', 'AUP', 'TR', 'BS', 'BB', 'TS', 'TB', 'Gandeng / Semitrailer', '']
    ];
  }
  console.log(headers)

  if (classification === classificationOptions[0]) {
    merges = [
      { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } }, // Periode
      { s: { r: 0, c: 1 }, e: { r: 2, c: 1 } }, // Status Camera
      { s: { r: 0, c: 2 }, e: { r: 2, c: 2 } }, // Waktu
      { s: { r: 0, c: 3 }, e: { r: 0, c: 11 } }, // Kendaraan Bermotor header
      { s: { r: 0, c: 12 }, e: { r: 0, c: 12 } }, // Kend. Tak Bermotor header
      // { s: { r: 0, c: 14 }, e: { r: 2, c: 14 } }, // Total
      { s: { r: 1, c: 4 }, e: { r: 1, c: 6 } }, // MP
      { s: { r: 1, c: 3 }, e: { r: 2, c: 3 } }, // SM
      { s: { r: 1, c: 7 }, e: { r: 2, c: 7 } }, // TR
      { s: { r: 1, c: 8 }, e: { r: 2, c: 8 } }, // BS
      { s: { r: 1, c: 9 }, e: { r: 2, c: 9 } }, // TS
      { s: { r: 1, c: 10 }, e: { r: 2, c: 10 } }, // BB
      { s: { r: 1, c: 11 }, e: { r: 2, c: 11 } }, // TB
      { s: { r: 1, c: 12 }, e: { r: 2, c: 12 } }, // Gandeng/Semitrailer
      { s: { r: 1, c: 13 }, e: { r: 2, c: 13 } }, // KTB
    ]
  } else if (classification === classificationOptions[1]) {
    merges = [
      { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } }, // Periode
      { s: { r: 0, c: 1 }, e: { r: 2, c: 1 } }, // Status Camera
      { s: { r: 0, c: 2 }, e: { r: 2, c: 2 } }, // Waktu
      { s: { r: 0, c: 3 }, e: { r: 0, c: 11 } }, // Kendaraan Bermotor header
      { s: { r: 1, c: 12 }, e: { r: 2, c: 12 } }, // KTB
      { s: { r: 1, c: 3 }, e: { r: 2, c: 3 } }, // SM
      { s: { r: 1, c: 4 }, e: { r: 1, c: 6 } }, // MP (row 1, col 4-6)
      { s: { r: 1, c: 7 }, e: { r: 1, c: 11 } }, // KS
      // Row 2 sub-headers untuk MP
      // { s: { r: 2, c: 4 }, e: { r: 2, c: 4 } }, // MP (tidak perlu merge, single cell)
      // { s: { r: 2, c: 5 }, e: { r: 2, c: 5 } }, // AUP (tidak perlu merge, single cell)
      // { s: { r: 2, c: 6 }, e: { r: 2, c: 6 } }, // TR (tidak perlu merge, single cell)
    ]
  } else if (classification === classificationOptions[2]) {
    merges = [
      { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } }, // Periode
      { s: { r: 0, c: 1 }, e: { r: 2, c: 1 } }, // Status Camera
      { s: { r: 0, c: 2 }, e: { r: 2, c: 2 } }, // Waktu
      { s: { r: 0, c: 3 }, e: { r: 0, c: 11 } }, // Kendaraan Bermotor header
      { s: { r: 1, c: 12 }, e: { r: 2, c: 12 } }, // KTB
      { s: { r: 1, c: 3 }, e: { r: 2, c: 3 } }, // SM
      { s: { r: 1, c: 4 }, e: { r: 1, c: 6 } }, // MP (row 1, col 4-6)
      { s: { r: 1, c: 7 }, e: { r: 1, c: 8 } }, // BUS
      { s: { r: 1, c: 9 }, e: { r: 1, c: 11 } }, // Truk
    ]
  } else {
    merges = []
  }
  XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: 'A1' });

  // Set lebar kolom
  const colWidths = [15, 15, 15, 8, 8, 8, 8, 8, 8, 8, 8, 8, 15, 8, 15];
  worksheet['!cols'] = colWidths.map(width => ({ width }));


  // Mulai dari baris ke-4 (setelah header)
  let rowIndex = 3;
  let periodRowStartIndex = {};

  // Menambahkan data
  vehicleData.forEach((periodData, periodIndex) => {
    periodRowStartIndex[periodData.period] = rowIndex;

    periodData.timeSlots.forEach((slot, slotIndex) => {
      let rowData = []
      if (classification === classificationOptions[0]) {
        rowData = [
          periodData.period,
          slot.status ? 1 : 0,  // Status Camera (akan diisi dengan warna)
          slot.time,
          slot.data.sm,
          slot.data.mp,
          slot.data.aup,
          slot.data.trMp,
          slot.data.tr,
          slot.data.bs,
          slot.data.ts,
          slot.data.bb,
          slot.data.tb,
          slot.data.gandengSemitrailer,
          slot.data.ktb,
          slot.data.total
        ]
      } else if (classification === classificationOptions[1]) {
        rowData = [
          periodData.period,
          slot.status ? 1 : 0,  // Status Camera (akan diisi dengan warna)
          slot.time,
          slot.data.sm,
          slot.data.mp,
          slot.data.aup,
          slot.data.trMp,
          // slot.data.tr,
          slot.data.bs,
          slot.data.ts,
          slot.data.bb,
          slot.data.tb,
          slot.data.gandengSemitrailer,
          slot.data.ktb
          // slot.data.total
        ]
      } else if (classification === classificationOptions[2]) {
        rowData = [
          periodData.period,
          slot.status ? 1 : 0,  // Status Camera (akan diisi dengan warna)
          slot.time,
          slot.data.sm,
          slot.data.mp,
          slot.data.aup,
          slot.data.trMp,
          // slot.data.tr,
          slot.data.bs,
          slot.data.bb,
          slot.data.ts,
          slot.data.tb,
          slot.data.gandengSemitrailer,
          slot.data.ktb
          // slot.data.total
        ]
      } else {
        rowData = []
      }


      // Hanya tampilkan nama periode pada baris pertama dari periode tersebut
      if (slotIndex > 0) {
        rowData[0] = '';
      }

      XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${rowIndex + 1}` });

      // Menambahkan warna latar belakang untuk status kamera
      const cell = XLSX.utils.encode_cell({ r: rowIndex, c: 1 });
      if (!worksheet[cell]) worksheet[cell] = { t: 's', v: '' };

      if (slot.status === 1) {
        // Status aktif (hijau)
        worksheet[cell].s = { fill: { fgColor: { rgb: "90EE90" } } }; // Hijau muda
      } else {
        // Status nonaktif (merah)
        worksheet[cell].s = { fill: { fgColor: { rgb: "FF7F7F" } } }; // Merah muda
      }

      rowIndex++;
    });

    // Menambahkan merger untuk kolom periode
    if (periodData.timeSlots.length > 1) {
      merges.push({
        s: { r: periodRowStartIndex[periodData.period], c: 0 },
        e: { r: rowIndex - 1, c: 0 }
      });
    }

    // Menambahkan baris pemisah setelah periode "Siang" (index 2)
    if (periodIndex === 2) {
      const dividerRow = Array(12).fill('');
      dividerRow[0] = 'Lalu Lintas Jam-Jaman Rata-Rata 4 x VR (omit teringgi) (kend/jam)';

      XLSX.utils.sheet_add_aoa(worksheet, [dividerRow], { origin: `A${rowIndex + 1}` });

      // Menambahkan merger dan styling untuk baris pemisah
      merges.push({
        s: { r: rowIndex, c: 0 },
        e: { r: rowIndex, c: 12 }
      });

      // Styling untuk baris pemisah
      for (let i = 0; i <= 14; i++) {
        const cell = XLSX.utils.encode_cell({ r: rowIndex, c: i });
        if (!worksheet[cell]) worksheet[cell] = { t: 's', v: '' };
        worksheet[cell].s = {
          font: { bold: true },
          alignment: { horizontal: 'center' },
          fill: { fgColor: { rgb: "D3D3D3" } } // Light gray
        };
      }

      rowIndex++;
    }
  });

  // Tambahkan merges ke worksheet
  worksheet['!merges'] = merges;

  // Styling global
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cell]) continue;

      if (!worksheet[cell].s) worksheet[cell].s = {};

      // Tambahkan border ke semua sel
      worksheet[cell].s.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };

      // Styling untuk header
      if (R < 3) {
        worksheet[cell].s.font = { bold: true };
        worksheet[cell].s.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
        worksheet[cell].s.fill = { fgColor: { rgb: "D3D3D3" } }; // Light gray
      } else {
        worksheet[cell].s.alignment = { horizontal: 'center' };
      }
    }
  }

  // Finalisasi dan ekspor
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Kendaraan');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const file = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });
  saveAs(file, `${fileName}.xlsx`);
};


export const ExportButton = ({
  vehicleData,
  fileName = 'VehicleData',
  className = "btn btn-md bg-green-500 text-white rounded-lg flex items-center gap-2",
  classification
}) => {
  const handleExport = () => {
    exportVehicleDataToExcel(vehicleData, fileName, classification);
  };

  return (
    <button onClick={handleExport} className={className} classification={classification} >
      <FaDownload />
      Export Excel
    </button>
  );
};