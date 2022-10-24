import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './EventDetail.css'

const EventDetail = ({ event })=>{

  const newGroup = (
  <>
  <h3 className="newgroup-h3-size">New Group</h3>
  </>
  )
//.Group: name, private, city, state,
//.Venue: name address city, state lat/log
// endDate, eventId, id, name, numAttending,
// description, capacity, price,
//previewImage, startDate, type, venueId

  return (
    <Link to={`/${event.Group.id}/events/${event.id}`}>
<div className="show-event-main-container">
          <div className="show-event-image-container">
            <h4 className="event-type-overlay">{event.type == "Online" ? event.type : null}</h4>
            <img
              src={event.previewImage && event.previewImage !== "Preview Image not found" ? event.previewImage : `/images/defaultGroup.jpg` }
              alt={event.name}
              className="show-event-image-style"
              />
          </div>
          <div className="show-event-details-container">
            <div className="show-event-name-container">
              <h3>{event.startDate} </h3>
              <h3>{event.name}</h3>
              <h3 className="location-h3-size">{event.Group.name} • {event.Venue.city}, {event.Venue.state}</h3>
                {newGroup}
            </div>

            <div className="show-event-about-container">
              <p className="show-event-about-content">{event.description}</p>
            </div>
            <div className="show-event-member-and-visibility">
              <div>
                {event.numAttending} attendees
              </div>
              {/* <div className="show-event-link-icon">
                ❔ This event’s content, including its members and event details, are visible to the public.Learn more

              </div> */}
            </div>
          </div>
        </div>
    </Link>
  )
}

export default EventDetail;
