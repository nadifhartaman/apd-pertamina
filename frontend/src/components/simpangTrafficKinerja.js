"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const GridVertical = lazy(() => import("@/components/gridVertical"));
const GridHorizontal = lazy(() => import("@/components/gridHorizontal"));

const SimpangTrafficKinerja = () => {
  const [dataSimpang, setDataSimpang] = useState(null);
  const [categoryNames, setCategoryNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  useEffect(() => {
    import("@/data/trafficKinerjaBySimpang.json").then((data) => {
      const kategori = data.default.category;
      setDataSimpang(kategori);
      setCategoryNames(Object.keys(kategori));
      setSelectedCategory(Object.keys(kategori)[0]);
    });
  }, []);

  useEffect(() => {
    console.log(dataSimpang)
    console.log(categoryNames)
    console.log(directionData)
  }, [dataSimpang])

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    if (dataSimpang && selectedCategory) {
      setSelectedCategoryName(dataSimpang[selectedCategory].name);
    }
  }, [selectedCategory, dataSimpang]);

  const getDirectionData = () => {
    if (!dataSimpang || !selectedCategory) return {};
    return dataSimpang[selectedCategory].directions;

  };

  const directionData = getDirectionData();

  return (
    <div className="p-4">
      <Suspense fallback={<div className="text-center font-medium m-auto w-full">Loading...</div>}>
        <div className="mb-4">
          <div className="form-control w-full flex flex-col gap-2 md:w-1/4">
            <label className="label">
              <span className="label-text font-medium">Kategori</span>
            </label>
            <select
              className="select select-bordered focus:ring-0 focus:outline-0 select-sm"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Semua Kategori</option>
              {categoryNames.map((number) => (
                <option key={number} value={number}>
                  {dataSimpang?.[number]?.name || number}
                </option>
              ))}
            </select>
          </div>
        </div>

        {dataSimpang && (
          <div className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory">
            <div className={`flex gap-4 w-fit ${ [selectedCategory].length > 0 ? "justify-center mx-auto" : ""
              }`}>
              {(selectedCategory === "" ? categoryNames : [selectedCategory]).map((key) => {
                const simpang = dataSimpang[key];
                const directions = simpang.directions;

                return (
                  <div
                    key={key}
                    className="min-w-[350px] snap-end bg-[#BCC3E1] font-semibold flex flex-col">
                    <div className="flex justify-center">
                      <div></div>
                      <GridVertical position={true} data={directions.north} col={1} />
                      <div></div>
                    </div>

                    <div className="flex justify-center">
                      <div>
                        <GridHorizontal position={true} data={directions.west} col={1} />
                      </div>
                      <div className="w-40 text-center items-center flex font-medium text-xs p-5 bg-stone-400">
                        <div className="m-auto">{simpang.name}</div>
                      </div>
                      <div>
                        <GridHorizontal position={false} data={directions.east} col={1} />
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div></div>
                      <GridVertical position={false} data={directions.south} col={1} />
                      <div></div>
                    </div>
                  </div>
                );
              })}

              {/* {dataSimpang && selectedCategory && (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[350px] flex flex-col w-fit bg-[#BCC3E1] mx-auto font-semibold">
                  <div className="flex justify-center">
                    <div></div>
                    <GridVertical position={true} data={directionData.north} col={1} />
                    <div></div>
                  </div>

                  <div className="flex justify-center">
                    <div>
                      <GridHorizontal position={true} data={directionData.west} col={1} />
                    </div>
                    <div className="w-40 text-center items-center flex font-medium text-xs p-5 bg-stone-400">
                      <div className="m-auto">
                        {selectedCategory ? selectedCategoryName : 'Jumlah<br />Kendaraan'}
                      </div>
                    </div>
                    <div>
                      <GridHorizontal position={false} data={directionData.east} col={1} />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div></div>
                    <GridVertical position={false} data={directionData.south} col={1} />
                    <div></div>
                  </div>
                </div>
              </div>
            )} */}
            </div>
          </div>
        )}

      </Suspense>
    </div>
  );
};

export default SimpangTrafficKinerja;
