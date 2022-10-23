import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, NavLink, useParams, useHistory, useLocation } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import iconImg from './assets/images/favicon.ico'
import FindPage from './components/FindPage'
import CreateGroupForm from './components/CreateGroup'
import CreateEventForm from './components/CreateEvent'
import EditGroup from './components/EditGroup'
import EditEvent from './components/EditEvent'
import ShowOneEvent from './components/ShowOneEvent'
import ShowOneGroup from './components/ShowOneGroup'

import Home from './components/Home'

import HomePage from './components/HomePage'

function App() {
  const history = useHistory()
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const groups = useSelector(state => state.groups);
  const events = useSelector(state => state.events);
  const [isLoaded, setIsLoaded] = useState(false);

  let location = useLocation()
  let { groupName, eventName  } = useParams()

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const previousPage = (e) =>{
    e.preventDefault()
     history.push("/")
  }

  return (
    <>
      {isLoaded && (
        <Switch>

          <Route exact path="/">
            {sessionUser ? <Home/> : <HomePage/>}
          </Route>

          <Route path="/signup">
            <NavLink exact to="/"><img src={iconImg} alt="G logo" /></NavLink>
            <SignupFormPage />
          </Route>

          <Route path="/login">
            <NavLink exact to="/"><img src={iconImg} alt="G logo" /></NavLink>
            <LoginFormPage />
          </Route>

          <Route path="/find">
            <Navigation isLoaded={isLoaded} />
            <FindPage isLoaded={isLoaded} />
          </Route>

          <Route exact path="/groups/:groupId">
            <Navigation isLoaded={isLoaded} />
            <ShowOneGroup />
          </Route>

          <Route path="/groups/:groupId/edit">
            <Navigation isLoaded={isLoaded} />
            <EditGroup />
          </Route>

          <Route path="/new-group">
            <Navigation isLoaded={isLoaded} />
            <CreateGroupForm isLoaded={isLoaded} />
          </Route>

          <Route exact path="/:groupId/events/:eventId">
            <Navigation isLoaded={isLoaded} />
            <ShowOneEvent />
          </Route>

          <Route exact path="/events/:eventId/edit">
            <Navigation isLoaded={isLoaded} />
            <EditEvent />
          </Route>

          <Route path="/groups/:groupId/new-event">
            <Navigation isLoaded={isLoaded} />
            <CreateEventForm isLoaded={isLoaded} />
          </Route>

          <Route>
            <Navigation isLoaded={isLoaded} />
            <div style={{
              display: "flex",
              alignItems:"center",
              flexDirection:"column",
              margin: "auto",
              fontSize: "24px",
              fontWeight: "900"}} >
              <span>Page Not Found</span>
              <button onClick={previousPage}>Click me to return Home!</button>
            </div>
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
