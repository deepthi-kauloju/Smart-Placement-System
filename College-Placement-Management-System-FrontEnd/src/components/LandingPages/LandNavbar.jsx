import { useEffect, useState } from 'react';
import Logo from '../../assets/CPMS.png';
import { useNavigate } from 'react-router-dom';

function LandingNavbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/88 shadow-lg shadow-slate-200/70 backdrop-blur-xl' : 'bg-white/70 backdrop-blur-md'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <button
          type="button"
          className="flex items-center gap-3 text-left"
          onClick={() => navigate('/')}
        >
          <img
            src={Logo}
            alt="Logo"
            className="h-14 w-14 rounded-2xl border border-slate-200 bg-white p-1 shadow-md shadow-slate-200 md:h-16 md:w-16"
          />
          <div>
            <p className="playfair text-xl font-semibold text-slate-900 md:text-2xl">CPMS</p>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500 md:text-sm">College Placement Management System</p>
          </div>
        </button>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#home" className="transition hover:text-slate-900">Home</a>
          <a href="#about" className="transition hover:text-slate-900">About</a>
          <a href="#roles" className="transition hover:text-slate-900">Roles</a>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
            onClick={() => navigate('student/login')}
          >
            Login
          </button>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800"
            onClick={() => navigate('student/signup')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingNavbar;
