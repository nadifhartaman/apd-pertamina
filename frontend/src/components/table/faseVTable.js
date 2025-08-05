"use client"

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function FormSAVTable ({ selectedId, setDataSAV }) {
  const [tableData, setTableData] = useState({
    trata: 0,
    totalrata: 0,
    rkhrata: 0,
    qtotal: 0,
    row_1: 1,
    row_2: 1,
    row_3: 1,
    row_4: 1,
    qbkijt: 0,
    total_tundaan: 0,
    tkt: 0,
    pol: 1,
    rkt: 0,
    bkijt: 0,
    los: '',
    polution: 0,
    loss: 0,
    data: [
      {
        kode: 'U',
        q: 0,
        c: 0,
        dj: 0,
        rh: 0,
        nq1: 0,
        nq2: 0,
        nq: 0,
        nqMax: 0,
        pa: 0,
        rqh: 0,
        nqh: 0,
        tl: 0,
        tg: 0,
        t: 0,
        tundaanTotal: 0
      },
      {
        kode: 'S',
        q: 0,
        c: 0,
        dj: 0,
        rh: 0,
        nq1: 0,
        nq2: 0,
        nq: 0,
        nqMax: 0,
        pa: 0,
        rqh: 0,
        nqh: 0,
        tl: 0,
        tg: 0,
        t: 0,
        tundaanTotal: 0
      },
      {
        kode: 'T',
        q: 0,
        c: 0,
        dj: 0,
        rh: 0,
        nq1: 0,
        nq2: 0,
        nq: 0,
        nqMax: 0,
        pa: 0,
        rqh: 0,
        nqh: 0,
        tl: 0,
        tg: 0,
        t: 0,
        tundaanTotal: 0
      },
      {
        kode: 'B',
        q: 0,
        c: 0,
        dj: 0,
        rh: 0,
        nq1: 0,
        nq2: 0,
        nq: 0,
        nqMax: 0,
        pa: 0,
        rqh: 0,
        nqh: 0,
        tl: 0,
        tg: 0,
        t: 0,
        tundaanTotal: 0
      }
    ]
  });

  const aggregateSA4DataByKode = (sa4TableData) => {
    if (!sa4TableData || !Array.isArray(sa4TableData)) {
      console.log('SA4 table data tidak valid atau kosong');
      return {};
    }

    const aggregated = {};

    sa4TableData.forEach(row => {
      const kode = row.kodePendekat?.toUpperCase(); // pakai 'kodePendekat' dari struktur kamu
      if (!kode) return;

      if (!aggregated[kode]) {
        aggregated[kode] = {
          kode: kode,
          totalArusLaluLintas: 0,
          totalVolume: 0,
          totalCapacity: 0,
          derajatKejenuhan: 0,
          waktuHijauPerFase: 0,
          lebarEfektif: 0,
          rbkijt: 0,
          rkba: 0,
          rkbi: 0,
          // Tambahan agregasi lainnya jika perlu
        };
      }
      console.log(row)
      // Agregasi nilai
      aggregated[kode].totalArusLaluLintas += parseFloat(row.arusLaluLintas) || 0;
      aggregated[kode].totalVolume += parseFloat(row.volume) || 0;
      aggregated[kode].totalCapacity += parseFloat(row.kapasitas) || 0;
      aggregated[kode].derajatKejenuhan += parseFloat(row.derajatKejenuhan) || 0;
      aggregated[kode].waktuHijauPerFase += parseFloat(row.waktuHijauPerFase) || 0;
      aggregated[kode].lebarEfektif = parseFloat(row.lebarEfektif) || 0;
      aggregated[kode].rkba = parseFloat(row.rkba) || 0;
      aggregated[kode].rkbi = parseFloat(row.rkbi) || 0;
      aggregated[kode].rkbijt = parseFloat(row.rkbijt) || 0;
    });

    return aggregated;
  };

  const getStoredData = (selectedId) => {
    if (!selectedId || selectedId === 0 || selectedId === '0') {
      return { isValid: false, error: 'ID tidak valid' };
    }

    const raw = localStorage.getItem('data');
    if (!raw) {
      return { isValid: false, error: 'Data tidak ditemukan di localStorage' };
    }

    try {
      const parsed = JSON.parse(raw);
      return { isValid: true, data: parsed };
    } catch (e) {
      return { isValid: false, error: 'Gagal parse data', details: e };
    }
  };

  // Function untuk mengambil data SA1 (pendekat)
  const getSA1Data = (data, selectedId) => {
    const sa1 = data?.data?.sa1?.[selectedId];

    if (!sa1) {
      return {
        isValid: false,
        error: "Data Form SA 1 tidak ditemukan!"
      };
    }

    return {
      isValid: true,
      pendekats: sa1.pendekat || [],
      faseData: sa1.fase?.data || {}
    };
  };

  // Function untuk mengambil data SA2 (survey data)
  const getSA2Data = (data, selectedId) => {
    const sa2 = data?.data?.sa2?.[selectedId];

    if (!sa2) {
      return {
        isValid: false,
        error: "Data Form SA 2 tidak ditemukan!"
      };
    }

    return {
      isValid: true,
      surveyData: sa2.surveyData || []
    };
  };

  // Function untuk mengambil data SA3 (konflik data)
  const getSA3Data = (data, selectedId) => {
    const sa3 = data?.data?.sa3?.[selectedId];

    if (!sa3) {
      return {
        isValid: false,
        error: "Data Form SA 3 tidak ditemukan!"
      };
    }

    return {
      isValid: true,
      tabelKonflik: sa3.tabel_konflik || {}
    };
  };
  function formattingAngka (angka) {
    return new Intl.NumberFormat('id-ID').format(angka);
  }

  // floor
  // round
  // ceil 

  // Function untuk membuat data row berdasarkan kode pendekat
  const createRowFromPendekat = (kodePendekat, faseAktif, sa4Data, S) => {
    const nq1 = sa4Data.derajatKejenuhan <= 0.5 ? 0
      : Math.floor(0.25 * S * ((sa4Data.derajatKejenuhan - 1) +
        Math.sqrt(
          Math.pow(sa4Data.derajatKejenuhan - 1, 2) +
          (8 * (sa4Data.derajatKejenuhan - 0.5)) / S
        ))
      );
    const rh = (sa4Data.waktuHijauPerFase / S).toFixed(3)
    const nq2 = Math.round(S * ((1 - rh) / (1 - rh * sa4Data.derajatKejenuhan) * (sa4Data.totalArusLaluLintas / 3600)))
    const nq = nq1 + nq2
    const nqmax = ((parseFloat(nq1) + parseFloat(nq2) + parseFloat(nq)) * 0.775).toFixed(0)
    const rqh = (0.9 * nq / (sa4Data.totalArusLaluLintas * S) * 3600).toFixed(3)
    const pa = (Math.round((parseFloat(nqmax) * 20) / sa4Data.lebarEfektif)).toFixed(0)
    const nqh = (sa4Data.totalArusLaluLintas * rqh).toFixed(0)
    const tl = (S * ((0.5 * Math.pow(1 - parseFloat(rh), 2) / (1 - parseFloat(rh) * sa4Data.derajatKejenuhan))) + ((parseFloat(nq1) * 3600) / sa4Data.totalCapacity)).toFixed(0)
    const tg = ((1 - parseFloat(rqh)) * (sa4Data.rkbi + sa4Data.rkba + sa4Data.rbkijt) * 6 + (parseFloat(rqh) * 4)).toFixed(0)
    const t = parseFloat(tl) + parseFloat(tg)
    const tundaanTotal = (parseFloat(sa4Data.totalArusLaluLintas) * t)

    const Faktor_baru = 0.775 + (tableData.pol - 1) * 0.0165
    console.log(Faktor_baru, tableData.pol)

    return {
      kode: kodePendekat.toUpperCase(),
      q: sa4Data.totalArusLaluLintas,
      c: sa4Data.totalCapacity,
      dj: sa4Data.derajatKejenuhan,
      rh: (sa4Data.waktuHijauPerFase / S).toFixed(3),
      nq1: nq1,
      nq2: nq2,
      nq: nq,
      nqMax: nqmax,
      pa: pa,
      rqh: rqh,
      nqh: nqh,
      tl: tl,
      tg: tg,
      t: t,
      tundaanTotal: tundaanTotal,
    };
  };


  // Function untuk mengambil data SA5 yang sudah ada (jika ada)
  const getSA5Data = (data, selectedId) => {
    const sa5 = data?.data?.sa5?.[selectedId];

    return {
      isValid: true, // SA5 bersifat opsional
      existingData: sa5?.SAV || null
    };
  };

  const getSA4Data = (data, selectedId) => {
    const sa4 = data?.data?.sa4?.[selectedId];

    return {
      isValid: true, // SA5 bersifat opsional
      existingData: sa4 || null
    };
  };

  // Function untuk menyimpan data ke localStorage
  const saveToLocalStorage = (data, selectedId, sa5Data) => {
    try {
      const updatedData = {
        ...data,
        data: {
          ...data.data,
          sa5: {
            ...data.data.sa5,
            [selectedId]: sa5Data
          }
        }
      };

      localStorage.setItem('data', JSON.stringify(updatedData));
      console.log('Data SA5 berhasil disimpan:', sa5Data);
      return true;
    } catch (e) {
      console.error('Gagal menyimpan data SA5:', e);
      return false;
    }
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function untuk menyimpan data saat ini ke localStorage
  const handleSaveData = () => {
    const storedResult = getStoredData(selectedId);
    if (!storedResult.isValid) {
      setError('Gagal menyimpan: ' + storedResult.error);
      return;
    }

    const saved = saveToLocalStorage(storedResult.data, selectedId, tableData);
    if (saved) {
      alert('Data berhasil disimpan!');
      setError('');
    } else {
      setError('Gagal menyimpan data ke localStorage');
    }
  };

  const handleInputChange = (rowIndex, field, value) => {

    setTableData(prevData => {
      const newData = [...prevData.data];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [field]: parseFloat(value) || 0
      };
      return {
        ...prevData,
        data: newData
      };
    });
  };

  // const handleInputChange2 = () => {
  //   const Faktor_baru = 0.775 + (tableData.pol - 1) * 0.0165;
  //   console.log('Faktor baru:', Faktor_baru);
  //   console.log('Faktor baru:', tableData);

  //   // Misalnya kamu ingin update semua baris rh (rasio hijau) berdasarkan Faktor_baru:
  //   const updatedData = tableData.data.map((row) => ({
  //     ...row,
  //     rh: parseFloat((row.rh * Faktor_baru).toFixed(3))  // contoh update
  //   }));

  //   setTableData(prev => ({
  //     ...prev,
  //     data: updatedData
  //   }));
  // };
  const updateAllRelatedCalculations = (currentData, newPolValue, S) => {
    const Faktor_baru = 0.775 + (newPolValue - 1) * 0.0165;

    return currentData.map((row) => {
      // Hitung ulang nqMax dengan faktor baru
      const newNqMax = parseFloat(((row.nq + row.nq1 + row.nq2) * Faktor_baru).toFixed(0));

      // Update perhitungan yang bergantung pada nqMax
      const newPa = (Math.round((parseFloat(newNqMax) * 20) / (row.lebarEfektif || 1))).toFixed(0);

      // Jika ada perhitungan lain yang bergantung pada nqMax, tambahkan di sini
      // Contoh: jika ada field lain yang menggunakan nqMax

      return {
        ...row,
        nqMax: newNqMax,
        pa: newPa
        // Tambahkan field lain yang perlu diupdate jika ada
      };
    });
  };

  const kriteriaLos = (derajatKejenuhan) => {
    if (derajatKejenuhan < 0.60) return { los: 'A', kondisi: 'Sangat Lancar' };
    if (derajatKejenuhan < 0.70) return { los: 'B', kondisi: 'Lancar' };
    if (derajatKejenuhan < 0.80) return { los: 'C', kondisi: 'Cukup Lancar' };
    if (derajatKejenuhan < 0.90) return { los: 'D', kondisi: 'Mulai Padat' };
    if (derajatKejenuhan <= 1.00) return { los: 'E', kondisi: 'Padat' };
    return { los: 'F', kondisi: 'Macet Total' };
  };




  const handleInputChange2 = (field, value) => {
    if (field === 'pol') {
      console.log('Updating pol value:', value);

      const storedResult = getStoredData(selectedId);
      const sa4Result = getSA4Data(storedResult.data, selectedId);
      const S = sa4Result.existingData?.SAIV?.foot?.S || 1;

      const updatedData = updateAllRelatedCalculations(tableData.data, value, S);

      setTableData((prev) => ({
        ...prev,
        pol: value,
        data: updatedData,
      }));
    }

    // if (field === 'row_1') {
    //   const row2 = tableData.row_2 ?? 0;
    //   const row1 = value ?? 0;

    //   setTableData((prev) => ({
    //     ...prev,
    //     row_1: row1,
    //     row_3: row1 + row2,
    //     row_4: parseInt(tableData.qbkijt) * (row1 + row2),
    //   }));
    // }

    // if (field === 'row_2') {
    //   const row1 = tableData.row_1 ?? 0;
    //   const row2 = value ?? 0;

    //   setTableData((prev) => ({
    //     ...prev,
    //     row_2: row2,
    //     row_3: row1 + row2,
    //     row_4: parseInt(tableData.qbkijt) * (row1 + row2),
    //   }));
    // }

    if (field === 'row_1') {
      const row_1 = value ?? 0;
      const row_2 = tableData.row_2 ?? 0;
      const row_3 = row_1 + row_2;
      const row_4 = parseInt(tableData?.bkijt ?? 1) * parseInt(row_3);
      const totalTundaan = (tableData.data || []).reduce((sum, row) => {
        return sum + (row.tundaanTotal ?? 0);
      }, 0);
      const total_tundaan = totalTundaan + row_4;
      const tundaanRata = (total_tundaan / tableData.qtotal).toFixed(3)
      setTableData((prev) => ({
        ...prev,
        row_1,
        row_3,
        row_4,
        total_tundaan,
        trata: tundaanRata
      }));
    }

    if (field === 'row_2') {
      const row_1 = tableData.row_1 ?? 0;
      const row_2 = value ?? 0;
      const row_3 = row_1 + row_2;
      const row_4 = parseInt(tableData?.bkijt ?? 1) * parseInt(row_3);

      const totalTundaan = (tableData.data || []).reduce((sum, row) => {
        return sum + (row.tundaanTotal ?? 0);
      }, 0);
      console.log(totalTundaan)
      const total_tundaan = totalTundaan + row_4;
      const tundaanRata = (total_tundaan / tableData.qtotal).toFixed(3)
      setTableData((prev) => ({
        ...prev,
        row_2,
        row_3,
        row_4,
        total_tundaan,
        trata: tundaanRata
      }));
    }
  };


  // const handleInputChange2 = (field, value) => {
  //   if (field === 'pol') {
  //     const Faktor_baru = 0.775 + (value - 1) * 0.0165;
  //     console.log('Faktor_baru:', Faktor_baru);
  //     console.log('Faktor_baru:', value);

  //     const updatedData = tableData.data.map((row) => {
  //       return {
  //         ...row,
  //         nqMax: parseFloat(((row.nq + row.nq1 + row.nq2) * Faktor_baru).toFixed(3))
  //       };
  //     });

  //     setTableData((prev) => ({
  //       ...prev,
  //       pol: value,
  //       data: updatedData
  //     }));
  //   }
  // };


  // Function untuk mendapatkan fase aktif
  const getFaseAktif = (faseData, kode) => {
    const arahKey = Object.keys(faseData).find((key) =>
      key.toLowerCase().startsWith(kode.toLowerCase())
    );

    const fasePendekat = faseData[arahKey]?.fase || {};
    return Object.entries(fasePendekat)
      .filter(([_, isTrue]) => isTrue)
      .map(([faseKey]) => parseInt(faseKey.replace('fase_', '')));
  };

  const calculateTotals = () => {
    return tableData.data.reduce((totals, row) => {
      totals.q += parseFloat(row.q) || 0;
      totals.nq += parseFloat(row.nq) || 0;
      totals.nqh += parseFloat(row.nqh) || 0;
      totals.tundaanTotal += parseFloat(row.tundaanTotal) || 0;
      return totals;
    }, { q: 0, nq: 0, nqh: 0, tundaanTotal: 0 });
  };

  useEffect(() => {
    if (!selectedId || selectedId === 0 || selectedId === '0') {
      setTableData(prev => ({ ...prev, data: [] }));
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Ambil dan validasi data dari localStorage
      const storedResult = getStoredData(selectedId);
      if (!storedResult.isValid) {
        setError(storedResult.error);
        setLoading(false);
        return;
      }

      // 2. Ambil data dari SA1, SA2, SA3
      const sa1Result = getSA1Data(storedResult.data, selectedId) || {};
      const sa2Result = getSA2Data(storedResult.data, selectedId) || {};
      const sa3Result = getSA3Data(storedResult.data, selectedId) || {};
      const sa5Result = getSA5Data(storedResult.data, selectedId) || {};
      const sa4Result = getSA4Data(storedResult.data, selectedId) || {};

      console.log('SA1 Data:', sa1Result);
      console.log('SA2 Data:', sa2Result);
      console.log('SA3 Data:', sa3Result);
      console.log('SA4 Data:', sa4Result);
      console.log('Existing SA5 Data:', sa5Result.existingData);

      if (!sa4Result.existingData) {
        setTableData({
          data: [],
          row_1: 0,
          row_2: 1,
          row_3: 1,
          row_4: 0,
          bkijt: 0,
          qtotal: 0,
          total_tundaan: 0,
          trata: 0,
          tkt: 0,
          rkt: 0,
          rkhrata: 0,
          totalrata: 0,
          polution: 0,
          loss: 0,
          los: ''
        });
        setLoading(false);
        return;
      }

      if (sa5Result.existingData) {
        setTableData(sa5Result.existingData);
        setLoading(false);
        return;
      }

      let totalKTBCount = 0;
      let qtotalarus = 0;

      // 3. Validasi data wajib (SA1 minimal harus ada untuk mendapatkan kode pendekat)
      if (!sa1Result.isValid) {
        setError(sa1Result.error);
        setLoading(false);
        return;
      }
      // 4. Jika ada data SA5 yang sudah tersimpan, gunakan itu
      if (sa5Result.existingData) {
        console.log('Menggunakan data SA5 yang sudah ada');
        setTableData(sa5Result.existingData);
      } else {
        if (!sa4Result.existingData) return;
        // Ambil nilai KTB dari SA2 jika bkijt di SA1 bernilai true


        // 5. Buat data baru berdasarkan kode pendekat dari SA1 dan SA4
        console.log('Membuat data SA5 baru dari SA1 dan SA4', sa4Result);

        // Agregasi data SA4 berdasarkan kode pendekat
        const S = sa4Result.existingData.SAIV ? sa4Result?.existingData?.SAIV?.foot?.S : 0;
        const sa4Aggregated = aggregateSA4DataByKode(sa4Result.existingData.SAIV.tabel);
        console.log('SA4 Data yang diagregasi:', sa4Aggregated);

        const newData = sa1Result.pendekats.map(pendekat => {
          const kodePendekat = pendekat.kodePendekat?.toUpperCase();
          const faseAktif = getFaseAktif(sa1Result.faseData, kodePendekat);
          const sa4Data = sa4Aggregated[kodePendekat] || null;

          let totalKTBRatio = 0;

          qtotalarus += sa4Data.totalArusLaluLintas

          const directionMap = {
            B: 'barat',
            S: 'selatan',
            T: 'timur',
            U: 'utara'
          };


          const arahPendekat = sa1Result?.faseData?.[directionMap[kodePendekat]]?.arah || {};

          console.log(sa1Result?.faseData?.[directionMap[kodePendekat]]?.arah, kodePendekat)
          if (arahPendekat?.bkijt === true) {
            console.log(`>>>> bkijt TRUE untuk pendekat ${kodePendekat}`);

            const mappedDirection = directionMap[kodePendekat];
            console.log(mappedDirection);

            const sa2Entry = sa2Result?.surveyData?.find(entry =>
              entry.direction?.toUpperCase() === kodePendekat?.toUpperCase()
            );

            console.log(">>>> SA2", sa2Result);
            console.log(">>>> SA2 Entry ditemukan:", sa2Entry);

            // const bkijtRow = sa2Entry?.rows?.find(row => row?.type?.toLowerCase() === "bki / bkijt");
            const bkijtRow = sa2Entry?.rows?.find(row =>
              row?.type?.toLowerCase().includes("bkijt")
            );

            if (bkijtRow?.total) {
              const terlawan = bkijtRow.total.terlawan || 0;
              const terlindung = bkijtRow.total.terlindung || 0;
              const nilaiKTB = Math.max(terlawan, terlindung);

              console.log(">>>> Nilai KTB (maks):", nilaiKTB, "dari terlawan:", terlawan, "dan terlindung:", terlindung);

              totalKTBCount += nilaiKTB;
            }
          }

          console.log(`Pendekat ${kodePendekat}: `);
          console.log('  - Fase aktif:', faseAktif);
          console.log('  - Data SA4:', sa4Data);
          console.log('  - Data S:', S);
          console.log('  - Data KTB:', totalKTBCount);

          return createRowFromPendekat(kodePendekat, faseAktif, sa4Data, S);
        }).filter(row => row.kode); // Filter yang memiliki kode

        const totalTundaan = newData.reduce((sum, row) => {
          return sum + (row.tundaanTotal ?? 0); // asumsi setiap row punya totalTundaan
        }, 0);

        const totalKendaraanTerhenti = newData.reduce((sum, row) => {
          return sum + (Number(row.nqh) ?? 0);
        }, 0);

        const totalArah = newData.length;
        const derajatKejenuhan = Math.max(...newData.map(data => data.dj));

        const bkijt = parseInt(totalKTBCount);
        const qtotal = bkijt + parseInt(qtotalarus);
        const row_1 = 0;
        const row_2 = 1;
        const row_3 = row_1 + row_2;
        const row_4 = bkijt * row_3;
        const total_tundaan = totalTundaan + row_4;
        const trata = (total_tundaan / qtotal).toFixed(3);
        const tkt = parseInt(totalKendaraanTerhenti)
        const rkt = (tkt / qtotal)
        const rkhrata = (Number(totalKendaraanTerhenti) / totalArah).toFixed(0)
        const totalrata = (qtotal / totalArah / 3600).toFixed(2);
        const polution = qtotal * 0.02
        // const loss = total_tundaan * qtotal * 30
        const loss = total_tundaan * 250
        const los = kriteriaLos(derajatKejenuhan).los

        setTableData(prev => ({
          ...prev,
          row_1,
          row_2,
          row_3,
          row_4,
          bkijt,
          qtotal,
          total_tundaan,
          data: newData,
          trata,
          tkt,
          rkt,
          rkhrata,
          totalrata,
          polution,
          loss,
          los
        }));


        console.log('Data SA5 yang dibuat:', newData);
      }

    } catch (e) {
      console.error('Error saat memproses data:', e);
      setError('Terjadi kesalahan saat memproses data: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  return (
    <div>

      <div className="p-4 bg-base-100">
        {/* <div className="mb-6">
        <h2 className="text-2xl  text-base-content mb-2">
        FORM SA-V
        </h2>
        <p className="text-sm text-base-content/70">
        Formulir Analisis Kapasitas dan Tundaan Lalu Lintas
        </p>
        </div> */}

        <div className="overflow-x-auto">
          <table className="table table-xs w-full border border-gray-300">
            <thead>
              <tr className="border border-gray-300 bg-gray-200">
                <th rowSpan={4} className="text-center border border-gray-300 min-w-10 text-wrap">
                  Kode Pendekat
                </th>
                <th rowSpan="2" className="text-center border border-gray-300 min-w-10 text-wrap">
                  Arah lalu lintas
                </th>
                <th rowSpan="2" className="text-center border border-gray-300 min-w-10 text-wrap">
                  Kapasitas
                </th>
                <th rowSpan="2" className="text-center border border-gray-300 min-w-10 text-wrap">
                  Derajat Kejenuhan
                </th>
                <th rowSpan="2" className="text-center border border-gray-300 min-w-10 text-wrap">
                  Rasio Hijau
                </th>
                <th colSpan={4} rowSpan={2} className="text-center border border-gray-300 ">
                  Jumlah kendaraan Antri
                </th>
                <th rowSpan={2} className="text-center border border-gray-300 min-w-10 text-wrap">
                  Panjang Antrian
                </th>
                <th rowSpan={2} className="text-center border border-gray-300 ">
                  Rasio <br />Kendaraan Terhenti
                </th>
                <th rowSpan={2} className="text-center border border-gray-300 min-w-10 text-wrap">
                  Jumlah Kendaraan Terhenti
                </th>
                <th colSpan={4} rowSpan={1} className="text-center border border-gray-300 ">
                  Tundaan
                </th>
              </tr>
              <tr className="border border-gray-300 text-xs bg-gray-200">

                <th className="text-center border border-gray-300 min-w-10 text-wrap">Tundaan lalu lintas rata-rata</th>
                <th className="text-center border border-gray-300 min-w-10 text-wrap">Tundaan geometri rata-rata</th>
                <th className="text-center border border-gray-300 min-w-10 text-wrap">Tundaan rata-rata</th>
                <th rowSpan={2} className="text-center border border-gray-300 min-w-10 text-wrap">Tundaan Total</th>
              </tr>
              <tr className="border border-gray-300 text-xs bg-gray-200">
                <th className="text-center border border-gray-300 ">q</th>
                <th className="text-center border border-gray-300 ">C</th>
                <th className="text-center border border-gray-300 ">D<sub>J</sub></th>
                <th className="text-center border border-gray-300 ">R<sub>H</sub></th>
                <th className="text-center border border-gray-300 min-w-10 text-wrap">N<sub>Q1</sub></th>
                <th className="text-center border border-gray-300 min-w-10 text-wrap">N<sub>Q2</sub></th>
                <th className="text-center border border-gray-300 min-w-10 text-wrap">N<sub>Q</sub></th>
                <th className="text-center border border-gray-300 min-w-10 text-wrap">N<sub>QMAX</sub></th>
                <th className="text-center border border-gray-300 ">P<sub>A</sub></th>
                <th className="text-center border border-gray-300 min-w-10 text-wrap">R<sub>KH</sub></th>
                <th className="text-center border border-gray-300 min-w-10 text-wrap">N<sub>KH</sub></th>
                <th className="text-center border border-gray-300 ">T<sub>L</sub></th>
                <th className="text-center border border-gray-300 ">T<sub>G</sub></th>
                <th className="text-center border border-gray-300 ">T</th>
              </tr>
              <tr className="border border-gray-300 text-xs bg-gray-200">
                <th className="text-center border border-gray-300">SMP/jam</th>
                <th className="text-center border border-gray-300">SMP/jam</th>
                <th className="text-center border border-gray-300">-</th>
                <th className="text-center border border-gray-300">-</th>
                <th className="text-center border border-gray-300">SMP</th>
                <th className="text-center border border-gray-300">SMP</th>
                <th className="text-center border border-gray-300 ">(6)+(7)</th>
                <th className="text-center border border-gray-300 ">Gambar SMP</th>
                <th className="text-center border border-gray-300">m</th>
                <th className="text-center border border-gray-300">-</th>
                <th className="text-center border border-gray-300">SMP</th>
                <th className="text-center border border-gray-300">detik</th>
                <th className="text-center border border-gray-300">detik</th>
                <th className="text-center border border-gray-300 ">(13)+(14)<br /> SMP.detik</th>
                <th className="text-center border border-gray-300 ">(2)x(15) <br /> SMP.detik</th>
              </tr>
              <tr className="border border-gray-300 text-xs bg-gray-200">
                <th className="text-center border border-gray-300">(1)</th>
                <th className="text-center border border-gray-300">(2)</th>
                <th className="text-center border border-gray-300">(3)</th>
                <th className="text-center border border-gray-300">(4)</th>
                <th className="text-center border border-gray-300">(5)</th>
                <th className="text-center border border-gray-300">(6)</th>
                <th className="text-center border border-gray-300">(7)</th>
                <th className="text-center border border-gray-300">(8)</th>
                <th className="text-center border border-gray-300">(9)</th>
                <th className="text-center border border-gray-300">(10)</th>
                <th className="text-center border border-gray-300">(11)</th>
                <th className="text-center border border-gray-300">(12)</th>
                <th className="text-center border border-gray-300">(13)</th>
                <th className="text-center border border-gray-300">(14)</th>
                <th className="text-center border border-gray-300">(15)</th>
                <th className="text-center border border-gray-300">(16)</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(tableData?.data) &&
                tableData.data.map((row, index) => (<tr key={index} className="hover:bg-base-200">
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="text"
                        className="p-0 focus:border-transparent focus:outline-0 focus:ring-0 w-full text-center flex-1 "
                        value={row.kode}
                        readOnly={true}
                        onChange={(e) => handleInputChange(index, 'kode', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="number"
                        step="0.01"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0" value={formattingAngka(row.q)}
                        onChange={(e) => handleInputChange(index, 'q', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        type="number"
                        step="0.001"
                        readOnly={true}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.c)}
                        onChange={(e) => handleInputChange(index, 'c', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="0.0001"
                        value={row.dj}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        onChange={(e) => handleInputChange(index, 'dj', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="0.001"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={row.rh}
                        onChange={(e) => handleInputChange(index, 'rh', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="0.001"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.nq1)}
                        onChange={(e) => handleInputChange(index, 'nq1', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="0.001"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.nq2)}
                        onChange={(e) => handleInputChange(index, 'nq2', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.nq)}
                        onChange={(e) => handleInputChange(index, 'nq', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={row.nqMax}
                        onChange={(e) => handleInputChange(index, 'nqMax', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="0.01"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.pa)}
                        onChange={(e) => handleInputChange(index, 'pa', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="0.01"
                        value={row.rqh}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        onChange={(e) => handleInputChange(index, 'rqh', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.nqh)}
                        onChange={(e) => handleInputChange(index, 'nqh', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.tl)}
                        onChange={(e) => handleInputChange(index, 'tl', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.tg)}
                        onChange={(e) => handleInputChange(index, 'tg', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.t)}
                        onChange={(e) => handleInputChange(index, 't', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <div className="flex h-full min-h-[2rem]">
                      <input
                        readOnly={true}
                        type="number"
                        step="1"
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-10 border-0"
                        value={formattingAngka(row.tundaanTotal)}
                        onChange={(e) => handleInputChange(index, 'tundaanTotal', e.target.value)}
                      />
                    </div>
                  </td>
                </tr>
                ))}

              <tr>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    . . .
                  </div>
                </td>
                {[...Array(15)].map((_, i) => (
                  <td className="border border-gray-300 p-0" key={i}>
                    <div className="flex h-full min-h-[2rem] items-center justify-center">
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    . . .
                  </div>
                </td>
                {[...Array(7)].map((_, i) => (
                  <td className="border border-gray-300 p-0" key={i}>
                    <div className="flex h-full min-h-[2rem] items-center justify-center">
                    </div>
                  </td>
                ))}
                <td className="border bg-green-100 border-gray-300 p-0">
                  <div className="flex items-center w-full h-full min-h-[2rem]">
                    <span className='text-nowrap'>POL =</span>
                    <input
                      type="number"
                      step="1"
                      className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-5 border-0"
                      value={tableData.pol ?? 0} // pastikan default 0 jika undefined/null
                      onChange={(e) => {
                        const rawValue = e.target.value;

                        // Perbolehkan nilai kosong agar user bisa hapus dulu
                        const newPol = rawValue === '' ? '' : parseInt(rawValue);

                        setTableData((prev) => ({
                          ...prev,
                          pol: newPol === '' || isNaN(newPol) ? '' : newPol
                        }));

                        // Jika handleInputChange2 tidak boleh dapat string kosong, beri nilai 0
                        handleInputChange2('pol', isNaN(newPol) ? 0 : newPol);
                      }}
                    />

                    <span>%</span>
                  </div>
                </td>
                {[...Array(7)].map((_, i) => (
                  <td className="border border-gray-300 p-0" key={i}>
                    <div className="flex h-full min-h-[2rem] items-center justify-center">
                    </div>
                  </td>
                ))}
              </tr>
              {/* <tr>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    . . .
                  </div>
                </td>
                {[...Array(15)].map((_, i) => (
                  <td className="border border-gray-300 p-0" key={i}>
                    <div className="flex h-full min-h-[2rem] items-center justify-center">
                    </div>
                  </td>
                ))}
              </tr> */}
              <tr>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    BKiJT
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    {tableData?.bkijt || 0}
                  </div>
                </td>
                {[...Array(10)].map((_, i) => (
                  <td className="border border-gray-300 p-0" key={i}>
                    <div className="flex h-full min-h-[2rem] items-center justify-center">
                    </div>
                  </td>
                ))}


                <td className="border bg-green-100 border-gray-300 p-0">
                  <div className="flex items-center w-full h-full min-h-[2rem]">

                    <input
                      type="number"
                      step="1"
                      className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-5 border-0"
                      value={tableData.row_1 ?? ''}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        const newRow1 = rawValue === '' ? '' : parseInt(rawValue);

                        setTableData((prev) => ({
                          ...prev,
                          row_1: newRow1 === '' ? 0 : newRow1,
                        }));

                        handleInputChange2('row_1', newRow1);
                      }}
                    />
                  </div>
                </td>

                <td className="border bg-green-100 border-gray-300 p-0">
                  <div className="flex items-center w-full h-full min-h-[2rem]">

                    <input
                      type="number"
                      step="1"
                      className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-5 border-0"
                      value={formattingAngka(tableData?.row_2) ?? ''}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        const newRow2 = rawValue === '' ? '' : parseInt(rawValue);

                        setTableData((prev) => ({
                          ...prev,
                          row_1: newRow2 === '' ? 0 : newRow2,
                        }));

                        handleInputChange2('row_2', newRow2);
                      }}
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <div className="flex items-center w-full h-full min-h-[2rem]">
                    <input
                      type="number"
                      step="1"
                      readOnly
                      className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 p-0 focus:border-transparent focus:outline-0 focus:ring-0 text-center w-5 border-0"
                      value={formattingAngka(tableData?.row_3) ?? 0} // pastikan default 0 jika undefined/null
                      onChange={(e) => {
                        const rawValue = e.target.value;

                        // Perbolehkan nilai kosong agar user bisa hapus dulu
                        const new_row_3 = rawValue === '' ? '' : parseInt(rawValue);

                        setTableData((prev) => ({
                          ...prev,
                          row_3: new_row_3 === '' || isNaN(new_row_3) ? '' : new_row_3
                        }));

                        handleInputChange2('row', isNaN(new_row_3) ? 0 : new_row_3);

                      }}
                    />
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    {formattingAngka(tableData?.row_4) || 0}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    q<sub>total</sub>
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    {formattingAngka(tableData?.qtotal) || 0}
                  </div>
                </td>
                {[...Array(5)].map((_, i) => (
                  <td rowSpan={2} className="bg-gray-200 p-0" key={i}>
                    <div className="flex h-full min-h-[2rem] items-center justify-center">
                    </div>
                  </td>
                ))}
                <td className="border border-gray-300 p-0" colSpan={4}>
                  <div className="justify-end flex h-full min-h-[2rem] items-center">
                    <div>
                      Total jumlah kendaraan terhenti =
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    {formattingAngka(tableData?.tkt) || 0}
                  </div>
                </td>
                <td className="border border-gray-300 p-0" colSpan={3}>
                  <div className="justify-end flex h-full min-h-[2rem] items-center">
                    <div>
                      Total tundaan =
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    {formattingAngka(tableData?.total_tundaan) || 0}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    q<sub>dikoreksi</sub>
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    1000
                  </div>
                </td>
                <td className="border border-gray-300 p-0" colSpan={4}>
                  <div className="justify-end flex h-full min-h-[2rem] items-center">
                    <div>
                      Rasio kendaraan terhenti rata-rata =
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    {formattingAngka(tableData?.total_tundaan) || 0}
                  </div>
                </td>
                <td className="border border-gray-300 p-0" colSpan={3}>
                  <div className="justify-end flex h-full min-h-[2rem] items-center">
                    <div className='text-nowrap'>
                      Tundaan simpang rata-rata, detik/SMP =
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    {formattingAngka(tableData?.trata) || 0}
                  </div>
                </td>
              </tr>
              <tr>
                <td rowSpan={3} colSpan={9} className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    <Image src={'/image/Picture3.png'} width={500} height={400} alt='' />
                  </div>
                </td>
                <td rowSpan={3} colSpan={3} className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    <Image src={'/image/Picture4.png'} width={200} height={300} alt='' />
                  </div>
                </td>
                <td rowSpan={3} colSpan={4} className="border border-gray-300 p-0">
                  <div className="flex h-full min-h-[2rem] items-center justify-center">
                    <Image src={'/image/Picture5.png'} width={600} height={600} alt='' />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="my-6 flex gap-4 w-full px-2 justify-center">
        <button
          className="btn btn-sm btn-success w-full"
          onClick={() => {
            setDataSAV(tableData)
          }}
        >
          Simpan
        </button>
      </div>
      {/* <SketsaSimpangV data={tableData} /> */}
      <div className='w-full overflow-x-auto text-sm'>
        <div className="min-w-[900px] flex flex-col w-fit bg-[#bec1ce] mx-auto font-semibold text-sm text-gray-800">
          {/* North */}
          <div className="grid grid-cols-3">
            <div className='p-2 text-xl text-left flex flex-col justify-end'>B</div>
            <div className='min-h-64 items-center flex bg-stone-200 justify-center'>
              {(Array.isArray(tableData?.data) ? tableData.data : []).filter(data => data.kode === "U").map((data, i) => (
                <table key={i} className="border-collapse">
                  <tbody>
                    <tr><td className="px-1">T</td><td className="px-1">= {data.t} detik/SMP</td></tr>
                    <tr><td className="px-1">R<sub>KH</sub></td><td className="px-1">= {data.rqh}</td></tr>
                    <tr><td className="px-1">P<sub>A</sub></td><td className="px-1">= {data.pa} meter</td></tr>
                    <tr><td className="px-1">D<sub>J</sub></td><td className="px-1">= {data.dj}</td></tr>
                    <tr><td className="px-1">C</td><td className="px-1">= {data.c} SMP/jam</td></tr>
                    <tr><td className="px-1">q</td><td className="px-1">= {data.q} SMP/jam</td></tr>
                  </tbody>
                </table>
              ))}
            </div>
            <div className='p-2 text-xl'>U</div>
          </div>

          {/* West - Center - East */}
          <div className="grid grid-cols-3">
            <div className='min-h-64 items-center flex bg-stone-200 justify-center'>
              {(Array.isArray(tableData?.data) ? tableData.data : []).filter(data => data.kode === "B").map((data, i) => (
                <table key={i} className="border-collapse">
                  <tbody>
                    <tr><td className="px-1">T</td><td className="px-1">= {data.t} detik/SMP</td></tr>
                    <tr><td className="px-1">R<sub>KH</sub></td><td className="px-1">= {data.rqh}</td></tr>
                    <tr><td className="px-1">P<sub>A</sub></td><td className="px-1">= {data.pa} meter</td></tr>
                    <tr><td className="px-1">D<sub>J</sub></td><td className="px-1">= {data.dj}</td></tr>
                    <tr><td className="px-1">C</td><td className="px-1">= {data.c} SMP/jam</td></tr>
                    <tr><td className="px-1">q</td><td className="px-1">= {data.q} SMP/jam</td></tr>
                  </tbody>
                </table>
              ))}
            </div>
            <div className='min-h-64 items-center flex justify-center'>
              <div className="m-auto">
                <div className='text-white bg-red-500 p-1 text-xl mb-2 text-center w-fit mx-auto'>
                  LOS : {tableData.los}
                </div>
                <table className="border-collapse text-sm">
                  <tbody>
                    <tr className='text-sm'><td className="px-1">Total rata-rata</td><td className="px-1">= {formattingAngka(tableData.totalrata)} detik/SMP</td></tr>
                    <tr className='text-sm'><td className="px-1">R<sub>KH</sub> rata-rata</td><td className="px-1">= {formattingAngka(tableData.rkhrata)}</td></tr>
                    <tr className='text-sm'><td className="px-1">q<sub>total</sub></td><td className="px-1">= {tableData.qtotal} SMP/jam</td></tr>
                    <tr className='text-sm'><td className="px-1">q<sub>bkijt</sub></td><td className="px-1">= {tableData.bkijt} SMP/jam</td></tr>
                    <tr className='text-sm'><td className="px-1">Tingkat polusi</td><td className="px-1">= {tableData.polution} μg/m<sup>3</sup></td></tr>
                    <tr className='text-sm'><td className="px-1">Biaya kemacetan</td><td className="px-1">= Rp.{tableData.loss > 0 || tableData.loss === '' ? formattingAngka(tableData.loss) : 0}.00</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='min-h-64 items-center flex bg-stone-200 justify-center'>
              {(Array.isArray(tableData?.data) ? tableData.data : []).filter(data => data.kode === "T").map((data, i) => (
                <table key={i} className="border-collapse">
                  <tbody>
                    <tr><td className="px-1">T</td><td className="px-1">= {data.t} detik/SMP</td></tr>
                    <tr><td className="px-1">R<sub>KH</sub></td><td className="px-1">= {data.rqh}</td></tr>
                    <tr><td className="px-1">P<sub>A</sub></td><td className="px-1">= {data.pa} meter</td></tr>
                    <tr><td className="px-1">D<sub>J</sub></td><td className="px-1">= {data.dj}</td></tr>
                    <tr><td className="px-1">C</td><td className="px-1">= {data.c} SMP/jam</td></tr>
                    <tr><td className="px-1">q</td><td className="px-1">= {data.q} SMP/jam</td></tr>
                  </tbody>
                </table>
              ))}
            </div>
          </div>

          {/* South */}
          <div className="grid grid-cols-3">
            <div className='p-2 text-xl text-right'>S</div>
            <div className='min-h-64 items-center flex bg-stone-200 justify-center'>
              {(Array.isArray(tableData?.data) ? tableData.data : []).filter(data => data.kode === "S").map((data, i) => (
                <table key={i} className="border-collapse">
                  <tbody>
                    <tr><td className="px-1">T</td><td className="px-1">= {data.t} detik/SMP</td></tr>
                    <tr><td className="px-1">R<sub>KH</sub></td><td className="px-1">= {data.rqh}</td></tr>
                    <tr><td className="px-1">P<sub>A</sub></td><td className="px-1">= {data.pa} meter</td></tr>
                    <tr><td className="px-1">D<sub>J</sub></td><td className="px-1">= {data.dj}</td></tr>
                    <tr><td className="px-1">C</td><td className="px-1">= {data.c} SMP/jam</td></tr>
                    <tr><td className="px-1">q</td><td className="px-1">= {data.q} SMP/jam</td></tr>
                  </tbody>
                </table>
              ))}
            </div>
            <div className='p-2 text-xl text-right'>T</div>
          </div>
        </div>
      </div>
    </div>
  );
}