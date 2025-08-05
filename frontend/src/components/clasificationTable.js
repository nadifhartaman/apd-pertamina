"use client"
import { useState, useEffect } from 'react';

const VehicleClassificationTable = ({ typeClass, customSize }) => {
  const [classificationData, setClassificationData] = useState([]);
  const [selectedType, setSelectedType] = useState('luar_kota');
  const [theme, setTheme] = useState('light');

  // Dynamic text size based on customSize prop
  const textSize = customSize ? 'text-xs' : 'text-sm';
  const headerTextSize = customSize ? 'text-sm' : 'text-xl';

  useEffect(() => {
    // In a real implementation, you'd import from a file
    // We're using the data directly here
    import("@/data/classification.json").then((data) => {
      setClassificationData(data.default);
    }).catch(error => {
      console.error("Error loading classification data:", error);
    });

    // Get initial theme
    setTheme(localStorage.getItem("theme") || "light");

    // Observer for theme changes
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeClass === "PKJI 2023 Luar Kota") {
      setSelectedType("luar_kota")
    } else if (typeClass === "PKJI 2023 Dalam Kota") {
      setSelectedType("dalam_kota")
    } else if (typeClass === "Tipikal") {
      setSelectedType("tipikal")
    }
  }, [typeClass])

  // Filter data by selected type
  const filteredData = classificationData?.filter(item => item.type === selectedType) || [];

  // Group filtered data by mainCode
  const groupedData = filteredData.reduce((acc, vehicle) => {
    if (!acc[vehicle.mainCode]) {
      acc[vehicle.mainCode] = [];
    }
    acc[vehicle.mainCode].push(vehicle);
    return acc;
  }, {});

  return (
    <div className="w-full p-4 my-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className={`${headerTextSize} font-semibold`}>Klasifikasi Kendaraan</h2>

        {/* <div className="mt-2 sm:mt-0">
          <label className="mr-2 font-medium">Pilih Tipe Klasifikasi:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border p-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white"
          >
            <option value="luar_kota">PKJI 2023 Luar Kota</option>
            <option value="dalam_kota">PKJI 2023 Dalam Kota</option>
            <option value="tipikal">Tipikal</option>
          </select>
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-base-300">
          <thead>
            <tr className={theme === 'light' ? 'bg-green-50 text-black' : 'bg-base-200 text-white'}>
              <th className={`border border-base-300 px-4 py-2 font-medium capitalize text-center align-middle ${textSize}`} colSpan={20}>{selectedType.replace(/_/g, ' ')}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).length > 0 ? (
              Object.entries(groupedData).flatMap(([mainCode, items]) =>
                items.map((vehicle, index) => (
                  <tr key={`${mainCode}-${index}`} className={theme === 'light' ? 'bg-green-50 text-black' : 'bg-base-200 text-white'}>
                    {!customSize && index === 0 ? (
                      <>

                        <td
                          className={`border border-base-300 px-4 py-2 text-center align-middle font-medium ${textSize}`}
                          rowSpan={items.length}
                        >
                          {vehicle.mainCode}
                        </td>
                        <td
                          className={`border border-base-300 px-4 py-2 align-middle ${textSize} text-center`}
                          rowSpan={items.length}
                        >
                          {vehicle.mainCategory}
                        </td>
                      </>
                    ) : customSize ? (
                      <>
                        <td
                          className={`border border-base-300 px-4 py-2 text-center align-middle font-medium ${textSize}`}
                        >
                          {index === 0 ? vehicle.mainCode : null}
                        </td>
                        <td
                          className={`border border-base-300 px-4 py-2 align-middle ${textSize} text-center`}
                        >
                          {index === 0 ? vehicle.mainCategory : null}
                        </td>
                      </>
                    ) : <></>}
                    <td className={`border border-base-300 px-4 py-2 text-center ${textSize}`}>
                      {vehicle.subCode} <br /> {vehicle.subCategory}
                    </td>
                    <td className={`border border-base-300 px-4 py-2 ${textSize}`}>
                      {vehicle.description}
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="4" className={`border border-base-300 px-4 py-2 text-center ${textSize}`}>
                  {classificationData?.length > 0 ? 'Tidak ada data untuk tipe yang dipilih' : 'Memuat data...'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VehicleClassificationTable;