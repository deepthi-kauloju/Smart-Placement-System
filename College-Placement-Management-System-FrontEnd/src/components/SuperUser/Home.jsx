import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { FaClipboardCheck, FaUserShield, FaUsers } from 'react-icons/fa';
import { GrUserWorker } from 'react-icons/gr';
import { PiStudentDuotone } from 'react-icons/pi';
import { BASE_URL } from '../../config/config';

function Home() {
  document.title = 'CPMS | Admin Dashboard';

  const [countUsers, setCountUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/all-users`);
        setCountUsers(response.data);
      } catch (error) {
        console.log("Home.jsx => ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const statCards = [
    {
      label: 'Management Admins',
      value: countUsers.managementUsers,
      to: '../admin/management',
      icon: <FaUserShield />,
      tone: 'from-blue-500 to-blue-700',
      note: 'System governance',
    },
    {
      label: 'TPO Admins',
      value: countUsers.tpoUsers,
      to: '../admin/tpo',
      icon: <GrUserWorker />,
      tone: 'from-emerald-500 to-teal-700',
      note: 'Placement operations',
    },
    {
      label: 'Student Users',
      value: countUsers.studentUsers,
      to: '../admin/student',
      icon: <PiStudentDuotone />,
      tone: 'from-violet-500 to-indigo-700',
      note: 'Registered candidates',
    },
    {
      label: 'Superusers',
      value: countUsers.superUsers,
      icon: <FaUsers />,
      tone: 'from-slate-700 to-slate-950',
      note: 'Full access users',
    },
  ];

  return (
    <>
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-700 max-sm:text-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const content = (
                <div className="dashboard-card group relative min-h-44 overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200">
                  <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-gradient-to-br ${card.tone} opacity-20 transition group-hover:opacity-25`} />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{card.label}</p>
                      <p className="mt-3 text-5xl font-extrabold tracking-tight text-slate-950">{card.value ?? 0}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-xl text-white shadow-lg shadow-slate-200`}>
                      {card.icon}
                    </div>
                  </div>
                  <p className="relative mt-5 text-sm font-medium text-slate-500">{card.note}</p>
                </div>
              );

              return card.to ? (
                <Link key={card.label} className="no-underline" to={card.to}>
                  {content}
                </Link>
              ) : (
                <div key={card.label}>{content}</div>
              );
            })}
          </div>

          {countUsers.studentApprovalPendingUsers !== 0 && (
            <Link className='no-underline' to='../admin/approve-student'>
              <div className="dashboard-card flex flex-col gap-4 rounded-2xl border-red-200 bg-red-50/80 p-5 text-slate-900 transition hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-2xl text-white shadow-lg shadow-red-200">
                    <FaClipboardCheck />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-700">Action Needed</p>
                    <h2 className="mt-1 text-2xl font-extrabold text-slate-950">Student Approval Pending</h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge bg="danger" pill className='px-3 py-2'>Review Queue</Badge>
                  <span className='text-4xl font-extrabold text-red-700'>{countUsers.studentApprovalPendingUsers}</span>
                </div>
              </div>
            </Link>
          )}

          <div className="dashboard-card rounded-2xl p-5">
            <p className="dashboard-kicker">Admin Overview</p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-950">Your control center is ready.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Use the sidebar to manage users, companies, job listings, and approval workflows across the placement system.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
