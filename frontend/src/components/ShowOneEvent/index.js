import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import './ShowOneEvent.css';
import * as eventActions from "../../store/events";

function ShowOneEvent() {
  const { groupId, eventId } = useParams();
  const dispatch = useDispatch()
  const history = useHistory()

  return (
    <>

    </>
  )
}

export default ShowOneEvent
