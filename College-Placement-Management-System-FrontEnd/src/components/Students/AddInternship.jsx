import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { BASE_URL } from '../../config/config';

function AddInternship() {
  document.title = 'CPMS | Add Internships';
  const [loading, setLoading] = useState(true);
  const { internshipId } = useParams();
  const navigate = useNavigate();

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState('');

  const closeModal = () => setShowModal(false);

  // store internship info
  const [internship, setInternship] = useState({});

  const [currentUserData, setCurrentUserData] = useState('');

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setCurrentUserData({ id: response.data.id });
        if (!internshipId) setLoading(false);
      } catch (error) {
        console.log("addinternship.jsx => ", error);
      }
    }
    fetchCurrentUserData();
  }, []);

  const fetchInternshipData = async () => {
    try {
      // if no studentId or internshipId then return back none 
      if (!currentUserData?.id || !internshipId) return;
      const response = await axios.get(`${BASE_URL}/student/internship?studentId=${currentUserData?.id}&internshipId=${internshipId}`);
      // console.log(response?.data);
      setInternship(response.data.internship);
      setModalBody(response.data.internship.companyName);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log("error while updating internship ", error);
      if (error.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
      } else {
        setToastMessage("Error while updating internship please try again later!");
      }
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }

  const handleDataChange = (e) => {
    setInternship({ ...internship, [e.target.name]: e.target.value });
    if (e.target.name === "companyName")
      setModalBody(e.target.value);
  }

  // for formating date of birth
  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const handleSubmit = () => {
    if (!internship?.companyName || !internship?.internshipDuration || !internship?.startDate || !internship?.type) {
      setToastMessage('Star Marked Required!');
      setShowToast(true);
      return;
    }
    setShowModal(true);
  }

  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/student/update-internship?studentId=${currentUserData?.id}&internshipId=${internshipId}`, { internship });
      // console.log(response?.data);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
        if (response?.data?.msg === "Internship Updated Successfully!") {
          const dataToPass = {
            showToastPass: true,
            toastMessagePass: response?.data?.msg
          }
          navigate('/student/internship', { state: dataToPass })
        }
      }
    } catch (error) {
      console.log("error while updating internship ", error);
      if (error.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
      } else {
        setToastMessage("Error while updating internship please try again later!");
      }
      setShowToast(true);
    }
    setShowModal(false);
  }


  useEffect(() => {
    fetchInternshipData();
  }, [currentUserData?.id]);

  return (
    <>
      {/* Toast Component */}
      <Toast
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
            <div className="dashboard-card my-4 rounded-2xl p-6 md:p-8">
              <div className="mb-6">
                <p className="dashboard-kicker">Experience</p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-950">{internshipId ? 'Update Internship' : 'Add Internship'}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add verified internship experience to strengthen your placement profile.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <FloatingLabel controlId="floatingCompanyName" label={
                  <>
                    <span>Company Name <span style={{ color: 'red' }}>*</span></span>
                  </>
                }>
                  <Form.Control
                    className="auth-input"
                    type="text"
                    placeholder="Company Name"
                    name='companyName'
                    value={internship?.companyName || ""}
                    onChange={handleDataChange}
                  />
                </FloatingLabel >
                <FloatingLabel controlId="floatingCompanyWebsite" label="Company Website">
                  <Form.Control
                    className="auth-input"
                    type="link"
                    placeholder="Company Website"
                    name='companyWebsite'
                    value={internship?.companyWebsite || ""}
                    onChange={handleDataChange}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInternshipDuration" label={
                  <>
                    <span>Internship Duration In Days <span style={{ color: 'red' }}>*</span></span>
                  </>
                }
                >
                  <Form.Control
                    className="auth-input"
                    type="number"
                    step={1}
                    placeholder="Internship Duration"
                    name='internshipDuration'
                    value={internship?.internshipDuration || ""}
                    onChange={handleDataChange}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingMonthlyStipend" label="Monthly Stipend in Rupees">
                  <Form.Control
                    className="auth-input"
                    type="number"
                    step={500}
                    placeholder="Monthly Stipend in Rupees"
                    name='monthlyStipend'
                    value={internship?.monthlyStipend || ""}
                    onChange={handleDataChange}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingStartDate" label={
                  <>
                    <span>Internship Start Date <span style={{ color: 'red' }}>*</span></span>
                  </>
                }>
                  <Form.Control
                    className="auth-input"
                    type="date"
                    placeholder="Internship Start Date"
                    name='startDate'
                    value={formatDate(internship?.startDate) || ""}
                    onChange={handleDataChange}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingEndDate" label="End Date">
                  <Form.Control
                    className="auth-input"
                    type="date"
                    placeholder="Internship End Date"
                    name='endDate'
                    value={formatDate(internship?.endDate) || ""}
                    onChange={handleDataChange}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelectType" label={
                  <>
                    <span>Select Internship Type <span style={{ color: 'red' }}>*</span></span>
                  </>
                }>
                  <Form.Select
                    aria-label="Floating label select internship type"
                    className='auth-input cursor-pointer'
                    name='type'
                    value={internship?.type || "undefined"}
                    onChange={handleDataChange}
                  >
                    <option disabled value="undefined" className='text-gray-400'>Select Internship Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="On-Site">On-Site</option>
                    <option value="Work From Home">Work From Home</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="floatingCompanyAddress" label="Company Address">
                  <Form.Control
                    className="auth-input"
                    as="textarea"
                    placeholder="Company Address"
                    name='companyAddress'
                    style={{ maxHeight: "200px" }}
                    value={internship?.companyAddress || ""}
                    onChange={handleDataChange}
                  />
                </FloatingLabel>
                <div className="col-span-2 max-sm:col-span-1">
                  <FloatingLabel controlId="floatingDescription" label="Internship Description">
                    <Form.Control
                      className="auth-input"
                      as="textarea"
                      placeholder="Internship Description"
                      name='description'
                      style={{ maxHeight: "350px", minHeight: "150px" }}
                      value={internship?.description || ""}
                      onChange={handleDataChange}
                    />
                  </FloatingLabel>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button className="auth-submit rounded-full px-6 py-3 text-sm font-bold" variant="primary" type='submit' onClick={handleSubmit}>
                {internshipId ? 'Update Internship' : 'Add Internship'}
              </Button>
            </div>
          </>
        )
      }


      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you add internship ${modalBody ? `of ${modalBody}` : ''}?`}
        btn={"Update"}
        confirmAction={confirmSubmit}
      />
    </>
  )
}

export default AddInternship
