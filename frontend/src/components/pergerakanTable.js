// "use client";

// import { useState, useEffect } from "react";

// const DirectionTable = ({ vehicleData, classification, activePergerakan, activePendekatan }) => {

//   const generateRowsForAllDirections = () => {
//     // For "Semua" direction, we need to expect the API returns separate data for each direction
//     // But based on your API response, it seems to return a single array
//     // This function might need to be called with different API calls for each direction

//     if (!vehicleData || typeof vehicleData !== 'object') {
//       console.log('vehicleData tidak valid:', vehicleData);
//       return (
//         <tr>
//           <td colSpan="17" className="text-center py-4">
//             Data tidak tersedia
//           </td>
//         </tr>
//       );
//     }

//     let rows = [];
//     let rowCount = 0;

//     const directions = ['belok_kiri', 'lurus', 'belok_kanan'];

//     // Check if vehicleData has direction-specific data
//     let referenceData = null;
//     for (const direction of directions) {
//       if (vehicleData[direction] && Array.isArray(vehicleData[direction]) && vehicleData[direction].length > 0) {
//         referenceData = vehicleData[direction];
//         break;
//       }
//     }

//     if (!referenceData) {
//       console.log('Tidak ada data referensi yang valid untuk semua arah');
//       return (
//         <tr>
//           <td colSpan="17" className="text-center py-4">
//             Data untuk semua arah tidak tersedia. Silakan pilih arah spesifik.
//           </td>
//         </tr>
//       );
//     }

//     referenceData.forEach((periodData, periodIndex) => {
//       if (!periodData || !periodData.timeSlots || !Array.isArray(periodData.timeSlots)) {
//         console.log(`Data periode ${periodIndex} tidak valid:`, periodData);
//         return;
//       }

//       periodData.timeSlots.forEach((slot, timeIndex) => {
//         if (!slot || !slot.time) {
//           console.log(`Slot ${timeIndex} pada periode ${periodIndex} tidak valid:`, slot);
//           return;
//         }

//         rows.push(
//           <tr key={`row-${periodIndex}-${timeIndex}`} className={rowCount % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}>
//             {timeIndex === 0 && (
//               <td
//                 rowSpan={periodData.timeSlots.length}
//                 className="border-r border-t border-b border-base-300 px-2 py-1 text-xs font-medium text-center align-middle"
//               >
//                 {periodData.period || `Periode ${periodIndex + 1}`}
//               </td>
//             )}

//             <td className="border border-base-300 px-2 py-1 text-xs text-center whitespace-nowrap">
//               {slot.time}
//             </td>

//             {/* Belok Kiri columns */}
//             {renderDirectionColumns(vehicleData.belok_kiri, periodIndex, timeIndex, 'belok_kiri')}

//             {/* Lurus columns */}
//             {renderDirectionColumns(vehicleData.lurus, periodIndex, timeIndex, 'lurus')}

//             {/* Belok Kanan columns */}
//             {renderDirectionColumns(vehicleData.belok_kanan, periodIndex, timeIndex, 'belok_kanan')}
//           </tr>
//         );
//         rowCount++;
//       });

//       if (periodIndex === 2) {
//         rows.push(
//           <tr key={`divider-${periodIndex}`}>
//             <td
//               colSpan="17"
//               className="border border-base-300 font-semibold px-2 py-1 text-xs text-center bg-base-200"
//             >
//               Lalu Lintas Jam-Jaman Rata-Rata 4 x VR (omit teringgi) (kend/jam)
//             </td>
//           </tr>
//         );
//       }
//     });

//     return rows.length > 0 ? rows : (
//       <tr>
//         <td colSpan="17" className="text-center py-4">
//           Tidak ada data untuk ditampilkan
//         </td>
//       </tr>
//     );
//   };

//   const renderDirectionColumns = (directionData, periodIndex, timeIndex, direction) => {
//     let slotData = { sm: 0, mp: 0, ks: 0, ktb: 0, total: 0 };

//     try {
//       if (directionData && 
//           Array.isArray(directionData) && 
//           directionData[periodIndex] && 
//           directionData[periodIndex].timeSlots && 
//           Array.isArray(directionData[periodIndex].timeSlots) &&
//           directionData[periodIndex].timeSlots[timeIndex] &&
//           directionData[periodIndex].timeSlots[timeIndex].data) {

