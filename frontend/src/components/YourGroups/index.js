import React from "react";
import { Link } from 'react-router-dom';
import './YourGroups.css'

const Home = ()=>{

  return(
    <>
      <div>
          <div> <- Back to home page </div>
        <div>
          <h1>Your groups</h1>
        </div>
        <div>
          <span>Position</span>
          <div> Group cards - four to a row</div>
        </div>
        <div>
            <div>
            <span> Become an organizer - Save 30%! </span>
            <span> Starting a Meetup group connects you with passionate people looking to share experiences in real life. </span>
            </div>
            <div> <button> Start a group</button> </div>
        </div>
      </div>
    </>
  )
}
