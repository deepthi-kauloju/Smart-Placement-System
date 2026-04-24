import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Placeholder from 'react-bootstrap/Placeholder';
import { useLocation, useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ModalBox from './Modal';
import Toast from './Toast';
import { BASE_URL } from '../config/config';
import TablePlaceholder from './TablePlaceholder';

function AllCompany() {
  document.title = 'CPMS | All Company';

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [companys, setCompanys] = useState({});
  const [jobs, setJobs] = useState({});

  const [modalBody, setModalBody] = useState({
    companyName: "",
    companyId: ""
  });

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  // stores only user role
  const [currentUser, setCurrentUser] = useState('');

  const fetchCurrentUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response?.data) setCurrentUser(response?.data?.role);
    } catch (error) {
      console.log("Account.jsx => ", error);
    }
  }

  const fetchCompanys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/company/company-detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCompanys(response.data.companys);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  const handleDeleteCompany = (companyName, companyId) => {
    setModalBody({ companyId: companyId, companyName: companyName });
    setShowModal(true);
  }

  const confirmDelete = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/company/delete-company`,
        { companyId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        },
      );

      setShowModal(false);
      fetchCompanys();
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error deleting job ", error);
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`);
      setJobs(response.data.data);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  const renderTooltipDeleteCompany = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete Company
    </Tooltip>
  );

  const renderTooltipEditCompany = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit Company
    </Tooltip>
  );


  const closeModal = () => setShowModal(false);

  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      // Clear the state after the toast is shown
      navigate('.', { replace: true, state: {} });
    }
    fetchCurrentUserData();
    fetchCompanys();
    fetchJobs();
  }, []);


  return (
    <>
      <>
        {/* Toast Component */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
          delay={3000}
          position="bottom-end"
        />

        <div>
          {
            loading ? (
              // fake table loading animation 
              <TablePlaceholder />
            ) : (
              <div className="dashboard-card overflow-x-auto rounded-2xl p-3 md:p-5">
              <Table hover className='dashboard-table mb-0 min-w-[980px] bg-white text-sm'>
                <thead>
                  <tr>
                    <th style={{ width: '7%' }}>Sr. No.</th>
                    <th style={{ width: '18%' }}><b>Company Name</b></th>
                    <th style={{ width: '15%' }}>Company Website</th>
                    <th style={{ width: '15%' }}>Company Location</th>
                    <th style={{ width: '17%' }}>Company Difficulty Level</th>
                    <th style={{ width: '13%' }}>No. of Jobs Posted</th>
                    <th style={{ width: '15%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companys?.length > 0 ? (
                    companys?.map((company, index) => (
                      <tr key={company?._id}>
                        <td>{index + 1}</td>
                        <td>
                          <b>
                            {company?.companyName}
                          </b>
                        </td>
                        <td>
                          <a
                            href={company?.companyWebsite}
                            target="_blank"
                            className='dashboard-table-link'
                            rel="noopener noreferrer"
                          >
                            {company?.companyWebsite}
                          </a>
                        </td>
                        <td>
                          {company?.companyLocation}
                        </td>
                        <td>
                          {
                            company?.companyDifficulty === "Easy" && (
                              <span className='dashboard-pill bg-green-100 text-green-700'>{company?.companyDifficulty}</span>
                            )
                          }
                          {
                            company?.companyDifficulty === "Moderate" && (
                              <span className='dashboard-pill bg-orange-100 text-orange-700'>{company?.companyDifficulty}</span>
                            )
                          }
                          {
                            company?.companyDifficulty === "Hard" && (
                              <span className='dashboard-pill bg-red-100 text-red-700'>{company?.companyDifficulty}</span>
                            )
                          }
                        </td>
                        <td>
                          {
                            jobs.filter(job => job?.company == company?._id).length
                          }
                        </td>
                        <td>
                          {/* for hover label effect  */}
                          <div className="flex justify-around items-center max-sm:flex-col max-sm:gap-1">
                            <div className="px-0.5">
                              {/* edit company  */}
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltipEditCompany}
                              >
                                <i
                                  className="fa-regular fa-pen-to-square cursor-pointer text-xl text-slate-400 transition-colors duration-200 ease-in-out hover:text-blue-600 max-sm:text-lg"
                                  onClick={() => {
                                    if (currentUser === 'tpo_admin') navigate(`../tpo/add-company/${company._id}`)
                                    else if (currentUser === 'management_admin') navigate(`../management/add-company/${company._id}`);
                                    else if (currentUser === 'superuser') navigate(`../admin/add-company/${company._id}`);
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.classList.add('fa-solid');
                                    e.target.classList.remove('fa-regular');
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.classList.add('fa-regular');
                                    e.target.classList.remove('fa-solid');
                                  }}
                                />
                              </OverlayTrigger>
                            </div>
                            <div className="px-0.5">
                              {/* delete company  */}
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltipDeleteCompany}
                              >
                                <i
                                  className="fa-regular fa-trash-can cursor-pointer text-xl text-slate-400 transition-colors duration-200 ease-in-out hover:text-red-600 max-sm:text-lg"
                                  onClick={() => handleDeleteCompany(company?.companyName, company?._id)}
                                  onMouseEnter={(e) => {
                                    e.target.classList.add('fa-solid');
                                    e.target.classList.remove('fa-regular');
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.classList.add('fa-regular');
                                    e.target.classList.remove('fa-solid');
                                  }}
                                />
                              </OverlayTrigger>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center font-semibold text-slate-500">No companies found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              </div>
            )
          }
        </div >


        {/* ModalBox Component for Delete Confirmation */}
        <ModalBox
          show={showModal}
          close={closeModal}
          header={"Confirmation"}
          body={`Do you want to delete company ${modalBody.companyName}?`}
          btn={"Delete"}
          confirmAction={() => confirmDelete(modalBody.companyId)}
        />
      </>
    </>
  )
}

export default AllCompany
