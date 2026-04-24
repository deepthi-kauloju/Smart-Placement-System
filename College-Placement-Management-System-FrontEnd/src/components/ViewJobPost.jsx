import React, { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Toast from './Toast';
import Button from 'react-bootstrap/Button';
import ModalBox from './Modal';
import { BASE_URL } from '../config/config';


function ViewJobPost() {
  document.title = 'CPMS | View Job Post';
  const { jobId } = useParams();

  const [data, setData] = useState({});
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  // useState for load data
  const [currentUser, setCurrentUser] = useState({});


  // check applied to a job
  const [applied, setApplied] = useState(false);

  const [applicant, setApplicant] = useState([]);

  // check applied to a job
  const fetchApplied = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/check-applied/${jobId}/${currentUser.id}`);
      // console.log(response.data);
      if (response?.data?.applied) {
        setApplied(response?.data?.applied)
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      console.log("error while fetching student applied or not => ", error);
    }
  }

  // checking for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
        setToastMessage(err);
        setShowToast(true);
      });
  }, []);

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      setData(response.data);
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)
        setShowToast(true);

        if (error?.response?.data?.msg === "job data not found") navigate('../404');
      }
      console.log("Error while fetching details => ", error);
    }
  }

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${data.company}`);
      setCompany(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    }
  }

  // handle apply and its modal
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleApply = () => {
    setModalBody("Do you really want to apply this job? Make sure your profile is updated to lastest that increase placement chances.");
    setShowModal(true);
    // console.log(currentUser)
  }

  const handleConfirmApply = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/student/job/${jobId}/${currentUser.id}`);
      // console.log(response.data);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      setShowModal(false);
      fetchApplied();
      // setCompany(response.data.company);
    } catch (error) {
      setShowModal(false);
      if (error?.response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      console.log("error while fetching apply to job => ", error);
    }
  }

  const fetchApplicant = async () => {
    if (!jobId || currentUser?.role === 'student') return;
    await axios.get(`${BASE_URL}/tpo/job/applicants/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res?.data?.msg) setToastMessage(res.data.msg)
        else setApplicant(res?.data?.applicantsList);
      })
      .catch(err => {
        console.log(err);
        if (err?.response?.data?.msg) setToastMessage(err.response.data.msg)
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchApplied();
        if (data?.company) {
          await fetchCompanyData();
        }
        if (currentUser.id) {
          await fetchJobDetail();
        }
        if (jobId)
          await fetchApplicant();
      } catch (error) {
        console.error("Error during fetching and applying job:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentUser.id, data?.company, jobId]);



  return (
    <>
      {/*  any message here  */}
      < Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {
        loading ? (
          <div className="flex justify-center h-72 items-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl" />
          </div>
        ) : (
          <>
            <div className="my-4 grid grid-cols-2 gap-5 text-base max-sm:grid-cols-1 max-sm:text-sm">
              <div className="flex flex-col grid-flow-row-dense gap-2">

                <div className="">
                  {/* Company Details  */}
                  <Accordion defaultActiveKey={['0']} alwaysOpen className='dashboard-accordion'>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Company Details</Accordion.Header>
                      <Accordion.Body>
                        <div className="">
                          {/* company name  */}
                          <h3 className='dashboard-section-title mb-4 border-b border-slate-200 py-4 text-center text-3xl'>
                            {company?.companyName}
                          </h3>
                          <div className="border-b border-slate-200 px-2 pb-4 text-justify leading-7 text-slate-500">
                            {company?.companyDescription}
                          </div>
                          <div className="my-2 flex justify-between border-b border-slate-200 p-2">
                            {/* company website  */}
                            <span>Website</span>
                            <span className='dashboard-pill bg-blue-100 text-blue-700'>
                              <a
                                href={`${company?.companyWebsite}`}
                                target='_blanck'
                                className='no-underline text-blue-700'
                              >
                                {company?.companyWebsite}
                              </a>
                            </span>
                          </div>
                          <div className="my-2 flex justify-between border-b border-slate-200 p-2">
                            {/* company location  */}
                            <span>Job Locations</span>
                            <div className="flex gap-2">
                              {company?.companyLocation?.split(',').map((location, index) => (
                                <span key={index} className='dashboard-pill bg-slate-100 text-slate-700'>
                                  {location.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="my-2 flex justify-between border-b border-slate-200 p-2">
                            {/* company difficulty  */}
                            <span>Difficulty Level</span>
                            {
                              company?.companyDifficulty === "Easy" &&
                              <span className='dashboard-pill bg-green-100 text-green-700'>
                                {company?.companyDifficulty}
                              </span>
                            }
                            {
                              company?.companyDifficulty === "Moderate" &&
                              <span className='dashboard-pill bg-orange-100 text-orange-700'>
                                {company?.companyDifficulty}
                              </span>
                            }
                            {
                              company?.companyDifficulty === "Hard" &&
                              <span className='dashboard-pill bg-red-100 text-red-700'>
                                {company?.companyDifficulty}
                              </span>
                            }
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>

                {
                  currentUser.role !== "student" && (
                    <>
                      {/* pending */}
                      <div className="">
                        {/* Applicants applied */}
                        <Accordion defaultActiveKey={['3']} alwaysOpen className='dashboard-accordion'>
                          <Accordion.Item eventKey="3">
                            <Accordion.Header>Applicants Applied</Accordion.Header>
                            <Accordion.Body>
                              <div className="overflow-x-auto">
                              <Table hover size='sm' className='dashboard-table mb-0 min-w-[760px] bg-white text-center text-sm'>
                                <thead>
                                  <tr>
                                    <th style={{ width: '10%' }}>#</th>
                                    <th style={{ width: '20%' }}>Name</th>
                                    <th style={{ width: '15%' }}>Email</th>
                                    <th style={{ width: '20%' }}>Current Round</th>
                                    <th style={{ width: '15%' }}>Status</th>
                                    <th style={{ width: '20%' }}>Applied On</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    applicant?.length > 0 ? (
                                      <>
                                        {
                                          applicant.map((app, index) => (
                                            <tr key={index}>
                                              <td>{index + 1}</td>
                                              <td>
                                                {
                                                  (currentUser.role === 'tpo_admin' ||
                                                    currentUser.role === 'management_admin' ||
                                                    currentUser.role === 'superuser') && (
                                                    <Link
                                                      to={
                                                        currentUser.role === 'tpo_admin'
                                                          ? `/tpo/user/${app.id}`
                                                          : currentUser.role === 'management_admin'
                                                            ? `/management/user/${app.id}`
                                                            : currentUser.role === 'superuser'
                                                              ? `/admin/user/${app.id}`
                                                              : '#'
                                                      }
                                                      target='_blank'
                                                      className='dashboard-table-link'
                                                    >
                                                      {app.name}
                                                    </Link>
                                                  )
                                                }
                                              </td>
                                              <td>{app.email}</td>
                                              <td>{(app?.currentRound?.charAt(0)?.toUpperCase() + app?.currentRound?.slice(1)) || '-'}</td>
                                              <td>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</td>
                                              <td>{new Date(app.appliedAt).toLocaleString('en-IN')}</td>
                                            </tr>
                                          ))
                                        }
                                      </>
                                    ) : (
                                      <tr>
                                        <td colSpan={6} className="py-8 text-center font-semibold text-slate-500">No students have applied yet.</td>
                                      </tr>
                                    )
                                  }
                                </tbody>
                              </Table>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                    </>
                  )
                }

              </div>


              <div className="">
                {/* Job details  */}
                <Accordion defaultActiveKey={['1']} alwaysOpen className='dashboard-accordion'>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Job Details</Accordion.Header>
                    <Accordion.Body>
                      <div className="flex flex-col gap-4">
                        {/* job title  */}
                        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 shadow-sm">
                          <span className='block border-b border-slate-200 py-3 text-lg font-extrabold text-blue-700'>
                            Job Title
                          </span>
                          <span className='py-3'>
                            {data?.jobTitle}
                          </span>
                        </div>
                        {/* job Profile  */}
                        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 shadow-sm">
                          <span className='block border-b border-slate-200 py-3 text-lg font-extrabold text-blue-700'>
                            Job Profile
                          </span>
                          <span className='py-3' dangerouslySetInnerHTML={{ __html: data?.jobDescription }} />
                        </div>
                        {/* job eligibility  */}
                        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 shadow-sm">
                          <span className='block border-b border-slate-200 py-3 text-lg font-extrabold text-blue-700'>
                            Eligibility
                          </span>
                          <span className='py-3' dangerouslySetInnerHTML={{ __html: data?.eligibility }} />
                        </div>
                        {/* job salary  */}
                        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 shadow-sm">
                          <span className='block border-b border-slate-200 py-3 text-lg font-extrabold text-blue-700'>
                            Annual CTC
                          </span>
                          <span className='py-3'>
                            {data?.salary} LPA
                          </span>
                        </div>
                        {/* job deadline  */}
                        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 shadow-sm">
                          <span className='block border-b border-slate-200 py-3 text-lg font-extrabold text-blue-700'>
                            Last Date of Application
                          </span>
                          <span className='py-3'>
                            {new Date(data?.applicationDeadline).toLocaleDateString('en-IN', {
                              month: 'long',
                              year: 'numeric',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {/* how to apply  */}
                        {
                          (applied === true || currentUser?.role !== 'student') && (
                            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 shadow-sm">
                              <span className='block border-b border-slate-200 py-3 text-lg font-extrabold text-blue-700'>
                                How to Apply?
                              </span>
                              <span className='py-3' dangerouslySetInnerHTML={{ __html: data?.howToApply }} />
                            </div>
                          )
                        }
                        {
                          currentUser.role === 'student' && (
                            <div className="flex justify-center">
                              {
                                applied === false ? (
                                  <Button className="rounded-full px-5 py-2 text-sm font-bold" variant="warning" onClick={handleApply}>
                                    <i className="fa-solid fa-check px-2" />
                                    Apply Now
                                  </Button>
                                ) : (
                                  <Link to={`/student/status/${jobId}`}>
                                    <Button className="rounded-full px-5 py-2 text-sm font-bold" variant="warning">
                                      <i className="fa-solid fa-check px-2" />
                                      Update Status
                                    </Button>
                                  </Link>
                                )
                              }
                            </div>
                          )
                        }
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>

            </div>
          </>
        )
      }


      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={modalBody}
        btn={"Apply"}
        confirmAction={handleConfirmApply}
      />

    </>
  )
}

export default ViewJobPost
