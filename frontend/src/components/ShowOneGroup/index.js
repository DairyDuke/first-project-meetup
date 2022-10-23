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
      <img src={group.GroupImages[0].url} />
      <div>
        <span>Group name {group.name}</span>
        <div>
          <h2>Test</h2>
        </div>
      </div>
      <div>
      </div>
    </div>
    {power}
    </>
  )
}

export default ShowOneGroup
