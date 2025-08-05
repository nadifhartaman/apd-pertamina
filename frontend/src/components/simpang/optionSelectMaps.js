"use client"
import { useEffect, useState } from 'react';
import { maps, cameras } from '@/lib/apiService';
import { FaAngleDown, FaMapMarkerAlt, FaSortAmountDown, FaSortAmountUp, FaCalendarAlt, FaTimes } from "react-icons/fa";

// Komponen Dropdown
const Dropdown = ({ isOpen, onToggle, label, children, className = "" }) => (
  <div className={`relative ${className}`}>
    <div
      className="rounded-xl text-xs w-fit shadow-xs bg-base-100/90 flex justify-end p-1 cursor-pointer"
      onClick={onToggle}
    >
      <button className="btn btn-xs btn-ghost text-xs bg-transparent border-none hover:shadow-none flex items-center gap-3 font-semibold">
        {label}
        <FaAngleDown className={`${isOpen ? "rotate-180" : ""} text-neutral-600`} />
      </button>
    </div>
    {isOpen && (
      <div className="absolute left-0 top-8 mt-2 w-64 rounded-xl shadow-xs bg-base-100/90 z-10">
        <div className="py-2">{children}</div>
      </div>
    )}
  </div>
);

// Komponen DropdownItem
const DropdownItem = ({ label, icon, onClick, bold }) => (
  <button
    onClick={onClick}
    className={`btn btn-ghost text-xs btn-sm btn-block justify-start rounded-none ${bold ? "font-semibold" : "font-normal"}`}
  >
    {icon && <span className="mr-3">{icon}</span>}
    {label}
  </button>
);

// Komponen Date Picker
const DatePicker = ({ selectedDate, onDateChange, onClearDate }) => (
  <div className="p-3 border-b border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-semibold text-gray-600">Pilih Tanggal:</label>
      {selectedDate && (
        <button
          onClick={onClearDate}
          className="btn btn-xs btn-ghost text-red-500 hover:bg-red-50"
          title="Clear date"
        >
          <FaTimes />
        </button>
      )}
    </div>
    <input
      type="date"
      value={selectedDate || ''}
      onChange={(e) => onDateChange(e.target.value)}
      className="input input-xs w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
    />
  </div>
);

