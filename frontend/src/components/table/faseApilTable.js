"use client"
import { useState, useEffect } from 'react';
import { SketsaAPILL } from '../sketsaApil';
import { MdDeleteOutline } from "react-icons/md";

const DynamicTrafficTable = ({ setDataFaseApil, dataLapangan }) => {
  const [data, setData] = useState({
    lokasi: "",
    data: {
      // "utara": {
      //   "tipe_pendekat": {
      //     "terlindung": false,
      //     "terlawan": false
      //   },
      //   "arah": {
      //     "bki": false,
      //     "bkijt": false,
      //     "lurus": false,
      //     "bka": false
      //   },
      //   "pemisahan_lurus_bka": false,
      //   "fase": {
      //     "fase_1": false,
      //     "fase_2": false,
      //     "fase_3": false,
      //     "fase_4": false
      //   }
      // },
      // "selatan": {
      //   "tipe_pendekat": {
      //     "terlindung": false,
      //     "terlawan": false
      //   },
      //   "arah": {
      //     "bki": false,
      //     "bkijt": false,
      //     "lurus": false,
      //     "bka": false
      //   },
      //   "pemisahan_lurus_bka": false,
      //   "fase": {
      //     "fase_1": false,
      //     "fase_2": false,
      //     "fase_3": false,
      //     "fase_4": false
      //   }
      // },
      // "timur": {
      //   "tipe_pendekat": {
      //     "terlindung": false,
      //     "terlawan": false
      //   },
      //   "arah": {
      //     "bki": false,
      //     "bkijt": false,
      //     "lurus": false,
      //     "bka": false
      //   },
      //   "pemisahan_lurus_bka": false,
      //   "fase": {
      //     "fase_1": false,
      //     "fase_2": false,
      //     "fase_3": false,
      //     "fase_4": false
      //   }
      // },
      // "barat": {
      //   "tipe_pendekat": {
      //     "terlindung": false,
      //     "terlawan": false
      //   },
      //   "arah": {
      //     "bki": false,
      //     "bkijt": false,
      //     "lurus": false,
      //     "bka": false
      //   },
      //   "pemisahan_lurus_bka": false,
      //   "fase": {
      //     "fase_1": false,
      //     "fase_2": false,
      //     "fase_3": false,
      //     "fase_4": false
      //   }
      // }
    }
  });

  const [newApproachName, setNewApproachName] = useState('');
  const [newApproachLabel, setNewApproachLabel] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApproach, setEditingApproach] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [lapangan, setLapangan] = useState({})

  const getDefaultApproach = () => ({
    tipe_pendekat: {
      terlindung: false,
      terlawan: false
    },
    arah: {
      bki: false,
      bkijt: false,
      lurus: false,
      bka: false
    },
    pemisahan_lurus_bka: false,
    fase: {
      fase_1: false,
      fase_2: false,
      fase_3: false,
      fase_4: false
    }
  });

  useEffect(() => {
    if (!dataLapangan) return;

    const pendekatMap = {
      u: 'utara',
      s: 'selatan',
      t: 'timur',
      b: 'barat'
    };

    // Jika ada fase, gunakan datanya
    if (dataLapangan.fase && dataLapangan.fase.data) {
      setData({
        lokasi: dataLapangan.fase.lokasi || "",
        data: dataLapangan.fase.data
      });
    }

    // Jika tidak ada, generate ulang dari pendekat
    else if (Array.isArray(dataLapangan.pendekat)) {
      const generatedData = {};

      dataLapangan.pendekat.forEach(item => {
        const kode = item.kodePendekat?.toLowerCase();
        const arah = pendekatMap[kode];
        if (arah && !generatedData[arah]) {
          generatedData[arah] = getDefaultApproach();
        }
      });

      setData({
        lokasi: "",
        data: generatedData
      });
    }
  }, [dataLapangan]);



  // Template untuk pendekat baru
  const defaultApproachData = {
    "tipe_pendekat": {
      "terlindung": false,
      "terlawan": false
    },
    "arah": {
      "bki": false,
      "bkijt": false,
      "lurus": false,
      "bka": false
    },
    "pemisahan_lurus_bka": false,
    "fase": {
      "fase_1": false,
      "fase_2": false,
      "fase_3": false,
      "fase_4": false
    }
  };


  const getDirectionLabel = (direction) => {
    const labels = {
      'utara': 'Utara (U)',
      'selatan': 'Selatan (S)',
      'timur': 'Timur (T)',
      'barat': 'Barat (B)'
    };
    return labels[direction];
  };

  const phases = ['fase_1', 'fase_2', 'fase_3', 'fase_4'];


  // Handler untuk mengubah data
  const handleDataChange = (direction, field, subField, value) => {
    setData(prevData => {
      const newData = { ...prevData };
      if (subField) {
        newData.data[direction][field][subField] = value;
      } else {
        newData.data[direction][field] = value;
      }
      return newData;
    });
  };



  const submitFormApill = () => {
    setDataFaseApil(data)
  }

  const Checkbox = ({ checked, onChange }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
    />
  );

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  const directions = Object.keys(data.data);

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[14px] font-semibold capitalize text-start">
          Urutan Fase Apil - Lokasi: {data.lokasi}
        </h2>

        {/* <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 btn btn-success btn-sm rounded"
        >
          Tambah Pendekat
        </button> */}
      </div>

      {/* Form tambah pendekat baru */}
      {showAddForm && (
        <div className="mb-4 p-4 border border-gray-300 rounded bg-gray-50">
          <h3 className="text-[12px] font-medium mb-2">Tambah Pendekat Baru</h3>
          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-[11px] text-gray-600 mb-1">Nama Pendekat</label>
              {/* <input
                type="text"
                value={newApproachName}
                onChange={(e) => setNewApproachName(e.target.value)}
                placeholder="contoh: tenggara"
                className="px-2 py-1 text-[11px] border border-gray-300 rounded w-32"
              /> */}
              <select
                className="select select-xs min-w-xs capitalize cursor-pointer"
                value={newApproachName}
                onChange={(e) => setNewApproachName(e.target.value)}
              >
                <option value="" disabled>Pilih Pendekat</option>
                <option value="timur">timur</option>
                <option value="barat">barat</option>
                <option value="Rendah">selatan</option>
                <option value="utara">utara</option>
              </select>
            </div>
            <button
              onClick={handleAddApproach}
              className="btn btn-xs btn-success rounded"
            >
              Tambah
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="btn btn-xs btn-error rounded"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr>
              <th className="border border-black p-2 bg-gray-100 text-[12px] font-medium">
                Kode<br />Pendekat
              </th>
              <th className="border border-black p-2 bg-gray-100 text-[12px] font-medium">
                Tipe<br />Pendekat
              </th>
              <th className="border border-black p-2 bg-gray-100 text-[12px] font-medium">
                Arah
              </th>
              <th className="border border-black p-2 bg-gray-100 text-[12px] font-medium">
                Pemisahan<br />Lurus - BKa
              </th>
              <th className="border border-black p-2 bg-gray-100 text-[12px] font-medium">
                Fase 1
              </th>
              <th className="border border-black p-2 bg-gray-100 text-[12px] font-medium">
                Fase 2
              </th>
              <th className="border border-black p-2 bg-gray-100 text-[12px] font-medium">
                Fase 3
              </th>
              <th className="border border-black p-2 bg-gray-100 text-[12px] font-medium">
                Fase 4
              </th>
              <th className="border border-black p-2 bg-gray-100 text-[12px] font-medium">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {directions.map((direction) => {
              const directionData = data.data[direction];

              return (
                <tr key={direction}>
                  {/* Kode Pendekat */}
                  <td className="border border-black p-2 text-center">
                    <Checkbox
                      checked={true}
                      onChange={() => { }}
                    />
                    <br />
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[12px] font-medium">
                          {getDirectionLabel(direction)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Tipe Pendekat */}
                  <td className="border border-black p-2 text-center text-[12px]">
                    <div className="flex items-center space-x-2 text-[12px] mb-1">
                      <Checkbox
                        checked={directionData.tipe_pendekat.terlindung}
                        onChange={(e) => handleDataChange(direction, 'tipe_pendekat', 'terlindung', e.target.checked)}
                      />
                      <span>Terlindung (P)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[12px]">
                      <Checkbox
                        checked={directionData.tipe_pendekat.terlawan}
                        onChange={(e) => handleDataChange(direction, 'tipe_pendekat', 'terlawan', e.target.checked)}
                      />
                      <span>Terlawan (O)</span>
                    </div>
                  </td>

                  {/* Arah */}
                  <td className="border border-black p-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-[12px]">
                        <Checkbox
                          checked={directionData.arah.bki}
                          onChange={(e) => handleDataChange(direction, 'arah', 'bki', e.target.checked)}
                        />
                        <span>BKi / BKIJT</span>
                        <Checkbox
                          checked={directionData.arah.bkijt}
                          onChange={(e) => handleDataChange(direction, 'arah', 'bkijt', e.target.checked)}
                        />
                      </div>
                      <div className="flex items-center space-x-2 text-[12px]">
                        <Checkbox
                          checked={directionData.arah.lurus}
                          onChange={(e) => handleDataChange(direction, 'arah', 'lurus', e.target.checked)}
                        />
                        <span>Lurus</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[12px]">
                        <Checkbox
                          checked={directionData.arah.bka}
                          onChange={(e) => handleDataChange(direction, 'arah', 'bka', e.target.checked)}
                        />
                        <span>BKa</span>
                      </div>
                    </div>
                  </td>

                  {/* Pemisahan Lurus - BKa */}
                  <td className="border border-black p-2 text-center">
                    <Checkbox
                      checked={directionData.pemisahan_lurus_bka}
                      onChange={(e) => handleDataChange(direction, 'pemisahan_lurus_bka', null, e.target.checked)}
                    />
                  </td>

                  {/* Fase 1-4 */}
                  {phases.map((phase) => (
                    <td key={phase} className="border border-black p-2 text-center">
                      <div>
                        <Checkbox
                          checked={directionData.arah.bkijt}
                          onChange={() => { }}
                        />
                      </div>
                      <div className="">
                        <Checkbox
                          checked={directionData.fase[phase]}
                          onChange={(e) => handleDataChange(direction, 'fase', phase, e.target.checked)}
                        />
                      </div>
                    </td>
                  ))}

                  {/* Aksi */}
                  <td className="border border-black p-5 text-center">
                    <div className="flex flex-col gap-1">
                      {/* <button
                        onClick={() => handleResetApproach(direction)}
                        className="p-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        title="Reset Data"
                      >
                      </button> */}
                      {/* <button
                        onClick={() => handleRemoveApproach(direction)}
                        className="p-2 text-white cursor-pointer hover:bg-red-50/90 hover:shadow-xs"
                        title="Hapus Pendekat"
                      >
                        <MdDeleteOutline className='text-lg text-red-600' />
                      </button> */}
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={4} className="border border-black p-2 text-center">Sketsa Simpang APILL</td>
              <td className="border border-black p-2 text-center">
                <SketsaAPILL
                  directions={data.data}
                  currentPhase={"fase_1"}
                />
              </td>
              <td className="border border-black p-2 text-center">
                <SketsaAPILL
                  directions={data.data}
                  currentPhase={"fase_2"}
                />
              </td>
              <td className="border border-black p-2 text-center">
                <SketsaAPILL
                  directions={data.data}
                  currentPhase={"fase_3"}
                />
              </td>
              <td className="border border-black p-2 text-center">
                <SketsaAPILL
                  directions={data.data}
                  currentPhase={"fase_4"}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='w-full py-2'>
        <button className="btn btn-sm btn-success w-full" onClick={submitFormApill}>Simpan Data Fase Apil</button>
      </div>


      <div className="mt-4 text-[12px] text-gray-600">
        <p><strong>Keterangan:</strong></p>
        <p>• BKi/BKIJT = Belok Kiri/Belok Kiri Jalan Terus</p>
        <p>• BKa = Belok Kanan</p>
        <p>• P = Terlindung, O = Terlawan</p>
        <p>• Gunakan tombol + untuk menambah pendekat baru</p>
        <p>• Klik ikon edit untuk mengubah label pendekat</p>
        <p>• Gunakan tombol reset untuk mengatur ulang data pendekat</p>
        <p>• Gunakan tombol X untuk menghapus pendekat (minimal 1 pendekat harus ada)</p>
      </div>

      {/* Debug: Show current data structure */}
      {/* <div className="mt-4 p-3 bg-gray-100 rounded">
        <h3 className="text-[12px] font-medium mb-2">Data JSON saat ini:</h3>
        <pre className="text-[10px] overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default DynamicTrafficTable;