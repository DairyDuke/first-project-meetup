import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './GroupDetail.css'

const GroupDetail = ({ group })=>{

  // about, city, createdAt, id, name,
  // numMembers, organizerId, previewImage,
  //  private, state, type, updatedAt
const groupLink = group.name.replace(' ', '').trim().toLowerCase();
  return (
    <Link to={`/groups/${group.id}`}>
        <div className="show-main-container">
          <div className="show-image-container">
            <img src={group.previewImage && group.previewImage !== "Preview Image not found" ? group.previewImage : `/images/defaultGroup.jpg` } alt={group.name}/>
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
    </Link>
  )
}

export default GroupDetail;
