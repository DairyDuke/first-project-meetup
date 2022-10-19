import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import './Footer.css';

const Footer = () => {

  return (
    <div className="footer-container">
      <div className="footer-content">
      <div className="create-button">
        <span className="heavy-text"> Create your own Groupup group. </span>
        <button
          className="get-started-button"
          onClick={()=> alert("This is an alert")}
          >Get Started   </button>
      </div>
      <br />

      <span className="bottom-menu">
        <div className="width-third">
          <span className="heavy-text">Your Account</span>
        <ul className="item-padding">
          <li className="item-padding">Sign up</li>
          <li className="item-padding">Log in</li>
          <li className="item-padding">Help</li>
          <li className="item-padding">Become an Affilliate</li>
        </ul>
        </div>
        <div className="width-third">
          <span className="heavy-text">Discover</span>
        <ul className="item-padding">
          <li className="item-padding">Groups</li>
          <li className="item-padding">Calendar</li>
          <li className="item-padding">Topics</li>
          <li className="item-padding">Cities</li>
          <li className="item-padding">Online Events</li>
          <li className="item-padding">Local Guides</li>
        </ul>
        </div>
        <div className="width-third">
          <span className="heavy-text">Groupup</span>
        <ul className="item-padding">
          <li className="item-padding">About</li>
          <li className="item-padding">Blog</li>
          <li className="item-padding">Groupup Pro</li>
          <li className="item-padding">Careers</li>
          <li className="item-padding">Apps</li>
          <li className="item-padding">Podcast</li>
        </ul>
        </div>
      </span>
        <div>SPACER</div>
          <div className="bottom-menu">
            <span className="heavy-text">Follow us</span>
            <span> multiple icons here </span>
            <span> get it on links </span>
          </div>
          <div className="footer-menu-link">
            <span className="heavy-text">@ 2022 Groupup</span>
             <div>Terms of Service</div>
             <div>Privacy Policy</div>
             <div>Cookie Policy</div>
             <div>Help</div>

          </div>
        </div>
    </div>
  )
}

export default Footer;
