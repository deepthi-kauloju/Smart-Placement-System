import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/config';

function NoticeBox() {
  const [loading, setLoading] = useState(true);
  const [noticesData, setNoticesData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  // Fetch the current user data
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

  // Fetch notices only after the user role is available
  useEffect(() => {
    if (currentUser?.role) {
      fetchNotices();
    }
  }, [currentUser?.role]);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/management/get-all-notices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      let filteredNotices = [];
      if (currentUser?.role === 'management_admin') {
        filteredNotices = response.data.filter(notice => (
          notice.receiver_role === 'management_admin' || notice.sender_role === 'management_admin' || notice.sender_role === 'superuser'
        ));
      } else if (currentUser?.role === 'tpo_admin') {
        filteredNotices = response.data.filter(notice => (
          notice.receiver_role === 'tpo_admin' || notice.sender_role === 'tpo_admin' || notice.sender_role === 'management_admin' || notice.sender_role === 'superuser'
        ));
      } else if (currentUser?.role === 'student') {
        filteredNotices = response.data.filter(notice => notice.receiver_role === 'student');
      } else if (currentUser?.role === 'superuser') {
        filteredNotices = response.data;
      }

      setNoticesData(filteredNotices);
    } catch (error) {
      console.log('Error while fetching notices => ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card my-2 w-full rounded-2xl p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="dashboard-kicker">Announcements</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-950">Notice</h3>
        </div>
        <span className=''>
          {
            currentUser?.role === 'student' && (
              <Link to='/student/all-notice' className='dashboard-table-link'>
                View All
              </Link>
            )
          }
          {
            currentUser?.role === 'tpo_admin' && (
              <Link to='/tpo/all-notice' className='dashboard-table-link'>
                View All
              </Link>
            )
          }
          {
            currentUser?.role === 'management_admin' && (
              <Link to='/management/all-notice' className='dashboard-table-link'>
                View All
              </Link>
            )
          }
          {
            currentUser?.role === 'superuser' && (
              <Link to='/admin/all-notice' className='dashboard-table-link'>
                View All
              </Link>
            )
          }
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <i className="fa-solid fa-spinner fa-spin text-2xl" />
        </div>
      ) : (
        <div className="relative h-72 overflow-hidden">
          <div className="absolute bottom-0 w-full h-full animate-scrollUp">
            {noticesData?.length > 0 ? (
              noticesData.map((notice, index) => (
                <div key={index} className="h-fit border-b border-slate-100 py-3 last:border-b-0">
                  <Link
                    className='dashboard-table-link'
                    to={
                      currentUser?.role === 'student'
                        ? `/student/notice/${notice?._id}`
                        : currentUser?.role === 'tpo_admin'
                          ? `/tpo/notice/${notice?._id}`
                          : currentUser.role === 'management_admin'
                            ? `/management/notice/${notice?._id}`
                            : currentUser?.role === 'superuser'
                              ? `/admin/notice/${notice?._id}`
                              : ''
                    }
                    target="_blank"
                  >
                    {notice?.title}
                    {/* Show the badge if the notice is within 2 days */}
                    {(new Date() - new Date(notice?.createdAt)) / (1000 * 60 * 60 * 24) <= 2 && (
                      <Badge className="mx-2" bg="primary">New</Badge>
                    )}
                  </Link>
                  <span className='mx-1 text-xs font-medium text-slate-400'>
                    {new Date(notice?.createdAt).toLocaleDateString('en-IN') + " " + new Date(notice?.createdAt).toLocaleTimeString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-10 text-center font-semibold text-slate-500">No notices found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeBox;
