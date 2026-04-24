import { useNavigate } from 'react-router-dom';
import HeroImg from '../../assets/heroImg.jpg';

function LandingHeroPage() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <img src={HeroImg} alt="Students preparing for placements" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.78),rgba(30,41,59,0.82))]"></div>
      </div>

      <div className="relative mx-auto grid min-h-[86vh] max-w-7xl items-center gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="max-w-3xl">
          <span className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">
            Campus placements, organized better
          </span>
          <h1 className="playfair text-5xl leading-tight text-white md:text-6xl lg:text-7xl">
            One portal for students, TPO, management, and placements.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            CPMS brings student records, company listings, job applications, approvals, and placement updates into one clear workflow.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-950/25 transition hover:bg-emerald-300"
              onClick={() => navigate('student/signup')}
            >
              Create Student Account
            </button>
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/16"
              onClick={() => navigate('student/login')}
            >
              Student Login
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">4</p>
              <p className="mt-1 text-sm text-slate-300">distinct login roles</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">1</p>
              <p className="mt-1 text-sm text-slate-300">shared placement workflow</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="mt-1 text-sm text-slate-300">access to records and updates</p>
            </div>
          </div>
        </div>

        <div id="roles" className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Quick Entry</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Choose your portal</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Students can sign up directly. TPO and management teams can jump straight into their login portals.
          </p>

          <div className="mt-6 space-y-3">
            <button type="button" className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-4 text-left text-slate-900 shadow-lg transition hover:-translate-y-0.5" onClick={() => navigate('student/login')}>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Student</span>
                <span className="mt-1 block text-base font-semibold">Apply, track, and update profile</span>
              </span>
              <span className="text-xl">-&gt;</span>
            </button>
            <button type="button" className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-left text-white transition hover:bg-slate-900/80" onClick={() => navigate('tpo/login')}>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">TPO Admin</span>
                <span className="mt-1 block text-base font-semibold">Manage jobs, companies, approvals</span>
              </span>
              <span className="text-xl">-&gt;</span>
            </button>
            <button type="button" className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-left text-white transition hover:bg-slate-900/80" onClick={() => navigate('management/login')}>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Management</span>
                <span className="mt-1 block text-base font-semibold">Oversee the full placement pipeline</span>
              </span>
              <span className="text-xl">-&gt;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingHeroPage;
