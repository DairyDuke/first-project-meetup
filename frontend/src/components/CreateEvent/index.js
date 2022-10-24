import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import './CreateEvent.css';
import * as eventActions from "../../store/events";

function CreateEventForm() {
  const { groupId } = useParams();
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

      setErrors([]);
      return dispatch(eventActions.createEventThunk({ name, description, type, capacity, price, startDate, endDate }, groupId ))
      .then(()=>{
        history.push(`/groups/${groupId}`)
      })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
          console.log(errors)
        });
    // }
  };

  const tooltipclasses = "signup-tooltip signup-tooltip-text"

  return (
    <div className="cevent-container">
    <span className="signup-content">
    <form onSubmit={handleSubmit} className="signup-form-box">
    <div>
      <h1 className="font-title">Let's setup your Event!</h1>
    </div>
      <ul>
        {/* {errors?.map((error, idx) => <li key={idx}>{error}</li>)} */}
      </ul>
      <label className="cevent-inputs-container">
        Start date:
        <input className="cevent-input-style"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        End date:
        <input className="cevent-input-style"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <div className="cgroup-error-speech">{errors.startDate ? errors.startDate : null} </div>
        <div className="cgroup-error-speech">{errors.endDate ? errors.endDate : null} </div>
      </label>
      <label className="cevent-inputs-container">
        Event name
        <input className="cevent-input-style"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="cgroup-error-speech">{errors.name ? errors.name : null} </div>
      </label>
      <label className="cevent-inputs-container">
        Give your Event a description
        <input className="cevent-input-style"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="cgroup-error-speech">{errors.description ? errors.description : null} </div>
      </label>

      <label className="cevent-inputs-container">
        What will your event cost?
        <input className="cevent-input-style"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <div className="cgroup-error-speech">{errors.price ? errors.price : null} </div>
      </label>

      <label className="cevent-inputs-container">
        What is the capacity?
        <input className="cevent-input-style"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <div className="cgroup-error-speech">{errors.capacity ? errors.capacity : null} </div>
      </label>
      <label className="cevent-inputs-container">
        How will your Event meet?
        <br/>
        <label>Online
        <input
          type="radio"
          value="online"
          name="type"
          onChange={(e) => setType(e.target.value)}
        /></label>
        <label>
        In-Person
        <input
          type="radio"
          value="In person"
          onChange={(e) => setType(e.target.value)}
          name="type"
          /></label>
        <div className="cgroup-error-speech">{errors.type ? errors.type : null} </div>
      </label>

      <button type="submit" className="signup-form-button">Sign Up</button>
    </form>
    </span>
    </div>
  );
}

export default CreateEventForm;
