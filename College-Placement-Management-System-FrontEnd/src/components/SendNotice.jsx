import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from './Toast';
import ModalBox from './Modal';
import { BASE_URL } from '../config/config';
import { useNavigate } from 'react-router-dom';

function SendNotice() {
  document.title = 'CPMS | Send Notice';

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // Loading state for initial fetch

  const [data, setData] = useState({});          // Form data state
  const [error, setError] = useState('');        // Error message state

  const [currentUser, setCurrentUser] = useState({ role: '', id: '' });  // Current user state
  const [showToast, setShowToast] = useState(false);                     // Toast visibility
  const [toastMessage, setToastMessage] = useState('');                  // Toast message content
  const [showModal, setShowModal] = useState(false);                     // Modal visibility
  const [attachment, setAttachment] = useState(null);

  const closeModal = () => setShowModal(false);  // Function to close the modal

  // Fetch current user data and handle authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  // Redirect to login if no token
      return;
    }

    axios.get(`${BASE_URL}/user/detail`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          role: res.data.role,
        });
        setLoading(false);  // End loading once data is fetched
      })
      .catch(err => {
        console.log("SendNotice.jsx => ", err);
        navigate('/login');  // Redirect to login on error
      });
  }, [navigate]);

  // Handle form input changes
  const handleDataChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  // Submit form
  const handleSubmit = () => {
    if (!data?.message || (currentUser?.role !== 'tpo_admin' && !data?.receiver_role)) {
      setError('All Fields Required!');
      return;
    }
    setError('');
    setShowModal(true);  // Show confirmation modal
  }

  // Confirm the submission
  const confirmSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('sender', data?.sender || '');
      formData.append('sender_role', data?.sender_role || '');
      formData.append('receiver_role', data?.receiver_role || 'student');
      formData.append('title', data?.title || '');
      formData.append('message', data?.message || '');
      if (attachment) formData.append('attachment', attachment);

      const response = await axios.post(`${BASE_URL}/management/send-notice`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      if (currentUser?.role === 'management_admin') navigate('/management/all-notice');
      else if (currentUser?.role === 'superuser') navigate('/admin/all-notice');
      else navigate('/tpo/all-notice');
    } catch (error) {
      console.log('Error while sending notice: ', error);
      setToastMessage(error?.response?.data?.msg || 'Unable to send notice right now.');
      setShowToast(true);
    }
    setShowModal(false);
  }

  // Update data with current user info after user data is loaded
  useEffect(() => {
    if (currentUser?.role && currentUser?.id) {
      setData(prevData => ({
        ...prevData,
        sender: currentUser?.id,
        sender_role: currentUser?.role,
      }));
    }
  }, [currentUser]);

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

      {loading ? (
        <div className="flex justify-center h-72 items-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl" />
        </div>
      ) : (
        <>
          <div>
            <div className="dashboard-card my-4 rounded-2xl p-6 md:p-8 max-sm:text-sm">
              <div className="mb-6">
                <p className="dashboard-kicker">Communication</p>
                <h2 className="dashboard-section-title mt-2 text-2xl">Send Notice</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Create a clear announcement for students or placement team members.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">

                {/* Receiver Role (Only for Management Admin) */}
                {(currentUser?.role === 'management_admin' || currentUser?.role === 'superuser') && (
                  <FloatingLabel
                    controlId="floatingSendTo"
                    label={<span>Receiver Role <span style={{ color: 'red' }}>*</span></span>}
                  >
                    <Form.Select
                      aria-label="Floating label select send to"
                      className="auth-input cursor-pointer"
                      name="receiver_role"
                      value={data?.receiver_role || ""}
                      onChange={handleDataChange}
                    >
                      <option disabled value="" className="text-gray-400">
                        Select Receiver Role...
                      </option>
                      <option value="student">Student</option>
                      <option value="tpo_admin">TPO</option>
                      <option value="management_admin">Management</option>
                      {currentUser?.role === 'superuser' && <option value="superuser">Super Admin</option>}
                    </Form.Select>
                  </FloatingLabel>
                )}

                {/* Title Input */}
                <FloatingLabel
                  controlId="floatingTitle"
                  label={<span>Title <span style={{ color: 'red' }}>*</span></span>}
                  className={currentUser?.role === 'tpo_admin' ? 'col-span-2' : ''}
                >
                  <Form.Control
                    className="auth-input"
                    type="text"
                    placeholder="Title"
                    name='title'
                    value={data?.title || ""}
                    onChange={handleDataChange}
                  />
                </FloatingLabel>

                {/* Message Input */}
                <div className="col-span-2">
                  <FloatingLabel
                    controlId="floatingMessage"
                    label={<span>Message <span style={{ color: 'red' }}>*</span></span>}
                  >
                    <Form.Control
                      className="auth-input"
                      as="textarea"
                      placeholder="Message"
                      name='message'
                      style={{ maxHeight: "250px", height: "200px" }}
                      value={data?.message || ""}
                      onChange={handleDataChange}
                    />
                  </FloatingLabel>
                </div>

                <div className="col-span-2">
                  <FloatingLabel
                    controlId="floatingAttachment"
                    label={<span>Attachment (optional)</span>}
                  >
                    <Form.Control
                      className="auth-input"
                      type="file"
                      name='attachment'
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    />
                  </FloatingLabel>
                </div>
              </div>

              {/* Error Display */}
              <div className="mt-2">
                  <span className='text-center text-sm font-semibold text-red-500'>
                  {error && error}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="primary"
                className="auth-submit rounded-full px-6 py-3 text-sm font-bold"
                onClick={handleSubmit}
              >
                <i className="fa-regular fa-paper-plane mr-2" />
                Send
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ModalBox Component */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Sending Notice ${data?.message ? `"${data?.message}"` : ""} to ${data?.receiver_role || "student"}?`}
        btn={"Send"}
        confirmAction={confirmSubmit}
      />
    </>
  )
}

export default SendNotice;
