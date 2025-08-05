"use client";

import React from 'react';

const DialogFCamera = ({
  showDialog,
  actionDialog,
  statusDialogCameras,
  formMaps,
  formCameras,
  mergedCameraData,
  onFormMapsChange,
  onFormCamerasChange,
  onSave,
  onClose
}) => {
  if (!showDialog) return null;

  const getDialogTitle = () => {
    if (actionDialog) {
      return actionDialog.replaceAll('_', ' ');
    }
    return statusDialogCameras ? 'Tambah Maps' : 'Tambah Kamera';
  };

  const handleSave = async () => {
    await onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-[90%] lg:w-[800px] max-h-[90%] overflow-y-auto space-y-4">
        <h2 className="text-lg font-semibold capitalize">
          {getDialogTitle()}
        </h2>

        {/* Maps Form */}
        {(actionDialog === "edit_maps" || actionDialog === "create_maps") && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>

            {/* <div>
              <label className="label">Kabupaten/Kota</label>
              <input
                type="text"
                className="input input-bordered w-full border-gray-300"
                value={formMaps.kota}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    kota: e.target.value
                  })
                }
              />
            </div> */}

            {/* Input Nama Lokasi */}
            <div>
              <label className="label">Nama Lokasi</label>
              <input
                type="text"
                className="input input-bordered w-full border-gray-300"
                value={formMaps.name}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    name: e.target.value
                  })
                }
              />
            </div>

            {/* Input Ukuran Kota */}
            <div>
              <label className="label">Ukuran Kota (Km)</label>
              <input
                type="text"
                className="input input-bordered w-full border-gray-300"
                value={formMaps.ukuran_kota}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    ukuran_kota: e.target.value
                  })
                }
              />
            </div>

            {/* Input date create */}
            {/* <div>
              <label className="label">Pilih Tanggal:</label>
              <input
                type="date"
                className="border rounded px-2 py-1 w-full border-gray-300"
                value={formMaps.tanggal}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    tanggal: e.target.value
                  })
                }
              /> 
            </div> */}

            {/* Input Ditangani */}
            <div>
              <label className="label">Ditangani</label>
              <input
                type="text"
                className="input input-bordered w-full border-gray-300"
                value={formMaps.ditangani_oleh}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    ditangani_oleh: e.target.value
                  })
                }
              />
            </div>

            {/* Input periode */}
            <div>
              <label className="label">Periode</label>
              <input
                type="text"
                className="input input-bordered w-full border-gray-300"
                value={formMaps.periode}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    periode: e.target.value
                  })
                }
              />
            </div>

            {/* Input Category */}
            <div>
              <label className="label">Kategori Wilayah</label>
              <select
                className="select text-sm rounded-md w-full "
                value={formMaps.category}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    category: e.target.value
                  })
                }
              >
                <option value="" disabled>Pilih Kategori</option>
                <option value="timur">Timur</option>
                <option value="barat">Barat</option>
                <option value="utara">Utara</option>
                <option value="selatan">Selatan</option>
              </select>
            </div>

            {/* Input Latitude */}
            <div>
              <label className="label">Latitude</label>
              <input
                type="text"
                className="input input-bordered w-full border-gray-300"
                value={formMaps.location.latitude}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    location: {
                      ...formMaps.location,
                      latitude: e.target.value
                    }
                  })
                }
              />
            </div>

            {/* Input Longitude */}
            <div>
              <label className="label">Longitude</label>
              <input
                type="text"
                className="input input-bordered w-full border-gray-300"
                value={formMaps.location.longitude}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    location: {
                      ...formMaps.location,
                      longitude: e.target.value
                    }
                  })
                }
              />
            </div>

            {/* Kecamatan */}
            <div>
              <label className="label">Kecamatan</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formMaps?.kecamatan || ""}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    kecamatan: e.target.value
                  })
                }
              />
            </div>

            {/* Lebar Jalur */}
            <div>
              <label className="label">Lebar Jalur</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formMaps?.lebar_jalur || ""}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    lebar_jalur: e.target.value
                  })
                }
              />
            </div>

            {/* Jumlah Lajur */}
            <div>
              <label className="label">Jumlah Lajur</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={formMaps?.jumlah_lajur || ""}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    jumlah_lajur: e.target.value
                  })
                }
              />
            </div>

            {/* Median */}
            <div>
              <label className="label">Median</label>
              <select
                className="select w-full"
                value={formMaps?.median || ""}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    median: e.target.value
                  })
                }
              >
                <option value="" disabled>Pilih Kategori</option>
                <option value="Ada">Ada</option>
                <option value="Tanpa">Tanpa</option>
              </select>
            </div>

            {/* Hambatan Samping */}
            <div>
              <label className="label">Hambatan Samping</label>
              <select
                className="select w-full"
                value={formMaps?.hambatan_samping || ""}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    hambatan_samping: e.target.value
                  })
                }
              >
                <option value="" disabled>Pilih Kategori</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>

            {/* Metode Survei */}
            <div>
              <label className="label">Metode Survei</label>
              <select
                type="number"
                className="input input-bordered w-full"
                value={formMaps?.metode_survei || ""}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    metode_survei: e.target.value
                  })
                }
              >
                <option value="">Pilih Kategori</option>
                <option value="Manual Count">Manual Count</option>
                <option value="Viana">Viana</option>
              </select>
            </div>

             {/* Belok Kiri Jalan Terus */}
            <div>
              <label className="label">Belok Kiri Jalan Terus</label>
              <select
                type="number"
                className="input input-bordered w-full"
                value={formMaps?.belok_kiri_jalan_terus || ""}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    belok_kiri_jalan_terus: e.target.value
                  })
                }
              >
                <option value="">Pilih Kategori</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            {/* kabupaten/kota */}
            {/* <div>
              <label className="label">Kabupaten/Kota</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formMaps?.kab_kota || ""}
                onChange={(e) =>
                  onFormMapsChange({
                    ...formMaps,
                    kab_kota: e.target.value
                  })
                }
              />
            </div> */}

            {/* Toggle Model Detection */}
            <div className='h-full flex flex-col'>
              <label className="label">
                Status {formMaps.model_detection ? "Aktif" : "Non-Aktif"}
              </label>
              <div className="form-control flex flex-row my-auto items-center gap-2">
                <input
                  type="checkbox"
                  className="toggle"
                  checked={formMaps.model_detection}
                  onChange={(e) =>
                    onFormMapsChange({
                      ...formMaps,
                      model_detection: e.target.checked
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Cameras Form */}
        {(actionDialog === "edit_cameras" || actionDialog === "create_cameras") && (
          <div>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
              {/* Judul Kamera */}
              <div>
                <label className="label">Judul Kamera</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formCameras?.name || ""}
                  onChange={(e) =>
                    onFormCamerasChange({
                      ...formCameras,
                      name: e.target.value
                    })
                  }
                />
              </div>

              {/* Name Location */}
              <div>
                <label className="label">Nama Lokasi</label>
                <select
                  className="text-sm rounded-md px-3 py-2 w-full select"
                  value={formCameras.ID_Simpang}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value, 10);
                    const selectedItem = mergedCameraData.find((item) => item.id === selectedId);
                    console.log(selectedItem);
                    onFormCamerasChange({
                      ...formCameras,
                      ID_Simpang: selectedId,
                      location: selectedItem?.Nama_Simpang || '',
                    });
                  }}
                >
                  <option value="" defaultValue>Pilih Kategori</option>
                  {mergedCameraData?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.Nama_Simpang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Link Url */}
              <div>
                <label className="label">URL</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formCameras?.url || ""}
                  onChange={(e) =>
                    onFormCamerasChange({
                      ...formCameras,
                      url: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-control flex flex-row items-center gap-2 mb-5">
                <label className="label">Status Kamera {formCameras.status}</label>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={formCameras.status}
                  onChange={(e) =>
                    onFormCamerasChange({
                      ...formCameras,
                      status: e.target.checked ? 1 : 0
                    })
                  }
                />
              </div>
            </div>

            {/* Socket Event */}
            <div>
              <div className="flex content-center items-center gap-2 pb-2">
                <div className="form-control flex flex-row items-center gap-2">
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={formCameras.socket_status}
                    onChange={(e) =>
                      onFormCamerasChange({
                        ...formCameras,
                        socket_status: e.target.checked
                      })
                    }
                  />
                </div>
                <label className="label">Socket Event</label>
              </div>
              <input
                type="text"
                disabled={!formCameras?.socket_status}
                className="input input-bordered w-full"
                value={formCameras?.socket_event || ""}
                onChange={(e) =>
                  onFormCamerasChange({
                    ...formCameras,
                    socket_event: e.target.value
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-2 pt-2">
          <button className="btn btn-sm" onClick={onClose}>
            Batal
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogFCamera;