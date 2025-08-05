"use client";

import React, { useEffect, useState } from 'react';

const TrafficPhaseDiagram = ({ tableData }) => {
  // Calculate total cycle time from the data
  const calculateTotalCycle = () => {
    let maxTime = 0;
    tableData.forEach(row => {
      Object.values(row.phases).forEach(phase => {
        if (phase.whi || phase.wAll.wk || phase.wAll.wms) {
          const mf = parseInt(phase.mf) || 0;
          const whi = parseInt(phase.whi) || 0;
          const wk = parseInt(phase.wAll.wk) || 0;
          const wms = parseInt(phase.wAll.wms) || 0;
          const phaseEnd = mf + whi + wk + wms;
          maxTime = Math.max(maxTime, phaseEnd);
        }
      });
    });
    return Math.max(maxTime, 117); // Minimum based on your example
  };

  const totalCycle = calculateTotalCycle();

  const getApproachCodes = () => {
    return tableData
      .map(row => row.kodePendekat)
      .filter(code => code)
      .sort();
  };
  // Get phase data for horizontal layout
  const getPhaseData = () => {
    const phases = ['f1', 'f2', 'f3', 'f4'];
    const phaseData = {};

    phases.forEach(phaseKey => {
      phaseData[phaseKey] = {
        name: phaseKey.toUpperCase().replace('F', 'FASE '),
        approaches: []
      };

      tableData.forEach(row => {
        const phase = row.phases[phaseKey];
        if (phase && (phase.mf || phase.whi || phase.wAll.wk || phase.wAll.wms)) {
          const mf = parseInt(phase.mf) || 0;
          const whi = parseInt(phase.whi) || 0;
          const wk = parseInt(phase.wAll.wk) || 0;
          const wms = parseInt(phase.wAll.wms) || 0;

          // console.log({
          //   mf, whi, wk, wms,
          //   total: mf + whi + wk + wms
          // });

          if (mf > 0 || whi > 0 || wk > 0 || wms > 0) {
            phaseData[phaseKey].approaches.push({
              kode: row.kodePendekat,
              mf,
              whi,
              wk,
              wms,
              total: mf + whi + wk + wms
            });
          }
        }
      });
    });

    return phaseData;
  };

  const phaseData = getPhaseData();
  const activePhases = Object.keys(phaseData).filter(key => phaseData[key].approaches.length > 0);
  const dynamicApproachCodes = getApproachCodes();
  // Calculate widths for each phase
  const calculatePhaseWidths = () => {
    const widths = {};
    let totalWidth = 0;

    activePhases.forEach(phaseKey => {
      const maxTotal = Math.max(...phaseData[phaseKey].approaches.map(app => app.total));
      widths[phaseKey] = maxTotal;
      totalWidth += maxTotal;
    });

    return { widths, totalWidth };
  };

  const { widths: phaseWidths, totalWidth } = calculatePhaseWidths();

  return (
    <div className="w-full py-6 bg-white">
      <div className="mb-6">
        <h2 className="text-lg font-normal mb-2">
          Diagram Waktu Fase Lalu Lintas
        </h2>
        <p className="text-sm text-gray-600">
          {/* Visualisasi timing berurutan per fase (kiri ke kanan: U, S, T, B) */}
          Visualisasi timing berurutan per fase (Pendekat: {dynamicApproachCodes.join(', ')})
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Phase headers */}
          <div className="flex border-b-2 border-gray-300">
            <div className="w-20 text-center font-semibold py-2 border-r border-gray-300">
              Pendekat
            </div>
            {activePhases.map(phaseKey => (
              <div
                key={phaseKey}
                className="text-center font-semibold py-2 border-r border-gray-300 bg-gray-50"
                style={{
                  width: `${(phaseWidths[phaseKey] / totalWidth) * 100}%`,
                  minWidth: '120px'
                }}
              >
                {phaseData[phaseKey].name}
              </div>
            ))}
          </div>

          {/* Approach data */}
          {dynamicApproachCodes.map(approachCode => {
            const approachData = tableData.find(row => row.kodePendekat === approachCode);
            if (!approachData) return null;

            return (
              <div key={approachCode} className="flex border-b border-gray-200">
                {/* Approach code */}
                <div className="w-20 text-center font-semibold text-sm py-4 border-r border-gray-300 bg-gray-50">
                  {approachCode}
                  <div className="text-xs text-gray-600 mt-1">
                    {approachData.tipePendekat}
                  </div>
                </div>

                {/* Phase cells */}
                {activePhases.map(phaseKey => {
                  const phaseInfo = phaseData[phaseKey].approaches.find(app => app.kode === approachCode);
                  const maxPhaseTotal = phaseWidths[phaseKey];

                  return (
                    <div
                      key={phaseKey}
                      className="border-r border-gray-300 flex items-center"
                      style={{
                        width: `${(maxPhaseTotal / totalWidth) * 100}%`,
                        minWidth: '120px',
                        height: '60px'
                      }}
                    >
                      {phaseInfo ? (
                        <div className="w-full h-full flex">
                          {/* MF segment */}
                          {/* {phaseInfo.mf > 0 && (
                            <div
                              className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-r border-white"
                              style={{
                                width: `${(phaseInfo.mf / maxPhaseTotal) * 100}%`,
                                minWidth: phaseInfo.mf > 0 ? '20px' : '0px'
                              }}
                              title={`MF: ${phaseInfo.mf}s`}
                            >
                              {phaseInfo.mf > 3 && 'MF'}
                            </div>
                          )} */}

                          {/* WHI segment */}
                          {phaseInfo.whi > 0 && (
                            <div
                              className="bg-green-500 flex items-center justify-center text-white text-xs font-bold border-r border-white"
                              style={{
                                width: `${(phaseInfo.whi / maxPhaseTotal) * 100}%`,
                                minWidth: phaseInfo.whi > 0 ? '20px' : '0px'
                              }}
                              title={`WHI: ${phaseInfo.whi}s`}
                            >
                              {phaseInfo.whi > 3 && 'WHI'}
                            </div>
                          )}

                          {/* WK segment */}
                          {phaseInfo.wk > 0 && (
                            <div
                              className="bg-yellow-500 flex items-center justify-center text-white text-xs font-bold border-r border-white"
                              style={{
                                width: `${(phaseInfo.wk / maxPhaseTotal) * 100}%`,
                                minWidth: phaseInfo.wk > 0 ? '20px' : '0px'
                              }}
                              title={`WK: ${phaseInfo.wk}s`}
                            >
                              {phaseInfo.wk > 3 && 'WK'}
                            </div>
                          )}

                          {/* WMS segment */}
                          {phaseInfo.wms > 0 && (
                            <div
                              className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                              style={{
                                width: `${(phaseInfo.wms / maxPhaseTotal) * 100}%`,
                                minWidth: phaseInfo.wms > 0 ? '20px' : '0px'
                              }}
                              title={`WMS: ${phaseInfo.wms}s`}
                            >
                              {phaseInfo.wms > 3 && 'WMS'}
                            </div>
                          )}

                          {/* Fill remaining space if needed */}
                          {phaseInfo.total < maxPhaseTotal && (
                            <div
                              className="bg-gray-200"
                              style={{
                                width: `${((maxPhaseTotal - phaseInfo.total) / maxPhaseTotal) * 100}%`
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          Tidak Aktif
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Time indicators */}
          <div className="flex mt-2 text-xs text-gray-600">
            <div className="w-20"></div>
            {activePhases.map(phaseKey => (
              <div
                key={phaseKey}
                className="border-r border-gray-300 px-2"
                style={{
                  width: `${(phaseWidths[phaseKey] / totalWidth) * 100}%`,
                  minWidth: '120px'
                }}
              >
                <div className="text-center">
                  Max: {phaseWidths[phaseKey]} detik
                </div>
              </div>
            ))}
          </div>
          <div className="relative flex mt-2 h-10 text-xs text-gray-600">
            <div className="w-20"></div>
            {activePhases.map(phaseKey => (
              <div
                key={phaseKey}
                className="relative px-2"
                style={{
                  width: `${(phaseWidths[phaseKey] / totalWidth) * 100}%`,
                  minWidth: '120px'
                }}
              >
                {/* Tampilkan mf dari setiap pendekat dalam fase ini */}
                {phaseData[phaseKey].approaches.map(app => (
                  <div key={app.kode} className="text-center absolute w-fit -left-2 top-1/3">
                    {app.mf}
                  </div>
                ))}
              </div>
            ))}
          </div>


          {/* <div className="mt-6 flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 border"></div>
              <span className="text-sm">MF (Mulai Fase)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 border"></div>
              <span className="text-sm">WHI (Hijau)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 border"></div>
              <span className="text-sm">WK (Kuning)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 border"></div>
              <span className="text-sm">WMS (Merah)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 border"></div>
              <span className="text-sm">Tidak Aktif</span>
            </div>
          </div> */}

          {/* <div className="mt-4 text-sm text-gray-600">
            <p><strong>Keterangan:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Setiap kolom mewakili satu fase (F1, F2, F3, F4)</li>
              <li>Setiap baris mewakili satu pendekat (U, S, T, B)</li>
              <li>Lebar setiap segmen proporsional dengan durasi waktu</li>
              <li>MF = Mulai Fase, WHI = Waktu Hijau, WK = Waktu Kuning, WMS = Waktu Merah Semua</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
};

// Example usage with sample data
const App = ({ dataSketsa }) => {
  const [dataProps, setDataProps] = useState([])
  const sampleData = {
    "tableData": [
      {
        "kodePendekat": "U",
        "tipePendekat": "P",
        "arah": "Terlindung",
        "pemisahanLurusRka": "",
        "phases": {
          "f1": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          },
          "f2": {
            "mf": "",
            "whi": "33",
            "wAll": {
              "wk": "24",
              "wms": "3"
            }
          },
          "f3": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          },
          "f4": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          }
        },
        "whi": "1",
        "s": ""
      },
      {
        "kodePendekat": "S",
        "tipePendekat": "P",
        "arah": "Terlindung",
        "pemisahanLurusRka": "",
        "phases": {
          "f1": {
            "mf": "0",
            "whi": "29",
            "wAll": {
              "wk": "3",
              "wms": "1"
            }
          },
          "f2": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          },
          "f3": {
            "mf": "",
            "whi": "70",
            "wAll": {
              "wk": "41",
              "wms": "3"
            }
          },
          "f4": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          }
        },
        "whi": "3",
        "s": "14"
      },
      {
        "kodePendekat": "T",
        "tipePendekat": "O",
        "arah": "Terlawan",
        "pemisahanLurusRka": 1,
        "phases": {
          "f1": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          },
          "f2": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          },
          "f3": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          },
          "f4": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          }
        },
        "whi": "",
        "s": "117"
      },
      {
        "kodePendekat": "B",
        "tipePendekat": "P/O",
        "arah": "Terlindung/Terlawan",
        "pemisahanLurusRka": "",
        "phases": {
          "f1": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          },
          "f2": {
            "mf": "",
            "whi": "",
            "wAll": {
              "wk": "",
              "wms": ""
            }
          },
          "f3": {
            "mf": "",
            "whi": "61",
            "wAll": {
              "wk": "9",
              "wms": "0"
            }
          },
          "f4": {
            "mf": "",
            "whi": "0",
            "wAll": {
              "wk": "70",
              "wms": "41"
            }
          }
        },
        "whi": "3",
        "s": "3"
      }
    ]
  };

  useEffect(() => {
    setDataProps(dataSketsa)
  }, [dataSketsa])

  return (
    <div className="h-fit">
      <TrafficPhaseDiagram tableData={dataProps || sampleData.tableData} />
    </div>
  );
};

export default App;