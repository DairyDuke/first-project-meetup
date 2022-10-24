import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import './EditGroup.css';
import * as groupActions from "../../store/groups";

function EditGroup() {
  const { groupId, eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory()
  const sessionUser = useSelector((state) => state.session.user);
  const group = useSelector(state => state.groups.singleGroup);

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [type, setType] = useState('In person');
  const [visibility, setVisibility] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(()=>{
    dispatch(groupActions.grabOneGroup(groupId))
    .catch(async (res)=>{
      const data = await res.json()
      if (data && data.message) {
        setErrors(data.message)
      }
    })
    setVisibility(group && group.private ? group.private : "false");
    setName(group && group.name ? group.name : '');
    setAbout(group && group.about ? group.about : '');
    setType(group && group.type ? group.type : 'In person');
    setCity(group && group.city ? group.city : '');
    setState(group && group.state ? group.state : '');
    return (()=> dispatch(groupActions.removeSingleGroupThunk()))
  }, [dispatch, groupId])

  if (group == undefined) {return null}


  const handleCancel = (e) => {
    e.preventDefault();
    history.push(`/groups/${groupId}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
      setErrors([]);

      return dispatch(groupActions.editGroupThunk({ name, about, type, visibility, city, state }, groupId))
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
                Let's edit your Group!
              </h1>
              <div>
              <h3 className="cgroup-header">
                Here's your group’s location.
              </h3>
                <label className="cgroup-inputs-container">
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
                  placeholder="State"
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
              Would you like to change your group's name?
              </h3>
              <label className="cgroup-inputs-container">
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
              Here is your group's description:
              </h3>
              <label className="cgroup-inputs-container">
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
              Update your group's meeting preference?
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
                Change your group's visibility?
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
                  style={{paddingRight:"5px"}}
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
                    >Confirm Edit
                  </button>
                  <button
                    type="button"
                    className="cgroup-submit-button"
                    onClick={handleCancel}
                    >Cancel Edit
                  </button>
                </div>
              </form>
          </div>
      </>
    );
  }

export default EditGroup;
