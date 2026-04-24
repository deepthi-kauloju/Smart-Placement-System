import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/config';

// for management adn tpo admins
function NotificationBox() {
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setCurrentUser({ role: response.data.role });
      } catch (error) {
        console.log("Error fetching user details => ", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [currentUser?.role]);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/notify-interview-hired`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const students = response.data.studentsWithJobDetails;

      // Filtering students with 'interview' or 'hired' status
      const filteredJobs = students.map(student => {
        return {
          id: student._id,
          studentName: student.name,
          department: student.department,
          year: student.year,
          jobs: student.jobs.filter(job => job.status === 'interview' || job.status === 'hired')
        };
      }).filter(student => student.jobs.length > 0);

      setNotify(filteredJobs);
    } catch (error) {
      console.log('Error while fetching updates notification: ', error);
    } finally {
      setLoading(false); // Turn off loading after fetching
    }
  };

  return (
    <>
      <div className="dashboard-card my-2 w-full rounded-2xl p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="dashboard-kicker">Live Updates</p>
            <h3 className="mt-1 text-xl font-extrabold text-slate-950">Notification</h3>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <i className="fa-solid fa-spinner fa-spin text-2xl" />
          </div>
        ) : (
          <div className="relative h-72 overflow-hidden">
            <div className="absolute bottom-0 w-full flex flex-col gap-2 h-full animate-scrollUp">
              {notify?.length > 0 ? (
                notify.map((student, studentIndex) => (
                  <Link
                    className='no-underline'
                    to={
                      currentUser?.role === 'tpo_admin' ? `/tpo/user/${student.id}`
                        : currentUser?.role === 'management_admin' && `/management/user/${student.id}`
                    }
                    target="_blank"
                  >
                    <div key={studentIndex} className="h-fit rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-amber-100">
                      <span className='text-base font-semibold text-slate-900'>
                        {student.studentName} from
                        <b>
                          {student.year === 1 && ' First Year '}
                          {student.year === 2 && ' Second Year '}
                          {student.year === 3 && ' Third Year '}
                          {student.year === 4 && ' Fourth Year '}
                        </b>
                        {student.department}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {student.jobs.map((job, jobIndex) => (
                          <Link
                            className='dashboard-table-link'
                            to={
                              currentUser?.role === 'tpo_admin' ? `/tpo/job/${job?.jobId}`
                                : currentUser?.role === 'management_admin' && `/management/job/${job?.jobId}`
                            }
                            target="_blank"
                          >
                            <div key={jobIndex} className="py-1 h-fit">
                              {job?.jobTitle} at {job?.companyName}
                              <span className='mx-2 text-slate-500'>
                                Status: {job?.status.charAt(0).toUpperCase() + job?.status.slice(1)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-center font-semibold text-slate-500">No notifications found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NotificationBox;
