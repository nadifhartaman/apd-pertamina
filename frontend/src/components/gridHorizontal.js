"use client"

import React, { useState, useEffect } from 'react';
import { HiMiniArrowTurnRightUp, HiMiniArrowTurnRightDown, HiArrowLongRight } from "react-icons/hi2";

// GridHorizontal Component for East-West routes
const GridHorizontal = ({ position, data, category = false, col }) => {
  const [displayData, setDisplayData] = useState({
    row1: [],
    row2: [],
    row3: []
  });

  const itemsPerPage = col ? col : 4;
  const typeVehicle = {
    type: ["sm", "mp", "ks", "ktb"]
  };
  useEffect(() => {
    const prepareRowData = (rowData) => {
      const processedData = rowData ? rowData.slice(0, itemsPerPage) : [];

      if (processedData.length < itemsPerPage) {
        const emptyItems = Array(itemsPerPage - processedData.length).fill().map((_, i) => ({
          id: `empty-${i}`,
          content: "---"
        }));
        return [...processedData, ...emptyItems];
      }

      return processedData;
    };

    setDisplayData({
      row1: prepareRowData(data?.row1 || []),
      row2: prepareRowData(data?.row2 || []),
      row3: prepareRowData(data?.row3 || [])
    });
  }, [data]);

  return (
    <div className={`h-34   ${col ? 'min-w-24' : 'w-40'} justify-evenly flex flex-col bg-stone-300 text-xs relative`}>
      {/* Row 1 - Up Arrow */}
      <div className={`flex items-center ${!position ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`grid ${col ? 'grid-cols-' + col + ' ' : 'grid-cols-4'} flex-grow`}>
          {(position ? [...displayData.row2].reverse() : displayData.row2).map((item) => (
            <div key={item.id} className="p-2 text-center text-xs overflow-hidden truncate">
              {item.content}
            </div>
          ))}
        </div>
        <div className="p-1">
          <HiMiniArrowTurnRightUp className={`text-lg ${!position ? 'transform rotate-180 scale-y-[-1]' : ''}`} />
        </div>
      </div>

      {/* Row 2 - Right Arrow */}
      <div className={`items-center flex ${!position ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`grid ${col ? 'grid-cols-' + col + ' ' : 'grid-cols-4'} flex-grow`}>
          {(position ? [...displayData.row2].reverse() : displayData.row2).map((item) => (
            <div key={item.id} className="p-2 text-center text-xs overflow-hidden truncate">
              {item.content}
            </div>
          ))}
        </div>
        <div className={`p-1 items-center flex ${!position ? 'transform rotate-180' : ''}`}>
          <HiArrowLongRight className="text-lg" />
        </div>
      </div>

      {/* Row 3 - Down Arrow */}
      <div className={`items-center flex ${!position ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`grid ${col ? 'grid-cols-' + col + ' ' : 'grid-cols-4'} flex-grow`}>
          {(position ? [...displayData.row2].reverse() : displayData.row2).map((item) => (
            <div key={item.id} className="p-2 text-center text-xs overflow-hidden truncate">
              {item.content}
            </div>
          ))}
        </div>
        <div className="p-1 items-center">
          <HiMiniArrowTurnRightDown className={`text-lg ${!position ? 'transform rotate-180 scale-y-[-1]' : ''}`} />
        </div>
      </div>

      {category && (
        typeVehicle.type.map((item, index) => (
          <div
            key={index}
            className={`absolute uppercase ${position ? '-top-8 mr-8' : '-bottom-8 ml-8'}`}
            style={{
              [!position ? 'left' : 'right']: `${index * 30}px`
            }}
          >
            {item}
          </div>
        )))}
      <div
        className={`absolute uppercase ml-10`}
        style={{
          [position ? 'bottom' : 'top']: '-40px'
        }}
      >
        Jl. ({position ? "T" : "B"})
      </div>
    </div>
  );
}

export default GridHorizontal;