//         const data = directionData[periodIndex].timeSlots[timeIndex].data;
//         slotData = {
//           sm: Number(data.sm) || 0,
//           mp: Number(data.mp) || 0,
//           ks: Number(data.ks || data.aup) || 0,
//           ktb: Number(data.ktb) || 0,
//           total: Number(data.total) || 0
//         };
//       }
//     } catch (error) {
//       console.error(`Error mengakses data untuk ${direction} pada periode ${periodIndex}, slot ${timeIndex}:`, error);
//     }

//     return (
//       <>
//         <td className="border border-base-300 px-2 py-1 text-xs text-center">
//           {slotData.sm}
//         </td>
//         <td className="border border-base-300 px-2 py-1 text-xs text-center">
//           {slotData.mp}
//         </td>
//         <td className="border border-base-300 px-2 py-1 text-xs text-center">
//           {slotData.ks}
//         </td>
//         <td className="border border-base-300 px-2 py-1 text-xs text-center">
//           {slotData.ktb}
//         </td>
//         <td className="border border-base-300 px-2 py-1 text-xs text-center font-medium">
//           {slotData.total}
//         </td>
//       </>
//     );
//   };

//   const generateRowsForSingleDirection = () => {
//     // Handle the actual API response structure
//     console.log('Processing single direction data:', vehicleData);

//     if (!vehicleData || !Array.isArray(vehicleData) || vehicleData.length === 0) {
//       console.log('vehicleData single direction tidak valid:', vehicleData);
//       return (
//         <tr>
//           <td colSpan="7" className="text-center py-4">
//             Data tidak tersedia
//           </td>
//         </tr>
//       );
//     }

//     let rows = [];
//     let rowCount = 0;

//     vehicleData.forEach((periodData, periodIndex) => {
//       if (!periodData || !periodData.timeSlots || !Array.isArray(periodData.timeSlots)) {
//         console.log(`Data periode ${periodIndex} tidak valid:`, periodData);
//         return;
//       }

//       periodData.timeSlots.forEach((slot, timeIndex) => {
//         if (!slot || !slot.time || !slot.data) {
//           console.log(`Slot ${timeIndex} pada periode ${periodIndex} tidak valid:`, slot);
//           return;
//         }

//         // Calculate total if not provided
//         const data = slot.data;
//         const calculatedTotal = data.total || (
//           (Number(data.sm) || 0) + 
//           (Number(data.mp) || 0) + 
//           (Number(data.aup) || Number(data.ks) || 0) + 
//           (Number(data.ktb) || 0)
//         );

//         rows.push(
//           <tr key={`row-${periodIndex}-${timeIndex}`} className={rowCount % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'}>
//             {timeIndex === 0 && (
//               <td
//                 rowSpan={periodData.timeSlots.length}
//                 className="border-r border-t border-b border-gray-300 px-2 py-1 text-xs font-medium text-center align-middle"
//               >
//                 {periodData.period || `Periode ${periodIndex + 1}`}
//               </td>
//             )}

//             <td className="border border-gray-300 px-2 py-1 text-xs text-center whitespace-nowrap">
//               {slot.time}
//             </td>

//             {/* Vehicle type columns based on API response */}
//             <td className="border border-gray-300 px-2 py-1 text-xs text-center">
//               {Number(data.sm) || 0}
//             </td>
//             <td className="border border-gray-300 px-2 py-1 text-xs text-center">
//               {Number(data.mp) || 0}
//             </td>
//             <td className="border border-gray-300 px-2 py-1 text-xs text-center">
//               {Number(data.aup) || Number(data.ks) || 0}
//             </td>
//             <td className="border border-gray-300 px-2 py-1 text-xs text-center">
//               {Number(data.ktb) || 0}
//             </td>
//             <td className="border border-gray-300 px-2 py-1 text-xs text-center font-medium bg-blue-50">
//               {calculatedTotal}
//             </td>
//           </tr>
//         );
//         rowCount++;
//       });

//       // Add summary rows or dividers as needed
//       if (periodIndex < vehicleData.length - 1) {
//         // Add a subtle divider between periods
//         rows.push(
//           <tr key={`divider-${periodIndex}`} className="bg-gray-300">
//             <td colSpan="7" className="h-1"></td>
//           </tr>
//         );
//       }
//     });

