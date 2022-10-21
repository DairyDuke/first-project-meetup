import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './CreateEvent.css';
import * as eventActions from "../../store/events";

function CreateEventForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory()


  const handleSubmit = (e) => {
    e.preventDefault();
    // if (password === confirmPassword) {
      setErrors([]);
      return dispatch(eventActions.createEventThunk({ name, about, type, visibility, city, state }))
      .then(()=>{
        history.push(`/find`)
      })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    // }
    return setErrors({confirmPassword: 'Confirm Password field must be the same as the Password field'});
  };

  const tooltipclasses = "signup-tooltip signup-tooltip-text"

  return (
    <div className="signup-container">
    <span className="signup-content">
    <form onSubmit={handleSubmit} className="signup-form-box">
    <div>
      <h1 className="font-title">Let's setup your Group!</h1>
    </div>
      <ul>
        {/* {errors?.map((error, idx) => <li key={idx}>{error}</li>)} */}
      </ul>
      <label>
        Location
        <input className="signup-input-box"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input className="signup-input-box"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <div>{errors.city ? errors.city : null} </div>
        <div>{errors.state ? errors.state : null} </div>
      </label>
      <label>
        Group name
        <input className="signup-input-box"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div>{errors.name ? errors.name : null} </div>
      </label>
      <label>
        Tell us about your Group
        <input className="signup-input-box"
          type="text"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          required
        />
        <div>{errors.about ? errors.about : null} </div>
      </label>
      <label>
        Is it Online or In-Person?
        <input className="signup-input-box"
          type="radio"
          value="online"
          onChange={(e) => setType(e.target.value)}
        >Online</input>
               <input className="signup-input-box"
          type="radio"
          value="in-person"
          onChange={(e) => setType(e.target.value)}
        >In-person</input>
        <div>{errors.type ? errors.type : null} </div>
      </label>
      <label>
        Private?
        <input className="signup-input-box"
          type="checkbox"
          value="true"
          onChange={(e) => setVisibility(e.target.value)}
        />
        <div>{errors.private ? errors.private : null} </div>
      </label>
      <button type="submit" className="signup-form-button">Sign Up</button>
    </form>
    </span>
    </div>
  );
}

export default CreateEventForm;
