import { useNavigate } from 'react-router-dom';

function LandFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="playfair text-3xl text-white">CPMS</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              A focused placement portal for colleges that need cleaner student records, faster job coordination, and better visibility across the placement process.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Explore</p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <a href="#home" className="transition hover:text-white">Home</a>
                <a href="#about" className="transition hover:text-white">About</a>
                <a href="#roles" className="transition hover:text-white">Roles</a>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Admin Portals</p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <button type="button" className="text-left transition hover:text-white" onClick={() => navigate('tpo/login')}>
                  Login as TPO Admin
                </button>
                <button type="button" className="text-left transition hover:text-white" onClick={() => navigate('management/login')}>
                  Login as Management Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
          © 2026 College Placement Management System
        </div>
      </div>
    </footer>
  );
}

export default LandFooter;
