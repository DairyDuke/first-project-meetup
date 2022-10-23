import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import './EditGroup.css';
import * as groupActions from "../../store/groups";

function EditGroup() {
  const { groupId, eventId } = useParams();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("in-person");
  const [visibility, setVisibility] = useState("false");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory()


  const handleSubmit = (e) => {
    e.preventDefault();
      setErrors([]);

      return dispatch(groupActions.createGroupThunk({ name, about, type, visibility, city, state }))
      .then(()=>{
        history.push(`/find`)
      })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });

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
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input className="signup-input-box"
          type="text"
          placeholder="State"
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
        How does your group meet?
        <input
          type="radio"
          value="online"
          // name="type"
          onChange={(e) => setType(e.target.value)}
          checked={type=="online"}
        />Online
        <input
          type="radio"
          value="in-person"
          onChange={(e) => setType(e.target.value)}
          // name="type"
          checked={type=="in-person"}
          />In-Person
        <div>{errors.type ? errors.type : null} </div>
      </label>
      {/* <div> */}
      <label>
        Do you want your group to be private?
      <input
          type="radio"
          value="true"
          // name="visibility"
          onChange={(e) => setVisibility(e.target.value)}
          checked={visibility=="true"}
        />Yes
        <input
          type="radio"
          value="false"
          onChange={(e) => setVisibility(e.target.value)}
          // name="visibility"
          checked={visibility=="false"}
          />No
        <div>{errors.private ? errors.private : null} </div>
      </label>
      {/* </div> */}
      <button type="submit" className="signup-form-button">Sign Up</button>
    </form>
    </span>
    </div>
  );
}

export default EditGroup;
