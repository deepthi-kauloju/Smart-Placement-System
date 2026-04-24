import React from 'react';
import { Link } from 'react-router-dom';
import NoticeBox from '../../components/NoticeBox';
import NotificationBox from '../../components/Students/NotificationBox';
import { FaBriefcase, FaFileAlt, FaRegCalendarCheck } from 'react-icons/fa';
import { FaBuildingColumns } from 'react-icons/fa6';

// student 
function Home() {
  // Set the page title
  document.title = 'CPMS | Student Dashboard';

  const quickActions = [
    {
      title: 'Job Listings',
      description: 'Explore open placement opportunities.',
      to: '/student/job-listings',
      icon: <FaBriefcase />,
      tone: 'from-blue-500 to-blue-700',
    },
    {
      title: 'Applied Jobs',
      description: 'Track every application and status update.',
      to: '/student/myjob',
      icon: <FaRegCalendarCheck />,
      tone: 'from-emerald-500 to-teal-700',
    },
    {
      title: 'Placement Profile',
      description: 'Keep academic details and resume ready.',
      to: '/student/placement-profile',
      icon: <FaFileAlt />,
      tone: 'from-violet-500 to-indigo-700',
    },
    {
      title: 'Internships',
      description: 'Add and maintain internship history.',
      to: '/student/internship',
      icon: <FaBuildingColumns />,
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
      <div className={`grid grid-cols-2 gap-5 max-sm:grid-cols-1`}>
        <NotificationBox />
        <NoticeBox />
      </div>
    </>
  );
}

export default Home
