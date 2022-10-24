import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './CreateGroup.css';
import * as groupActions from "../../store/groups";


function CreateGroupForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("In person");
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

  return (
    <>
    <div className="cgroup-container">
        <form onSubmit={handleSubmit} className="cgroup-content">
          <div className="cgroup-header">
            <h1 className="cgroup-h1-form">
              Let's setup your Group!
            </h1>
            <div>
            <h3 className="cgroup-header">
              First, set your group’s location.
            </h3>
              <label className="cgroup-inputs-container">
                Groupup organizations meet locally, in person and online. We'll connect you with people in your area, and more can join you online.
              <input className="cgroup-input-style"
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <div className="cgroup-error-speech">
                {errors.city ? errors.city : null}
              </div>
              <input className="cgroup-input-style"
                type="text"
                placeholder="State's Abreviation"
                maxlength="2em"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <div className="cgroup-error-speech">
                {errors.state ? errors.state : null}
              </div>
              </label>
            </div>
          </div>
          <div>
            <h3>
            What will your group’s name be?
            </h3>
            <label className="cgroup-inputs-container">
              Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.
            <input className="cgroup-input-style"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="cgroup-error-speech">
              {errors.name ? errors.name : null}
            </div>
            </label>
          </div>
          <div>
            <h3>
            Now describe what you Group will be about:
            </h3>
            <label className="cgroup-inputs-container">
              <ul>
              People will see this when we promote your group, but you’ll be able to add to it later, too.
                <li>
                What's the purpose of the group?
                </li>
                <li>
                Who should join?
                </li>
                <li>
                What will you do at your events?
                </li>
              </ul>
            <input className="cgroup-input-style-description"
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              required
            />
            <div className="cgroup-error-speech">
              {errors.about ? errors.about : null}
            </div>
          </label>
          </div>
          <div className="cgroup-align-items">
            <h3>
            How does your group meet?
            </h3>
            <label className="cgroup-align-items-buttons">
              <div className="spacer-div"> </div>
            Online
            <input
              type="radio"
              value="online"
              onChange={(e) => setType(e.target.value)}
              checked={type=="online"}
              />
              In-Person
            <input
              type="radio"
              value="In person"
              onChange={(e) => setType(e.target.value)}
              checked={type=="In person"}
              />
            <div className="cgroup-error-speech">
              {errors.type ? errors.type : null}
            </div>
            </label>
            </div>
          <div className="cgroup-align-items">
              <h3>
              Do you want your group to be private?
              </h3>
              <label className="cgroup-align-items-buttons">
              <input
                type="radio"
                value="true"
                onChange={(e) => setVisibility(e.target.value)}
                checked={visibility=="true"}
              />Yes
              <input
                type="radio"
                value="false"
                onChange={(e) => setVisibility(e.target.value)}
                checked={visibility=="false"}
              />No
              <div className="cgroup-align-items">
                {errors.private ? errors.private : null}
              </div>
              </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="cgroup-submit-button"
                  >Create Group
                </button>
              </div>
            </form>
        </div>
    </>
  );
}

export default CreateGroupForm;
