// components/NavbarUserDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Logout } from '@/app/auth/logout';
import ThemeToggle from '../ui/customTheme';
import { FaAngleDown } from "react-icons/fa6";
import { useAuth } from '../../contexts/authContext';

export default function NavbarUserDropdown () {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside (event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User avatar and dropdown toggle */}
      <div className="flex items-center gap-3 px-2 cursor-pointer" onClick={toggleDropdown}>
        <div className="flex items-center bg-neutral-100 p-2 rounded-md text-neutral-700">
          <span className="text-[11px] font-medium px-2 sm:w-fit w-20 truncate capitalize">Hi, {user.full_name}</span>
          <FaAngleDown className={`text-md text-neutral-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-fit rounded-md shadow-lg bg-base-100 z-50">
          <div role="menu" aria-orientation="vertical">
            {user && (
              <div className=" text-xs border-b border-base-300 p-4">
                <p className="font-medium capitalize">{user && user?.username +  ' - ' + user.role}</p>
                <p className="text-xs text-neutral-700">{user?.email || ''}</p>
              </div>
            )}

            <div className="flex flex-col p-1">
              {/* <ThemeToggle classCustom=" rounded-none " /> */}

              {/*             
            <Link href="/profile" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
              Profile
            </Link> */}
              {/* <hr className="border-t border-gray-200" /> */}
              <Logout classCustom=" rounded-none " />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}