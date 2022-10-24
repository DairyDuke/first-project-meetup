import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import './ShowOneEvent.css';
import * as eventActions from "../../store/events";
import * as groupActions from "../../store/groups";

function ShowOneEvent() {
  const { groupId, eventId } = useParams();
  const dispatch = useDispatch()
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user);
  const group = useSelector(state => state.groups.singleGroup);
  const [category, setCategory] = useState('about')
  const [error, setError ] = useState('')


useEffect(()=>{
  dispatch(groupActions.grabOneGroup(groupId))
  .catch(async (res)=>{
    const data = await res.json()
    if (data && data.message) {
      setError(data.message)
    }
  })

  // return (()=> dispatch(groupActions.removeSingleGroupThunk()))
}, [dispatch, groupId])

if (group == undefined) return null;

const editButton = (e) => {
  e.preventDefault();

  history.push(`/events/${eventId}/edit`)

}
const eventButton = (e) => {
  e.preventDefault();

  history.push(`/groups/${groupId}/new-event`)

}
const deleteButton = (e) => {
  e.preventDefault();
  if (window.confirm("Are you certain you wish to delete your group? This can not be undone.")) {
    dispatch(eventActions.deleteEventThunk(eventId))
    history.push('/')
  } else {
  history.push(`/groups/${groupId}/`)
  }
}


let power;
if (sessionUser && sessionUser.id === group.organizerId){
  power =(
    <div>
      <button className="power-buton" onClick={editButton}>Edit</button>
      <button className="power-buton" onClick={deleteButton}>Delete</button>
      <button className="power-buton" onClick={eventButton}>New Event</button>
    </div>
  )
}


const about = (
  <>

  </>
)


const categorySwitch =({category})=> {
  switch(category) {
    case 'about':
     return ;
    case 'events':
      return ;
    case 'members':
      return ;
    case 'photos':
      return ;
    default:
      return ;
    }
  }
  const newGroup = (
    <>
    <h3 className="newgroup-h3-size">New Group</h3>
    </>
    )
return (
  <div className="sog-container">
  <div className="sog-header-container">
    <img
      src={group.previewImage && group.previewImage !== "Preview Image not found" ? group.previewImage : `/images/defaultGroup.jpg` }
      alt={group.name}
      className="sog-image-style"
      />

    <div>{power}</div>
  </div>
  <div className="sog-body-container">
    <div className="sog-group-name-container">
        {newGroup}
       <h3>{group.name}</h3>
       <span className="location-h3-size">{group.city}, {group.state}</span>
       <span className="location-h3-size">{group.numMembers} members · {group.private === 0 ? "Public group" : "Private group"}</span>
       <span className="location-h3-size">Organized by {sessionUser.firstName}</span>
      <div>
      </div>
    </div>
    {/* <div className="sog-group-member-and-visibility"> */}
      {/* <div className="sog-group-link-icon">
        ❔ This group’s content, including its members and event details, are visible to the public.Learn more

      </div> */}
    {/* </div> */}
    <div className="sog-group-about-container">
      <p className="sog-group-about-content">{group.about}</p>
    </div>
  </div>

</div>
)

  // return (
  //   <>
  //   <div className="sog-container">
  //     <div className="sog-header-container">
  //      {/* top container  */}
  //       <div>
  //         <img src={"/images/defaultGroup.jpg"} className="sog-image-style"/>
  //       </div>
  //       <div>
  //         <div className="sog-info">
  //           <h3 className="sog-title">{group.name}</h3>
  //           <h3 className="sog-text">{group.city}, {group.state}</h3>
  //         </div>
  //         <div className="sog-text">
  //           {group.numMembers} members · {group.private === 0 ? "Public" : "Private"}
  //         </div>
  //         <div className="sog-text">
  //           Organized by {group.organizerId}
  //         </div>
  //       </div>
  //     </div>
  //     <div>
  //       <div> </div>
  //       <div>{power}</div>
  //     </div>
  //     <div>
  //       <div className="sog-body-container">
  //         <p className="sog-body-content">{group.about}</p>
  //       </div>
  //       <div>
  //         Organizer
  //       </div>
  //       <div>
  //         Members List
  //       </div>
  //     </div>
  //   </div>
  //   </>
  // )
}


export default ShowOneEvent
