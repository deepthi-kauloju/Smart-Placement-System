import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Tailwind CSS classes will replace styled-components
const SidebarLink = ({ to, onClick, active, children, hasSubnav }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`mx-3 my-1 flex h-12 items-center justify-between rounded-xl px-3 text-sm font-semibold no-underline transition ${active ? 'bg-blue-50 text-blue-800 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'} ${hasSubnav ? 'cursor-pointer' : ''}`}
  >
    {children}
  </Link>
);

const SidebarLabel = ({ children }) => (
  <span className="ml-3">{children}</span>
);

const DropdownLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`mx-3 flex h-11 items-center rounded-xl pl-8 pr-3 text-sm font-semibold no-underline transition ${active ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
  >
    {children}
  </Link>
);

const SubMenu = ({ item, currentPath }) => {
  const [subnav, setSubnav] = useState(false);

  useEffect(() => {
    if (item.subNav && item.subNav.some(subItem => currentPath.includes(subItem.path))) {
      setSubnav(true);
    } else {
      setSubnav(false);
    }
  }, [currentPath, item.subNav]);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink
        to={item.path}
        onClick={item.subNav && showSubnav}
        active={currentPath === item.path}
        hasSubnav={!!item.subNav}  // Pass whether it has subnav
      >
        <div className="flex items-center [&>svg]:text-lg">
          {item.icon}
          <SidebarLabel>
            {item.title}
          </SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
              ? item.iconClosed
              : null}
        </div>
      </SidebarLink>

      {subnav && (
        <div className="mb-2 border-l border-slate-200">
          {item.subNav.map((subItem, index) => (
            <DropdownLink
              to={subItem.path}
              key={index}
              active={currentPath === subItem.path}
            >
              <span className="[&>svg]:text-base">{subItem.icon}</span>
              <SidebarLabel>
                {subItem.title}
              </SidebarLabel>
            </DropdownLink>
          ))}
        </div>
      )}
    </>
  );
};

export default SubMenu;
