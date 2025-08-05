"use client";

import React, { useEffect, useState } from 'react';
import { GoPlus } from "react-icons/go";
import { FaMinus } from "react-icons/fa6";
import { Description } from '../ui/description';
import { IoReloadOutline } from "react-icons/io5";
import { useAuth } from '@/contexts/authContext';

const SurveyFormSAHeader = ({ setDataHeader, setSelectedId, onResetAll }) => {
  const { pathname } = useAuth()
  const [statusForm, setStatusForm] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    tanggal: '',
    kabupatenKota: '',
    lokasi: '',
    ruasJalanMayor: [''],
    ruasJalanMinor: [''],
    ukuranKota: '',
    perihal: '',
    periode: ''
  });
  const [resetAll, setReset] = useState(false)
  const [optionSelect, setOptionSelect] = useState(0);
  const [dataLocalHead, setDataLocalHead] = useState([])
  const [statusHeader, setStatusHeader] = useState(false)
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addRow = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeRow = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('data');
    if (stored) {
      const parsed = JSON.parse(stored);
      setDataLocalHead(parsed.data?.headerData || []);
    }
  }, []);

  const handleSubmit = () => {
    // Validasi form
    const requiredFields = ['tanggal', 'kabupatenKota', 'lokasi'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Harap lengkapi field: ${missingFields.join(', ')}`);
      return;
    }

    // Filter empty string dari array
    const cleanData = {
      ...formData,
      ruasJalanMayor: formData.ruasJalanMayor.filter(item => item.trim() !== ''),
      ruasJalanMinor: formData.ruasJalanMinor.filter(item => item.trim() !== '')
    };

    // Ambil localStorage
    const raw = localStorage.getItem('data');
    let existing = raw ? JSON.parse(raw) : {
      data: { headerData: [], sa1: {}, sa2: {}, sa3: {} }
    };

    if (!Array.isArray(existing.data.headerData)) {
      existing.data.headerData = [];
    }

    // Kalau sedang edit (sudah ada id)
    if (cleanData.id > 0) {
      const index = existing.data.headerData.findIndex(item => item.id === cleanData.id);
      if (index !== -1) {
        existing.data.headerData[index] = cleanData; // update
      } else {
        existing.data.headerData.push({ ...cleanData, id: Date.now() }); // fallback kalau id tidak ditemukan
      }
    } else {
      // Kalau tambah baru
      const newId = Date.now();
      existing.data.headerData.push({ ...cleanData, id: newId });
    }

    // Simpan kembali ke localStorage
    localStorage.setItem('data', JSON.stringify(existing));

    // Simulasi sukses
    console.log('Data berhasil disimpan:', cleanData);
    alert('Data berhasil disimpan!');

    setDataHeader(cleanData)
  };


  const refreshData = () => {
    const stored = localStorage.getItem('data');
    if (stored) {
      const parsed = JSON.parse(stored);
      setDataLocalHead(parsed.data?.headerData || []);
    }
  }

  const handleSelect = (e) => {
    setReset(false)
    const selectedId = e.target.value;
    setOptionSelect(selectedId);

    const selectedData = dataLocalHead.find(item => item.id.toString() === selectedId);
    if (selectedData) {
      setFormData({
        id: selectedData.id || 0,
        tanggal: selectedData.tanggal || '',
        kabupatenKota: selectedData.kabupatenKota || '',
        lokasi: selectedData.lokasi || '',
        ruasJalanMayor: selectedData.ruasJalanMayor || [''],
        ruasJalanMinor: selectedData.ruasJalanMinor || [''],
        ukuranKota: selectedData.ukuranKota || '',
        perihal: selectedData.perihal || '',
        periode: selectedData.periode || ''
      });
    }
    setSelectedId(selectedData.id || 0)
    setDataHeader(selectedData)
  };

  const handleReset = () => {
    onResetAll();
    setReset(true)
    setFormData({
      id: 0,
      tanggal: '',
      kabupatenKota: '',
      lokasi: '',
      ruasJalanMayor: [''],
      ruasJalanMinor: [''],
      ukuranKota: '',
      perihal: '',
      periode: ''
    });
  }

  useEffect(() => {
    console.log(pathname)
    if (pathname !== '/form-sa-i') {
      setStatusForm(true)
    } else {
      setStatusForm(false)
    }
  }, [pathname])
  const renderArrayInput = (field, label, placeholder) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {formData[field].map((value, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            readOnly={statusForm}
            value={value}
            onChange={(e) => handleArrayInputChange(field, index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="input input-sm border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100/90 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => addRow(field)}
            className="btn btn-sm bg-blue-500/90 text-white rounded-md hover:bg-blue-500 transition-colors"
            title="Tambah baris"
            disabled={statusForm}
          >
            <GoPlus size={16} />
          </button>
          {formData[field].length > 1 && (
            <button
              type="button"
              onClick={() => removeRow(field, index)}
              className="btn btn-sm bg-red-500/90 text-white rounded-md hover:bg-red-500 transition-colors"
              title="Hapus baris"
              disabled={statusForm}
            >
              <FaMinus size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full mx-auto px-6 gap-3 flex flex-col">
      <Description>
        <div className='flex flex-col gap-2'>
          {!statusHeader ? (
            <div className='w-fit text-blue-600 font-semibold text-xs cursor-pointer' onClick={() => setStatusHeader(!statusHeader)}>Lanjut dengan mengisi form yang sudah ada?</div>
          ) : (
            <div className='w-fit text-red-600 font-semibold text-xs cursor-pointer' onClick={() => { setOptionSelect(0), handleReset(), setStatusHeader(!statusHeader), setOptionSelect("") }}>Reset Form (Buat Baru)</div>
          )}
          {statusHeader && (
            <div>
              <select
                className="select select-bordered focus:outline-none select-sm bg-transparent focus:ring-0 "
                value={optionSelect}
                onChange={handleSelect}
              >
                <option value={0} disabled={!resetAll && (optionSelect !== 0 || optionSelect !== '')}>Pilih Data Header</option>
                {dataLocalHead.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.perihal} - {item.lokasi}
                  </option>
                ))}
              </select>
              <button className='btn btn-sm bg-transparent hover:drop-shadow-2xl hover:bg-transparent border-none ring-0' onClick={() => refreshData()}
              >
                <IoReloadOutline className='text-xl text-success' />
              </button>
            </div>
          )}
        </div>
      </Description >
      <div className='bg-base-200 p-5 rounded-md border border-base-300 grid grid-cols-1 lg:grid-cols-2 lg:space-x-10 w-full space-y-10'>
        <div className="space-y-6 grid grid-cols-2 gap-2">
          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal *
            </label>
            <input
              type="date"
              readOnly={statusForm}
              value={formData.tanggal}
              onChange={(e) => handleInputChange('tanggal', e.target.value)}
              className="w-full px-3 input input-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100/90 focus:border-transparent"
              required
            />
          </div>


          {/* Perihal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Perihal
            </label>
            <textarea
              readOnly={statusForm}
              value={formData.perihal}
              onChange={(e) => handleInputChange('perihal', e.target.value)}
              rows={3}
              className="w-full px-3 input input-sm py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100/90 focus:border-transparent resize-vertical min-h-[33px]"
            />
          </div>

          {/* Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode
            </label>
            <input
              type="text"
              readOnly={statusForm}
              value={formData.periode}
              onChange={(e) => handleInputChange('periode', e.target.value)}
              className="w-full px-3 input input-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Kabupaten/Kota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kabupaten/Kota *
            </label>
            <input
              type="text"
              readOnly={statusForm}
              value={formData.kabupatenKota}
              onChange={(e) => handleInputChange('kabupatenKota', e.target.value)}
              placeholder="Contoh: Sleman"
              className="w-full px-3 input input-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100/90 focus:border-transparent"
              required
            />
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi *
            </label>
            <input
              type="text"
              readOnly={statusForm}
              value={formData.lokasi}
              onChange={(e) => handleInputChange('lokasi', e.target.value)}
              placeholder="Contoh: Simpang Condongcatur"
              className="w-full px-3 input input-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100/90 focus:border-transparent"
              required
            />
          </div>

          {/* Ruas Jalan Mayor */}
          {renderArrayInput('ruasJalanMayor', 'Ruas Jalan Mayor', 'Jl. Padjajaran (T,B)')}

          {/* Ruas Jalan Minor */}
          {renderArrayInput('ruasJalanMinor', 'Ruas Jalan Minor', 'Jl. Anggajaya (U), Jl. Affandi (S)')}

          {/* Ukuran Kota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ukuran Kota
            </label>
            <input
              type="text"
              readOnly={statusForm}
              value={formData.ukuranKota}
              onChange={(e) => handleInputChange('ukuranKota', e.target.value)}
              placeholder="Contoh: 8,3 juta jiwa"
              className="w-full px-3 input input-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100/90 focus:border-transparent"
            />
          </div>

        </div>
        <div className="overflow-x-autos">
          <table className="w-full border border-gray-300 table table-sm">
            <tbody className='font-normal'>
              <tr>
                <td className='border border-gray-300 w-1/2'>Tanggal</td>
                <td className='border border-gray-300'>{formData.tanggal}</td>
              </tr>
              <tr>
                <td className='border border-gray-300'>Kabupaten/Kota</td>
                <td className='border border-gray-300'>{formData.kabupatenKota}</td>
              </tr>
              <tr>
                <td className='border border-gray-300'>Lokasi</td>
                <td className='border border-gray-300'>{formData.lokasi}</td>
              </tr>
              <tr>
                <td className='border border-gray-300'>Ruas Jalan Mayor</td>
                <td className='border border-gray-300'>{formData.ruasJalanMayor}</td>
              </tr>
              <tr>
                <td className='border border-gray-300'>Ruas Jalan Minor</td>
                <td className='border border-gray-300'>{formData.ruasJalanMinor}</td>
              </tr>
              <tr>
                <td className='border border-gray-300'>Ukuran Kota</td>
                <td className='border border-gray-300'>{formData.ukuranKota}</td>
              </tr>
              <tr>
                <td className='border border-gray-300'>Perihal</td>
                <td className='border border-gray-300'>{formData.perihal}</td>
              </tr>
              <tr>
                <td className='border border-gray-300'>Periode</td>
                <td className='border border-gray-300'>{formData.periode}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-md gap-5 flex flex-col">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full btn-sm btn btn-success"
          disabled={statusForm}
        >
          <span>Simpan</span>
        </button>
      </div>
      {/* <div className="w-full bg-gray-100 p-4 mt-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Log Data (Debug)</h3>
        <pre className="text-xs whitespace-pre-wrap break-all max-h-96 overflow-auto bg-white p-2 rounded border border-gray-300">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div> */}
    </div >
  );
};

export default SurveyFormSAHeader;


