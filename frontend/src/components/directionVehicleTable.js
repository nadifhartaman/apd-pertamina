"use client";
import React, { useState, useEffect } from 'react';

const AccumulatedVehicleDirectionTable = ({ Data, activePergerakan, activePendekatan }) => {
  const [vehicleData, setVehicleData] = useState(Data || {});
  const [loading, setLoading] = useState(!Data);
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [selectedTurnType, setSelectedTurnType] = useState('all');
  const [showAccumulated, setShowAccumulated] = useState(true);

  useEffect(() => {
    if (Data && typeof Data === 'object') {
      setVehicleData(Data);
      setLoading(false);
    }
  }, [Data]);

  // Process data to accumulate across all directions for each time period
  const processData = () => {
    if (!vehicleData || Object.keys(vehicleData).length === 0) return {};

    const allDirections = Object.values(vehicleData);
    const processedData = {};
    const accumData = {};

    // First pass: collect all unique periods and time slots
    allDirections.forEach(direction => {
      direction.vehicleData?.forEach(periodData => {
        const period = periodData.period;

        if (!processedData[period]) {
          processedData[period] = {
            timeSlots: []
          };
        }

        periodData.timeSlots.forEach(slot => {
          const existingSlot = processedData[period].timeSlots.find(
            existingSlot => existingSlot.time === slot.time
          );

          if (!existingSlot) {
            processedData[period].timeSlots.push({
              time: slot.time,
              data: {
                straight: { sm: 0, mp: 0, ks: 0, ktb: 0, total: 0 },
                rightTurn: { sm: 0, mp: 0, ks: 0, ktb: 0, total: 0 },
                leftTurn: { sm: 0, mp: 0, ks: 0, ktb: 0, total: 0 },
                total: { sm: 0, mp: 0, ks: 0, ktb: 0, total: 0 }
              }
            });
          }
        });
      });
    });

    // Second pass: accumulate values for each time slot
    allDirections.forEach(direction => {
      direction.vehicleData?.forEach(periodData => {
        const period = periodData.period;

        periodData.timeSlots.forEach(slot => {
          const targetSlot = processedData[period].timeSlots.find(
            targetSlot => targetSlot.time === slot.time
          );

          if (targetSlot) {
            // Accumulate straight
            targetSlot.data.straight.sm += slot.data.straight.sm || 0;
            targetSlot.data.straight.mp += slot.data.straight.mp || 0;
            targetSlot.data.straight.ks += slot.data.straight.ks || 0;
            targetSlot.data.straight.ktb += slot.data.straight.ktb || 0;
            targetSlot.data.straight.total += slot.data.straight.total || 0;

            // Accumulate right turn
            targetSlot.data.rightTurn.sm += slot.data.rightTurn.sm || 0;
            targetSlot.data.rightTurn.mp += slot.data.rightTurn.mp || 0;
            targetSlot.data.rightTurn.ks += slot.data.rightTurn.ks || 0;
            targetSlot.data.rightTurn.ktb += slot.data.rightTurn.ktb || 0;
            targetSlot.data.rightTurn.total += slot.data.rightTurn.total || 0;

            // Accumulate left turn
            targetSlot.data.leftTurn.sm += slot.data.leftTurn.sm || 0;
            targetSlot.data.leftTurn.mp += slot.data.leftTurn.mp || 0;
            targetSlot.data.leftTurn.ks += slot.data.leftTurn.ks || 0;
            targetSlot.data.leftTurn.ktb += slot.data.leftTurn.ktb || 0;
            targetSlot.data.leftTurn.total += slot.data.leftTurn.total || 0;

            // Accumulate totals
            targetSlot.data.total.sm += slot.data.total.sm || 0;
            targetSlot.data.total.mp += slot.data.total.mp || 0;
            targetSlot.data.total.ks += slot.data.total.ks || 0;
            targetSlot.data.total.ktb += slot.data.total.ktb || 0;
            targetSlot.data.total.total += slot.data.total.total || 0;
          }
        });
      });
    });

    // Create an accumulated data object that looks like the original format
    accumData.accumulated = {
      vehicleData: Object.keys(processedData).map(period => ({
        period,
        timeSlots: processedData[period].timeSlots
      }))
    };

    return accumData;
  };

  // Filter the data based on selected direction and turn type
  const getFilteredData = () => {
    const accumulatedData = processData();

    if (showAccumulated) {
      return accumulatedData.accumulated?.vehicleData || [];
    } else {
      if (selectedDirection === 'all') {
        return Object.values(vehicleData || {}).flatMap(direction =>
          direction.vehicleData || []
        );
      }
      return vehicleData[selectedDirection]?.vehicleData || [];
    }
  };

  // Generate the table rows based on the filtered data
  const generateRows = () => {
    const filteredData = getFilteredData();
    let rows = [];
    let rowCount = 0;

    filteredData.forEach((periodData, periodIndex) => {
      periodData.timeSlots.forEach((slot, timeIndex) => {
        rows.push(
          <tr key={`row-${rowCount}`} className={rowCount % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}>
            {/* Period name only on first time slot */}
            {timeIndex === 0 ? (
              <td rowSpan={periodData.timeSlots.length} className="border border-base-300 px-2 py-1 text-sm font-medium text-center align-middle">
                {periodData.period}
              </td>
            ) : null}

            {/* Direction name if showing all directions individually */}
            {!showAccumulated && selectedDirection === 'all' && (
              <td className="border border-base-300 px-2 py-1 text-sm text-center">
                {showAccumulated ? 'Akumulasi' : periodData.direction || '-'}
              </td>
            )}

            {/* Time slot */}
            <td className="border border-base-300 px-2 py-1 text-sm text-center whitespace-nowrap">
              {slot.time}
            </td>

            {/* Total counts for all vehicles */}
            <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.total.sm || ''}</td>
            <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.total.mp || ''}</td>
            <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.total.ks || ''}</td>
            <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.total.ktb || ''}</td>
            <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.total.total || ''}</td>

            {/* Straight counts */}
            {(selectedTurnType === 'all' || selectedTurnType === 'straight') && (
              <>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.straight.sm || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.straight.mp || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.straight.ks || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.straight.ktb || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.straight.total || ''}</td>
              </>
            )}

            {/* Right Turn counts */}
            {(selectedTurnType === 'all' || selectedTurnType === 'rightTurn') && (
              <>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.rightTurn.sm || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.rightTurn.mp || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.rightTurn.ks || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.rightTurn.ktb || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.rightTurn.total || ''}</td>
              </>
            )}

            {/* Left Turn counts */}
            {(selectedTurnType === 'all' || selectedTurnType === 'leftTurn') && (
              <>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.leftTurn.sm || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.leftTurn.mp || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.leftTurn.ks || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.leftTurn.ktb || ''}</td>
                <td className="border border-base-300 px-2 py-1 text-sm text-center">{slot.data.leftTurn.total || ''}</td>
              </>
            )}
          </tr>
        );

        rowCount++;
      });
    });
    return rows;
  };

  // Generate table header columns based on the selected turn type
  const generateHeaderColumns = () => {
    const columns = [];

    // Add straight columns if applicable
    if (selectedTurnType === 'all' || selectedTurnType === 'straight') {
      columns.push(
        <th key="straight-header" colSpan={5} className="border border-base-100 px-2 py-1 text-sm font-medium">
          Lurus
        </th>
      );
    }

    // Add right turn columns if applicable
    if (selectedTurnType === 'all' || selectedTurnType === 'rightTurn') {
      columns.push(
        <th key="rightTurn-header" colSpan={5} className="border border-base-100 px-2 py-1 text-sm font-medium">
          Belok Kanan
        </th>
      );
    }

    // Add left turn columns if applicable
    if (selectedTurnType === 'all' || selectedTurnType === 'leftTurn') {
      columns.push(
        <th key="leftTurn-header" colSpan={5} className="border border-base-100 px-2 py-1 text-sm font-medium">
          Belok Kiri
        </th>
      );
    }

    return columns;
  };

  // Generate table subheader columns based on the selected turn type
  const generateSubHeaderColumns = () => {
    const columns = [];

    // Add straight columns if applicable
    if (selectedTurnType === 'all' || selectedTurnType === 'straight') {
      columns.push(
        <React.Fragment key="straight-subheader">
          <th colSpan={4} className="border border-base-100 px-2 py-1 text-sm font-medium">
            Kendaraan Bermotor
          </th>
          <th rowSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
            Total
          </th>
        </React.Fragment>
      );
    }

    // Add right turn columns if applicable
    if (selectedTurnType === 'all' || selectedTurnType === 'rightTurn') {
      columns.push(
        <React.Fragment key="rightTurn-subheader">
          <th colSpan={4} className="border border-base-100 px-2 py-1 text-sm font-medium">
            Kendaraan Bermotor
          </th>
          <th rowSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
            Total
          </th>
        </React.Fragment>
      );
    }

    // Add left turn columns if applicable
    if (selectedTurnType === 'all' || selectedTurnType === 'leftTurn') {
      columns.push(
        <React.Fragment key="leftTurn-subheader">
          <th colSpan={4} className="border border-base-100 px-2 py-1 text-sm font-medium">
            Kendaraan Bermotor
          </th>
          <th rowSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
            Total
          </th>
        </React.Fragment>
      );
    }

    return columns;
  };

  // Generate vehicle type columns for each turn type
  const generateVehicleTypeColumns = () => {
    const columns = [];

    const vehicleTypes = [
      <th key="sm" className="border border-base-100 px-2 py-1 text-sm font-medium">SM</th>,
      <th key="mp" className="border border-base-100 px-2 py-1 text-sm font-medium">MP</th>,
      <th key="ks" className="border border-base-100 px-2 py-1 text-sm font-medium">KS</th>,
      <th key="ktb" className="border border-base-100 px-2 py-1 text-sm font-medium">KTB</th>
    ];

    // Add straight vehicle types
    if (selectedTurnType === 'all' || selectedTurnType === 'straight') {
      columns.push(...vehicleTypes.map((col, i) => React.cloneElement(col, { key: `straight-${i}` })));
    }

    // Add right turn vehicle types
    if (selectedTurnType === 'all' || selectedTurnType === 'rightTurn') {
      columns.push(...vehicleTypes.map((col, i) => React.cloneElement(col, { key: `rightTurn-${i}` })));
    }

    // Add left turn vehicle types
    if (selectedTurnType === 'all' || selectedTurnType === 'leftTurn') {
      columns.push(...vehicleTypes.map((col, i) => React.cloneElement(col, { key: `leftTurn-${i}` })));
    }

    return columns;
  };

  // Handle direction change
  const handleDirectionChange = (e) => {
    setSelectedDirection(e.target.value);
    if (e.target.value !== 'all') {
      setShowAccumulated(false);
    }
  };

  // Handle turn type change
  const handleTurnTypeChange = (e) => {
    setSelectedTurnType(e.target.value);
  };

  // Handle data view mode change
  const handleViewModeChange = (e) => {
    setShowAccumulated(e.target.value === 'accumulated');
    if (e.target.value === 'accumulated') {
      setSelectedDirection('all');
    }
  };
  useEffect(() => {
    let dActive = activePergerakan.toLowerCase().replace(/\s+/g,"");
    let fActive = activePendekatan.toLowerCase().replace(/\s+/g,"");
    if (dActive === "semua") {
      setSelectedTurnType("all");
    } else if (dActive === "lurus") {
      setSelectedTurnType("straight");
    } else if (dActive === "belokkanan") {
      setSelectedTurnType("rightTurn");
    } else if (dActive === "belokkiri") {
      setSelectedTurnType("leftTurn");
    }
     if (fActive === "semua") {
      setSelectedDirection("all");
      setShowAccumulated("accumulated")
      setShowAccumulated(true);
    } else if (fActive === "barat") {
      setShowAccumulated("individual")
      setSelectedDirection("west");
      setShowAccumulated(false);
    } else if (fActive === "utara") {
      setShowAccumulated("individual")
      setSelectedDirection("north");
      setShowAccumulated(false);
    } else if (fActive === "selatan") {
      setShowAccumulated("individual")
      setSelectedDirection("south");
      setShowAccumulated(false);
    } else if (fActive === "timur") {
      setShowAccumulated("individual")
      setSelectedDirection("east");
      setShowAccumulated(false);
    }

  }, [activePergerakan, activePendekatan])
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 overflow-x-auto gap-5 flex flex-col">
      <div className="w-full gap-5 flex flex-col md:flex-row">
        {/* View Mode Filter */}
        {/* <div className="form-control w-full md:w-1/4">
          <label className="label">
            <span className="label-text font-medium">Mode Tampilan</span>
          </label>
          <select
            className="select select-bordered"
            value={showAccumulated ? 'accumulated' : 'individual'}
            onChange={handleViewModeChange}
          >
            <option value="accumulated">Akumulasi Semua Arah</option>
            <option value="individual">Per Arah</option>
          </select>
        </div> */}

        {/* Direction Filter - only shown when not accumulated */}
        {/* {!showAccumulated && (
          <div className="form-control w-full md:w-1/4">
            <label className="label">
              <span className="label-text font-medium">Arah Simpang</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedDirection}
              onChange={handleDirectionChange}
              disabled={showAccumulated}
            >
              <option value="all">Semua Arah</option>
              <option value="north">Utara</option>
              <option value="south">Selatan</option>
              <option value="east">Timur</option>
              <option value="west">Barat</option>
            </select>
          </div>
        )} */}

        {/* Turn Type Filter */}
        {/* <div className="form-control w-full md:w-1/4">
          <label className="label">
            <span className="label-text font-medium">Jenis Belok</span>
          </label>
          <select
            className="select select-bordered"
            value={selectedTurnType}
            onChange={handleTurnTypeChange}
          >
            <option value="all">Semua Jenis</option>
            <option value="straight">Lurus</option>
            <option value="rightTurn">Belok Kanan</option>
            <option value="leftTurn">Belok Kiri</option>
          </select>
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-base-300 w-full">
          <thead>
            <tr className="bg-base-300">
              <th rowSpan={3} className="border border-base-100 px-2 py-1 text-sm font-medium">
                Periode
              </th>
              {/* Direction column for individual view */}
              {!showAccumulated && selectedDirection === 'all' && (
                <th rowSpan={3} className="border border-base-100 px-2 py-1 text-sm font-medium">
                  Arah
                </th>
              )}
              <th rowSpan={3} className="border border-base-100 px-2 py-1 text-sm font-medium">
                Interval<br />15 menit
              </th>
              <th colSpan={5} className="border border-base-100 px-2 py-1 text-sm font-medium">
                Total Kendaraan Bermotor
              </th>
              {generateHeaderColumns()}
            </tr>
            <tr className="bg-base-300">
              <th colSpan={4} className="border border-base-100 px-2 py-1 text-sm font-medium">
                Kendaraan Bermotor
              </th>
              <th rowSpan={2} className="border border-base-100 px-2 py-1 text-sm font-medium">
                Total
              </th>
              {generateSubHeaderColumns()}
            </tr>
            <tr className="bg-base-300">
              <th className="border border-base-100 px-2 py-1 text-sm font-medium">SM</th>
              <th className="border border-base-100 px-2 py-1 text-sm font-medium">MP</th>
              <th className="border border-base-100 px-2 py-1 text-sm font-medium">KS</th>
              <th className="border border-base-100 px-2 py-1 text-sm font-medium">KTB</th>
              {generateVehicleTypeColumns()}
            </tr>
          </thead>
          <tbody>
            {generateRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccumulatedVehicleDirectionTable;