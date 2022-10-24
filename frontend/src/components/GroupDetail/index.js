import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './GroupDetail.css'

const GroupDetail = ({ group })=>{

  const newGroup = (
  <>
  <h3 className="newgroup-h3-size">New Group</h3>
  </>
  )
  // about, city, createdAt, id, name,
  // numMembers, organizerId, previewImage,
  //  private, state, type, updatedAt
const groupLink = group.name.replace(' ', '').trim().toLowerCase();
  return (
    <Link to={`/groups/${group.id}`}>
        <div className="show-group-main-container">
          <div className="show-group-image-container">
            <img
              src={group.previewImage && group.previewImage !== "Preview Image not found" ? group.previewImage : `/images/defaultGroup.jpg` }
              alt={group.name}
              className="show-group-image-style"
              />
          </div>
          <div className="show-group-details-container">
            <div className="show-group-name-container">
                {newGroup}
               <h3>{group.name}</h3>
               <h3 className="location-h3-size">{group.city}, {group.state}</h3>
            </div>

            <div className="show-group-about-container">
              <p className="show-group-about-content">{group.about}</p>
            </div>
            <div className="show-group-member-and-visibility">
              <div>
                {group.numMembers} members · {group.private === 0 ? "Public" : "Private"}
              </div>
              {/* <div className="show-group-link-icon">
                ❔ This group’s content, including its members and event details, are visible to the public.Learn more

              </div> */}
            </div>
          </div>
        </div>
    </Link>
  )
}

export default GroupDetail;
