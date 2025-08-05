"use client";
import Image from "next/image";
import * as Icons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import listMenu from "@/data/menu.json";
import listMenuMobility from "@/data/menuMobility.json";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import ProfileDropdown from "@/components/dialog/dialogProfile"
import PageWrapper from "../layout/wrapper";
import { Logout } from '@/app/auth/logout';

// import { redirect } from "next/navigation";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  const { token, pathname, idUser, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    setMounted(true);
    // console.log(idUser)
  }, []);

  const hasAccess = (menuItem) => {
    // Jika user belum ter-load, return false untuk safety
    if (!user) return false;

    const userRoles = user.roles?.map(item => item.name.toLowerCase()) || [];
    // console.log(userRoles)
    const menuUrl = menuItem.url;

    const roleBasedMenus = {
      '/dashboard': ['admin'],
      "/camera": ['admin'],
    };

    // Check jika menu memerlukan role khusus
    const requiredRoles = roleBasedMenus[menuUrl];
    if (requiredRoles) {
      return requiredRoles.some(role => userRoles.includes(role));
    }

    return true;
  }

  const filterMenuByRole = (menuList) => {
    if (!user || !menuList) return [];

    return menuList.filter(item => hasAccess(item));
  };

  useEffect(() => {
    const baseMenu = pathname === "/dashboard/mobility" ? listMenuMobility : listMenu;
    const filteredMenu = filterMenuByRole(baseMenu);
    // setMenu(filteredMenu);
    setMenu(listMenu);
    console.log("path", filteredMenu)
  }, [pathname, user])

  if (!mounted) return null;

  // if (!token || pathname === "/auth" || pathname === "/not-found") {
  //   return <div>{children}</div>;
  // }

  if (!token && pathname !== "/dashboard/mobility" || pathname === "/auth/login" || pathname === "/not-found") {
    return (
      <div>
        <ToastContainer />
        {children}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">

      {/* <ClockBar /> */}
      <div className="drawer 2xl:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar bg-white border-gray-200 border-y 2xl:hidden w-full sticky top-0 z-[20] 2xl:z-[40] h-fit">
            <div className="flex-none 2xl:hidden">
              <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <Icons.AiOutlineMenu className="inline-block text-xl" />
              </label>
            </div>
            <div className="2xl:hidden flex flex-1 text-sm font-normal place-items-center w-fit xl:w-full not-xl:overflow-hidden not-xl:text-ellipsis h-10 truncate">
              <Breadcrumbs />
            </div>
            <div className="flex-none">
              <div className="flex menu-horizontal items-center gap-2">
                <ProfileDropdown />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <PageWrapper>
              <ToastContainer />
              <div className="hidden 2xl:flex flex-1 text-sm font-normal place-items-center w-fit xl:w-full not-xl:overflow-hidden not-xl:text-ellipsis h-20 justify-between pr-3">
                <Breadcrumbs />
                <div className="flex-none">
                  <div className="flex menu-horizontal items-center gap-2">
                    <ProfileDropdown />
                  </div>
                </div>
              </div>
              {children}
            </PageWrapper>
          </div>
        </div>
        {/* Sidebar */}
        <div className="drawer-side z-[40]">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="menu bg-white text-base-content font-semibold min-h-full p-0 w-64 gap-1 border border-gray-200">
            <div className="flex justify-center items-center w-full border-y border-gray-200">
              <div className="bg-transparent h-20 p-5 mx-auto">
                <Image
                  src="/image/pertamina-logo.png"
                  alt="Logo"
                  width={150}
                  height={150}
                  className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                  onLoadingComplete={() => setLoaded(true)}
                />
              </div>
            </div>
            <ul className="flex flex-col gap-2 p-2 text-[13px]">
              {menu?.map((item, index) => {
                // Try to find the icon in the primary Icons library
                let IconComponent = item.icon && Icons[item.icon];

                // If not found in the primary library, try the FaIcons library
                if (!IconComponent && item.icon && FaIcons[item.icon]) {
                  IconComponent = FaIcons[item.icon];
                } else if (!IconComponent && item.icon && MdIcons[item.icon]) {
                  IconComponent = MdIcons[item.icon];
                } else if (!IconComponent && item.icon && RiIcons[item.icon]) {
                  IconComponent = RiIcons[item.icon]
                }

                return (
                  <li key={index} >
                    <a href={item.url} className={pathname === item.url ? `items-center bg-neutral-100/90 box-shadow rounded-md text-neutral-700 py-2` : `rounded-md py-2 ` + `text-neutral-700`}>
                      {IconComponent && <IconComponent className="inline-block mr-2 text-lg" />}
                      {item.name}
                    </a>
                  </li>
                );
              })}
              {/* <div className="lg:flex hidden absolute bottom-5">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex">
                    <Logout />
                  </div>
                </div>
              </div> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
