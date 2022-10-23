import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './CreateEvent.css';
import * as eventActions from "../../store/events";

function AddGroupImage() {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [groupId, setGroupId] = useState("");

  const [errors, setErrors] = useState([]);
  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([])

  }

  return(
    <>
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <span>Enter Your Group Image</span>
        </div>
        <label>
          Image URL
          <input
            type="url"
            value={url}
            onChange={(e)=>setUrl(e.target.value)}
            required
            placeholder="Please ensure your url ends with an image type."
            />
        </label>
        <input
          type="hidden"
          value={groupId}
          />
      </form>
    </div>
    </>
  )
}
//groupId, url, preview?
