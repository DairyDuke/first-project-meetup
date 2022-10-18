import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import './Footer.css';

const Footer = () => {

  return (
    <div className="footer-container">
      <div className="create-button">
        <h2> Create your own Groupup group. </h2>
        <button
          className="get-started-button"
          onClick={()=> alert("This is an alert")}
          > Get Started </button>
      </div>
      <br />

      <span className="bottom-menu">
        <div className="width-third">
          <h3>Your Account</h3>
        <ul className="item-padding">
          <li>Sign up</li>
          <li>Log in</li>
          <li>Help</li>
          <li>Become an Affilliate</li>
        </ul>
        </div>
        <div className="width-third">
          <h3>Discover</h3>
        <ul className="item-padding">
          <li>Groups</li>
          <li>Calendar</li>
          <li>Topics</li>
          <li>Cities</li>
          <li>Online Events</li>
          <li>Local Guides</li>
        </ul>
        </div>
        <div className="width-third">
          <h3>Groupup</h3>
        <ul className="item-padding">
          <li>About</li>
          <li>Blog</li>
          <li>Groupup Pro</li>
          <li>Careers</li>
          <li>Apps</li>
          <li>Podcast</li>
        </ul>
        </div>
      </span>
      <div className="bottom-menu">
        <h3>Follow us</h3>
        <span> multiple icons here </span>
        <span> get it on links </span>
      </div>
      <div className="bottom-menu">
        <h3>@ 2022 Groupup</h3>
        <ul>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
          <li>Cookie Policy</li>
          <li>Help</li>
        </ul>
        </div>
    </div>
  )
}

export default Footer;
