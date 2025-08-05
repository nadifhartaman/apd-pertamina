import React, { useEffect } from 'react';
import {
  HiArrowUp,
  HiArrowDown,
  HiArrowLeft,
  HiArrowRight,
  HiArrowTurnRightUp,
  HiOutlineArrowTurnRightDown,
  HiOutlineArrowTurnLeftUp,
} from 'react-icons/hi2';

export const SketsaAPILL = ({ directions, currentPhase = 'fase_1' }) => {
  // Fungsi untuk mendapatkan warna berdasarkan status fase
  const getArrowColor = (direction, movement, phase) => {
    const directionData = directions[direction];
    if (!directionData) return 'text-gray-300';

    // Cek apakah fase aktif
    const isPhaseActive = directionData.fase[phase];

    // Cek apakah arah movement aktif
    const isMovementActive = directionData.arah[movement];

    // Untuk BKIJT (belok kiri jalan terus), selalu hijau jika tersedia
    if (movement === 'bkijt' && isMovementActive === true) {
      return 'text-green-500';
    }

    // Untuk movement lainnya, ikuti logika fase
    if (isPhaseActive && isMovementActive) {
      return 'text-green-500'; // Hijau untuk aktif
    } else if (isMovementActive) {
      return 'text-red-500'; // Merah untuk tidak aktif tapi tersedia
    } else {
      return 'text-gray-300'; // Abu-abu untuk tidak tersedia
    }
  };

  // Fungsi untuk menentukan movement belok kiri yang akan ditampilkan
  const getBelokKiriMovement = (direction) => {
    const directionData = directions[direction];
    if (!directionData) return null;

    // Prioritas jika ada BKIJT Jika tidak tampilkan BKI
    if (directionData.arah.bkijt) {
      return 'bkijt';
    } else if (directionData.arah.bki) {
      return 'bki';
    }
    return 'bki';
  };

  // Fungsi untuk mendapatkan ikon panah berdasarkan arah dan gerakan
  const getArrowIcon = (direction, movement, size = 20) => {
    const color = getArrowColor(direction, movement, currentPhase);

    if (direction === 'utara') {
      if (movement === 'lurus') return <HiArrowDown size={size} className={color} />;
      if (movement === 'bki' || movement === 'bkijt') return <HiOutlineArrowTurnLeftUp className={`rotate-y-180 rotate-90 scale-90 ${color}`} size={size} />;
      if (movement === 'bka') return <HiOutlineArrowTurnLeftUp className={`rotate-90 -scale-90 ${color}`} size={size} />;
    }

    if (direction === 'selatan') {
      if (movement === 'lurus') return <HiArrowUp size={size} className={color} />;
      if (movement === 'bki' || movement === 'bkijt') return <HiOutlineArrowTurnLeftUp className={`rotate-y-45 rotate-90 -scale-y-90 ${color}`} size={size} />;
      if (movement === 'bka') return <HiOutlineArrowTurnLeftUp className={`rotate-y-45 rotate-90 ${color}`} size={size} />;
    }

    if (direction === 'timur') {
      if (movement === 'lurus') return <HiArrowLeft size={size} className={color} />;
      if (movement === 'bki' || movement === 'bkijt') return <HiOutlineArrowTurnLeftUp size={size} className={`-scale-y-90 ${color}`} />;
      if (movement === 'bka') return <HiOutlineArrowTurnLeftUp className={` ${color}`} size={size} />;
    }

    if (direction === 'barat') {
      if (movement === 'lurus') return <HiArrowRight size={size} className={color} />;
      if (movement === 'bki' || movement === 'bkijt') return <HiOutlineArrowTurnRightDown className={`rotate-x-180 ${color}`} size={size} />;
      if (movement === 'bka') return <HiOutlineArrowTurnRightDown className={`${color}`} size={size} />;
    }

    return null;
  };
  useEffect(() => { console.log(directions['barat']) }, [directions])

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
      {/* <h3 className="text-sm font-medium mb-2">Sketsa Fase APILL - {currentPhase.replace('_', ' ').toUpperCase()}</h3> */}

      <div className="relative w-40 h-40 bg-white border-2 border-gray-300 rounded-lg">
        {/* Intersection center */}

        {/* Utara - Top */}
        {directions['utara'] && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1">
            <div className="text-xs font-semibold text-gray-700">U</div>
            <div className="flex space-x-1">
              {getArrowIcon('utara', 'bka', 20)}
              {getArrowIcon('utara', 'lurus', 20)}
              {getBelokKiriMovement('utara') && getArrowIcon('utara', getBelokKiriMovement('utara'), 20)}
            </div>
            <div className="text-xs text-gray-500">
              {directions.utara?.tipe_pendekat?.terlindung && 'P'}
              {directions.utara?.tipe_pendekat?.terlawan && 'O'}
            </div>
          </div>
        )}

        {/* Selatan - Bottom */}
        {directions['selatan'] && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1">
            <div className="text-xs text-gray-500">
              {directions.selatan?.tipe_pendekat?.terlindung && 'P'}
              {directions.selatan?.tipe_pendekat?.terlawan && 'O'}
            </div>
            <div className="flex space-x-1">
              {getBelokKiriMovement('selatan') && getArrowIcon('selatan', getBelokKiriMovement('selatan'), 20)}
              {getArrowIcon('selatan', 'lurus', 20)}
              {getArrowIcon('selatan', 'bka', 20)}
            </div>
            <div className="text-xs font-semibold text-gray-700">S</div>
          </div>
        )}
        
        {/* Timur - Right */}
        {directions["timur"] && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-1">
            <div className="flex gap-1">
              <div className="flex flex-col space-y-1">
                {getArrowIcon('timur', 'bka', 20)}
                {getArrowIcon('timur', 'lurus', 20)}
                {getBelokKiriMovement('timur') && getArrowIcon('timur', getBelokKiriMovement('timur'), 20)}
              </div>
              <div className="text-xs text-gray-500">
                {directions.timur?.tipe_pendekat?.terlindung && 'P'}
                {directions.timur?.tipe_pendekat?.terlawan && 'O'}
              </div>
              <div className="text-xs font-semibold text-gray-700 m-auto">T</div>
            </div>
          </div>
        )}

        {/* Barat - Left */}
        {directions["barat"] && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-1">
            <div className="flex gap-1">
              <div className="text-xs font-semibold text-gray-700 text-center m-auto">B</div>
              <div className="flex flex-col space-y-1">
                {getBelokKiriMovement('barat') && getArrowIcon('barat', getBelokKiriMovement('barat'), 20)}
                {getArrowIcon('barat', 'lurus', 20)}
                {getArrowIcon('barat', 'bka', 20)}
              </div>
              <div className="text-xs text-gray-500">
                {directions.barat?.tipe_pendekat?.terlindung && 'P'}
                {directions.barat?.tipe_pendekat?.terlawan && 'O'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {/* <div className="mt-4 text-[12px] text-gray-600 space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Aktif (Hijau)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Tidak Aktif (Merah)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span>Tidak Tersedia</span>
        </div>
      </div> */}
    </div>
  );
};