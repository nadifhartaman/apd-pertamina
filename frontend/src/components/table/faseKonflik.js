
import { useEffect, useState } from 'react';
import Image from 'next/image';


export default function VehicleDataTable ({ setDataKonflik, selectedId }) {
  const [tableData, setTableData] = useState({
    whh: 0,
    dataFase: [
      {
        fase: 2,
        kode: 'U',
        whh: 0,
        jarak: {
          lintasanBerangkat: {
            pendekat: {
              u: 0, s: 0, t: 0, b: 0
            },
            kecepatan: {
              vkbr: 0, vkdt: 0, vpk: 0
            },
            waktuTempuh: 0,
            wms: 0,
            wmsDisesuaikan: 0,
            wk: 0,
            wah: 0,
          },
          panjangBerangkat: {
            pendekat: {
              u: 0, s: 0, t: 0, b: 0
            },
            kecepatan: {
              vkbr: 0, vkdt: 0, vpk: 0
            },
            waktuTempuh: 0,
            wms: 0,
            wmsDisesuaikan: 0,
            wk: 0,
            wah: 0,
          },
          lintasanDatang: {
            pendekat: {
              u: 0, s: 0, t: 0, b: 0
            },
            kecepatan: {
              vkbr: 0, vkdt: 0, vpk: 0
            },
            waktuTempuh: 0,
            wms: 0,
            wmsDisesuaikan: 0,
            wk: 0,
            wah: 0,
          },
          lintasanPejalan: {
            pendekat: {
              u: 0, s: 0, t: 0, b: 0
            },
            kecepatan: {
              vkbr: 0, vkdt: 0, vpk: 0
            },
            waktuTempuh: 0,
            wms: 0,
            wmsDisesuaikan: 0,
            wk: 0,
            wah: 0,
          }
        }
      },
      {
        fase: 1,
        kode: 'S',
        whh: 0,
        jarak: {
          lintasanBerangkat: {
            pendekat: {
              u: 0, s: 0, t: 0, b: 0
            },
            kecepatan: {
              vkbr: 0, vkdt: 0, vpk: 0
            },
            waktuTempuh: 0,
            wms: 0,
            wmsDisesuaikan: 0,
            wk: 0,
            wah: 0,
          },
          panjangBerangkat: {
            pendekat: {
              u: 0, s: 0, t: 0, b: 0
            },
            kecepatan: {
              vkbr: 0, vkdt: 0, vpk: 0
            },
            waktuTempuh: 0,
            wms: 0,
            wmsDisesuaikan: 0,
            wk: 0,
            wah: 0,
          },
          lintasanDatang: {
            pendekat: {
              u: 0, s: 0, t: 0, b: 0
            },
            kecepatan: {
              vkbr: 0, vkdt: 0, vpk: 0
            },
            waktuTempuh: 0,
            wms: 0,
            wmsDisesuaikan: 0,
            wk: 0,
            wah: 0,
          },
          lintasanPejalan: {
            pendekat: {
              u: 0, s: 0, t: 0, b: 0
            },
            kecepatan: {
              vkbr: 0, vkdt: 0, vpk: 0
            },
            waktuTempuh: 0,
            wms: 0,
            wmsDisesuaikan: 0,
            wk: 0,
            wah: 0,
          }
        }
      }
    ]
  });

  const recalculateWhh = (dataFase) => {
    // Menjumlahkan semua nilai wah dari lintasanBerangkat di setiap fase
    const totalWah = dataFase.reduce((total, fase) => {
      return total + (fase.jarak.lintasanBerangkat.wah || 0);
    }, 0);

    return totalWah;
  };


  const [totals, setTotals] = useState({});
  const wkBaku = 3;

  const handleInputChange = (rowIndex, jarakType, field, subField, value) => {
    const newData = { ...tableData };
    const newDataFase = [...newData.dataFase];

    if (subField) {
      newDataFase[rowIndex].jarak[jarakType][field][subField] = value;
    } else {
      newDataFase[rowIndex].jarak[jarakType][field] = value;
    }

    // hitung ulang waktuTempuh kalau field yang berubah adalah u atau vkbr
    const pendekatU = newDataFase[rowIndex].jarak[jarakType].pendekat?.u ?? 0;
    const vkbr = newDataFase[rowIndex].jarak[jarakType].kecepatan?.vkbr ?? 0;
    const vkdt = newDataFase[rowIndex].jarak[jarakType].kecepatan?.vkdt ?? 0;

    const pendekat = newDataFase[rowIndex].jarak[jarakType].pendekat;

    const total =
      parseFloat(pendekat?.u || 0) +
      parseFloat(pendekat?.t || 0) +
      parseFloat(pendekat?.b || 0) +
      parseFloat(pendekat?.s || 0);

    console.log(newDataFase[rowIndex].jarak[jarakType].pendekat, jarakType)

    if ((field === 'pendekat' && subField === 'u') ||
      (field === 'pendekat' && subField === 't') ||
      (field === 'pendekat' && subField === 'b') ||
      (field === 'pendekat' && subField === 's') ||
      (field === 'kecepatan' && subField === 'vkbr') ||
      (field === 'kecepatan' && subField === 'vkdt') ||
      (field === 'wk')
    ) {

      // Update totals untuk row ini
      const newTotals = { ...totals };

      if (!newTotals[rowIndex]) {
        newTotals[rowIndex] = { LKBR: 0, PKBR: 0, LKDT: 0, LPK: 0, WMS: 0, WAH: 0 };
      }

      if (jarakType === "lintasanBerangkat") {
        newTotals[rowIndex].PKBR = total;
      } else if (jarakType === "panjangBerangkat") {
        newTotals[rowIndex].LKBR = total;
      } else if (jarakType === "lintasanDatang") {
        newTotals[rowIndex].LKDT = total;
      } else if (jarakType === "lintasanPejalan") {
        newTotals[rowIndex].LPK = total;
      }

      setTotals(newTotals);

      // Ambil nilai VKBR dari kedua jarakType (gunakan yang terbaru atau yang ada)
      const vkbrLintasan = newDataFase[rowIndex].jarak.lintasanBerangkat?.kecepatan?.vkbr ?? 0;
      const vkbrPanjang = newDataFase[rowIndex].jarak.panjangBerangkat?.kecepatan?.vkbr ?? 0;
      const vkdtValue = newDataFase[rowIndex].jarak.lintasanDatang?.kecepatan?.vkdt ?? 0;

      const wmsLintasan = newDataFase[rowIndex].jarak.lintasanBerangkat?.wmsDisesuaikan ?? 0;
      const wmsPanjang = newDataFase[rowIndex].jarak.panjangBerangkat?.wmsDisesuaikan ?? 0;
      const wmsDatang = newDataFase[rowIndex].jarak.lintasanDatang?.wmsDisesuaikan ?? 0;

      const wkLintasan = newDataFase[rowIndex].jarak.lintasanBerangkat?.wk ?? 0;
      const wkBerangkat = newDataFase[rowIndex].jarak.panjangBerangkat?.wk ?? 0;
      const wkDatang = newDataFase[rowIndex].jarak.lintasanDatang?.wk ?? 0;

      const wahLintasan = newDataFase[rowIndex].jarak.lintasanBerangkat?.wah ?? 0;
      const wahBerangkat = newDataFase[rowIndex].jarak.panjangBerangkat?.wah ?? 0;
      const wahLintasanDatang = newDataFase[rowIndex].jarak.lintasanDatang?.wah ?? 0;

      const vkdt = parseFloat(vkdtValue);
      const vkbr = parseFloat(vkbrLintasan || vkbrPanjang || 0);
      const wmsDisesuaikan = parseFloat(wmsLintasan || wmsPanjang || wmsDatang || 0);
      const wk = parseFloat(wkLintasan || wkBerangkat || wkDatang || 0);
      const wah = parseFloat(wahLintasan || wahBerangkat || wahLintasanDatang || 0);

      // Gunakan nilai dari row ini untuk menghitung waktums
      const currentLKBR = newTotals[rowIndex].LKBR;
      const currentPKBR = newTotals[rowIndex].PKBR;
      const currentLKDT = newTotals[rowIndex].LKDT;

      const currentWMS = newTotals[rowIndex].WMS;

      console.log(newTotals);
      console.log(currentLKBR, currentPKBR, vkbr, vkdt, currentWMS, wk, wkBaku);

      if (wkBaku === 3) {
        console.log(rowIndex, jarakType)
        newDataFase[rowIndex].jarak[jarakType].wk = wkBaku
      } else {
        null;
      }

      // Update waktums untuk KEDUA jarakType jika vkbr > 0
      let waktums2 = 0;
      const totalswah = wmsDisesuaikan + wkBaku
      console.log(wmsLintasan, wmsPanjang, wmsDatang, totalswah, wmsDisesuaikan, wkBaku)

      if (vkdt > 0) {
        waktums2 = parseFloat((currentLKDT / vkdt)).toFixed(2);
        console.log('Updated waktums2:', waktums2);
      }
      if (vkbr > 0) {
        const waktums = parseFloat((((currentPKBR + currentLKBR) / vkbr) - waktums2) * 0.1).toFixed(2);
        // Update waktums untuk lintasanBerangkat
        if (newDataFase[rowIndex].jarak.lintasanBerangkat) {
          newDataFase[rowIndex].jarak.lintasanBerangkat.wms = waktums;
        }

        // Update waktums untuk panjangBerangkat
        if (newDataFase[rowIndex].jarak.panjangBerangkat) {
          newDataFase[rowIndex].jarak.panjangBerangkat.wms = waktums;
        }

        if (newDataFase[rowIndex].jarak.lintasanDatang) {
          newDataFase[rowIndex].jarak.lintasanDatang.wms = waktums;
        }

        console.log('Updated waktums:', waktums);

        if (waktums > 0) {
          newDataFase[rowIndex].jarak.lintasanBerangkat.wmsDisesuaikan = Math.ceil(waktums);
          newDataFase[rowIndex].jarak.panjangBerangkat.wmsDisesuaikan = Math.ceil(waktums);
          newDataFase[rowIndex].jarak.lintasanDatang.wmsDisesuaikan = Math.ceil(waktums);
        }

        if (totalswah > 0) {
          console.log("test", totalswah)
          newDataFase[rowIndex].jarak.lintasanBerangkat.wah = totalswah;
          newDataFase[rowIndex].jarak.panjangBerangkat.wah = totalswah;
          newDataFase[rowIndex].jarak.lintasanDatang.wah = totalswah;
        }

        // if (wah) {
        //   newData.whh = recalculateWhh(newDataFase[rowIndex])
        //   console.log("test")
        // }
        if (wah || totalswah > 0) {
          console.log("test", totalswah)
          newDataFase[rowIndex].jarak.lintasanBerangkat.wah = totalswah;
          newDataFase[rowIndex].jarak.panjangBerangkat.wah = totalswah;
          newDataFase[rowIndex].jarak.lintasanDatang.wah = totalswah;

          // Hitung ulang whh dari semua fase
          newData.whh = recalculateWhh(newDataFase);
          console.log("Updated whh:", newData.whh);
        }
      }
    }

    let waktuTempuhs = 0;

    if (
      (field === 'pendekat' && subField === 'u') ||
      (field === 'pendekat' && subField === 's') ||
      (field === 'pendekat' && subField === 'b') ||
      (field === 'pendekat' && subField === 't') ||
      (field === 'kecepatan' && subField === 'vkbr')
    ) {
      console.log(subField, field)
      waktuTempuhs = vkbr > 0 ? waktuTempuhs = parseFloat((total / vkbr).toFixed(2)) : 0;
      // const waktuTempuh = vkbr > 0 || subField !== 'vkdt' ? parseFloat((total / vkbr).toFixed(2)) : parseFloat((total / vkdt).toFixed(2));
      newDataFase[rowIndex].jarak[jarakType].waktuTempuh = waktuTempuhs;
    } else if (
      (field === 'pendekat' && subField === 'u') ||
      (field === 'pendekat' && subField === 's') ||
      (field === 'pendekat' && subField === 'b') ||
      (field === 'pendekat' && subField === 't') ||
      (field === 'kecepatan' && subField === 'vkdt')
    ) {
      waktuTempuhs = vkdt > 0 ? waktuTempuhs = parseFloat((total / vkdt).toFixed(2)) : 0;
      newDataFase[rowIndex].jarak[jarakType].waktuTempuh = waktuTempuhs;
    }

    newData.dataFase = newDataFase;
    setTableData(newData);
  };

  const handleKodeChange = (rowIndex, value) => {
    const newData = { ...tableData };
    const newDataFase = [...newData.dataFase];
    newDataFase[rowIndex].kode = value;
    newData.dataFase = newDataFase;
    setTableData(newData);
  };

  const jarakTypes = [
    { key: 'lintasanBerangkat', label: 'Lintasan Kendaraan Berangkat, L', sub: 'kbr' },
    { key: 'panjangBerangkat', label: 'Panjang Kendaraan Berangkat, P', sub: 'kbr' },
    { key: 'lintasanDatang', label: 'Lintasan Kendaraan Datang, L', sub: 'kdt' },
    { key: 'lintasanPejalan', label: 'Lintasan Pejalan Kaki, L', sub: 'pk' }
  ];


  // const loadSA3 = (id) => {
  //   const existing = JSON.parse(localStorage.getItem('data'));
  //   return existing?.data?.sa3?.[id] || null;
  // };


  // useEffect(() => {
  //   console.log("test", selectedId)
  //   if (selectedId === 0) {
  //     setTableData({});
  //     return;
  //   }

  //   if (!selectedId || selectedId === 0 || selectedId === '0') return;
  //   const loadData = loadSA3(selectedId)
  //   if (!loadData || !Array.isArray(loadData.tabel_konflik.dataFase)) {
  //     console.warn("dataFase tidak valid:", loadData);
  //     setTableData({});
  //     return;
  //   }

  //   setTableData(loadData.tabel_konflik);
  //   console.log("Loaded dataFase:", loadData.tabel_konflik);
  // }, [selectedId]);

  useEffect(() => {
    if (!selectedId || selectedId === 0 || selectedId === '0') {
      setTableData({});
      return;
    }

    const existing = JSON.parse(localStorage.getItem('data'));
    const sa1 = existing?.data?.sa1?.[selectedId];
    const sa3 = existing?.data?.sa3?.[selectedId];
    const faseData = sa1?.fase?.data || {};

    const pendekatMap = {
      u: "U",
      s: "S",
      t: "T",
      b: "B",
    };

    const defaultJarak = () => ({
      pendekat: { u: 0, s: 0, t: 0, b: 0 },
      kecepatan: { vkbr: 0, vkdt: 0, vpk: 0 },
      waktuTempuh: 0,
      wms: 0,
      wmsDisesuaikan: 0,
      wk: 0,
      wah: 0
    });

    // Ambil data awal dari sa3 jika ada
    const baseTableData = sa3?.tabel_konflik || { whh: 0, dataFase: [] };

    // Buat Set semua fase yang AKTIF di sa1
    const validFaseKeys = new Set();

    Object.entries(faseData).forEach(([key, detail]) => {
      const kode = pendekatMap[key.toLowerCase()?.charAt(0)] || '-';
      const fasePendekat = detail?.fase || {};

      Object.entries(fasePendekat).forEach(([faseKey, aktif]) => {
        if (aktif) {
          const faseNum = parseInt(faseKey.replace('fase_', ''));
          const identifier = `fase_${faseNum}_${kode}`;
          validFaseKeys.add(identifier);
        }
      });
    });

    // Filter dataFase lama dari sa3 — hanya simpan yang masih valid
    const filteredExistingDataFase = (baseTableData.dataFase || []).filter(item => {
      const identifier = `fase_${item.fase}_${item.kode}`;
      return validFaseKeys.has(identifier);
    });

    // Buat tambahanDataFase dari fase aktif di sa1 yang belum ada di sa3
    const existingKeys = new Set(
      filteredExistingDataFase.map(item => `fase_${item.fase}_${item.kode}`)
    );

    const tambahanDataFase = [];

    validFaseKeys.forEach(identifier => {
      if (!existingKeys.has(identifier)) {
        const [_, faseNum, kode] = identifier.split('_');
        tambahanDataFase.push({
          fase: parseInt(faseNum),
          kode,
          whh: 0,
          jarak: {
            lintasanBerangkat: defaultJarak(),
            panjangBerangkat: defaultJarak(),
            lintasanDatang: defaultJarak(),
            lintasanPejalan: defaultJarak(),
          }
        });
      }
    });

    // Gabungkan dan urutkan berdasarkan fase
    const combinedDataFase = [...filteredExistingDataFase, ...tambahanDataFase]
      .sort((a, b) => a.fase - b.fase);

    // Set ke tableData
    setTableData({
      ...baseTableData,
      dataFase: combinedDataFase
    });

    setDataKonflik(
      {
        ...baseTableData,
        dataFase: combinedDataFase
      }
    )

  }, [selectedId]);


  useEffect(() => {
    const newData = { ...tableData };
    const updatedDataFase = newData?.dataFase?.map((row) => {
      const newRow = { ...row };

      // iterasi semua jenis jarak (misalnya: 'lintasanBerangkat', 'pendekat', dst.)
      Object.keys(newRow.jarak).forEach((jarakKey) => {
        console.log(newRow.jarak, jarakKey)
        if (newRow.jarak[jarakKey].wk !== 3) {
          newRow.jarak[jarakKey].wk = 3;
        }
      });

      return newRow;
    });

    newData.dataFase = updatedDataFase;
    setTableData(newData);
  }, []);

  const totalRows = tableData?.dataFase?.length * jarakTypes.length || 0;

  return (
    <div className="p-6 bg-base-100 min-h-fit">
      <div className="mb-6">
        <h2 className="text-[20px] text-base-content mb-2">
          Tabel Data Kendaraan
        </h2>
        <p className="text-sm text-base-content/70">
          Input data kendaraan berdasarkan fase, kode pendekat, dan parameter lainnya
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-xs w-full border border-base-300">
          <thead>
            <tr className="bg-base-300">
              <th rowSpan="3" className="text-center border border-base-300 min-w-10 font-semibold">
                Fase
              </th>
              <th rowSpan="3" className="text-center border border-base-300 min-w-5 font-semibold">
                Kode <br /> Pendekat
              </th>
              <th rowSpan={'2'} className="text-center border border-base-300 min-w-14 font-semibold">
                Jarak
              </th>
              <th colSpan="4" className="text-center border border-base-300 font-semibold">
                Kode Pendekat
              </th>
              <th colSpan="3" className="text-center border border-base-300 font-semibold">
                Kecepatan (m/detik)
              </th>
              <th rowSpan="2" className="text-center border border-base-300 min-w-10 font-semibold">
                Waktu <br />Tempuh
              </th>
              <th rowSpan="2" className="text-center border border-base-300 min-w-10 font-semibold">
                W<sub>MS</sub>
              </th>
              <th rowSpan="2" className="text-center border border-base-300 min-w-10 font-semibold">
                W<sub>MS</sub> <br /> Disesuaikan
              </th>
              <th rowSpan="2" className="text-center border border-base-300 min-w-10 font-semibold">
                W<sub>K</sub>
              </th>
              <th rowSpan="2" className="text-center border border-base-300 min-w-10 font-semibold">
                W<sub>AH</sub>
              </th>
              <th rowSpan="2" className="text-center border border-base-300 min-w-10 font-semibold">
                W<sub>HH</sub>
              </th>
            </tr>
            <tr className="bg-base-300">
              <th rowSpan={2} className="text-center border border-base-300 min-w-10 font-semibold">U</th>
              <th rowSpan={2} className="text-center border border-base-300 min-w-10 font-semibold">S</th>
              <th rowSpan={2} className="text-center border border-base-300 min-w-10 font-semibold">T</th>
              <th rowSpan={2} className="text-center border border-base-300 min-w-10 font-semibold">B</th>
              <th className="text-center border border-base-300 min-w-10 font-semibold">
                Berangkat
              </th>
              <th className="text-center border border-base-300 min-w-10 font-semibold">
                Datang
              </th>
              <th className="text-center border border-base-300 min-w-10 font-semibold">
                Pejalan Kaki
              </th>
            </tr>
            <tr className="bg-base-300 text-xs">
              <th className="text-center border border-base-300 font-semibold">(m)</th>
              <th className="text-center border border-base-300 font-semibold">
                V<sub>kbr</sub>
              </th>
              <th className="text-center border border-base-300 font-semibold">
                V<sub>kdt</sub>
              </th>
              <th className="text-center border border-base-300 font-semibold">
                V<sub>pk</sub>
              </th>
              <th className="text-center border border-base-300 font-semibold">(detik)</th>
              <th className="text-center border border-base-300 font-semibold">(detik)</th>
              <th className="text-center border border-base-300 font-semibold">(detik)</th>
              <th className="text-center border border-base-300 font-semibold">(detik)</th>
              <th className="text-center border border-base-300 font-semibold">(detik)</th>
              <th className="text-center border border-base-300 font-semibold">(detik/siklus)</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.dataFase?.map((row, rowIndex) =>
            (
              jarakTypes.map((jarakType, jarakIndex) => (
                <tr key={`${rowIndex}-${jarakIndex}`} className="hover:bg-base-200">
                  {jarakIndex === 0 && (
                    <td rowSpan="4" className="text-center border border-base-300 font-semibold align-middle">
                      {row.fase}
                    </td>
                  )}
                  {jarakIndex === 0 && (
                    <td rowSpan="4" className="text-center border border-base-300 p-0">
                      <div className="flex h-full min-h-[16rem]">
                        <input
                          type="text"
                          className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-full min-w-10 border-0"
                          value={row.kode}
                          onChange={(e) => handleKodeChange(rowIndex, e.target.value)}
                        />
                      </div>
                    </td>
                  )}
                  <td className="border border-base-300">
                    <div className="text-xs text-base-content/70">
                      {jarakType.label}<sub>{jarakType.sub}</sub>
                    </div>
                  </td>
                  <td className="border border-base-300 p-0">
                    <div className="flex h-full min-h-[4rem]">
                      <input
                        type="number"
                        step="0.1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-full min-w-10 border-0"
                        value={row.jarak[jarakType.key].pendekat.u === 0 || row.jarak[jarakType.key].pendekat.u === '0' ? '' : row.jarak[jarakType.key].pendekat.u}
                        onChange={(e) =>
                          handleInputChange(rowIndex, jarakType.key, 'pendekat', 'u', e.target.value)
                        }
                      />
                    </div>
                  </td>
                  <td className="border border-base-300 p-0">
                    <div className="flex h-full min-h-[4rem]">
                      <input
                        type="number"
                        step="0.1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-full min-w-10 border-0"
                        value={row.jarak[jarakType.key].pendekat.s === 0 || row.jarak[jarakType.key].pendekat.s === '0' ? '' : row.jarak[jarakType.key].pendekat.s}
                        onChange={(e) =>
                          handleInputChange(rowIndex, jarakType.key, 'pendekat', 's', e.target.value)
                        }
                      />
                    </div>
                  </td>
                  <td className="border border-base-300 p-0">
                    <div className="flex h-full min-h-[4rem]">
                      <input
                        type="number"
                        step="0.1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-full min-w-10 border-0"
                        value={row.jarak[jarakType.key].pendekat.t === 0 || row.jarak[jarakType.key].pendekat.t === '0' ? '' : row.jarak[jarakType.key].pendekat.t}
                        onChange={(e) =>
                          handleInputChange(rowIndex, jarakType.key, 'pendekat', 't', e.target.value)
                        }
                      />
                    </div>

                  </td>
                  <td className="border border-base-300 p-0">
                    <div className="flex h-full min-h-[4rem]">
                      <input
                        type="number"
                        step="0.1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-full min-w-10 border-0"
                        value={row.jarak[jarakType.key].pendekat.b === 0 || row.jarak[jarakType.key].pendekat.b === '0' ? '' : row.jarak[jarakType.key].pendekat.b}
                        onChange={(e) =>
                          handleInputChange(rowIndex, jarakType.key, 'pendekat', 'b', e.target.value)
                        }
                      />
                    </div>

                  </td>
                  <td className="border border-base-300 p-0">
                    <div className="flex h-full min-h-[4rem]">
                      <input
                        type="number"
                        step="0.1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-full min-w-10 border-0"
                        value={row.jarak[jarakType.key].kecepatan.vkbr === 0 || row.jarak[jarakType.key].kecepatan.vkbr === '0' ? '' : row.jarak[jarakType.key].kecepatan.vkbr}
                        onChange={(e) =>
                          handleInputChange(rowIndex, jarakType.key, 'kecepatan', 'vkbr', e.target.value)
                        }
                      />
                    </div>

                  </td>
                  <td className="border border-base-300 p-0">
                    <div className="flex h-full min-h-[4rem]">
                      <input
                        type="number"
                        step="0.1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-full min-w-10 border-0"
                        value={row.jarak[jarakType.key].kecepatan.vkdt === 0 || row.jarak[jarakType.key].kecepatan.vkdt === '0' ? '' : row.jarak[jarakType.key].kecepatan.vkdt}
                        onChange={(e) =>
                          handleInputChange(rowIndex, jarakType.key, 'kecepatan', 'vkdt', e.target.value)
                        }
                      />
                    </div>
                  </td>
                  <td className="border border-base-300 p-0">
                    <div className="flex h-full min-h-[4rem]">
                      <input
                        type="number"
                        step="0.1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-full min-w-10 border-0"
                        value={row.jarak[jarakType.key].kecepatan.vpk === 0 || row.jarak[jarakType.key].kecepatan.vpk === '0' ? '' : row.jarak[jarakType.key].kecepatan.vpk}
                        onChange={(e) =>
                          handleInputChange(rowIndex, jarakType.key, 'kecepatan', 'vpk', e.target.value)
                        }
                      />
                    </div>

                  </td>
                  <td className="text-center border-base-300 p-0">
                    <div className="flex h-full min-h-[4rem]">
                      <input
                        type="number"
                        step="0.01"
                        readOnly
                        className="focus:outline-none appearance-none flex-1 p-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full min-w-10 font-semibold border-0 focus:ring-0 text-center"
                        // value={row.jarak[jarakType.key].waktuTempuh}
                        value={row.jarak[jarakType.key].waktuTempuh === 0 || row.jarak[jarakType.key].waktuTempuh === '0' ? '' : row.jarak[jarakType.key].waktuTempuh}

                      // value={row.jarak[jarakType.key].pendekat.u / row.jarak[jarakType.key].kecepatan.vkbr}
                      // onChange={() => {
                      //   const pendekatU = row?.jarak?.[jarakType?.key]?.pendekat?.u ?? 0;
                      //   const kecepatanVkbr = row?.jarak?.[jarakType?.key]?.kecepatan?.vkbr ?? 1; // hindari dibagi 0

                      //   const hasil = pendekatU / kecepatanVkbr;
                      //   handleInputChange(rowIndex, jarakType.key, 'waktuTempuh', null, hasil)
                      // }
                      // }
                      />
                    </div>
                  </td>
                  {jarakIndex === 0 && (
                    <td className="border border-base-300 p-0" rowSpan={4}>
                      <div className="flex h-full min-h-[4rem]">
                        <input
                          type="number"
                          step="0.01"
                          readOnly
                          className="focus:outline-none appearance-none flex-1 p-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full min-w-10 font-semibold border-0 focus:ring-0 text-center"
                          value={row.jarak[jarakType.key].wms === 0 || row.jarak[jarakType.key].wms === '0' ? '' : row.jarak[jarakType.key].wms}
                          onChange={(e) =>
                            handleInputChange(rowIndex, jarakType.key, 'wms', null, e.target.value)
                          }
                        />
                      </div>
                    </td>
                  )}
                  {jarakIndex === 0 && (
                    <td className="border border-base-300 p-0" rowSpan={4}>
                      <div className="flex h-full min-h-[4rem]">
                        <input
                          type="number"
                          step="1"
                          readOnly
                          className="focus:outline-none appearance-none flex-1 p-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full min-w-10 font-semibold border-0 focus:ring-0 text-center"
                          value={row.jarak[jarakType.key].wmsDisesuaikan === 0 || row.jarak[jarakType.key].wmsDisesuaikan === '0' ? '' : row.jarak[jarakType.key].wmsDisesuaikan}
                          // value={row.jarak[jarakType.key].wms === 0 || row.jarak[jarakType.key].wms === '0' ? '' : row.jarak[jarakType.key].wms}
                          onChange={(e) =>
                            handleInputChange(rowIndex, jarakType.key, 'wmsDisesuaikan', null, e.target.value)
                          }
                        />
                      </div>
                    </td>
                  )}
                  {jarakIndex === 0 && (
                    <td className="border border-base-300 p-0" rowSpan={4}>
                      <div className="flex h-full min-h-[4rem]">
                        <input
                          type="number"
                          step="1"
                          className="focus:outline-none appearance-none flex-1 p-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full min-w-10 font-semibold border-0 focus:ring-0 text-center"
                          value={row.jarak[jarakType.key].wk === 0 || row.jarak[jarakType.key].wk === '0' ? '' : row.jarak[jarakType.key].wk}
                          onChange={(e) =>
                            handleInputChange(rowIndex, jarakType.key, 'wk', null, e.target.value)
                          }
                        />
                      </div>
                    </td>
                  )}

                  {jarakIndex === 0 && (
                    <td className="border border-base-300 p-0" rowSpan={4}>
                      <div className="flex h-full min-h-[4rem]">
                        <input
                          type="number"
                          step="1"
                          readOnly
                          className="focus:outline-none appearance-none flex-1 p-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full min-w-10 font-semibold border-0 focus:ring-0 text-center"
                          value={row.jarak[jarakType.key].wah === 0 || row.jarak[jarakType.key].wah === '0' ? '' : row.jarak[jarakType.key].wah}
                        // onChange={(e) =>
                        //   handleInputChange(rowIndex, jarakType.key, 'wah', null, e.target.value)
                        // }
                        />
                      </div>
                    </td>
                  )}
                  {/* 
                  {jarakIndex === 0 && (
                    <td className="border border-base-300 p-0" rowSpan={4 * (jarakIndex + 1)}>
                      <div className="flex h-full min-h-[4rem]">
                        <input
                          type="number"
                          step="1"
                          readOnly
                          className="focus:outline-none appearance-none flex-1 p-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full min-w-10 font-semibold border-0 focus:ring-0 text-center"
                          value={tableData.whh}
                        // onChange={(e) =>
                        //   handleInputChange(rowIndex, jarakType.key, 'wah', null, e.target.value)
                        // }
                        />
                      </div>
                    </td>
                  )} */}

                  {rowIndex === 0 && jarakIndex === 0 && (
                    <td rowSpan={totalRows}>
                      <input
                        value={tableData.whh === 0 || tableData.whh === '0' ? '' : tableData.whh}
                        readOnly
                        className="focus:outline-none appearance-none flex-1 p-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full min-w-10 font-semibold border-0 focus:ring-0 text-center"
                      />
                    </td>
                  )}
                </tr>
              ))))}
            <tr>
              <td colSpan={8} className='text-xs text-base-600 align-text-top border-1 border-base-100'>
                <strong>Catatan:</strong><br /> Dari fase 3 ke 4 tidak memerlukan WMS karena arus dari barat tetap berjalan
              </td>
              <td colSpan={3} className='text-xs text-base-600 align-text-top'>
                <table>
                  <tbody>
                    <tr>
                      <td>V<sub>KDT</sub></td>
                      <td className='text-nowrap'>= m/det (Kendaraan Bermotor)</td>
                    </tr>
                    <tr>
                      <td className='align-text-top'>V<sub>KBR</sub></td>
                      <td className='text-nowrap'>
                        <ul>
                          <li>= 10 m/det (Kendaraan Bermotor)</li>
                          <li>= 3 m/det (Kendaraan tidak bermotor misalnya sepeda)</li>
                          <li>= 1,2 m/det (pejalan kaki)</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className='align-text-top'>V<sub>KBR</sub></td>
                      <td className='text-nowrap'>
                        <ul>
                          <li>= 5 m/det (MP atau KS)</li>
                          <li>= 2 m/det (SM atau KTB)</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colSpan={5} className='border-1 border-base-100'>
                <Image
                  src="/image/Picture1.png"
                  alt=""
                  width={300}
                  height={200}
                  className='m-auto'
                /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className="btn btn-sm btn-success"
          onClick={() => {
            setDataKonflik(tableData)
          }}
        >
          Simpan Data
        </button>

        {/* <button
          className="btn btn-sm btn-warning"
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
              setTableData([]);
            }
          }}
        >
          Reset Tabel
        </button> */}
      </div>

      {/* <div className="mt-4 p-3 bg-gray-100 rounded">
        <h3 className="text-[12px] font-medium mb-2">Data JSON saat ini:</h3>
        <pre className="text-[10px] overflow-x-auto">
          {JSON.stringify(tableData, null, 2)}
        </pre>
      </div> */}
      {/* <div className="mt-6 p-4 bg-base-200 rounded-lg">
        <h3 className="font-semibold mb-2">Keterangan:</h3>
        <div className="text-sm space-y-1">
          <p>• L<sub>bkr</sub>: Lintasan Kendaraan Berangkat</p>
          <p>• P<sub>bkr</sub>: Panjang Kendaraan Berangkat</p>
          <p>• L<sub>dkt</sub>: Lintasan Kendaraan Datang</p>
          <p>• L<sub>pk</sub>: Lintasan Pejalan Kaki</p>
          <p>• V<sub>bkr</sub>: Kecepatan Berangkat</p>
          <p>• V<sub>dkt</sub>: Kecepatan Datang</p>
          <p>• V<sub>pk</sub>: Kecepatan Pejalan Kaki</p>
        </div>
      </div> */}
    </div>
  );
}