// Komponen utama
const OptionSelectMaps = ({ onSelect, onDateSelect }) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [camerasData, setCamerasData] = useState([]);
  // const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState([]);

  // Fungsi untuk menggabungkan data
  const combineData = (buildings, camerasData) => {
    const result = buildings.filter(b => b.latitude != null && b.longitude != null).map(building => {
      const relatedCameras = camerasData.filter(camera => camera.ID_Simpang === building.id);

      return {
        ...building,
        latitude: building.latitude ? parseFloat(building.latitude) : null,
        longitude: building.longitude ? parseFloat(building.longitude) : null,
        cameras: relatedCameras || [],
      };
    });
    return result;
  };

  // Fungsi untuk sorting berdasarkan tanggal
  // const sortBuildingsByDate = (buildings, order) => {
  //   return [...buildings].sort((a, b) => {
  //     // Sesuaikan dengan field tanggal yang ada di data Anda
  //     const dateA = new Date(a.created_at || a.updated_at || a.tanggal || 0);
  //     const dateB = new Date(b.created_at || b.updated_at || b.tanggal || 0);

  //     if (order === 'newest') {
  //       return dateB - dateA; // Terbaru ke terlama
  //     } else {
  //       return dateA - dateB; // Terlama ke terbaru
  //     }
  //   });
  // };

  // Fungsi untuk filter berdasarkan tanggal
  const filterBuildingsByDate = (buildings, targetDate) => {
    if (!targetDate) return buildings;

    return buildings.filter(building => {
      // Sesuaikan dengan field tanggal yang ada di data Anda
      const buildingDate = building.created_at || building.updated_at || building.tanggal;
      if (!buildingDate) return false;

      const buildingDateOnly = new Date(buildingDate).toISOString().split('T')[0];
      return buildingDateOnly === targetDate;
    });
  };

  // Fungsi untuk memformat tanggal untuk display
  const formatDateLabel = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Effect untuk fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const camerasRes = await cameras.getAll();
        const data = camerasRes.data.cameras || [];
        setCamerasData(data);

        const buildingsRes = await maps.getAllSimpang();
        const buildingsData = buildingsRes.data.simpang || [];

        const filtered = combineData(buildingsData, data);

        console.log(filtered);
        const validation = filtered
          .map(item => ({
            ...item,
            cameras: (item.cameras || []).filter(
              cam => cam?.socket_event && cam?.socket_event !== "not_yet_assign"
            )
          }))
          .filter(item => item.cameras.length > 0); // hanya simpang yang punya kamera valid


        setBuildings(validation);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setBuildings([]);
        setCamerasData([]);
      }
    };

    fetchData();
  }, []);

  // Effect untuk filtering dan sorting
  useEffect(() => {
    if (buildings.length > 0) {
      const dateFiltered = filterBuildingsByDate(buildings, selectedDate);
      // Filter berdasarkan tanggal terlebih dahulu
      onDateSelect?.(dateFiltered)
      setFilteredBuildings(dateFiltered);
    }
  }, [buildings, selectedDate]);

  // Handler untuk mengubah sort order
  // const handleSortChange = (newSortOrder) => {
  //   setSortOrder(newSortOrder);
  //   setIsSortDropdownOpen(false);
  // };

  // Handler untuk select lokasi
  const handleLocationSelect = (building) => {
    setIsLocationDropdownOpen(false);
    onSelect?.(building);
  };

  // Handler untuk clear date
  const handleClearDate = () => {
    setSelectedDate('');
    onDateSelect?.('')
  };

  // Generate label untuk dropdown lokasi
  const getLocationDropdownLabel = () => {
    let label = "Pilih Lokasi";
    if (selectedDate) {
      label += ` (${formatDateLabel(selectedDate)})`;
    }
    if (filteredBuildings.length !== buildings.length && buildings.length > 0) {
      label += ` - ${filteredBuildings.length} lokasi`;
    }
    return label;
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Dropdown untuk filter tanggal */}
      <Dropdown
        isOpen={isDateDropdownOpen}
        onToggle={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
        label={selectedDate ? `Tanggal: ${formatDateLabel(selectedDate)}` : "Filter Tanggal"}
        className="min-w-fit"
      >
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onClearDate={handleClearDate}
        />
        <div className="px-3 py-2 text-xs text-gray-500">
          {selectedDate
            ? `Menampilkan ${filteredBuildings.length} lokasi pada tanggal ${formatDateLabel(selectedDate)}`
            : `Total ${buildings.length} lokasi tersedia`
          }
        </div>
      </Dropdown>

      {/* Dropdown untuk sorting */}
      {/* <Dropdown
        isOpen={isSortDropdownOpen}
        onToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
        label={`Sort: ${sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}`}
      >
        <DropdownItem
          label="Terbaru"
          icon={<FaSortAmountDown />}
          onClick={() => handleSortChange('newest')}
          bold={sortOrder === 'newest'}
        />
        <DropdownItem
          label="Terlama"
          icon={<FaSortAmountUp />}
          onClick={() => handleSortChange('oldest')}
          bold={sortOrder === 'oldest'}
        />
      </Dropdown> */}

      {/* Dropdown untuk pilih lokasi */}
      <Dropdown
        isOpen={isLocationDropdownOpen}
        onToggle={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
        label={getLocationDropdownLabel()}
        className="min-w-fit"
      >
        {Array.isArray(filteredBuildings) && filteredBuildings.length > 0 ? (
          filteredBuildings.map((building) => (
            <DropdownItem
              key={building.id}
              label={building.Nama_Simpang}
              icon={<FaMapMarkerAlt />}
              onClick={() => handleLocationSelect(building)}
            />
          ))
        ) : (
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400 italic">
              {selectedDate
                ? `Tidak ada lokasi pada tanggal ${formatDateLabel(selectedDate)}`
                : "Tidak ada lokasi tersedia"
              }
            </p>
            {selectedDate && (
              <button
                onClick={handleClearDate}
                className="text-xs text-blue-500 hover:text-blue-700 mt-1"
              >
                Reset filter tanggal
              </button>
            )}
          </div>
        )}
      </Dropdown>
    </div>
  );
};

export default OptionSelectMaps;