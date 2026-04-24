import About1 from '../../assets/aboutImg1.jpg';
import About2 from '../../assets/aboutImg2.jpg';
import About3 from '../../assets/aboutImg3.jpg';

function LandAbout() {
  const aboutCards = [
    {
      title: 'Student-first workflow',
      image: About2,
      text: 'Students can create accounts, build placement profiles, upload resumes, and stay aligned with the latest opportunities.',
    },
    {
      title: 'Smarter placement management',
      image: About1,
      text: 'The platform keeps company listings, job posts, applications, and approvals in one place for faster coordination.',
    },
    {
      title: 'Clear visibility for admins',
      image: About3,
      text: 'TPO and management teams can track progress, review student data, and keep the placement process organized.',
    },
  ];

  return (
    <section id='about' className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">About CPMS</p>
          <h2 className="playfair mt-3 text-4xl text-slate-900 md:text-5xl">Built to make campus placements easier to manage and easier to trust.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            The current homepage had the right message, but it needed stronger hierarchy and cleaner cards. This section now explains the product more clearly and gives each idea enough space to breathe.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {aboutCards.map((card) => (
            <article key={card.title} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
              <img src={card.image} alt={card.title} className="h-56 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandAbout;
