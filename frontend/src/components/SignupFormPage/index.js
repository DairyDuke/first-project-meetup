import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './SignupForm.css';
import * as sessionActions from "../../store/session";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory()

  if (sessionUser) return (
  <Redirect to="/" />
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ firstName, lastName, email, username, password }))
      .then(()=>{
        history.push('/')
      })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors({confirmPassword: 'Confirm Password field must be the same as the Password field'});
  };

  const tooltipclasses = "signup-tooltip signup-tooltip-text"

  return (
    <div className="signup-container">
    <span className="signup-content">
    <form onSubmit={handleSubmit} className="signup-form-box">
    <div>
      <h1 className="font-title">Finish Signing Up</h1>
    </div>
      <ul>
        {/* {errors?.map((error, idx) => <li key={idx}>{error}</li>)} */}
      </ul>
      <label className="signup-form-text">
        Your first name
        <input className="signup-input-box"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <div className="signup-error-speech">{errors.firstName ? errors.firstName : null} </div>
      </label>
      <label className="signup-form-text">
        Your last name
        <input className="signup-input-box"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <div className="signup-error-speech">{errors.lastName ? errors.lastName : null} </div>
      </label>
      <label className="signup-form-text">
        Email addresss
        <input className="signup-input-box"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="signup-error-speech">{errors.email ? errors.email : null} </div>
      </label>
      <label className="signup-form-text">
        Username
        <input className="signup-input-box"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="signup-error-speech">{errors.username ? errors.username : null} </div>
      </label>
      <label className="signup-form-text">
        Password
        {/* <div className="tooltip"> ?
          <span className="tooltiptext">
          Your password must be at least 10 characters, and can't have 3 of the same characters in a row. To improve password strength, use a mix of upper case, lower case, numbers, and symbols. Learn more...
          </span>
        </div> */}

        <input className="signup-input-box"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="signup-error-speech">{errors.password ? errors.password : null} </div>
      </label>
      <label className="signup-form-text">
        Confirm Password
        <input className="signup-input-box"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="signup-error-speech">{errors.confirmPassword ? errors.confirmPassword : null} </div>
      </label>
      <button type="submit" className="signup-form-button">Sign Up</button>
    </form>
    </span>
    </div>
  );
}

export default SignupFormPage;
