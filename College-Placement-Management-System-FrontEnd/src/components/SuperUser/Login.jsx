import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/CPMS.png';
import isAuthenticated from '../../utility/auth.utility';
import Toast from '../../components/Toast';
import { Button } from 'react-bootstrap';
import { BASE_URL } from '../../config/config';

function LoginSuperUser() {
  document.title = 'CPMS | Admin Login';
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('../admin/dashboard');
    }
  }, [navigate]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') return setError({ ...error, email: '' });
    if (e.target.name === 'password') return setError({ ...error, password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.email && !formData?.password) return setError({ email: 'Email Required!', password: 'Password Required!' });
    if (!formData?.email) return setError({ email: 'Email Required!' });
    if (!formData?.password) return setError({ password: 'Password Required!' });

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('../admin/dashboard');
    } catch (error) {
      if (error.response.data.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log('Error in admin login.jsx => ', error);
      setLoading(false);
    }
  };

  const [isEyeOpen, setEyeOpen] = useState(false);

  const handleEye = () => {
    setEyeOpen(!isEyeOpen);
  };

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="auth-shell flex justify-center items-center px-4">
        <button type="button" className="auth-back" onClick={() => navigate('/')}>
          <span aria-hidden="true">&larr;</span>
          <span>Home</span>
        </button>        <form className="auth-card form-signin flex justify-center items-center flex-col gap-3 rounded-2xl p-8 w-1/3 max-lg:w-2/3 max-md:w-3/4 max-[400px]:w-4/5" onSubmit={handleSubmit}>
          <div className='flex justify-center items-center flex-col'>
            <img className="mb-4 rounded-xl shadow w-30 h-28 lg:w-40 lg:h-40" src={`${Logo}`} alt="Logo Image" />
            <h1 className="auth-title h3 mb-1 font-weight-normal">Super User Log In</h1>
            <p className="auth-subtext text-center mb-3">Manage platform access, users, and the full placement system.</p>
          </div>
          <div className="w-full">
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input
              type="email"
              id="inputEmail"
              className="auth-input form-control ml-1"
              placeholder="Email address"
              autoFocus
              autoComplete='email'
              name='email'
              value={email}
              onChange={handleChange}
            />
            {
              error?.email &&
              <div className="ml-2">
                <span className='text-red-500'>{error?.email}</span>
              </div>
            }
          </div>

          <div className="w-full">
            <div className="relative flex justify-center items-center w-full">
              <label htmlFor="inputPassword" className="sr-only">Password</label>
              <input
                type={isEyeOpen ? 'text' : 'password'}
                id="inputPassword"
                className="auth-input form-control auth-password-input"
                placeholder="Password"
                autoComplete='current-password'
                name='password'
                value={password}
                onChange={handleChange}
              />
              <button type="button" className="auth-eye-button" onClick={handleEye} aria-label={isEyeOpen ? 'Hide password' : 'Show password'}>
                <i className={`${isEyeOpen ? 'fa-solid fa-eye' : 'fa-regular fa-eye-slash'} auth-eye`} />
              </button>
            </div>
            {
              error?.password &&
              <div className="ml-2">
                <span className='text-red-500'>{error?.password}</span>
              </div>
            }
          </div>

          <div className="flex justify-center items-center flex-col">
            <Button
              type="submit"
              variant="primary"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Log In'}
            </Button>
          </div>
          <p className="auth-copyright text-center">© College Placement Management System 2024 - 25</p>
        </form>
      </div>
    </>
  );
}

export default LoginSuperUser;

