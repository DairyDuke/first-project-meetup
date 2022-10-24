import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import './ShowOneEvent.css';
import * as eventActions from "../../store/events";

function ShowOneEvent() {
  const { eventId } = useParams();
  const dispatch = useDispatch()
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user);
  const event = useSelector(state => state.events.singleEvent);
  const [category, setCategory] = useState('about')
  const [error, setError ] = useState('')


useEffect(()=>{
  dispatch(eventActions.grabOneEvent(eventId))
  .catch(async (res)=>{
    const data = await res.json()
    if (data && data.message) {
      setError(data.message)
    }
  })
  // return (()=> dispatch(groupActions.removeSingleGroupThunk()))
}, [dispatch, eventId])

if (event == undefined) return null;

const editButton = (e) => {
  e.preventDefault();

  history.push(`/events/${eventId}/edit`)

}
const deleteButton = (e) => {
  e.preventDefault();
  if (window.confirm("Are you certain you wish to delete your event? This can not be undone.")) {
    dispatch(eventActions.deleteEventThunk(eventId))
    history.push('/')
  } else {
  history.push(`/events/${eventId}/`)
  }
}


let power;
if (sessionUser && sessionUser.id){
  power =(
    <div>
      <button className="power-buton" onClick={editButton}>Edit</button>
      <button className="power-buton" onClick={deleteButton}>Delete</button>
      {/* <button className="power-buton" onClick={eventButton}>New Event</button> */}
    </div>
  )
}

// Group - id, name, private, city, state
// Venue - id, address, city, state, lat/longetc
// capacity
//description
//startDate
//endDate
//groupId
// id
// name
// numAttending
// price
//type
//venueId
const about = (
  <>

  </>
)


const categorySwitch =({category})=> {
  switch(category) {
    case 'about':
     return ;
    case 'events':
      return ;
    case 'members':
      return ;
    case 'photos':
      return ;
    default:
      return ;
    }
  }
  const newGroup = (
    <>
    <h3 className="newgroup-h3-size">New Event</h3>
    </>
    )

return (
  <div className="soe-container">
  <div className="soe-header-container">
    <img
    src={event.EventImages && event.EventImages.length > 1  ? event.EventImages[0].url : `/images/defaultEventImage.png` }
      alt={event.name}
      className="soe-image-style"
      />

    <div>{power}</div>
  </div>
  <div className="soe-body-container">
    <div className="soe-group-name-container">
        {newGroup}
       <h3>{event.name}</h3>
       <span className="location-h3-size">{event.startDate} to {event.endDate}</span>
       <span className="location-h3-size">{event.city}, {event.state}</span>
       <span className="location-h3-size">{event.Venue.name} </span>
       <span className="location-h3-size">{event.Venue.address} </span>

      <div>
      </div>
    </div>

    <div className="soe-group-about-container">
    <span className="location-h3-size">Details</span>
      <p className="soe-group-about-content">{event.description}</p>
    </div>
  </div>

</div>
)}


export default ShowOneEvent;
