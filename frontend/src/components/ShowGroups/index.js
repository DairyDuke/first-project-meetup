import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, NavLink } from "react-router-dom";
import './ShowAll.css';
import * as groupActions from "../../store/groups";

const ShowGroups = ()=> {
  const dispatch = useDispatch();
  const groupsObj = useSelector(state => state.groups.groups);
  const groups = Object.values(groupsObj);
  const history = useHistory();
  const [errors, setErrors] = useState([]);

  useEffect(()=> {
    dispatch(groupActions.grabAllGroups())
  },[dispatch])


  //about, city, createdAt, id, name, numMembers, organizerId, previewImage, private, state, type, updatedAt
  return(
    <div >
      {groups.map(group =>(
        <div className="show-main-container">
          <div className="show-image-container">
            <img src={`${group.previewImage}`} alt={group.name}/>
          </div>
          <div className="show-details-container">
            <span>{group.name}</span>
            <div>
              <span>{group.city},{group.state}</span>
            </div>
            <div>
              <p>{group.about}</p>
            </div>
            <div>
              <span>Total Members:{group.numMembers}</span>
              <img/>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShowGroups;
