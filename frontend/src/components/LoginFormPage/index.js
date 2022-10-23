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
          <h1>This is the Login Page</h1>
        <div>
        Not a member?
          <NavLink to="/signup">
             Signup
          </NavLink>
        </div>
          <ul>
          {/* {errors.map((error, idx) => <li key={idx}>{error}</li>)} */}
            <li>{errors ? errors : null} </li>
          </ul>
          <label>
            Username or Email
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
            <div>{errors.username ? errors.password : null} </div>
            <div>{errors.email ? errors.password : null} </div>
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div>{errors.password ? errors.password : null} </div>
          </label>
          <button type="submit">Log In</button>
        <div>
          <button className="signup-form-button"
            onClick={demoUser}
            >Demo User</button>
        </div>
            </form>
      </div>
    </>
  );
}


export default LoginFormPage;
