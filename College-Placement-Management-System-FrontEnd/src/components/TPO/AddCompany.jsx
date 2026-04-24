import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { BASE_URL } from '../../config/config';

function AddCompany() {
  document.title = 'CPMS | Add Company';
  const navigate = useNavigate();
  const location = useLocation();
  const portal = location.pathname.split('/').filter(Boolean)[0] || 'tpo';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { companyId } = useParams();

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.companyName || !data?.companyDescription || !data?.companyDifficulty || !data?.companyLocation || !data?.companyWebsite)
      return setError("All Fields Required!");
    setShowModal(true);
  }

  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/company/add-company`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      if (response?.data?.msg === "Company Created Successfully!") {
        setShowModal(false);
        setToastMessage(response?.data?.msg);
        const dataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg
        }
        navigate(`/${portal}/companys`, { state: dataToPass });
      }
      if (response?.data?.msg === "Company Name Already Exist!") {
        setShowModal(false);
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    }
  }

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${companyId}`);
      setData(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (companyId) fetchCompanyData() }, [companyId])


  useEffect(() => {
    if (!companyId) setLoading(false);
  }, [])


  const handleDataChange = (e) => {
    setError('');
    setData({ ...data, [e.target.name]: e.target.value })
  }


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
            <Form onSubmit={handleSubmit}>
              <div className="dashboard-card my-4 rounded-2xl p-6 md:p-8">
                <div className="mb-6">
                  <p className="dashboard-kicker">Company Profile</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-slate-950">{companyId ? 'Edit Company Details' : 'Add Company Details'}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Keep recruiter information clear so job listings and student applications stay easy to manage.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                    <FloatingLabel controlId="floatingCompanyName" label={
                      <>
                        <span>Company Name <span className='text-red-500'>*</span></span>
                      </>
                    }>
                      <Form.Control
                        className="auth-input"
                        type="text"
                        placeholder="Company Name"
                        name='companyName'
                        value={data?.companyName || ''}
                        onChange={handleDataChange}

                      />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingCompanyLocation" label={
                      <>
                        <span>Company Location <span className='text-red-500'>*</span></span>
                      </>
                    }>
                      <Form.Control
                        className="auth-input"
                        type="text"
                        placeholder="Company Location"
                        name='companyLocation'
                        value={data?.companyLocation || ''}
                        onChange={handleDataChange}

                      />
                    </FloatingLabel>
                  </div>
                  <FloatingLabel controlId="floatingCompanyWebsite" label={
                    <>
                      <span>Company Website <span className='text-red-500'>*</span></span>
                    </>
                  }>
                    <Form.Control
                      className="auth-input"
                      type="link"
                      placeholder="Company Website"
                      name='companyWebsite'
                      value={data?.companyWebsite || ''}
                      onChange={handleDataChange}

                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelectDifficulty" label={
                    <>
                      <span>Difficulty Level <span className='text-red-500'>*</span></span>
                    </>
                  }>
                    <Form.Select
                      aria-label="Floating label select difficulty"
                      className='auth-input cursor-pointer'
                      name='companyDifficulty'
                      value={data?.companyDifficulty || ''}
                      onChange={handleDataChange}

                    >
                      <option disabled value='' className='text-gray-400'>Enter Difficulty Level</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingcompanyDescription" label={
                    <>
                      <span>Company Description <span className='text-red-500'>*</span></span>
                    </>
                  }>
                    <Form.Control
                      className="auth-input"
                      as="textarea"
                      placeholder="Company Description"
                      name='companyDescription'
                      style={{ height: '100px', maxHeight: "450px" }}
                      value={data?.companyDescription || ''}
                      onChange={handleDataChange}

                    />
                  </FloatingLabel>
                </div>
                {
                  error &&
                  <div className="flex pt-2">
                    <span className='text-sm font-semibold text-red-500'>{error}</span>
                  </div>
                }
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button className="auth-submit rounded-full px-5 py-3 text-sm font-bold" variant="primary" type='submit'>
                  {companyId ? 'Update Company' : 'Add Company'}
                </Button>
              </div>
            </Form>
          </>
        )
      }


      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to add company ${data?.companyName}?`}
        btn={"Post"}
        confirmAction={confirmSubmit}
      />
    </>
  )
}
export default AddCompany
