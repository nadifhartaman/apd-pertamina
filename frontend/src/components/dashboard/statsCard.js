"use client";

import { SiSpeedtest } from "react-icons/si";
import { FaCheck } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import { BiVideoRecording } from "react-icons/bi";

export default function StatsCardGrid({ stats }) {
  return (
    <div className="lg:col-span-2 xl:col-span-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="stat bg-white border-gray-100 border rounded-lg"
          >
            <div className={`stat-figure ${stat.color}`}>
              <stat.icon size={32} />
            </div>
            <div className="stat-title">{stat.title}</div>
            <div className={`stat-value ${stat.color}`}>{stat.value}</div>
            <div className="stat-desc">{stat.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}