import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './EventDetail.css'

const EventDetail = ({ event })=>{


//.Group: name, private, city, state,
//.Venue: name address city, state lat/log
// endDate, groupId, id, name, numAttending,
// description, capacity, price,
//previewImage, startDate, type, venueId

const groupLink = event.Group.name.replace(' ', '').trim().toLowerCase();
const eventLink = event.name.replace(' ', '').trim().toLowerCase();
  return (
    <Link to={`/${event.Group.id}/events/${event.id}`}>
        <div className="show-main-container">
        <div className="show-image-container">
          <img src={event.previewImage && event.previewImage !== "Preview Image not found" ? event.previewImage : `/images/defaultEventImage.png` } alt={event.name}/>
        </div>
        <div className="show-details-container">
          <span>{event.name}</span>
          <div>
            <span>{event.city},{event.state}</span>
          </div>
          <div>
            <p>{event.description}</p>
          </div>
          <div>
            <span>{event.numMembers}</span>
            <img/>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventDetail;
