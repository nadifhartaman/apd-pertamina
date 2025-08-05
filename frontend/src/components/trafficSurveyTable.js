'use client'

import React, { useEffect, useState } from 'react';

const TrafficSurveyTable = ({ dataEMP, selectedId, setDataTraffic }) => {


  const getKinerjaDataByDirectionAPI = async (direction) => {
    try {
      const res = await fetch(`/api/kinerja/${direction.toLowerCase()}`);
      const json = await res.json();
      return json.data; // asumsi BE kirim field `data` seperti contoh di atas
    } catch (err) {
      console.error("Gagal fetch kinerja:", err);
      return [];
    }
  };
  const getKinerjaDataByDirection = (direction) => {
    const mock = {
      u: {
        mp: [500, 100, 140],
        ks: [100, 250, 80],
        sm: [120, 220, 50],
        ktb: [0, 2, 0],
        rktb: [4, null, null]
      },
      t: {
        mp: [300, 120, 90],
        ks: [80, 210, 70],
        sm: [110, 200, 45],
        ktb: [1, 1, 1],
        rktb: [3, null, null]
      },
      b: {
        mp: [500, 620, 290],
        ks: [80, 270, 420],
        sm: [110, 110, 65],
        ktb: [1, 5, 2],
        rktb: [3, null, null]
      },
      s: {
        mp: [312, 620, 290],
        ks: [850, 270, 420],
        sm: [160, 310, 65],
        ktb: [1, 4, 2],
        rktb: [2, null, null]
      },
    };

    return mock[direction.toLowerCase()] || {
      mp: [0, 0, 0],
      ks: [0, 0, 0],
      sm: [0, 0, 0],
      ktb: [0, 0, 0],
      rktb: [null, null, null]
    };
  };

  const generateSurveyDataFromPendekat = (pendekatArray) => {
    if (!Array.isArray(pendekatArray)) return [];

    const pendekatMap = {
      u: "U",
      s: "S",
      t: "T",
      b: "B"
    };

    return pendekatArray.map((item) => {
      const kode = item.kodePendekat?.toLowerCase();
      const direction = pendekatMap[kode];
      if (!direction) return null;

      const kinerja = getKinerjaDataByDirection(kode);

      return {
        direction,
        rows: ["BKi / BKIJT", "Lurus", "BKa"].map((type, index) => ({
          type,
          mp: { kendjam: kinerja.mp[index], terlindung: 0, terlawan: 0 },
          ks: { kendjam: kinerja.ks[index], terlindung: 0, terlawan: 0 },
          sm: {
            kendjam: kinerja.sm[index],
            terlindung: 0,
            terlawan: 0,
            smpTerlindung: 0,
            smpTerlawan: 0
          },
          total: {
            kendjam: 0,
            terlindung: 0,
            terlawan: 0,
            smpTerlindung: 0,
            smpTerlawan: 0
          },
          ktb: {
            rasio: 0,
            count: kinerja.ktb[index]
          },
          rktb: kinerja.rktb[index]
        })),
        subtotal: {
          mp: { kendjam: 0, terlindung: 0, terlawan: 0 },
          ks: { kendjam: 0, terlindung: 0, terlawan: 0 },
          sm: { kendjam: 0, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
          total: { kendjam: 0, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
          ktb: 0,
          rktb: 0
        }
      };
    }).filter(Boolean);
  };

  // const [trafficData, setTrafficData] = useState({ surveyData: [] });
  const [trafficData, setTrafficData] = useState(
    // {
    //   surveyData: [
    //     {
    //       direction: 'U',
    //       rows: [
    //         {
    //           type: "BKi / BKIJT",
    //           mp: { kendjam: 500, terlindung: 0, terlawan: 0 },
    //           ks: { kendjam: 100, terlindung: 0, terlawan: 0 },
    //           sm: { kendjam: 120, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
    //           total: { kendjam: 0, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
    //           ktb: { rasio: 0, count: 0 },
    //           rktb: 4
    //         },
    //         {
    //           type: "Lurus",
    //           mp: { kendjam: 100, terlindung: 0, terlawan: 0 },
    //           ks: { kendjam: 250, terlindung: 0, terlawan: 0 },
    //           sm: { kendjam: 220, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
    //           total: { kendjam: 0, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
    //           ktb: { rasio: 0, count: 2 },
    //           rktb: null
    //         },
    //         {
    //           type: "BKa",
    //           mp: { kendjam: 140, terlindung: 0, terlawan: 0 },
    //           ks: { kendjam: 80, terlindung: 0, terlawan: 0 },
    //           sm: { kendjam: 50, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
    //           total: { kendjam: 0, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
    //           ktb: { rasio: 0, count: 0 },
    //           rktb: null
    //         }
    //       ],
    //       subtotal: {
    //         mp: { kendjam: 0, terlindung: 0, terlawan: 0 },
    //         ks: { kendjam: 0, terlindung: 0, terlawan: 0 },
    //         sm: { kendjam: 0, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
    //         total: { kendjam: 0, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
    //         ktb: 0,
    //         rktb: 0
    //       }
    //     }
    //   ]
    // }
    {
      surveyData: []
    }
  );

  const getPendekatFromLocalStorage = (id) => {
    const raw = localStorage.getItem('data');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parsed?.data?.sa1[id]?.pendekat || [];
    } catch (e) {
      console.error('Gagal parse data:', e);
      return [];
    }
  };

  useEffect(() => {
    console.log("testsa", selectedId)
    if (selectedId === 0) {
      setTrafficData({ surveyData: [] });
      return;
    }

    if (!selectedId || selectedId === 0 || selectedId === '0') return;
    const pendekatArr = getPendekatFromLocalStorage(selectedId);
    const generated = generateSurveyDataFromPendekat(pendekatArr);
    setTrafficData({ surveyData: generated });

  }, [selectedId]);

  // Hitung SMP berdasarkan dataEMP
  useEffect(() => {
    if (
      !trafficData?.surveyData ||
      !dataEMP?.terlindung ||
      !dataEMP?.terlawan
    ) return;

    console.log(trafficData.surveyData)
    const updatedData = trafficData.surveyData.map((directionData) => {
      const subtotal = {
        mp: { kendjam: 0, terlindung: 0, terlawan: 0 },
        ks: { kendjam: 0, terlindung: 0, terlawan: 0 },
        sm: { kendjam: 0, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
        total: { kendjam: 0, terlindung: 0, terlawan: 0, smpTerlindung: 0, smpTerlawan: 0 },
        ktb: 0,
        rktb: 0
      };


      const updatedRows = directionData.rows.map((row) => {
        const newRow = { ...row };
        let totalTerlindung = 0;
        let totalTerlawan = 0;
        let totalKendjam = 0;

        ['mp', 'ks', 'sm'].forEach((kendaraan) => {
          // if (!row[kendaraan]) return;

          const kendjam = row[kendaraan]?.kendjam ?? 0;
          const empTerlindung = parseFloat(dataEMP.terlindung?.[kendaraan]) || 0;
          const empTerlawan = parseFloat(dataEMP.terlawan?.[kendaraan]) || 0;

          // const terlindung = parseFloat(kendjam * empTerlindung).toFixed(2);
          // const terlawan = parseFloat(kendjam * empTerlawan).toFixed(2);

          const terlindung = kendjam * empTerlindung;
          const terlawan = kendjam * empTerlawan;

          newRow[kendaraan] = {
            ...row[kendaraan],
            terlindung,
            terlawan,
            kendjam
          };

          totalTerlindung += terlindung;
          totalTerlawan += terlawan;
          totalKendjam += kendjam;


          subtotal[kendaraan].kendjam += kendjam;
          subtotal[kendaraan].terlindung += terlindung;
          subtotal[kendaraan].terlawan += terlawan;
        });

        newRow.total = {
          terlindung: totalTerlindung,
          terlawan: totalTerlawan,
          smpTerlindung: totalTerlindung,
          smpTerlawan: totalTerlawan,
          kendjam: totalKendjam
        };

        subtotal.total.kendjam += totalKendjam;
        subtotal.total.terlindung += totalTerlindung;
        subtotal.total.terlawan += totalTerlawan;
        subtotal.total.smpTerlindung += totalTerlindung;
        subtotal.total.smpTerlawan += totalTerlawan;
        subtotal.ktb += row.ktb?.count ?? 0;

        return newRow;
      });

      subtotal.rktb = Number(((subtotal.ktb / subtotal.total.kendjam) || 0).toFixed(3));

      const finalRows = updatedRows.map((row) => {
        const rowKendjam = row.total.kendjam || 0;
        const subtotalKendjam = subtotal.total.kendjam || 1; // hindari bagi 0

        return {
          ...row,
          ktb: {
            ...row.ktb,
            rasio: +((rowKendjam / subtotalKendjam) || 0).toFixed(2)
          }
        };
      });

      return {
        ...directionData,
        rows: finalRows,
        subtotal: {
          ...subtotal,

          // optional
          mp: {
            ...subtotal.mp,
            terlindung: +subtotal.mp.terlindung.toFixed(0),
            terlawan: +subtotal.mp.terlawan.toFixed(0),
          },
          ks: {
            ...subtotal.ks,
            terlindung: +subtotal.ks.terlindung.toFixed(0),
            terlawan: +subtotal.ks.terlawan.toFixed(0),
          },
          sm: {
            ...subtotal.sm,
            terlindung: +subtotal.sm.terlindung.toFixed(0),
            terlawan: +subtotal.sm.terlawan.toFixed(0),
          },
          total: {
            ...subtotal.total,
            terlindung: +subtotal.total.terlindung.toFixed(0),
            terlawan: +subtotal.total.terlawan.toFixed(0),
            smpTerlindung: +subtotal.total.smpTerlindung.toFixed(0),
            smpTerlawan: +subtotal.total.smpTerlawan.toFixed(0),
          },

        }
      }
    });

    setTrafficData({ surveyData: updatedData });
  }, [dataEMP]);

  const renderTableRows = () => {
    const rows = [];

    console.log("test", trafficData)

    if (!trafficData || !trafficData.surveyData) {
      return rows;
    }

    console.log("test", trafficData)
    trafficData.surveyData.forEach((directionData, dirIndex) => {
      // Render rows for each direction
      directionData.rows?.forEach((row, rowIndex) => {
        rows.push(
          <tr key={`${dirIndex}-${rowIndex}`} className=" border-gray-300">
            {/* Direction column (only for first row of each direction) */}
            {rowIndex === 0 && (
              <td
                rowSpan={directionData.rows.length + 1}
                className="border-r border-gray-400 px-2 py-3 text-center font-semibold bg-base-100 align-middle"
              >
                {directionData.direction}
              </td>
            )}

            {/* Type column */}
            <td className="border-r border-gray-300 px-2 py-1 text-xs bg-base-50">
              {row.type}
            </td>

            {/* MP columns */}
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center text-blue-600 font-semibold">
              {row.mp.kendjam || 0}
            </td>
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center">
              {row.mp.terlindung.toFixed(0) || 0}
            </td>
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center">
              {row.mp.terlawan.toFixed(0) || 0}
            </td>

            {/* KS columns */}
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center text-blue-600 font-semibold">
              {row.ks.kendjam || 0}
            </td>
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center">
              {row.ks.terlindung.toFixed(0) || 0}
            </td>
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center">
              {row.ks.terlawan.toFixed(0) || 0}
            </td>

            {/* SM columns */}
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center text-blue-600 font-semibold">
              {row.sm.kendjam || 0}
            </td>
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center">
              {row.sm.terlindung.toFixed(0) || 0}
            </td>
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center">
              {row.sm.terlawan.toFixed(0) || 0}
            </td>

            {/* Total columns */}
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center text-blue-600 font-semibold">
              {row.total.kendjam || 0}
            </td>
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center text-green-600 font-semibold">
              {row.total.smpTerlindung.toFixed(0) || 0}
            </td>
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center text-green-600 font-semibold">
              {row.total.smpTerlawan.toFixed(0) || 0}
            </td>

            {/* KTB columns */}
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center">
              {row.ktb.rasio}
            </td>
            <td className="border-r border-gray-300 px-1 py-1 text-xs text-center text-blue-600 font-semibold">
              {row.ktb.count}
            </td>

            {/* RKTB column */}
            <td className="px-1 py-1 text-xs text-center bg-base-200">
            </td>
          </tr>
        );
      });

      // Add subtotal row
      rows.push(
        <tr key={`subtotal-${dirIndex}`} className="bg-base-100 font-semibold border-gray-400">
          <td className="border-r border-gray-300 px-2 py-1 text-xs">
            Total
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.mp.kendjam}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.mp.terlindung}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.mp.terlawan}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.ks.kendjam}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.ks.terlindung}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.ks.terlawan}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.sm.kendjam}
          </td>
          <td className="border-r border-green-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.sm.terlindung}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.sm.terlawan}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.total.kendjam}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.total.smpTerlindung}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold">
            {directionData.subtotal.total.smpTerlawan}
          </td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold"></td>
          <td className="border-r border-gray-300 px-1 py-1 text-xs text-center font-semibold ">
            {directionData.subtotal.ktb}
          </td>
          <td className="px-1 py-1 text-xs text-center font-semibold bg-base-200">
            {directionData.subtotal.rktb}
          </td>
        </tr>
      );
    });

    return rows;
  };

  return (
    <div className="w-full p-4 overflow-x-auto">
      <div className="p-2">
        <div className="py-4">
          <h2 className="text-[20px] font-normal text-gray-800">Form SA-II</h2>
          <p className="text-xs text-gray-600 mt-1">Data kendaraan berdasarkan arah pergerakan</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 text-xs table table-xs">
            <thead className="text-center">
              {/* Header Row 1 */}
              <tr className="bg-base-200 ">
                <th rowSpan={6} className="border border-gray-400 px-2 py-3 text-xs font-semibold min-w-[60px]">
                  Kode Pendekat
                </th>
                <th rowSpan={6} className="border border-gray-400 px-2 py-3 text-xs font-semibold min-w-[80px]">
                  Arah
                </th>
                <th colSpan={13} className="border border-gray-400 px-2 py-2 text-xs font-semibold bg-base-200">
                  KENDARAAN BERMOTOR
                </th>
                <th colSpan={2} className="border border-gray-400 px-2 py-2 text-xs font-semibold bg-base-200">
                  KEND. TAK BERMOTOR
                </th>
              </tr>

              {/* Header Row 2 */}
              <tr className="bg-base-200">
                <th colSpan={3} className="border border-gray-400 px-1 py-2 text-xs font-semibold">
                  Mobil Penumpang (MP)
                </th>
                <th colSpan={3} className="border border-gray-400 px-1 py-2 text-xs font-semibold">
                  Kendaraan Sedang (KS)
                </th>
                <th colSpan={3} className="border border-gray-400 px-1 py-2 text-xs font-semibold">
                  Sepeda Motor (SM)
                </th>
                <th colSpan={3} rowSpan={3} className="border border-gray-400 px-1 py-2 text-xs font-semibold">
                  Total Kendaraan Bermotor
                </th>
                <th rowSpan={5} className="border border-gray-400 px-1 py-1 text-xs font-semibold">
                  Rasio Belok Kendaraan
                </th>
                <th rowSpan={5} className="border border-gray-400 px-1 py-2 text-xs font-semibold">
                  KTB
                </th>
                <th rowSpan={5} className="border border-gray-400 px-1 py-2 text-xs font-semibold">
                  RKTB
                </th>
              </tr>

              {/* Header Row 3 */}
              <tr className="bg-base-200 text-center">
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={2}>
                  EMP<sub>terlindung</sub>
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={1}>
                  {dataEMP?.terlindung?.mp || 0}
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={2}>
                  EMP<sub>terlindung</sub>
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={1}>
                  {dataEMP?.terlindung?.ks || 0}
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={2}>
                  EMP<sub>terlindung</sub>
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={1}>
                  {dataEMP?.terlindung?.sm || 0}
                </th>
              </tr>

              {/* Header Row 4 */}
              <tr className="bg-base-200 text-center">
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={2}>
                  EMP<sub>terlawan</sub>
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={1}>
                  {dataEMP?.terlawan?.mp || 0}
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={2}>
                  EMP<sub>terlawan</sub>
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={1}>
                  {dataEMP?.terlawan?.ks || 0}
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={2}>
                  EMP<sub>terlawan</sub>
                </th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" colSpan={1}>
                  {dataEMP?.terlawan?.sm || 0}
                </th>
              </tr>

              {/* Column Headers */}
              <tr className="bg-base-200">
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" rowSpan={2}>kend/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">terlindung</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">terlawan</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" rowSpan={2}>kend/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">terlindung</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">terlawan</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" rowSpan={2}>kend/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">terlindung</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">terlawan</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold" rowSpan={2}>kend/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">terlindung</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">terlawan</th>
              </tr>

              {/* Column Headers */}
              <tr className="bg-base-200">
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">SMP/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">SMP/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">SMP/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">SMP/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">SMP/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">SMP/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">SMP/jam</th>
                <th className="border border-gray-400 px-1 py-1 text-xs font-semibold">SMP/jam</th>
              </tr>

              {/* Row Numbers */}
              <tr className="bg-base-100 text-center">
                <th className="border border-gray-400 px-1 py-1 text-xs">(1)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(2)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(3)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(4)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(5)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(6)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(7)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(8)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(9)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(10)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(11)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(12)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(13)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(14)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(16)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(17)</th>
                <th className="border border-gray-400 px-1 py-1 text-xs">(18)</th>
              </tr>
            </thead>

            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full items-center flex">
        <button className="btn btn-sm w-full m-auto btn-success" onClick={() => setDataTraffic(trafficData)}>Simpan</button>
      </div>
    </div>
  );
};

export default TrafficSurveyTable;