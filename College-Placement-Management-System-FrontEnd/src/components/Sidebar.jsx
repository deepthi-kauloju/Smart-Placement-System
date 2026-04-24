import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import axios from 'axios';
import Logo from '../assets/CPMS.png';
import SubMenu from './Submenu';
import { BASE_URL, FILE_BASE_URL } from '../config/config';

const Sidebar = ({ isSidebarVisible }) => {
  const [sidebar, setSidebar] = useState(isSidebarVisible);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebar(isSidebarVisible);
  }, [isSidebarVisible]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (loadData.role === 'student') navigate('../student/login');
    else if (loadData.role === 'tpo_admin') navigate('../tpo/login');
    else if (loadData.role === 'management_admin') navigate('../management/login');
    else if (loadData.role === 'superuser') navigate('../admin');
  };

  const [loadData, setLoadData] = useState({
    name: 'Not Found',
    email: 'Not Found',
    profile: '/profileImgs/default/defaultProfileImg.jpg',
    role: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setLoadData({
          name: [res.data?.first_name, res.data?.middle_name, res.data?.last_name]
            .filter((value) => value && value !== 'undefined' && value !== 'null')
            .join(' '),
          email: res.data.email,
          profile: res.data.profile || '/profileImgs/default/defaultProfileImg.jpg',
          role: res.data.role,
        });
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          const dataToPass = {
            showToastPass: true,
            toastMessagePass: err.response.data.msg,
          };
          navigate('../', { state: dataToPass });
        }
      });
  }, [navigate]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [SidebarData, setSidebarData] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const fetchSidebarData = async () => {
    if (loadData.role === 'superuser') {
      const { SidebarData } = await import('./SuperUser/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'management_admin') {
      const { SidebarData } = await import('./Management/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'tpo_admin') {
      const { SidebarData } = await import('./TPO/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'student') {
      const { SidebarData } = await import('./Students/SidebarData');
      setSidebarData(SidebarData);
    }
  };

  useEffect(() => {
    if (loadData.role) {
      fetchSidebarData();
    }
  }, [loadData.role]);


  return (
    <>
      <nav className={`w-[240px] min-h-screen h-full z-20 flex flex-col fixed top-0 transition-transform duration-300 ${sidebar ? 'translate-x-0' : '-translate-x-full'} border-r border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur-xl navbar-container lg:w-[260px]`}>
        {/* Main Sidebar Logo and Name */}
        <div className="mx-3 my-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <img className="h-14 w-14 rounded-2xl border border-slate-100 bg-white p-1 shadow-md shadow-slate-200" src={Logo} alt="Logo Image" />
          <div>
            <h1 className="playfair text-2xl font-bold leading-none text-slate-950">
              {loadData.role === 'superuser' && <Link to="/admin/dashboard" className="no-underline text-slate-950">CPMS</Link>}
              {loadData.role === 'management_admin' && <Link to="/management/dashboard" className="no-underline text-slate-950">CPMS</Link>}
              {loadData.role === 'tpo_admin' && <Link to="/tpo/dashboard" className="no-underline text-slate-950">CPMS</Link>}
              {loadData.role === 'student' && <Link to="/student/dashboard" className="no-underline text-slate-950">CPMS</Link>}
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Placement</p>
          </div>
        </div>

        {/* Main body */}
        <div className="flex-grow overflow-y-auto sidebar-content pb-24">
          <div className="flex flex-col justify-center w-full">
            {SidebarData.length > 0 ? (
              SidebarData.map((item, index) => (
                <SubMenu item={item} key={index} currentPath={location.pathname} />
              ))
            ) : (
              <p className="py-4 text-center text-sm font-semibold text-slate-500">Loading...</p>
            )}
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="bottom-0 absolute w-full transition-all duration-300">
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className={`mx-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg ${dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-5'}`}>
              {/* Conditional rendering based on role */}
              {loadData.role === 'student' && (
                <Link to={`../student/account`} className="flex items-center no-underline text-slate-700 p-3 hover:bg-blue-50">
                  <FaCog className="mr-2" /> <span>Account Details</span>
                </Link>
              )}
              {loadData.role === 'tpo_admin' && (
                <Link to={`../tpo/account`} className="flex items-center no-underline text-slate-700 p-3 hover:bg-blue-50">
                  <FaCog className="mr-2" /> <span>Account Details</span>
                </Link>
              )}
              {loadData.role === 'management_admin' && (
                <Link to={`../management/account`} className="flex items-center no-underline text-slate-700 p-3 hover:bg-blue-50">
                  <FaCog className="mr-2" /> <span>Account Details</span>
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center w-full p-3 text-red-700 hover:bg-red-50">
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}

          {/* User Profile */}
          <div className="mx-3 mb-3 flex cursor-pointer items-center rounded-2xl border border-slate-200 bg-slate-50 p-2 transition hover:bg-white" onClick={toggleDropdown}>
            <img src={`${FILE_BASE_URL}${loadData.profile}`} alt="Profile Img" className="mr-3 h-11 w-11 rounded-2xl object-cover transition-all duration-300 shadow-md" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col justify-center py-1">
                <h2 className="truncate text-sm font-bold text-slate-800">{loadData.name}</h2>
                <p className="truncate text-xs text-slate-500">{loadData.email}</p>
              </div>
            </div>
            <div className="px-1 text-slate-500">
              <IoIosArrowDropdownCircle size={22} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
