import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, NavLink } from "react-router-dom";
import './ShowAll.css';
import * as groupActions from "../../store/groups";
import GroupDetail from '../GroupDetail'

const ShowGroups = ()=> {
  const dispatch = useDispatch();
  const groupsObj = useSelector(state => state.groups.groups);
  const groups = Object.values(groupsObj);
  const history = useHistory();
  const [errors, setErrors] = useState([]);

  useEffect(()=> {
    dispatch(groupActions.grabAllGroups())
  },[dispatch])

  let DisplayGroups;
  if (groups.length > 1 ) {
    DisplayGroups =  groups.map((group) => <GroupDetail group={group}/>)

  } else {
    DisplayGroups = (
    <>
     <h2> No groups yet! </h2>
    </>
    )
  }

  return(
    <>
      {DisplayGroups}
    </>
  )
}

export default ShowGroups;
