"use client";

import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { GiBattleGear, GiHelmet, GiGasMask } from "react-icons/gi";

// Design 1: Vertical Stack Card
export function ViolationBreakdownVertical({ violationData, totalViolations }) {
  const violations = [
    { key: "No Safety Vest", label: "Safety Vest", icon: GiBattleGear, color: "bg-orange-100 border-orange-300", textColor: "text-orange-600" },
    { key: "No Hardhat", label: "Hardhat", icon: GiHelmet, color: "bg-blue-100 border-blue-300", textColor: "text-blue-600" },
    { key: "No Mask", label: "Masker", icon: GiGasMask, color: "bg-purple-100 border-purple-300", textColor: "text-purple-600" },
  ];

  return (
    <div className="card bg-white border-gray-100 border h-full">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4 flex items-center gap-2">
          <IoWarningOutline size={20} className="text-red-500" />
          Rincian Pelanggaran
        </h3>
        <div className="space-y-3">
          {violations.map((violation) => {
            const Icon = violation.icon;
            const count = violationData?.[violation.key] || 0;
            const percentage = totalViolations > 0 ? ((count / totalViolations) * 100).toFixed(1) : 0;

            return (
              <div
                key={violation.key}
                className={`border ${violation.color} rounded-lg p-4 flex items-center justify-between`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${violation.color}`}>
                    <Icon size={24} className={violation.textColor} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{violation.label}</h4>
                    <p className="text-xs text-gray-500">Tidak memakai {violation.label.toLowerCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${violation.textColor}`}>{count}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="font-semibold text-gray-700">Total Pelanggaran:</span>
          <span className="text-2xl font-bold text-red-600">{totalViolations}</span>
        </div>
      </div>
    </div>
  );
}

export function ViolationBreakdownProgress({ violationData, totalViolations }) {
  const violations = [
    { key: "No Safety Vest", label: "Safety Vest", color: "#FF9800", bgColor: "bg-orange-500" },
    { key: "No Hardhat", label: "Hardhat", color: "#006db7", bgColor: "bg-blue-500" },
    { key: "No Mask", label: "Masker", color: "#9C27B0", bgColor: "bg-purple-500" },
  ];

  return (
    <div className="card bg-white border-gray-100 border">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4 flex items-center gap-2">
          <IoWarningOutline size={20} className="text-red-500" />
          Distribusi Pelanggaran
        </h3>
        <div className="space-y-5">
          {violations.map((violation) => {
            const count = violationData?.[violation.key] || 0;
            const percentage = totalViolations > 0 ? (count / totalViolations) * 100 : 0;

            return (
              <div key={violation.key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{violation.label}</span>
                  <span className="text-sm font-bold text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <progress
                  className="progress w-full h-2"
                  value={percentage}
                  max="100"
                  style={{
                    "--tw-bg-opacity": "1",
                    backgroundColor: violation.color,
                  }}
                ></progress>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ViolationBreakdownGrid({ violationData, totalViolations }) {
  const violations = [
    { key: "No Safety Vest", label: "Safety Vest", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    { key: "No Hardhat", label: "Hardhat", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { key: "No Mask", label: "Masker", color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {violations.map((violation) => {
        const count = violationData?.[violation.key] || 0;
        const percentage = totalViolations > 0 ? ((count / totalViolations) * 100).toFixed(1) : 0;

        return (
          <div
            key={violation.key}
            className={`card border ${violation.borderColor} ${violation.bgColor}`}
          >
            <div className="card-body p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-sm font-semibold ${violation.color}`}>{violation.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">Pelanggaran</p>
                </div>
                <IoWarningOutline size={20} className={violation.color} />
              </div>
              <div className="mt-4">
                <div className={`text-3xl font-bold ${violation.color}`}>{count}</div>
                <div className="text-xs text-gray-600 mt-1">{percentage}% dari total</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ViolationBreakdownCompact({ violationData, totalViolations }) {
  const violations = [
    { key: "No Safety Vest", label: "Safety Vest", badge: "bg-orange-100 text-orange-800" },
    { key: "No Hardhat", label: "Hardhat", badge: "bg-blue-100 text-blue-800" },
    { key: "No Mask", label: "Masker", badge: "bg-purple-100 text-purple-800" },
  ];

  return (
    <div className="card bg-white border-gray-100 border">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4">Rincian Pelanggaran</h3>
        <div className="flex flex-col gap-2">
          {violations.map((violation) => {
            const count = violationData?.[violation.key] || 0;
            const percentage = totalViolations > 0 ? ((count / totalViolations) * 100).toFixed(1) : 0;

            return (
              <div key={violation.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <div className={`badge ${violation.badge} font-semibold`}>{violation.label}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{percentage}%</span>
                  <span className="font-bold text-gray-900 min-w-12 text-right">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="divider my-3"></div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Total Pelanggaran</p>
          <p className="text-3xl font-bold text-red-600">{totalViolations}</p>
        </div>
      </div>
    </div>
  );
}

export function ViolationBreakdownCircular({ violationData, totalViolations }) {
  const violations = [
    { key: "No Safety Vest", label: "Safety Vest", color: "#FF9800", icon: GiVest },
    { key: "No Hardhat", label: "Hardhat", color: "#006db7", icon: GiHardHat },
    { key: "No Mask", label: "Masker", color: "#9C27B0", icon: GiSafetyMask },
  ];

  return (
    <div className="card bg-white border-gray-100 border">
      <div className="card-body">
        <h3 className="card-title text-lg mb-6 flex items-center gap-2">
          <IoWarningOutline size={20} className="text-red-500" />
          Pelanggaran per Jenis
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {violations.map((violation) => {
            const Icon = violation.icon;
            const count = violationData?.[violation.key] || 0;
            const percentage = totalViolations > 0 ? ((count / totalViolations) * 100).toFixed(1) : 0;

            return (
              <div key={violation.key} className="flex flex-col items-center">
                <div
                  className="radial-progress mb-3"
                  style={{
                    "--value": percentage,
                    "--size": "120px",
                    "--thickness": "8px",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <Icon size={32} style={{ color: violation.color }} />
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 text-center">{violation.label}</h4>
                <p className="text-2xl font-bold mt-2" style={{ color: violation.color }}>
                  {count}
                </p>
                <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
