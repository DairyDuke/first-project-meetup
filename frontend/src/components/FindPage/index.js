import React from "react";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './FindPage.css'
import ShowGroups from '../ShowGroups'
import ShowEvents from '../ShowEvents'
import Navigation from "../Navigation";

const FindPage = ({ isLoaded })=>{

  return(
    <>
      <Navigation isLoaded={isLoaded} />

      <div className="find-page-container">
        <div className="find-page-main-container">
          <div className="find-page-selection">
            <div className="find-page-toggle">
              <span className="find-page-selectors">Groups</span>
              <span className="find-page-selectors">Events</span>
            </div>
          </div>

          <div className="find-page-display-content-space-container">
            <div className="find-page-display-actual-content">
            <div>
              <ShowGroups />
            </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default FindPage
