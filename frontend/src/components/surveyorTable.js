"use client"

import React, { useEffect, useState } from 'react';
import { maps } from '@/lib/apiService';

const SurveyInfoTable = ({ fetchStatus, id, cuaca }) => {

  const [dataSurvey, setDataSurvey] = useState([])

  // Fetch simpang data first to get the ID
  const fetchSimpangData = async (id) => {
    try {
      const simpangRes = await maps.getById(id);
      const data = simpangRes ? simpangRes.data : {}
      setDataSurvey([
        { label: 'Cuaca', value: `${cuaca ?cuaca?.cuaca : ''}` || "" },
        { label: 'Metode Survei', value: data?.Metode_Survei || "" },
        { label: 'Lokasi', value: data?.Kota },
        { label: 'Kabupaten/Kota', value: data?.Nama_Simpang || "" },
        { label: 'Kecamatan', value: data?.Kecamatan },
        { label: 'Lebar Jalur', value: data?.Lebar_Jalur },
        { label: 'Jumlah Lajur', value: data?.Jumlah_Lajur },
        { label: 'Median', value: data?.Median },
        { label: 'Belok Kiri Jalan Terus', value: data?.Belok_Kiri_Jalan_Terus },
        { label: 'Hambatan Samping', value: data?.Hambatan_Samping },
      ])      
    } catch (err) {
      console.error('Error fetching simpang data:', err);
    }
  };

  const surveyData = [
    { label: 'Cuaca', value: 'Cerah berawan' },
    { label: 'Metode Survei', value: 'Pencacahan Lalu Lintas ( Volume Kendaraan)' },
    { label: 'Lokasi', value: 'Simpang Condongcatur (koordinat)' },
    { label: 'Kabupaten/Kota', value: 'Sleman' },
    { label: 'Kecamatan', value: 'Depok' },
    { label: 'Lebar Jalur', value: '7 meter' },
    { label: 'Jumlah Lajur', value: '2 lajur' },
    { label: 'Median', value: 'Ada / Tanpa' },
    { label: 'Belok Kiri Jalan Terus', value: 'Ya / Tidak' },
    { label: 'Hambatan Samping', value: 'Tinggi / Sedang / Rendah' },
  ];

  useEffect(() => {
    if (id !== undefined && fetchStatus) {
      fetchSimpangData(id)
    } else {
      setDataSurvey(surveyData)
    }
  }, [id])

  const setUploadFormulir = (option) => {
    console.log(option);
  }
  return (
    <div className="w-full max-w-4xl mx-auto py-2 gap-5 flex flex-col">
      {/* <button
        className={`btn truncate btn-sm border-2 rounded-lg w-fit border-[#232f61]/90 btn-outline text-[#232f61]`}
        onClick={() => setUploadFormulir("test")}
      >
      Formulir
    </button> */}
      <div className="card bg-base-100 shadow-xs">
        <div className="card-body p-0 sm:p-2 outline-2 outline-[#232f61]/30">
          <div className="overflow-x-auto w-full">
            <table className="table w-full table-sm min-w-[200px]">
              <tbody>
                {dataSurvey.map((item, index) => (
                  <tr key={index}>
                    <td className="bg-[#232f61]/90 max-w-[60px] font-semibold text-white whitespace-normal">{item.label}</td>
                    <td className=' whitespace-normal min-w-1/2'>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyInfoTable;