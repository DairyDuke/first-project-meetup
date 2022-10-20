import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, NavLink } from "react-router-dom";
import './ShowEvents.css';
import * as eventsActions from "../../store/events";

const ShowEvents = ()=> {
  const dispatch = useDispatch();
  const eventsObj = useSelector(state => state.events.events);
  const events = Object.values(eventsObj);
  const history = useHistory();
  const [errors, setErrors] = useState([]);

  useEffect(()=> {
    dispatch(eventsActions.grabAllEvents())
  },[dispatch])

//.Group: name, private, city, state,
//.Venue: name address city, state lat/log
// endDate, groupId, id, name, numAttending, previewImage, startDate, type, venueId
  return(
    <div>
      {events.map(event =>(
        <div>
          <div><img src={`${event.previewImage}`} alt={event.name}/> </div>
          <div>Details </div>
        </div>
      ))}
    </div>
  )
}

export default ShowEvents;
