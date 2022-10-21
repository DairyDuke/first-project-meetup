import React from "react";
import { Link } from 'react-router-dom';
import './Home.css'
import FindPage from '../FindPage'

const Home = ()=>{

  return(
    <>
      <div>
        <div>
          <h1>Welcome, Username (handwavemoji)</h1>
          <h2>Events from your groups</h2>
        </div>

        <div>
          Calendar/Left column
        </div>
        <div>
            <div> <FindPage /> </div>
        </div>
      </div>
    </>
  )
}

export default Home
