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

  return(
    <div>
      {groups.map(group =>(
        <div>
          <div><img src={`${group.previewImage}`} alt={group.name}/> </div>
          <div>Details </div>
        </div>
      ))}
    </div>
  )
}

export default ShowGroups;
