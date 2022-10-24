import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, NavLink } from "react-router-dom";
import './ShowEvents.css';
import * as eventsActions from "../../store/events";
import EventDetail from '../EventDetail'

const ShowEvents = ()=> {
  const dispatch = useDispatch();
  const eventsObj = useSelector(state => state.events.events);
  const events = Object.values(eventsObj);
  const history = useHistory();
  const [errors, setErrors] = useState([]);

  useEffect(()=> {
    dispatch(eventsActions.grabAllEvents())
  },[dispatch])


  let DisplayEvents;
  if (events.length > 1 ) {
    DisplayEvents =  events.map((event) => <EventDetail event={ event }/>)

  } else {
    DisplayEvents = (
    <>
     <h2> No events yet! </h2>
    </>
    )
  }

  return(
    <div>
        {DisplayEvents}
    </div>
  )
}

export default ShowEvents;
