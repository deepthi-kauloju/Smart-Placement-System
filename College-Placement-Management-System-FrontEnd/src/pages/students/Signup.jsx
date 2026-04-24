import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../assets/CPMS.png";
import Toast from '../../components/Toast';
import isAuthenticated from '../../utility/auth.utility';
import { BASE_URL } from '../../config/config';

function Signup() {
  document.title = 'CPMS | Student Sign Up';
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('../student/dashboard');
    }
  }, [navigate]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState({});

  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    number: '',
    password: '',
  });

  const { first_name, number, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'first_name') setError({ ...error, first_name: '' });
    if (e.target.name === 'email') setError({ ...error, email: '' });
    if (e.target.name === 'number') setError({ ...error, number: '' });
    if (e.target.name === 'password') {
      setError({ ...error, password: '' });
      if (!validatePassword(e.target.value)) setError({ ...error, password: 'Password Must Contains: Minimum 8 Char with atleast 1 Special Char, 1 Number, 1 Uppercase, 1 Lowercase' });
    }
  };

  function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.email && !formData?.first_name && !formData?.number && !formData?.password) {
      return setError({ email: 'Email Required!', first_name: 'Name Required!', number: 'Number Required!', password: 'Password Required!' });
    }
    if (!formData?.email || !formData?.first_name || !formData?.number || !formData?.password) {
      let nextEmail;
      let nextFirstName;
      let nextNumber;
      let nextPassword;
      if (!formData?.email) nextEmail = 'Email Required!';
      if (!formData?.first_name) nextFirstName = 'Name Required!';
      if (!formData?.number) nextNumber = 'Number Required!';
      if (!formData?.password) nextPassword = 'Password Required!';
      setError({ email: nextEmail, first_name: nextFirstName, number: nextNumber, password: nextPassword });
      return;
    }

    if (!validatePassword(formData?.password)) return setError({ password: 'Password Must Contains: Minimum 8 Char with atleast 1 Special Char, 1 Number, 1 Uppercase, 1 Lowercase' });

    if (formData?.number?.length !== 10) return setError({ ...error, number: 'Number Length Should be 10 digital only!' });

    try {
      await axios.post(`${BASE_URL}/student/signup`, {
        first_name,
        email,
        number,
        password
      });

      setToastMessage('User Created Successfully! Now You Can Login.');
      setShowToast(true);

      const dataToPass = {
        showToastPass: true,
        toastMessagePass: 'User Created Successfully! Now You Can Login.'
      };
      navigate('../student/login', { state: dataToPass });
    } catch (error) {
      if (error.response.data.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log('Student Signup.jsx => ', error);
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

      <div className="auth-shell flex justify-center items-center px-4 py-6">
        <button type="button" className="auth-back" onClick={() => navigate('/')}>
          <span aria-hidden="true">&larr;</span>
          <span>Home</span>
        </button>        <form className="auth-card form-signin flex justify-center items-center flex-col gap-3 rounded-2xl p-8 w-1/3 max-lg:w-2/3 max-md:w-3/4 max-[400px]:w-4/5" onSubmit={handleSubmit}>
          <div className='flex justify-center items-center flex-col'>
            <img className="mb-4 rounded-xl shadow w-30 h-28 lg:w-40 lg:h-40" src={`${Logo}`} alt="Logo Image" />
            <h1 className="auth-title h3 mb-1 font-weight-normal">Sign Up as a Student</h1>
            <p className="auth-subtext text-center mb-3">Create your account and start building your placement profile.</p>
          </div>
          <div className="w-full">
            <label htmlFor="inputName" className="sr-only">Name</label>
            <input type="text" id="inputName" className="auth-input form-control ml-1" placeholder="Name" autoFocus autoComplete='name' name='first_name' value={first_name} onChange={handleChange} />
            <div className="text-red-500 ml-2">
              <span>{error?.first_name}</span>
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="inputEmail" className="sr-only">Email Address</label>
            <input type="email" id="inputEmail" className="auth-input form-control ml-1" placeholder="Email Address" autoComplete='email' name='email' value={email} onChange={handleChange} />
            <div className="text-red-500 ml-2">
              <span>{error?.email}</span>
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="inputNumber" className="sr-only">Phone Number</label>
            <input
              type="number"
              id="inputNumber"
              className="auth-input form-control ml-1"
              placeholder="Phone Number"
              autoComplete='tel'
              name='number'
              value={number}
              onChange={handleChange}
              onInput={(e) => {
                if (e.target.value > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
            />
            <div className="text-red-500 ml-2">
              <span>{error?.number}</span>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-center items-center w-full">
              <label htmlFor="inputPassword" className="sr-only">Password</label>
              <input type={isEyeOpen ? 'text' : 'password'} id="inputPassword" className="auth-input form-control" placeholder="Password" autoComplete='new-password' name='password' value={password} onChange={handleChange} />
              <i className={`${isEyeOpen ? 'fa-solid fa-eye' : 'fa-regular fa-eye-slash'} auth-eye -ml-6 cursor-pointer`} onClick={handleEye}></i>
            </div>
            <div className="text-red-500 ml-2">
              <span>{error?.password}</span>
            </div>
          </div>

          <div className="flex justify-center items-center flex-col">
            <button
              className="auth-submit btn btn-primary btn-block"
              type="submit"
            >
              Sign Up
            </button>
          </div>
          <span className='auth-subtext text-center'>Already having account?
            <span className='auth-link cursor-pointer px-1' onClick={() => navigate('../student/login')}>Login</span>
          </span>
          <p className="auth-copyright text-center">© College Placement Management System 2024 - 25</p>
        </form>
      </div>
    </>
  );
}

export default Signup;