//     return rows.length > 0 ? rows : (
//       <tr>
//         <td colSpan="7" className="text-center py-4">
//           Tidak ada data untuk ditampilkan
//         </td>
//       </tr>
//     );
//   };

//   const renderTableHeader = () => {
//     if (activePergerakan === 'Semua') {
//       return (
//         <thead>
//           <tr>
//             <th rowSpan="2" className="border border-gray-300 p-2 text-xs bg-gray-200 font-medium">Periode</th>
//             <th rowSpan="2" className="border border-gray-300 p-2 text-xs bg-gray-200 font-medium">Waktu<br/>Interval<br/>15 menit</th>
//             <th colSpan="5" className="border border-gray-300 p-2 text-xs bg-gray-200 font-medium">Belok Kiri</th>
//             <th colSpan="5" className="border border-gray-300 p-2 text-xs bg-gray-200 font-medium">Lurus</th>
//             <th colSpan="5" className="border border-gray-300 p-2 text-xs bg-gray-200 font-medium">Belok Kanan</th>
//           </tr>
//           <tr>
//             {/* Belok Kiri sub-headers */}
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">SM</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">MP</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">KS/AUP</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">KTB</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">Total</th>

//             {/* Lurus sub-headers */}
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">SM</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">MP</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">KS/AUP</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">KTB</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">Total</th>

//             {/* Belok Kanan sub-headers */}
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">SM</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">MP</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">KS/AUP</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">KTB</th>
//             <th className="border border-gray-300 p-1 text-xs bg-gray-200 font-medium">Total</th>
//           </tr>
//         </thead>
//       );
//     } else {
//       // Single direction header
//       const directionColors = {
//         'Belok Kiri': 'bg-blue-100',
//         'Lurus': 'bg-gray-100', 
//         'Belok Kanan': 'bg-gray-100'
//       };

//       const headerColor = directionColors[activePergerakan] || 'bg-gray-100';

//       return (
//         <thead>
//           <tr>
//             <th rowSpan="2" className="border border-gray-300 p-2 text-xs bg-gray-100">Periode</th>
//             <th rowSpan="2" className="border border-gray-300 p-2 text-xs bg-gray-100">Waktu<br/>Interval<br/>15 menit</th>
//             <th colSpan="5" className={`border border-gray-300 p-2 text-xs ${headerColor}`}>
//               {activePergerakan}
//             </th>
//           </tr>
//           <tr>
//             <th className="border border-gray-300 p-1 text-xs">SM</th>
//             <th className="border border-gray-300 p-1 text-xs">MP</th>
//             <th className="border border-gray-300 p-1 text-xs">KS/AUP</th>
//             <th className="border border-gray-300 p-1 text-xs">KTB</th>
//             <th className="border border-gray-300 p-1 text-xs font-medium bg-blue-50">Total</th>
//           </tr>
//         </thead>
//       );
//     }
//   };

//   // Debug logging
//   useEffect(() => {
//     console.log('=== DirectionTable Debug ===');
//     console.log('vehicleData:', vehicleData);
//     console.log('activePergerakan:', activePergerakan);
//     console.log('activePendekatan:', activePendekatan);
//     console.log('vehicleData type:', typeof vehicleData);
//     console.log('vehicleData isArray:', Array.isArray(vehicleData));

//     if (Array.isArray(vehicleData) && vehicleData.length > 0) {
//       console.log('First period:', vehicleData[0]);
//       if (vehicleData[0]?.timeSlots?.length > 0) {
//         console.log('First time slot:', vehicleData[0].timeSlots[0]);
//       }
//     }
//   }, [vehicleData, activePergerakan, activePendekatan]);

//   return (
//     <div className="w-full overflow-x-auto bg-white shadow-sm my-2">
//       <table className="w-full border-collapse border border-gray-300">
//         {renderTableHeader()}
//         <tbody>
//           {activePergerakan === 'Semua' 
//             ? generateRowsForAllDirections()
//             : generateRowsForSingleDirection()
//           }
//         </tbody>
//       </table>

