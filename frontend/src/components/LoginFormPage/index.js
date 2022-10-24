import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, NavLink } from 'react-router-dom';
import './LoginForm.css';
import SignupFormPage from '../SignupFormPage'

const LoginFormPage = ()=> {
  const history = useHistory();
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);


  // if (sessionUser) return (
  //   <Redirect to="/" />
  // );
  const handleEye = (e)=>{
    e.preventDefault()

  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
    .then(()=>{
      history.push('/')
    })
      .catch(async (res) => {
        const data = await res.json();

        if (data && data.errors) setErrors(data.errors);
      });
  }
  const demoUser = () => {
    setPassword("password")
    setCredential("Demo-lition")
  }
  return (
    <>
      <div className="login-container">

        <form onSubmit={handleSubmit} className="login-content">

          <div className="login-header">
            <div className="login-header-icon">
              👨‍👧‍👧
            </div>
            <h1 className="login-h1-form">Log in</h1>
            <div>
              Not a member yet? <NavLink to="/signup" className="login-header-signup">
                  Sign up
                </NavLink>
            </div>
          </div>


    <div className="login-inputs-container">
          <label className="login-text">
            Email or Username
          </label>
          <div>
          <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              className="login-input-style"
            />
            </div>
            {/* <div>{errors ? errors : null} </div> */}
            <div>{errors.username ? errors.password : null} </div>
            <div>{errors.email ? errors.password : null} </div>

          <label className="login-text">
            Password
          </label>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input-style"
            />
            {/* <div className="login-show-password-div">
              <button
              type="toggle"
              className="login-show-password"
              onClick={handleEye}
              >👁</button>
              <div className="login-show-password-div">
                <button
              type="toggle"
                  className="login-show-password-x"
                  >✖</button>
              </div> */}
            {/* </div> */}
            </div>
            <div>{errors.password ? errors.password : null} </div>
          </div>
          <div className="login-align-items">
            <button type="submit" className="login-submit-button">
              Log In
            </button>
            <button className="login-demo-user-button"
            onClick={demoUser}
            >Demo User
            </button>
          </div>
        </form>
      </div>
    </>
  );
}


export default LoginFormPage;
