import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, NavLink } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import iconImg from './assets/images/favicon.ico'
import FindPage from './components/FindPage'
import CreateGroupForm from './components/CreateGroup'
import CreateEventForm from './components/CreateEvent'

import Home from './components/Home'

import HomePage from './components/HomePage'

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {isLoaded && (
        <Switch>
          <Route path="/signup">
            <NavLink exact to="/"><img src={iconImg} alt="G logo" /></NavLink>
            <SignupFormPage />
          </Route>
          <Route path="/login">
            <NavLink exact to="/"><img src={iconImg} alt="G logo" /></NavLink>
            <LoginFormPage />
          </Route>
          <Route path="/find">
            <FindPage isLoaded={isLoaded} />
          </Route>
          <Route path="/new-group">
            <Navigation isLoaded={isLoaded} />
            <CreateGroupForm isLoaded={isLoaded} />
          </Route>
          <Route path="/new-event">
            <Navigation isLoaded={isLoaded} />
            <CreateEventForm isLoaded={isLoaded} />
          </Route>
          <Route>
            <Navigation isLoaded={isLoaded} />
            {sessionUser ? <Home/> : <HomePage/>}
          </Route>
        </Switch>
      )}
      <div>
      <Footer />
      </div>
    </>
  );
}

export default App;


// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { Route, Switch } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from "./components/SignupFormPage";
// import * as sessionActions from "./store/session";
// import Navigation from "./components/Navigation";

// function App() {
//   const dispatch = useDispatch();
//   const [isLoaded, setIsLoaded] = useState(false);
//   useEffect(() => {
//     dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
//   }, [dispatch]);

//   return (
//     <>
//       <Navigation isLoaded={isLoaded} />
//       {isLoaded && (
//         <Switch>
//           <Route path="/login">
//             <LoginFormPage />
//           </Route>
//           <Route path="/signup">
//             <SignupFormPage />
//           </Route>
//         </Switch>
//       )}
//     </>
//   );
// }


// export default App;
