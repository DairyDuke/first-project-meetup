import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import {LoginFormModal, SignupFormModal, LanguageSelectModal} from '../Modals';
import './Navigation.css';
import iconImg from '../../assets/images/favicon.ico'
import HomePage from '../HomePage'

// {/* <NavLink to="/signup">Sign Up</NavLink> */}
function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;

  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <LanguageSelectModal />
        <LoginFormModal />
        <SignupFormModal />
      </>
    );
  }

  return (
    <>
    <div className="navigation-container">
      <div className="navigation-home-button">
      <NavLink exact to="/"><img src={iconImg} alt="G logo" /></NavLink>
      </div>
      <div>
      <ul>
        <li>
          {isLoaded && sessionLinks}
        </li>
      </ul>
      </div>
    </div>

      <div>
       <HomePage />
      </div>
    </>
  );
}

export default Navigation;


// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton';
// import './Navigation.css';

// function Navigation({ isLoaded }){
//   const sessionUser = useSelector(state => state.session.user);

//   let sessionLinks;
//   if (sessionUser) {
//     sessionLinks = (
//       <ProfileButton user={sessionUser} />
//     );
//   } else {
//     sessionLinks = (
//       <>
//         <NavLink to="/login">Log In</NavLink>
//         <NavLink to="/signup">Sign Up</NavLink>
//       </>
//     );
//   }

//   return (
//     <ul>
//       <li>
//         <NavLink exact to="/">Home</NavLink>
//         {isLoaded && sessionLinks}
//       </li>
//     </ul>
//   );
// }

// export default Navigation;
