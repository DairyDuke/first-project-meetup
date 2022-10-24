import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import './ShowOneGroup.css';
import * as groupActions from "../../store/groups";

function ShowOneGroup() {
  const { groupId } = useParams();
  const dispatch = useDispatch()
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user);
  const group = useSelector(state => state.groups.singleGroup)
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

  history.push(`/groups/${groupId}/edit`)

}

const deleteButton = (e) => {
  e.preventDefault();
  if (window.confirm()) {
    dispatch(groupActions.deleteGroupThunk(groupId))
    history.push('/')
  } else {
  history.push(`/groups/${groupId}`)
  }
}
let power;
if (sessionUser && sessionUser.id === group.organizerId){
  power =(
    <div>
      <button onClick={editButton}>Edit</button>
      <button onClick={deleteButton}>Delete</button>
    </div>
  )
}
  return (
    <>
    <div>
      <div>
       {/* top container  */}
        <div>
          <img src={"/images/defaultGroup.jpg"} />
        </div>
        <div>
          <div>
            <h3>{group.name}</h3>
            <h3 className="location-h3-size">{group.city}, {group.state}</h3>
          </div>
          <div>
            {group.numMembers} members · {group.private === 0 ? "Public" : "Private"}
          </div>
          <div>
            Organized by {group.organizerId}
          </div>
        </div>
      </div>
      <div>
        <div> </div>
        <div> </div>
      </div>
      <div>
        <div>
          <p className="show-group-about-content">{group.about}</p>
        </div>
        <div>
          Organizer
        </div>
        <div>
          Members List
        </div>
      </div>
    </div>
    </>
  )
}

export default ShowOneGroup
