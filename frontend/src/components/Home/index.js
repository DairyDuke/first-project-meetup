import React from "react";
import { Link } from 'react-router-dom';
import './Home.css'
import FindPage from '../FindPage'

const Home = ({ user })=>{
  return(
    <>
      <div>
        <div className="home-main-container">
          <h1>Welcome, {user.firstName} 👋</h1>
        </div>
        <div>
            <div> <FindPage user={user} /> </div>
        </div>
      </div>
    </>
  )
}

export default Home
