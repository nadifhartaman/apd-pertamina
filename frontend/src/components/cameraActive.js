"use client"

import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";

const CameraActive = ({ children, onOptionChange, addNewCamera, addNewMaps, inputSearch, searchValue, editorStatus }) => {
  const [optionSelect, setOptionSelect] = useState('peta');
  const activeOption = ["peta", "pratinjau", "daftar"]

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setOptionSelect(value);
    onOptionChange?.(value);
  };

  const handleButtonClick = (option) => {
    setOptionSelect(option);
    onOptionChange?.(option);
  };
  return (
    <div>
      {/* <div className="form-control w-full md:w-1/4">
        <label className="label">
          <span className="label-text font-medium">Arah Simpang</span>
        </label>
        <select
          className="select select-bordered"
          value={optionSelect}
          onChange={handleSelectChange}
        >
          <option value="peta">Peta</option>
          <option value="pratinjau">Pratinjau</option>
          <option value="daftar">Daftar</option>
        </select>
      </div> */}
      <div>
        <div className="flex flex-col gap-3">
          <div className="w-full flex flex-wrap gap-4 items-center justify-between">
            <h3 className="text-lg font-semibold">Kamera Aktif</h3>
            {editorStatus && (
              <div className="flex flex-wrap w-full gap-2">
                <button className="btn btn-sm rounded-md bg-[#314385]/80 text-white capitalize" onClick={addNewMaps}><IoIosAdd className="text-xl" />Tambah Maps</button>
                <button className="btn btn-sm rounded-md bg-[#314385]/80 text-white capitalize" onClick={addNewCamera}><IoIosAdd className="text-xl" />Tambah kamera</button>
                <label className="input input-sm rounded-md bg-[#314385]/10 w-38">
                  <svg className="h-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </g>
                  </svg>
                  <input
                    type="search"
                    className="input input-sm focus:outline-0 focus:ring-0"
                    placeholder="Search"
                    onChange={inputSearch}
                    value={searchValue}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="join w-fit gap-2 flex flex-wrap overflow-x-auto pt-2">
            {activeOption.map((option) => (
              <button
                key={option}
                className={`btn join-item rounded-md flex-1 text-nowrap btn-sm w-fit px-5 capitalize ${optionSelect === option
                  ? "bg-[#232f61]/80 text-white"
                  : "bg-[#232f61]/10 text-[#3e55bd] outline-none"
                  }`}
                onClick={() => handleButtonClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default CameraActive