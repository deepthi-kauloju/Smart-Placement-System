import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL, FILE_BASE_URL } from '../config/config';

function ViewNotice() {
  document.title = 'CPMS | Notice';
  const navigate = useNavigate();
  const noticeId = useParams();
  const [notice, setNotice] = useState({});

  const fetchNotice = async () => {
    try {
      if (!noticeId) return;
      const response = await axios.get(`${BASE_URL}/management/get-notice?noticeId=${noticeId.noticeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      // console.log(response?.data);
      setNotice(response?.data);
    } catch (error) {
      console.log("error while fetching notice => ", error);
    }
  }

  useEffect(() => {
    fetchNotice();
    if (notice === null) navigate('/404');
  }, [noticeId]);

  return (
    <>
      <div className="dashboard-card my-4 rounded-2xl p-6 text-base max-sm:text-sm">
        <div className="flex flex-col gap-2 justify-between">
          <p className="dashboard-kicker">Notice</p>
          <span className='dashboard-section-title my-2 text-3xl max-sm:my-1 max-sm:text-xl'>
            {notice?.title}
          </span>
          <span className='leading-7 text-slate-600'>
            {notice?.message}
          </span>
          {
            notice?.attachment?.filepath && (
              <a
                className='dashboard-pill mt-3 w-fit bg-blue-100 text-blue-700 no-underline'
                href={FILE_BASE_URL + notice.attachment.filepath}
                target='_blank'
                rel='noreferrer'
              >
                <i className="fa-solid fa-paperclip pr-2" />
                Open Attachment
              </a>
            )
          }
          <span className='my-1 text-right text-sm font-semibold text-slate-400'>
            {new Date(notice?.createdAt).toLocaleDateString('en-IN') + " " + new Date(notice?.createdAt).toLocaleTimeString('en-IN')}
          </span>
        </div>
      </div>
    </>
  )
}

export default ViewNotice
