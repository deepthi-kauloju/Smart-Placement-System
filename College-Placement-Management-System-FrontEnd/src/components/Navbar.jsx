// Navbar.jsx
import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

function Navbar({ isSidebarVisible, toggleSidebar }) {
  const location = useLocation();

  // Page name extraction and formatting
  let pageName = location.pathname.split('/').filter(Boolean).pop();
  if (pageName === 'dashboard') pageName = "home";
  if (pageName === 'tpo') pageName = "TPO";
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className={`h-20 sticky top-0 z-10 flex justify-start items-center border-b border-slate-200/70 bg-white/80 shadow-sm shadow-slate-200/60 backdrop-blur-xl text-slate-600 transition-all duration-300 ${isSidebarVisible ? 'ml-60 px-4' : 'ml-0'}`}>
      <button
        type="button"
        className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FaBars size={18} />
      </button>
      <span className="ml-5 text-lg font-bold text-slate-800 md:text-xl">
        {pageName}
      </span>
    </div>
  );
}

export default Navbar;
