import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect, NavLink, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation()
  // console.log("History "+location)
  const sessionUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()
  const logout = () => {
    dispatch(sessionActions.logout());
  };
  return (
  <div className="footer-container">
    <div className="footer-content">
        <div className="create-button-box">
          <span className="footer-heavy-text"> Create your own Groupup group. </span>
            <NavLink to="/new-group" className="get-started-button">Get Started</NavLink>
        </div>
        <br />
        <br />
      <span className="bottom-menu">
        <div className="width-third">
          <span className="footer-heavy-text">Your Account</span>
            <ul className="footer-item-padding">
              {/* TODO switch signup to logout */}
              {sessionUser && <li className="footer-item-padding"><div className="footer-menu-links" onClick={logout}>Log out</div></li>}
              {!sessionUser && <li className="footer-item-padding"><NavLink to="/signup" className="footer-menu-links">Sign up</NavLink>
              </li>}
              {!sessionUser && <li className="footer-item-padding">
              <NavLink to="/login" className="footer-menu-links">Log in</NavLink></li>}
          {/* <li className="footer-item-padding">Help</li>
          <li className="footer-item-padding">Become an Affilliate</li> */}
            </ul>
        </div>
        <div className="width-third">
          <span className="footer-heavy-text">Discover</span>
            <ul className="footer-item-padding">
              <li className="footer-item-padding"><NavLink to="/find" className="footer-menu-links">Groups</NavLink></li>
          {/* <li className="footer-item-padding">Calendar</li>
          <li className="footer-item-padding">Topics</li>
          <li className="footer-item-padding">Cities</li> */}
              <li className="footer-item-padding"><NavLink to="/find" className="footer-menu-links">Online Events</NavLink></li>
          {/* <li className="footer-item-padding">Local Guides</li> */}
            </ul>
        </div>
        <div className="width-third">
          <span className="footer-heavy-text">Groupup</span>
            <ul className="footer-item-padding">
              <li className="footer-item-padding"><NavLink to="" className="footer-menu-links">About</NavLink></li>
          {/* <li className="footer-item-padding">Blog</li>
          <li className="footer-item-padding">Groupup Pro</li>
          <li className="footer-item-padding">Careers</li>
          <li className="footer-item-padding">Apps</li>
          <li className="footer-item-padding">Podcast</li> */}
            </ul>
        </div>
      </span>
        <br />
        <br />
          {/* <div className="bottom-menu">
            <span className="footer-heavy-text">Follow us</span>
            <span> multiple icons here </span>
            <span> get it on links </span>
          </div>*/}
        <div className="footer-menu-copyright">
          <span>@ 2022 Groupup</span>
             {/* <div>Terms of Service</div>
             <div>Privacy Policy</div>
             <div>Cookie Policy</div>
             <div>Help</div> */}
        </div>
    </div>
  </div>
  )
}

export default Footer;
