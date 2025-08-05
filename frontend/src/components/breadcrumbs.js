"use client";
import listMenu from "@/data/menu.json";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import { useAuth } from "@/contexts/authContext";
import Link from "next/link";

// Mapping prefix to icon modules
const iconModules = {
  Ai: AiIcons,
  Fa: FaIcons,
  Md: MdIcons,
  Bs: BsIcons,
};

export default function Breadcrumbs() {
  const { pathname } = useAuth();
  
  // Split pathname into segments and remove empty strings
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  // Create breadcrumb items by building paths progressively
  const breadcrumbs = pathSegments.map((segment, index) => {
    // Build the path up to this segment
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    
    // Find the corresponding menu item, if any
    const menuItem = listMenu.find(item => item.path === path);
    
    return {
      name: menuItem ? menuItem.name : segment.charAt(0).toUpperCase() + segment.slice(1),
      path: path,
      icon: menuItem ? menuItem.icon : null
    };
  });
  
  return (
    <nav className={`flex items-center font-semibold p-5 text-neutral-700` }>
      <Link href="/" className="flex items-center">
        {/* <AiIcons.AiFillHome className="mr-1" /> */}
        <span>/ Dashboard</span>
      </Link>
      
      {breadcrumbs.map((item, index) => {
        let IconComponent = null;
        
        if (item.icon) {
          const prefix = item.icon.slice(0, 2);
          const iconGroup = iconModules[prefix];
          IconComponent = iconGroup?.[item.icon] || null;
        }
        
        return (
          <div key={index} className="flex items-center ">
            <span className="mx-2">/ </span>
            <Link href={item.path} className="flex items-center">
              {/* {IconComponent && <IconComponent className="mr-1" />} */}
              <span>{item.name}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}