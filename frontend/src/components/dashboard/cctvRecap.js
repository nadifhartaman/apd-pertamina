'use client';
import React, { useState, useRef, useEffect } from 'react';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import Image from 'next/image';
import { motion } from "framer-motion";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { BiVideoRecording } from "react-icons/bi";

const options = {
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return value.toFixed(2);
        },
      },
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.raw;
          return `Jumlah: ${value.toFixed(2)}`;
        },
      },
    },
  },
};

export const CRecapTableComponent = ({ dataApd = [] }) => {
  // const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className='w-full'>
      <h3 className="card-title text-sm my-2 flex items-center gap-2">Rekap Deteksi APD</h3>
      <table className="table table-sm w-full">
        <thead>
          <tr>
            <th className='text-center text-sm'>No</th>
            <th className='text-center text-sm'>Kamera</th>
            <th className='text-center text-sm'>Tanggal</th>
            <th className='text-center text-sm'>Informasi</th>
            <th className='text-center text-sm'>Status</th>
            <th className='text-center text-sm'>Link</th>
          </tr>
        </thead>
        <tbody>
          {dataApd.length > 0 ? (
            dataApd.map((record, index) => {
              const number = (0 - 1) * 0 + (index + 1);
              const datePart = record.timestamp?.split('T')[0];
              const timePart = record.timestamp?.split('T')[1]?.split('.')[0];
              const info = record?.detected_container_id || '-';

              return (
                <tr key={record.id} className='text-xs'>
                  <td className='text-center'>{number}</td>
                  <td className='text-center'>Kamera {record?.id_camera}</td>
                  <td className='text-center whitespace-nowrap'>{datePart} {timePart}</td>
                  <td className='text-center'>
                    <span
                      className={`text-xs
                            ${["No Mask", "No Hardhat", "Person"].some(item =>
                        info.includes(item)
                      )
                          ? "text-error"
                          : "text-warning"
                        }`}
                    >
                      {info}
                    </span>
                  </td>
                  <td className='text-center'>
                    <div className="flex justify-center items-center">
                      <span className="text-green-600">Online</span>
                    </div>
                  </td>
                  <td className='text-center'>
                    <a
                      href={`data:image/jpeg;base64,${record.image_frame}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      link
                    </a>
                  </td>
                  {/* <td className="text-center">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() =>
                            setSelectedImage(`data:image/jpeg;base64,${record.image_frame}`)
                          }
                        >
                          Lihat
                        </button>
                      </td> */}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-400 py-4">
                Tidak ada data tersedia
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export const CRecapImageComponent = ({ dataApd = [] }) => {
  return (
    <div className='my-5 h-fit'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-fit">
        {dataApd.map((record, index) => {

          const number = (0 - 1) * 0 + (index + 1);
          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: index * 0.1
              }}
              whileHover={{ scale: 1.02 }}
              className="rounded-lg relative shadow-md border border-gray-200 overflow-hidden bg-white"
            >
              <div className="absolute bottom-0 left-0 z-10 p-2">
                <div className="font-bold text-xs bg-blue-500/60 text-white h-5 w-5 align-center text-center items-center justify-center flex rounded-full">
                  {number}
                </div>
              </div>
              <div className="aspect-video relative">
                <Image
                  src={`data:image/jpeg;base64,${record.image_frame}`}
                  alt="Capture"
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </div>

              <div className="absolute top-0 right-0 z-10 p-2">
                <h4 className="font-semibold text-[9px] bg-black/90 p-1 rounded-sm text-white truncate">{record.timestamp.split('T')[0]} - {record.timestamp.split('T')[1].split('.')[0]} - {record.id_camera ? `Kamera ${record.id_camera}` : ''}</h4>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
};

const CRecapComponent = ({ dataApd, lastRecord, pagination, page, setPage, todayPerHour, activeTabCCTV, setActiveTabCCTV }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const chartData = {
    labels: todayPerHour.map(d => `${d.hour}:00`),
    datasets: [
      {
        label: "Jumlah Deteksi",
        data: todayPerHour.map(d => d.count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };
  return (
    <>
      <div className="card bg-white border-gray-100 border">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">📹 Rekap CCTV yang Diaktifkan</h3>
          <div className="tabs tabs-lifted flex mb-6 gap-2">
            <button
              className={`btn btn-md items-center flex gap-1 tab-lg shadow-none rounded-lg ${activeTabCCTV === 'detail'
                ? 'bg-blue-200/80 text-blue-700 font-medium'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border-0'}`}
              onClick={() => setActiveTabCCTV('detail')}
            >
              <BsFileEarmarkBarGraph size={18} />Tabel
            </button>
            <button
              className={`btn btn-md items-center flex gap-1 tab-lg shadow-none rounded-lg ${activeTabCCTV === 'image'
                ? 'bg-blue-200/80 text-blue-600 font-medium'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border-0'}`}
              onClick={() => setActiveTabCCTV('image')}
            >
              <BiVideoRecording size={18} />Image
            </button>
          </div>

          {/* <pre>{JSON.stringify(lastRecord, null, 2)}</pre> */}
          <div className="grid md:grid-cols-2 gap-4 w-full items-stretch">
            <div className="flex flex-col">
              <h2 className='font-semibold text-xl py-2'>Last Capture</h2>
              {lastRecord ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    delay: 0.1 * 0.1
                  }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-lg relative shadow-sm border border-gray-200 overflow-hidden bg-white"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={`data:image/jpeg;base64,${lastRecord.image_frame}`}
                      alt="Capture"
                      fill
                      className="object-cover rounded-lg"
                      unoptimized
                    />
                  </div>
                  <div className="absolute top-0 right-0 z-10 p-2">
                    <h4 className="font-semibold text-[9px] bg-black/90 p-1 rounded-sm text-white truncate">
                      {lastRecord.timestamp.split('T')[0]} -{" "}
                      {lastRecord.timestamp.split('T')[1].split('.')[0]} -{" "}
                      {lastRecord.id_camera ? `Kamera ${lastRecord.id_camera}` : ''}
                    </h4>
                  </div>
                </motion.div>
              ) : (
                <div className="rounded-lg shadow-md border border-gray-200 bg-gray-100 animate-pulse aspect-video flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Tidak ada data terakhir</span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold text-xl py-2">Traffic Overview</h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  delay: 0.1 * 0.1
                }}
                whileHover={{ scale: 1.01 }}
                className="rounded-lg p-5 relative shadow-sm border border-gray-200 overflow-hidden bg-white h-full w-full"
              >
                <Line data={chartData} options={options} />
              </motion.div>
            </div>
          </div>

          {activeTabCCTV === 'detail' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: 0.1 * 0.1
              }}
              whileHover={{ scale: 1.01 }}
              className='overflow-x-auto border border-base-300 my-5 rounded-xl'>

              <table className="table table-md table-zebra w-full">
                <thead>
                  <tr>
                    <th className='text-center'>No</th>
                    <th className='text-center'>Name</th>
                    <th className='text-center'>Date</th>
                    <th className='text-center'>Information</th>
                    <th className='text-center'>Status</th>
                    <th className='text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataApd.map((record, index) => {
                    const number = (page - 1) * pagination.limit + (index + 1);
                    return (
                      <tr key={record.id} className='text-sm'>
                        <td>
                          <span className="font-bold text-xs bg-blue-500/80 text-white px-2 py-1 rounded">
                            {number}
                          </span>
                        </td>
                        <td className='text-center place-items-center'>
                          <div className="flex items-center space-x-3">
                            <div className="avatar placeholder">
                              <BiVideoRecording size={18} />
                            </div>
                            <div>
                              <div className="font-semibold text-nowrap">Kamera {record?.id_camera}</div>
                            </div>
                          </div>
                        </td>
                        <td className='text-center'>
                          <span className="text-sm text-nowrap">{record.timestamp}</span>
                        </td>
                        <td className='text-center'>
                          <span
                            className={`badge text-xs text-nowrap p-1 font-semibold truncate overflow-hidden rounded-full badge-sm 
                              ${["No Mask", "No Hardhat", "Person"].some(item =>
                              record?.detected_container_id?.includes(item)
                            )
                                ? "text-error bg-red-100/90"
                                : "text-warning bg-yellow-100/90"
                              }
                            `}
                          >
                            {record.detected_container_id}
                          </span>
                          {/* {record.detected_container_id} */}
                        </td>
                        <td className='text-center'>
                          <div className="flex justify-center items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-600">Online</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() =>
                              setSelectedImage(
                                `data:image/jpeg;base64,${record.image_frame}`
                              )
                            }
                          >
                            Lihat
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
          {activeTabCCTV === 'image' && (
            <div className='my-5'>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dataApd.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      delay: index * 0.1
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-lg relative shadow-md border border-gray-200 overflow-hidden bg-white"
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={`data:image/jpeg;base64,${record.image_frame}`}
                        alt="Capture"
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                    </div>

                    <div className="absolute top-0 right-0 z-10 p-2">
                      <h4 className="font-semibold text-[9px] bg-black/90 p-1 rounded-sm text-white truncate">{record.timestamp.split('T')[0]} - {record.timestamp.split('T')[1].split('.')[0]} - {record.id_camera ? `Kamera ${record.id_camera}` : ''}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {pagination && (
            <div className='gap-2 flex items-center'>
              <button
                className='btn btn-sm'
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>
              <span>{page} / {pagination.totalPages}</span>
              <button
                className='btn btn-sm'
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}

          {/* Modal */}
          {selectedImage && (
            <dialog id="imageModal" className="modal modal-open">
              <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-lg mb-4">📷 Deteksi CCTV</h3>
                <div className="flex justify-center">
                  <Image
                    src={selectedImage}
                    alt="Deteksi CCTV"
                    width={800}
                    height={600}
                    className="rounded-lg"
                  />
                </div>
                <div className="modal-action">
                  <button className="btn" onClick={() => setSelectedImage(null)}>
                    Tutup
                  </button>
                </div>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </>
  )
}
export default CRecapComponent