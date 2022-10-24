import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './CreateEvent.css';
import * as eventActions from "../../store/events";

function CreateEventForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  // const [name, setName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory()


  const handleSubmit = (e) => {
    e.preventDefault();
    // if (password === confirmPassword) {
      setErrors([]);
      return dispatch(eventActions.createEventThunk({ name, description, type, capacity, price, startDate, endDate }))
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
      <h1 className="font-title">Let's setup your Event!</h1>
    </div>
      <ul>
        {/* {errors?.map((error, idx) => <li key={idx}>{error}</li>)} */}
      </ul>
      <label>
        Start date:
        <input className="signup-input-box"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        End date:
        <input className="signup-input-box"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <div>{errors.startDate ? errors.startDate : null} </div>
        <div>{errors.endDate ? errors.endDate : null} </div>
      </label>
      <label>
        Event name
        <input className="signup-input-box"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div>{errors.name ? errors.name : null} </div>
      </label>
      <label>
        Give your Event a description
        <input className="signup-input-box"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div>{errors.description ? errors.description : null} </div>
      </label>

      <label>
        What will your event cost?
        <input className="signup-input-box"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <div>{errors.price ? errors.price : null} </div>
      </label>

      <label>
        What is the capacity?
        <input className="signup-input-box"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <div>{errors.capacity ? errors.capacity : null} </div>
      </label>
      <label>
        How will your Event meet?
        <input
          type="radio"
          value="online"
          name="type"
          onChange={(e) => setType(e.target.value)}
        />Online
        <input
          type="radio"
          value="in-person"
          onChange={(e) => setType(e.target.value)}
          name="type"
          />In-Person
        <div>{errors.type ? errors.type : null} </div>
      </label>

      <button type="submit" className="signup-form-button">Sign Up</button>
    </form>
    </span>
    </div>
  );
}

export default CreateEventForm;
