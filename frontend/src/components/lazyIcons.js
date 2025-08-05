"use client";

import React from 'react';
import { 
  FaCar, 
  FaTruck, 
  FaBus, 
  FaMotorcycle, 
  FaBicycle, 
  FaShuttleVan, 
  FaTractor, 
  FaTruckMoving, 
  FaCaravan 
} from "react-icons/fa";
import { 
  FaArrowRightToBracket, 
  FaArrowRightFromBracket 
} from "react-icons/fa6";

// Icon mapping component to lazy load all icons
const LazyIcons = ({ iconType, size = 16, className = "" }) => {
  const getIconComponent = () => {
    switch (iconType) {
      case 'SM':
        return <FaMotorcycle size={size} className={className} />;
      case 'MP':
        return <FaCar size={size} className={className} />;
      case 'AUP':
        return <FaShuttleVan size={size} className={className} />;
      case 'TR':
      case 'TB':
        return <FaTruck size={size} className={className} />;
      case 'BS':
      case 'BB':
        return <FaBus size={size} className={className} />;
      case 'TS':
      case 'GANDENG':
        return <FaTruckMoving size={size} className={className} />;
      case 'KTB':
        return <FaBicycle size={size} className={className} />;
      case 'MASUK':
        return <FaArrowRightToBracket size={size} className={`${className} text-green-500`} />;
      case 'KELUAR':
        return <FaArrowRightFromBracket size={size} className={`${className} text-red-500`} />;
      default:
        return <FaCar size={size} className={className} />;
    }
  };

  return getIconComponent();
};

export default LazyIcons;