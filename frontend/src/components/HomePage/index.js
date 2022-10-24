import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import {
  chatting,
  datingGroup,
  handsUp,
  hiking,
  joinGroup,
  laptopSmile,
  meetGroup,
  online_events,
  pencilGroup,
  taxesGroup,
  greenBlob,
  redBlob,
  yellowBlob,
  ticket
} from '../../assets/images/index.js';
import { Redirect, useHistory, NavLink, Link } from "react-router-dom";
import Navigation from "../Navigation";
import './HomePage.css';


const HomePage = ()=> {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const arrow = "➡"
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const previousPage = (e) =>{
    e.preventDefault()
    history.push("/")
  }

  const handleNotLoggedIn = (e) => {
    e.preventDefault()

    history.push("/signup")

  }

  return (
    <>
    <Navigation isLoaded={isLoaded} />
    <div className="homepage-container">
      <img src={(redBlob).default} className="blob-red"/>
      <img src={(yellowBlob).default} className="blob-yellow"/>
      <img src={(greenBlob).default} className="blob-green"/>
      <div className="homepage-block">
        <div className="homepage-leftside">
          <h1 className="homepage-h1">
            Celebrating 20 years of real connections on Groupup
          </h1>
          <p>
            Whatever you’re looking to do this year, Groupup can help. For 20 years, people have turned to Groupup to meet people, make friends, find support, grow a business, and explore their interests. Thousands of events are happening every day—join the fun.
          </p>
        </div>
        <div className="homepage-rightside">
          <img src={(online_events).default} alt="Online Events" className="image-rightside"/>
        </div>
      </div>
      <div  className="homepage-points-of-interest">
        <div className="option-card" >
          <img src={(laptopSmile)} alt={(laptopSmile)} className="image-resizing"/>
          {/* <button className="option-card-button" onClick={handleNotLoggedIn}>
            Make new friends {arrow}</button> */}
        </div>
        <div className="option-card" >
          <img src={(pencilGroup)} alt={(hiking)} className="image-resizing"/>
          {/* <button className="option-card-button" onClick={handleNotLoggedIn}>
          Explore the outdoors {arrow}</button> */}
        </div>
        <div className="option-card" >
          <img src={(chatting)} alt={(chatting)} className="image-resizing"/>
          {/* <button className="option-card-button" onClick={handleNotLoggedIn}>
            Connect over tech {arrow}</button> */}
        </div>
      </div>
      <div className="homepage-center-information">
        <h2>How Groupup Works</h2>
        <p className="homepage-p-text">
          Meet new people who share your interests through online and in-person events. It’s free to create an account.
        </p>
      </div>
      <div  className="homepage-points-of-interest">
        <div className="option-card-navigation" >
          <img src={(handsUp).default} alt={(handsUp).default} />
          <div>
            <div className="option-card-navigation-button"
            >
              <h3>
                Join a group
              </h3>
            </div>
          </div>
          <p className="option-card-paragraph">
            Do what you love, meet others who love it, find your community. The rest is history!
          </p>
        </div>
        <div className="option-card-navigation" >
          <img src={(ticket).default} alt={(ticket).default} />
          <div>
            <div className="option-card-navigation-button"
             >
              <h3>
                Find an event
              </h3>
            </div>
          </div>
          <p className="option-card-paragraph">
            Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.
          </p>
        </div>
        <div className="option-card-navigation" >
          <img src={(joinGroup).default} alt={(joinGroup).default} />
          <div>
            <div className="option-card-navigation-button"
             >
             <h3>
              Start a group
             </h3>
            </div>
          </div>
          <p className="option-card-paragraph">
            You don’t have to be an expert to gather people together and explore shared interests.
          </p>
        </div>
            <button className="join-card-button"
            onClick={handleNotLoggedIn}>
             <h3>
               Join Groupup
             </h3>
            </button>

      </div>
    </div>
    </>
  )
}

export default HomePage;
