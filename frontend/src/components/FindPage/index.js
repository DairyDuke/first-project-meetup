import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './FindPage.css';
import ShowGroups from '../ShowGroups';
import ShowEvents from '../ShowEvents';
import Navigation from '../Navigation';
import CreateGroupForm from '../CreateGroup';
import CreateEventForm from '../CreateEvent';

const FindPage = ({ isLoaded })=>{
  const [current, setCurrent] = useState(true)

  return(
    <>
      <Navigation isLoaded={isLoaded} />

      <div className="find-page-container">
        <div className="find-page-main-container">
          <div className="find-page-selection">
            <div className="find-page-toggle">
              <button className="find-page-selectors"
              onClick={()=>setCurrent(true)}
              >Groups</button>
              <button className="find-page-selectors"
              onClick={()=>setCurrent(false)}
              >Events</button>
            </div>
            <div>

            {current ? <NavLink to="/new-group">Why not create a new Group?</NavLink> : <NavLink to="new-event">Let's create a new Event!</NavLink>}
            </div>
          </div>

          <div className="find-page-display-content-space-container">
            <div className="find-page-display-actual-content">
            <div>
              {current ? <ShowGroups /> : <ShowEvents />}
            </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default FindPage
