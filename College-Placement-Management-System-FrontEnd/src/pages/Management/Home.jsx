import React from 'react';
import { Link } from 'react-router-dom';
import NoticeBox from '../../components/NoticeBox';
import NotificationBox from '../../components/NotificationBox';
import { FaBriefcase, FaBuilding, FaClipboardCheck } from 'react-icons/fa';
import { GrUserWorker } from 'react-icons/gr';

// management
function Home() {
  document.title = 'CPMS | Management Dashboard';

  const quickActions = [
    {
      title: 'TPO Admins',
      description: 'Review and create placement officer accounts.',
      to: '/management/tpo-admin',
      icon: <GrUserWorker />,
      tone: 'from-blue-500 to-blue-700',
    },
    {
      title: 'Approve Students',
      description: 'Clear pending student registrations.',
      to: '/management/approve-student',
      icon: <FaClipboardCheck />,
      tone: 'from-emerald-500 to-teal-700',
    },
    {
      title: 'Companies',
      description: 'Maintain recruiter and company records.',
      to: '/management/companys',
      icon: <FaBuilding />,
      tone: 'from-violet-500 to-indigo-700',
    },
    {
      title: 'Job Listings',
      description: 'Create and monitor placement opportunities.',
      to: '/management/job-listings',
      icon: <FaBriefcase />,
      tone: 'from-slate-700 to-slate-950',
    },
  ];

  return (
    <>
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.to} className="no-underline">
            <div className="dashboard-card group h-full rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.tone} text-xl text-white shadow-lg shadow-slate-200`}>
                {action.icon}
              </div>
              <h2 className="mt-4 text-xl font-extrabold text-slate-950">{action.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
        <NotificationBox />
        <NoticeBox />
      </div>
    </>
  )
}

export default Home