//       {/* Debug info - remove in production */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="mt-4 p-2 bg-gray-100 text-xs">
//           <strong>Debug Info:</strong><br/>
//           Active Direction: {activePergerakan}<br/>
//           Data Type: {typeof vehicleData}<br/>
//           Is Array: {Array.isArray(vehicleData).toString()}<br/>
//           Data Length: {Array.isArray(vehicleData) ? vehicleData.length : 'N/A'}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DirectionTable;

"use client";
import { useState, useEffect } from "react";

const DirectionTable = ({ vehicleData, classification, activePergerakan, activePendekatan }) => {

  const generateRowsForAllDirections = () => {
    // For "Semua" direction, we need to expect the API returns separate data for each direction
    // But based on your API response, it seems to return a single array
    // This function might need to be called with different API calls for each direction

    if (!vehicleData || typeof vehicleData !== 'object') {
      return (
        <tr>
          <td colSpan={22} className="text-center py-4">
            Data tidak tersedia
          </td>
        </tr>
      );
    }

    let rows = [];
    let rowCount = 0;

    const directions = ['timur', 'barat', 'utara', 'selatan'];

    // Check if vehicleData has direction-specific data
    let referenceData = null;
    for (const direction of directions) {
      if (vehicleData[direction] && Array.isArray(vehicleData[direction]) && vehicleData[direction].length > 0) {
        referenceData = vehicleData[direction];
        break;
      }
    }

    if (!referenceData) {
      // console.log('Tidak ada data referensi yang valid untuk semua arah');
      return (
        <tr>
          <td colSpan="17" className="text-center py-4">
            Data untuk semua arah tidak tersedia. Silakan pilih arah spesifik.
          </td>
        </tr>
      );
    }

    referenceData.forEach((periodData, periodIndex) => {
      if (!periodData || !periodData.timeSlots || !Array.isArray(periodData.timeSlots)) {
        console.log(`Data periode ${periodIndex} tidak valid:`, periodData);
        return;
      }

      periodData.timeSlots.forEach((slot, timeIndex) => {
        if (!slot || !slot.time) {
          console.log(`Slot ${timeIndex} pada periode ${periodIndex} tidak valid:`, slot);
          return;
        }

        rows.push(
          <tr key={`row-${periodIndex}-${timeIndex}`} className={rowCount % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}>
            {timeIndex === 0 && (
              <td
                rowSpan={periodData.timeSlots.length}
                className="border-base-300 px-2 py-1 text-xs font-medium text-center align-middle"
              >
                {periodData.period || `Periode ${periodIndex + 1}`}
              </td>
            )}

            <td className="border border-base-300 px-2 py-1 text-xs text-center whitespace-nowrap">
              {slot.time}
            </td>

            {renderDirectionColumns(vehicleData.timur, periodIndex, timeIndex, 'timur')}
            {renderDirectionColumns(vehicleData.barat, periodIndex, timeIndex, 'barat')}
            {renderDirectionColumns(vehicleData.utara, periodIndex, timeIndex, 'utara')}
            {renderDirectionColumns(vehicleData.selatan, periodIndex, timeIndex, 'selatan')}

          </tr>
        );
        rowCount++;
      });

      if (periodIndex === 2) {
        rows.push(
          <tr key={`divider-${periodIndex}`}>
            <td
              colSpan={22}
              className="border border-base-300 font-semibold px-2 py-1 text-xs text-center bg-base-200"
            >
              Lalu Lintas Jam-Jaman Rata-Rata 4 x VR (omit teringgi) (kend/jam)
            </td>
          </tr>
        );
      }
    });

    return rows.length > 0 ? rows : (
      <tr>
        <td colSpan={22} className="text-center py-4">
          Tidak ada data untuk ditampilkan
        </td>
      </tr>
    );
  };

  const renderDirectionColumns = (directionData, periodIndex, timeIndex, direction) => {
    let slotData = { sm: 0, mp: 0, ks: 0, ktb: 0, total: 0 };

    try {
      if (directionData &&
        Array.isArray(directionData) &&
        directionData[periodIndex] &&
        directionData[periodIndex].timeSlots &&
        Array.isArray(directionData[periodIndex].timeSlots) &&
        directionData[periodIndex].timeSlots[timeIndex] &&
        directionData[periodIndex].timeSlots[timeIndex].data) {

        const data = directionData[periodIndex].timeSlots[timeIndex].data;
        slotData = {
          sm: Number(data.sm) || 0,
          mp: Number(data.mp) || 0,
          ks: Number(data.ks || data.aup) || 0,
          ktb: Number(data.ktb) || 0,
          total: Number(data.total) || 0
        };
      }
    } catch (error) {
      console.error(`Error mengakses data untuk ${direction} pada periode ${periodIndex}, slot ${timeIndex}:`, error);
    }

    return (
      <>
        <td className="border border-base-300 px-2 py-1 text-xs text-center">
          {slotData.sm}
        </td>
        <td className="border border-base-300 px-2 py-1 text-xs text-center">
          {slotData.mp}
        </td>
        <td className="border border-base-300 px-2 py-1 text-xs text-center">
          {slotData.ks}
        </td>
        <td className="border border-base-300 px-2 py-1 text-xs text-center">
          {slotData.ktb}
        </td>
        <td className="border border-base-300 px-2 py-1 text-xs text-center font-medium">
          {slotData.total}
        </td>
      </>
    );
  };

  const generateRowsForSingleDirection = () => {
    // Handle the actual API response structure
    console.log('Processing single direction data:', vehicleData);

    if (!vehicleData || !Array.isArray(vehicleData) || vehicleData.length === 0) {
      console.log('vehicleData single direction tidak valid:', vehicleData);
      return (
        <tr>
          <td colSpan="7" className="text-center py-4">
            Data tidak tersedia
          </td>
        </tr>
      );
    }

    let rows = [];
    let rowCount = 0;

    vehicleData.forEach((periodData, periodIndex) => {
      if (!periodData || !periodData.timeSlots || !Array.isArray(periodData.timeSlots)) {
        console.log(`Data periode ${periodIndex} tidak valid:`, periodData);
        return;
      }

      periodData.timeSlots.forEach((slot, timeIndex) => {
        if (!slot || !slot.time || !slot.data) {
          console.log(`Slot ${timeIndex} pada periode ${periodIndex} tidak valid:`, slot);
          return;
        }

        // Calculate total if not provided
        const data = slot.data;
        const calculatedTotal = data.total || (
          (Number(data.sm) || 0) +
          (Number(data.mp) || 0) +
          (Number(data.aup) || Number(data.ks) || 0) +
          (Number(data.ktb) || 0)
        );

        rows.push(
          <tr key={`row-${periodIndex}-${timeIndex}`} className={rowCount % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}>
            {timeIndex === 0 && (
              <td
                rowSpan={periodData.timeSlots.length}
                className="border-r border-t border-b border-gray-300 px-2 py-1 text-xs font-medium text-center align-middle"
              >
                {periodData.period || `Periode ${periodIndex + 1}`}
              </td>
            )}

            <td className="border border-gray-300 px-2 py-1 text-xs text-center whitespace-nowrap">
              {slot.time}
            </td>

            {/* Vehicle type columns based on API response */}
            <td className="border border-gray-300 px-2 py-1 text-xs text-center">
              {Number(data.sm) || 0}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-center">
              {Number(data.mp) || 0}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-center">
              {Number(data.aup) || Number(data.ks) || 0}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-center">
              {Number(data.ktb) || 0}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-center font-medium bg-blue-50">
              {calculatedTotal}
            </td>
          </tr>
        );
        rowCount++;
      });

      // Add summary rows or dividers as needed
      if (periodIndex < vehicleData.length - 1) {
        // Add a subtle divider between periods
        rows.push(
          <tr key={`divider-${periodIndex}`} className="bg-gray-300">
            <td colSpan="7" className="h-1"></td>
          </tr>
        );
      }
    });

    return rows.length > 0 ? rows : (
      <tr>
        <td colSpan="7" className="text-center py-4">
          Tidak ada data untuk ditampilkan
        </td>
      </tr>
    );
  };

  const renderTableHeader = () => {
    if (activePergerakan === 'Semua') {
      return (
        <thead>
          <tr>
            <th rowSpan={3} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Periode</th>
            <th rowSpan={3} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Waktu<br />Interval<br />15 menit</th>
            <th colSpan={5} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Timur</th>
            <th colSpan={5} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Barat</th>
            <th colSpan={5} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Utara</th>
            <th colSpan={5} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Selatan</th>
          </tr>
          <tr>
            {/* Timur */}
            <th colSpan={3} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Kendaraan Bermotor</th>
            <th className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Kend. Tak<br />Bermotor</th>
            <th rowSpan={2} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Total</th>

            {/* Barat */}
            <th colSpan={3} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Kendaraan Bermotor</th>
            <th className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Kend. Tak<br />Bermotor</th>
            <th rowSpan={2} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Total</th>

            {/* Utara */}
            <th colSpan={3} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Kendaraan Bermotor</th>
            <th className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Kend. Tak<br />Bermotor</th>
            <th rowSpan={2} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Total</th>

            {/* Selatan */}
            <th colSpan={3} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Kendaraan Bermotor</th>
            <th className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Kend. Tak<br />Bermotor</th>
            <th rowSpan={2} className="border border-base-300 p-2 text-xs bg-base-200 font-medium">Total</th>
          </tr>

          <tr>
            {/* Timur sub-headers */}
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">SM</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">MP</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">KS/AUP</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">KTB</th>
            {/* <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">Total</th> */}

            {/* Barat sub-headers */}
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">SM</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">MP</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">KS/AUP</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">KTB</th>
            {/* <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">Total</th> */}

            {/* Utara sub-headers */}
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">SM</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">MP</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">KS/AUP</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">KTB</th>
            {/* <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">Total</th> */}

            {/* Selatan sub-headers */}
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">SM</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">MP</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">KS/AUP</th>
            <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">KTB</th>
            {/* <th className="border border-base-300 p-1 text-xs bg-base-200 font-medium">Total</th> */}
          </tr>
        </thead>
      );
    } else {
      // Single direction header
      const directionColors = {
        'timur': 'bg-gray-200',
        'barat': 'bg-gray-200',
        'selatan': 'bg-gray-200',
        'utara': 'bg-gray-200'
      };

      const headerColor = directionColors[activePergerakan.toLowerCase()] || 'bg-gray-100';

      return (
        <thead>
          <tr>
            <th rowSpan="2" className="border border-gray-300 p-2 text-xs bg-gray-100">Periode</th>
            <th rowSpan="2" className="border border-gray-300 p-2 text-xs bg-gray-100">Waktu<br />Interval<br />15 menit</th>
            <th colSpan="5" className={`border border-gray-300 p-2 text-xs ${headerColor} capitalize`}>
              {activePergerakan}
            </th>
          </tr>
          <tr>
            <th className="border border-gray-300 p-1 text-xs">SM</th>
            <th className="border border-gray-300 p-1 text-xs">MP</th>
            <th className="border border-gray-300 p-1 text-xs">KS/AUP</th>
            <th className="border border-gray-300 p-1 text-xs">KTB</th>
            <th className="border border-gray-300 p-1 text-xs font-medium bg-blue-50">Total</th>
          </tr>
        </thead>
      );
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('=== DirectionTable Debug ===');
    console.log('vehicleData:', vehicleData);
    console.log('activePergerakan:', activePergerakan);
    console.log('activePendekatan:', activePendekatan);
    console.log('vehicleData type:', typeof vehicleData);
    console.log('vehicleData isArray:', Array.isArray(vehicleData));

    if (Array.isArray(vehicleData) && vehicleData.length > 0) {
      console.log('First period:', vehicleData[0]);
      if (vehicleData[0]?.timeSlots?.length > 0) {
        console.log('First time slot:', vehicleData[0].timeSlots[0]);
      }
    }
  }, [vehicleData, activePergerakan, activePendekatan]);

  return (
    <div className="w-full overflow-x-auto bg-white my-2">
      <table className="w-full border-collapse border border-base-300 text-xs">
        {renderTableHeader()}
        <tbody>
          {activePergerakan === 'Semua'
            ? generateRowsForAllDirections()
            : generateRowsForSingleDirection()
          }
        </tbody>
      </table>

      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 text-xs">
          <strong>Debug Info:</strong><br/>
          Active Direction: {activePergerakan}<br/>
          Data Type: {typeof vehicleData}<br/>
          Is Array: {Array.isArray(vehicleData).toString()}<br/>
          Data Length: {Array.isArray(vehicleData) ? vehicleData.length : 'N/A'}
        </div>
      )} */}
    </div>
  );
};

export default DirectionTable;