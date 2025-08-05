"use client";

import { useState, useEffect } from 'react';
import { GoPlus } from "react-icons/go";
import { FaMinus } from "react-icons/fa6";


export default function FaseLapanganTable ({ setDataLapangan, selectedId }) {
  const [formData, setFormData] = useState({
    pendekat: [
      {
        kodePendekat: "",
        tipeLingkunganJalan: "",
        kelasHambatanSamping: "",
        median: "",
        kelandaianPendekat: "",
        bkjt: "",
        jarakKeKendaraanParkir: "",
        lebarPendekat: {
          awalLajur: "",
          garisHenti: "",
          lajurBki: "",
          lajurKeluar: ""
        }
      }
    ]
  });

  const kodePendekataOptions = [
    { value: "", label: "Pilih Kode Pendekat" },
    { value: "u", label: "U (Utara)" },
    { value: "s", label: "S (Selatan)" },
    { value: "b", label: "B (Barat)" },
    { value: "t", label: "T (Timur)" }
  ];

  const tipeLingkunganOptions = [
    { value: "", label: "Pilih Tipe Lingkungan" },
    { value: "kom", label: "KOM (Komersial)" },
    { value: "kim", label: "KIM (Kawasan Industri Madya)" },
    { value: "at", label: "AT (Akses Terbatas)" }
  ];

  const kelasHambatanOptions = [
    { value: "", label: "Pilih Kelas Hambatan" },
    { value: "t", label: "T (Tinggi)" },
    { value: "s", label: "S (Sedang)" },
    { value: "r", label: "R (Rendah)" }
  ];

  const bkijtOptions = [
    { value: 1, label: "Ya" },
    { value: 0, label: "Tidak" },
  ]

  const handleInputChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pendekat: prev.pendekat.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleLebarPendekataChange = (index, subField, value) => {
    setFormData(prev => ({
      ...prev,
      pendekat: prev.pendekat.map((item, i) =>
        i === index
          ? {
            ...item,
            lebarPendekat: {
              ...item.lebarPendekat,
              [subField]: value
            }
          }
          : item
      )
    }));
  };

  const loadSA1 = (id) => {
    const existing = JSON.parse(localStorage.getItem('data'));
    return existing?.data?.sa1?.[id] || null;
  };

  useEffect(() => {
    if (selectedId === 0) {
      setFormData({
        pendekat: [
          {
            kodePendekat: "",
            tipeLingkunganJalan: "",
            kelasHambatanSamping: "",
            median: "",
            kelandaianPendekat: "",
            bkjt: "",
            jarakKeKendaraanParkir: "",
            lebarPendekat: {
              awalLajur: "",
              garisHenti: "",
              lajurBki: "",
              lajurKeluar: ""
            }
          }
        ]
      })
    }
    if (selectedId !== undefined && selectedId !== null && selectedId !== 0 && selectedId !== '0' && selectedId !== '') {
      const loadData = loadSA1(selectedId)
      if (!loadData || !Array.isArray(loadData.pendekat)) return;
      setFormData(loadData)
      setDataLapangan(loadData)

      console.log(loadData)
    }
  }, [selectedId])

  const addRow = () => {
    const newRow = {
      kodePendekat: "",
      tipeLingkunganJalan: "",
      kelasHambatanSamping: "",
      median: "",
      kelandaianPendekat: "",
      bkjt: "",
      jarakKeKendaraanParkir: "",
      lebarPendekat: {
        awalLajur: "",
        garisHenti: "",
        lajurBki: "",
        lajurKeluar: ""
      }
    };

    setFormData(prev => ({
      ...prev,
      pendekat: [...prev.pendekat, newRow]
    }));
  };

  const removeRow = (index) => {
    if (formData.pendekat.length > 1) {
      setFormData(prev => ({
        ...prev,
        pendekat: prev.pendekat.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = () => {
    // Validasi wajib
    const hasEmptyRequired = formData.pendekat.some(item =>
      !item.kodePendekat || !item.tipeLingkunganJalan || !item.kelasHambatanSamping
    );

    if (hasEmptyRequired) {
      alert('Harap lengkapi field wajib: Kode Pendekat, Tipe Lingkungan Jalan, dan Kelas Hambatan Samping');
      return;
    }

    // Bersihkan dan filter data
    const cleanData = {
      ...formData,
      pendekat: formData.pendekat.map(item => ({
        ...item,
        lebarPendekat: Object.fromEntries(
          Object.entries(item.lebarPendekat || {}).filter(([key, value]) => value.trim() !== '')
        )
      })).filter(item => item.kodePendekat)
    };

    // Hapus data fase lama agar komponen fase bisa generate ulang
    delete cleanData.fase;

    // Optional: agar React detect perubahan meskipun sama
    cleanData.updatedAt = Date.now();

    // Simpan ke parent
    setDataLapangan(cleanData);

    console.log('Data Pendekat yang akan dikirim:', cleanData);
    alert('Data berhasil disimpan! Lihat console untuk detail data.');
  };


  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Form Data Lapangan</h2>

      <div className="space-y-8">
        {formData.pendekat.map((pendekat, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Pendekat {index + 1}
              </h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={addRow}
                  className="btn btn-sm bg-blue-500/90 text-white rounded-md hover:bg-blue-500 transition-colors"
                  title="Tambah pendekat"
                >
                  <GoPlus size={16} />
                </button>
                {formData.pendekat.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="btn btn-sm bg-red-500/90 text-white rounded-md hover:bg-red-500 transition-colors"
                    title="Hapus pendekat"
                  >
                    <FaMinus size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Kode Pendekat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Pendekat *
                </label>
                <select
                  value={pendekat.kodePendekat}
                  onChange={(e) => handleInputChange(index, 'kodePendekat', e.target.value)}
                  className="w-full select select-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent"
                  required
                >
                  {kodePendekataOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipe Lingkungan Jalan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Lingkungan Jalan *
                </label>
                <select
                  value={pendekat.tipeLingkunganJalan}
                  onChange={(e) => handleInputChange(index, 'tipeLingkunganJalan', e.target.value)}
                  className="w-full px-3 select select-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent"
                  required
                >
                  {tipeLingkunganOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kelas Hambatan Samping */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelas Hambatan Samping *
                </label>
                <select
                  value={pendekat.kelasHambatanSamping}
                  onChange={(e) => handleInputChange(index, 'kelasHambatanSamping', e.target.value)}
                  className="w-full px-3 select select-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent"
                  required
                >
                  {kelasHambatanOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Median */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Median
                </label>
                <input
                  type="text"
                  value={pendekat.median}
                  onChange={(e) => handleInputChange(index, 'median', e.target.value)}
                  placeholder="Contoh: Ada/Tidak Ada"
                  className="w-full px-3 input input-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent"
                />
              </div>

              {/* Kelandaian Pendekat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelandaian Pendekat (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={pendekat.kelandaianPendekat}
                  onChange={(e) => handleInputChange(index, 'kelandaianPendekat', e.target.value)}
                  placeholder="Contoh: 2.5"
                  className="w-full px-3 input input-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent"
                />
              </div>

              {/* BKJT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BKJT
                </label>
                <select
                  value={pendekat.bkjt}
                  onChange={(e) => handleInputChange(index, 'bkjt', e.target.value)}
                  className="w-full px-3 select select-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent"
                  required
                >
                  <option value="">
                    Pilih Kategori
                  </option>

                  {bkijtOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jarak Ke Kendaraan Parkir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jarak Ke Kendaraan Parkir (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={pendekat.jarakKeKendaraanParkir}
                  onChange={(e) => handleInputChange(index, 'jarakKeKendaraanParkir', e.target.value)}
                  placeholder="Contoh: 15.5"
                  className="w-full px-3 input input-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent"
                />
              </div>
            </div>

            {/* Lebar Pendekat Section */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">Lebar Pendekat (m)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Awal Lajur
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pendekat.lebarPendekat.awalLajur}
                    onChange={(e) => handleLebarPendekataChange(index, 'awalLajur', e.target.value)}
                    placeholder="0.0"
                    className="w-full px-3 input input-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:ring-green-100/90 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Garis Henti
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pendekat.lebarPendekat.garisHenti}
                    onChange={(e) => handleLebarPendekataChange(index, 'garisHenti', e.target.value)}
                    placeholder="0.0"
                    className="w-full px-3 input input-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:ring-green-100/90 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Lajur BKI
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pendekat.lebarPendekat.lajurBki}
                    onChange={(e) => handleLebarPendekataChange(index, 'lajurBki', e.target.value)}
                    placeholder="0.0"
                    className="w-full px-3 input input-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:ring-green-100/90 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Lajur Keluar
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pendekat.lebarPendekat.lajurKeluar}
                    onChange={(e) => handleLebarPendekataChange(index, 'lajurKeluar', e.target.value)}
                    placeholder="0.0"
                    className="w-full px-3 input input-sm py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:ring-green-100/90 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="shadow-xs overflow-x-auto mt-5">
        <div className="overflow-x-auto">
          <table className="w-full table table-sm border rounded-md border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th rowSpan={3} className="text-xs text-wrap text-center font-medium text-gray-700 uppercase border border-gray-300">
                  Kode Pendekat
                </th>
                <th rowSpan={3} className="text-xs text-wrap text-center font-medium text-gray-700 uppercase border border-gray-300">
                  Tipe Lingkungan Jalan
                </th>
                <th rowSpan={3} className="text-xs text-wrap text-center font-medium text-gray-700 uppercase border border-gray-300">
                  Kelas Hambatan Samping
                </th>
                <th rowSpan={3} className="text-xs text-wrap text-center font-medium text-gray-700 uppercase border border-gray-300">
                  Median
                </th>
                <th rowSpan={3} className="text-xs text-wrap text-center font-medium text-gray-700 uppercase border border-gray-300">
                  Kelandaian Pendekat
                </th>
                <th rowSpan={3} className="text-xs text-wrap text-center font-medium text-gray-700 uppercase border border-gray-300 px-5">
                  BKJT
                </th>
                <th rowSpan={3} className="text-xs text-wrap text-center font-medium text-gray-700 uppercase border border-gray-300">
                  Jarak ke Kendaraan Parkir
                </th>
                <th colSpan={4} className=" text-center text-xs text-wrap font-medium text-gray-700 uppercase border border-gray-300">
                  Lebar Pendekat
                </th>
              </tr>
              <tr>
                <th className="px-2 py-2 text-center text-xs text-wrap font-medium text-gray-700 uppercase border border-gray-300">
                  Awal Lajur
                </th>
                <th className="px-2 py-2 text-center text-xs text-wrap font-medium text-gray-700 uppercase border border-gray-300">
                  Garis Henti
                </th>
                <th className="px-2 py-2 text-center text-xs text-wrap font-medium text-gray-700 uppercase border border-gray-300">
                  Lajur Bki
                </th>
                <th className="px-2 py-2 text-center text-xs text-wrap font-medium text-gray-700 uppercase border border-gray-300">
                  Lajur Keluar
                </th>
              </tr>
              <tr>
                <th className="px-2 py-2 text-center text-xs text-wrap font-medium text-gray-600 border border-gray-300">m</th>
                <th className="px-2 py-2 text-center text-xs text-wrap font-medium text border border-gray-300">m</th>
                <th className="px-2 py-2 text-center text-xs text-wrap font-medium text border border-gray-300">m</th>
                <th className="px-2 py-2 text-center text-xs text-wrap font-medium text border border-gray-300">m</th>
              </tr>
            </thead>
            <tbody className="">
              {formData.pendekat.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.kodePendekat} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.tipeLingkunganJalan} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.kelasHambatanSamping} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.median} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.kelandaianPendekat} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.bkjt === '1' ? "Y" : row?.bkjt === '0' ? "T" : ''} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.jarakKeKendaraanParkir} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.lebarPendekat?.awalLajur} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.lebarPendekat?.garisHenti} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.lebarPendekat?.lajurBki} onChange={() => { }} />
                  </td>
                  <td className="text-center border border-gray-300">
                    <input type={"text"} className='h-full w-full capitalize text-center font-semibold  border-gray-300 rounded-md focus:outline-0 focus:ring-0 focus:border-transparent' value={row?.lebarPendekat?.lajurKeluar} onChange={() => { }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full btn btn-sm btn-success py-3 text-xs"
        >
          Simpan Data Pendekat
        </button>
      </div>
    </div>
  );
};