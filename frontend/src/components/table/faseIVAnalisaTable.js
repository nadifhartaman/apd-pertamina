"use client";

import { useState, useEffect } from 'react';
import DataSample from "@/data/DataFaseIVAnalisa.json"
import SketsaFaseIV from '@/components/sketsa/sketsaFaseIV'
import { ToastContainer, toast } from 'react-toastify';


export default function TrafficPhaseTable ({ selectedId }) {
  const [tableData, setTableData] = useState(
    [
      {
        kodePendekat: "U",
        tipePendekat: "P",
        arah: "Terlindung",
        pemisahanLurusRka: "",
        arahDetail: {
          bka: false,
          bki: false,
          bkijt: false,
          lurus: false,
        },
        phases: {
          f1: {
            mf: 0,
            whi: 0,
            wAll: { wk: 0, wms: 0 }
          },
          f2: {
            mf: 0,
            whi: 0,
            wAll: { wk: 0, wms: 0 }
          },
          f3: {
            mf: 0,
            whi: 0,
            wAll: { wk: 0, wms: 0 }
          },
          f4: {
            mf: 0,
            whi: 0,
            wAll: { wk: 0, wms: 0 }
          }
        },
        whh: 0,
        s: 0
      },
      {
        kodePendekat: "S",
        tipePendekat: "P",
        arah: "Terlindung",
        pemisahanLurusRka: "",
        arahDetail: {
          bka: false,
          bki: false,
          bkijt: false,
          lurus: false,
        },
        phases: {
          f1: {
            mf: 0,
            whi: 0,
            wAll: { wk: 0, wms: 0 }
          },
          f2: {
            mf: 0,
            whi: 0,
            wAll: { wk: 0, wms: 0 }
          },
          f3: {
            mf: 0,
            whi: 0,
            wAll: { wk: 0, wms: 0 }
          },
          f4: {
            mf: 0,
            whi: 0,
            wAll: { wk: 0, wms: 0 }
          }
        },
        whh: 0,
        s: 0
      }
    ]);


  useEffect(() => {
    if (!selectedId || selectedId === 0 || selectedId === '0') {
      setTableData([]);
      return;
    }

    const raw = localStorage.getItem('data');
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const sa1 = parsed?.data?.sa1?.[selectedId];
      const sa2 = parsed?.data?.sa2?.[selectedId];
      const sa3 = parsed?.data?.sa3?.[selectedId];
      const sa4 = parsed?.data?.sa4?.[selectedId];
      const data_fase = sa3?.tabel_konflik?.dataFase
      const saiv = sa4?.SAIV
      if (!sa4) {
        toast.error("Data SA 4 tidak ditemukan!", { position: 'top-right' });
      }

      if (!sa1 || !sa2 || !sa3) {
        toast.error("Data SA 1 s/d SA 3 tidak lengkap!", { position: 'top-right' });
        setTableData([]);
        return;
      }

      const arahMap = {
        utara: "U",
        selatan: "S",
        timur: "T",
        barat: "B"
      };

      console.log(sa4)

      // Kumpulkan data dari semua arah untuk semua fase terlebih dahulu
      const allArahData = {};

      // Loop semua arah untuk mengumpulkan data
      Object.entries(sa1.fase.data).forEach(([arahKey, detail]) => {
        const arahKode = arahMap[arahKey] || arahKey?.charAt(0)?.toUpperCase() || '-';
        allArahData[arahKode] = [];

        let currentMF = 0; // Mulai dari 0 untuk setiap arah

        ['1', '2', '3', '4'].forEach(fKey => {
          const faseData = data_fase?.find(
            item => item.kode === arahKode && item.fase === parseInt(fKey)
          );
          console.log(faseData)
          const wk = Number(faseData?.wk || 0);
          const wms = Number(faseData?.jarak?.lintasanBerangkat?.wmsDisesuaikan || 0 );

          const saivData = saiv?.tabel?.find(
            item => item.kodePendekat === arahKode && item.hijauFase === parseInt(fKey)
          );

          const whi = saivData?.waktuHijauPerFase ? Number(saivData.waktuHijauPerFase) : 0;
          const wkFinal = saivData ? 3 : wk;

          // Total waktu fase ini
          console.log({wk: wk,wms: wms, whi: whi, wkFinal: wkFinal})
          const total = whi + wkFinal + wms;

          allArahData[arahKode].push({
            fase: fKey,
            mf: currentMF,
            whi,
            wk: wkFinal,
            wms,
            total: total
          });

          currentMF += total; // Update mf untuk fase berikutnya
        });
      });


      // Hitung akumulasi global untuk setiap fase (dari SEMUA arah)
      const globalAccumulation = [0, 0, 0, 0]; // untuk fase 1, 2, 3, 4

      for (let faseIndex = 1; faseIndex < 4; faseIndex++) { // fase 2, 3, 4
        let totalForThisFase = 0;

        // Akumulasi dari semua fase sebelumnya
        for (let prevFaseIndex = 0; prevFaseIndex < faseIndex; prevFaseIndex++) {
          // Jumlah dari SEMUA arah di fase sebelumnya
          Object.values(allArahData).forEach(arahData => {
            totalForThisFase += arahData[prevFaseIndex].total;
          });
        }

        globalAccumulation[faseIndex] = totalForThisFase;
      }

      console.log("Global accumulation:", globalAccumulation);

      // Sekarang proses untuk arah saat ini (dalam loop utama)
      const newTableData = Object.entries(sa1.fase.data).map(([arah, detail]) => {
        const kodePendekat = arahMap[arah] || arah?.charAt(0)?.toUpperCase() || '-';

        console.log(arah, detail)
        const tipePendekatRaw = detail?.tipe_pendekat || {};
        const arahRaw = detail?.arah || {};
        const faseRaw = detail?.fase || {};

        // Tentukan arah
        const arahLabel = (() => {
          const terlawan = arahRaw?.terlawan;
          const terlindung = arahRaw?.terlindung;
          if (terlawan && terlindung) return "Terlindung/Terlawan";
          if (terlawan) return "Terlawan";
          if (terlindung) return "Terlindung";
          return "-";
        })();

        // whh dari sa4
        const whhFromSAIV = saiv?.foot?.whh || 0;
        const SFromSAIV = saiv?.foot?.S || 0;
        // Tentukan tipe pendekat
        const tipePendekatLabel = (() => {
          const p = tipePendekatRaw?.terlindung;
          const o = tipePendekatRaw?.terlawan;
          if (p && o) return "P/O";
          if (p) return "P";
          if (o) return "O";
          return "-";
        })();

        const phases = {
          f1: { mf: 0, whi: 0, wAll: { wk: 0, wms: 0 } },
          f2: { mf: 0, whi: 0, wAll: { wk: 0, wms: 0 } },
          f3: { mf: 0, whi: 0, wAll: { wk: 0, wms: 0 } },
          f4: { mf: 0, whi: 0, wAll: { wk: 0, wms: 0 } }
        };

        ['1', '2', '3', '4'].forEach((fKey, index) => {
          const faseData = data_fase?.find(
            item => (item.kode === kodePendekat) && (item.fase === parseInt(fKey))
          );

          const wk = Number(faseData?.wk || 0);
          const wms = Number(faseData?.jarak?.lintasanBerangkat?.wmsDisesuaikan || 0);
          console.log(faseData?.jarak?.lintasanBerangkat?.wmsDisesuaikan)
          const saivData = saiv?.tabel?.find(
            item => item.kodePendekat === kodePendekat && item.hijauFase === parseInt(fKey)
          );

          const whi = saivData?.waktuHijauPerFase ? Number(saivData.waktuHijauPerFase) : 0;
          const wkFinal = saivData ? 3 : wk;

          // Cek apakah arah ini AKTIF di fase ini (ada data whi, wk, atau wms)
          const isActive = (whi > 0 || wkFinal > 0 || wms > 0);

          // Berikan mf hanya jika arah ini aktif, jika tidak aktif mf = 0
          const mf = isActive ? globalAccumulation[index] : 0;

          phases[`f${fKey}`] = {
            mf,
            whi,
            wAll: { wk: wkFinal, wms: wms }
          };
        });

        return {
          kodePendekat,
          tipePendekat: tipePendekatLabel,
          arah: arahLabel,
          arahDetail: {
            bka: detail?.arah?.bka || false,
            bki: detail?.arah?.bki || false,
            bkijt: detail?.arah?.bkijt || false,
            lurus: detail?.arah?.lurus || false
          },
          pemisahanLurusRka: detail?.pemisahan_lurus_bka ?? "",
          phases,
          whi: 0,
          s: SFromSAIV,
          whh: whhFromSAIV
        };
      });

      setTableData(newTableData);
      console.log(newTableData)
    } catch (e) {
      console.error('Gagal parse data:', e);
    }
  }, [selectedId]);


  const handleInputChange = (rowIndex, field, subField, phaseKey, value) => {
    const newData = [...tableData];

    if (field === 'phases' && phaseKey && subField) {
      if (subField === 'wAll') {
        const [wAllField, wAllSubField] = value.split('.');
        if (wAllSubField) {
          newData[rowIndex][field][phaseKey][subField][wAllField] = wAllSubField;
        } else {
          newData[rowIndex][field][phaseKey][subField][wAllField] = value.value;
        }
      } else {
        newData[rowIndex][field][phaseKey][subField] = value;
      }
    } else if (field && subField) {
      // Untuk nested object seperti arah.bka, arah.lurus, dsb
      if (!newData[rowIndex][field]) {
        newData[rowIndex][field] = {};
      }
      newData[rowIndex][field][subField] = value;
    } else {
      newData[rowIndex][field] = value;
    }

    setTableData(newData);
  };


  const handlePhaseWAllChange = (rowIndex, phaseKey, wAllField, value) => {
    const newData = [...tableData];
    if (!newData[rowIndex].phases[phaseKey].wAll) {
      newData[rowIndex].phases[phaseKey].wAll = {};
    }
    newData[rowIndex].phases[phaseKey].wAll[wAllField] = value;
    setTableData(newData);
  };

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-lg font-normal mb-2">
          Tabel Analisis Fase Lalu Lintas
        </h2>
        <p className="text-[12px]">
          Analisis waktu dan fase untuk setiap pendekat
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-gray-200">
              <th rowSpan={4} className="border border-gray-300 p-2 text-center font-semibold min-w-[50px] text-wrap">
                Kode<br />Pendekat
              </th>
              <th rowSpan={4} className="border border-gray-300 p-2 text-center font-semibold min-w-[50px] text-wrap">
                Tipe<br />Pendekat
              </th>
              <th rowSpan={4} className="border border-gray-300 p-2 text-center font-semibold min-w-[80px] text-wrap">
                Arah
              </th>
              <th rowSpan={4} className="border border-gray-300 p-2 text-center font-semibold min-w-[80px] text-wrap">
                Pemisahan<br />Lurus - BKa
              </th>
              <th colSpan={4} className="border border-gray-300 p-2 text-center font-semibold">
                F1
              </th>
              <th colSpan={4} className="border border-gray-300 p-2 text-center font-semibold">
                F2
              </th>
              <th colSpan={4} className="border border-gray-300 p-2 text-center font-semibold">
                F3
              </th>
              <th colSpan={4} className="border border-gray-300 p-2 text-center font-semibold">
                F4
              </th>
              <th rowSpan={4} className="border border-gray-300 p-2 text-center font-semibold min-w-[60px]">
                W<sub>HI</sub>
              </th>
              <th rowSpan={4} className="border border-gray-300 p-2 text-center font-semibold min-w-[60px]">
                S
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[50px]">MF</th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[50px]">W<sub>HI</sub></th>
              <th colSpan={2} className="border border-gray-300 p-1 text-center font-semibold ">W<sub>All</sub></th>

              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[50px]">MF</th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[50px]">W<sub>HI</sub></th>
              <th colSpan={2} className="border border-gray-300 p-1 text-center font-semibold ">W<sub>All</sub></th>

              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[50px]">MF</th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[50px]">W<sub>HI</sub></th>
              <th colSpan={2} className="border border-gray-300 p-1 text-center font-semibold ">W<sub>All</sub></th>

              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[50px]">MF</th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[50px]">W<sub>HI</sub></th>
              <th colSpan={2} className="border border-gray-300 p-1 text-center font-semibold ">W<sub>All</sub></th>
            </tr>

            {/* Header Row 3 */}
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-1"></th>
              <th className="border border-gray-300 p-1"></th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[40px]">W<sub>K</sub></th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[40px]">W<sub>MS</sub></th>

              <th className="border border-gray-300 p-1"></th>
              <th className="border border-gray-300 p-1"></th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[40px]">W<sub>K</sub></th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[40px]">W<sub>MS</sub></th>

              <th className="border border-gray-300 p-1"></th>
              <th className="border border-gray-300 p-1"></th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[40px]">W<sub>K</sub></th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[40px]">W<sub>MS</sub></th>

              <th className="border border-gray-300 p-1"></th>
              <th className="border border-gray-300 p-1"></th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[40px]">W<sub>K</sub></th>
              <th className="border border-gray-300 p-1 text-center font-semibold min-w-[40px]">W<sub>MS</sub></th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((row, rowIndex) => {
              const index = rowIndex;
              return (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {/* Kode Pendekat */}
                  <td className="border border-gray-300 text-center ">
                    <div className="flex items-center justify-center p-2">
                      {/* <input type="checkbox" className="checkbox checkbox-xs mr-1" defaultChecked /> */}
                      <span className="font-semibold">{row.kodePendekat}</span>
                    </div>
                  </td>

                  {/* Tipe Pendekat */}
                  <td className="border border-gray-300 text-center p-2 font-semibold">
                    {row.tipePendekat}
                  </td>

                  {/* Arah */}
                  <td className="border border-gray-300 p-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          className="mr-1 mb-0.5 checkbox checkbox-xs"
                          checked={row.arahDetail.bki || false}
                          onChange={(e) => handleInputChange(rowIndex, "arahDetail", "bki", null, e.target.checked)}
                        />
                        <span className='text-nowrap'>BKI / BKIJT</span>
                        <input
                          type="checkbox"
                          className="mr-1 mb-0.5 checkbox checkbox-xs"
                          checked={row.pemisahanLurusRka === 1}
                          onChange={(e) =>
                            handleInputChange(rowIndex, "arahDetail", null, null, e.target.checked ? 1 : 0)
                          }
                        />
                      </div>
                      <div className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          className="mr-1 mb-0.5 checkbox checkbox-xs"
                          checked={row.arahDetail.lurus || false}
                          onChange={(e) => handleInputChange(rowIndex, "arahDetail", "lurus", null, e.target.checked)}
                        />
                        <span>Lurus</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          className="mr-1 mb-0.5 checkbox checkbox-xs"
                          checked={row.arahDetail.bka || false}
                          onChange={(e) => handleInputChange(rowIndex, "arahDetail", "bka", null, e.target.checked)}
                        />
                        <span>BKa</span>
                      </div>
                    </div>
                  </td>


                  {/* Pemisahan Lurus - RKa */}
                  <td className="border border-gray-300 text-center p-2">
                    <input type="checkbox" className="checkbox checkbox-xs" defaultChecked={row.pemisahanLurusRka === 1} />
                  </td>

                  {/* F1 */}
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f1.mf}
                        onChange={(e) => handleInputChange(rowIndex, 'phases', 'mf', 'f1', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f1.whi}
                        onChange={(e) => handleInputChange(rowIndex, 'phases', 'whi', 'f1', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f1.wAll.wk}
                        onChange={(e) => handlePhaseWAllChange(rowIndex, 'f1', 'wk', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f1.wAll.wms}
                        onChange={(e) => handlePhaseWAllChange(rowIndex, 'f1', 'wms', e.target.value)}
                      />
                    </div>
                  </td>

                  {/* F2 */}
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f2.mf}
                        onChange={(e) => handleInputChange(rowIndex, 'phases', 'mf', 'f2', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f2.whi}
                        onChange={(e) => handleInputChange(rowIndex, 'phases', 'whi', 'f2', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f2.wAll.wk}
                        onChange={(e) => handlePhaseWAllChange(rowIndex, 'f2', 'wk', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f2.wAll.wms}
                        onChange={(e) => handlePhaseWAllChange(rowIndex, 'f2', 'wms', e.target.value)}
                      />
                    </div>
                  </td>

                  {/* F3 */}
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f3.mf}
                        onChange={(e) => handleInputChange(rowIndex, 'phases', 'mf', 'f3', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f3.whi}
                        onChange={(e) => handleInputChange(rowIndex, 'phases', 'whi', 'f3', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f3.wAll.wk}
                        onChange={(e) => handlePhaseWAllChange(rowIndex, 'f3', 'wk', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f3.wAll.wms}
                        onChange={(e) => handlePhaseWAllChange(rowIndex, 'f3', 'wms', e.target.value)}
                      />
                    </div>
                  </td>

                  {/* F4 */}
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f4.mf}
                        onChange={(e) => handleInputChange(rowIndex, 'phases', 'mf', 'f4', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f4.whi}
                        onChange={(e) => handleInputChange(rowIndex, 'phases', 'whi', 'f4', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f4.wAll.wk}
                        onChange={(e) => handlePhaseWAllChange(rowIndex, 'f4', 'wk', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                        value={row.phases.f4.wAll.wms}
                        onChange={(e) => handlePhaseWAllChange(rowIndex, 'f4', 'wms', e.target.value)}
                      />
                    </div>
                  </td>

                  {/* Render kolom whh hanya di baris pertama dari 3 (index 0) */}
                  {/* WHI */}
                  {index % 3 === 0 && (
                    <td className="border border-gray-300 p-0" rowSpan={3}>
                      <div className="flex h-full min-h-[2rem]">
                        <input
                          type="text"
                          readOnly={true}
                          className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                          value={row.whh}
                          onChange={(e) => handleInputChange(rowIndex, 'whi', null, null, e.target.value)}
                        />
                      </div>
                    </td>
                  )}
                  {/* S */}
                  {index % 3 === 0 && (
                    <td className="border border-gray-300 p-0" rowSpan={3}>
                      <div className="flex h-full min-h-[2rem]">
                        <input
                          type="text"
                          readOnly={true}
                          className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-1 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-16 border-0"
                          value={row.s}
                          onChange={(e) => handleInputChange(rowIndex, 's', null, null, e.target.value)}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div >
      <SketsaFaseIV dataSketsa={tableData} />
      {/* 
      <div className="mt-6 flex gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          onClick={() => {
            console.log('Data saved:', tableData);
            alert('Data berhasil disimpan! (Lihat console untuk detail)');
          }}
        >
          Simpan Data
        </button>

        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          onClick={() => {
            const newRow = {
              kodePendekat: '',
              tipePendekat: '',
              arah: '',
              pemisahanLurusRka: '',
              phases: {
                f1: { mf: '', whi: '', wAll: { wk: '', wms: '' } },
                f2: { mf: '', whi: '', wAll: { wk: '', wms: '' } },
                f3: { mf: '', whi: '', wAll: { wk: '', wms: '' } },
                f4: { mf: '', whi: '', wAll: { wk: '', wms: '' } }
              },
              whi: '',
              s: ''
            };
            setTableData([...tableData, newRow]);
          }}
        >
          Tambah Baris
        </button>
      </div> */}
    </div >
  );
}