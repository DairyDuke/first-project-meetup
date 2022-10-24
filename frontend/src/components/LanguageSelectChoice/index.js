import './LanguageSelectChoice.css'
const LanguageSelectChoice = ()=>{

  return (
    <>
    <div className="language-select-container">
      <div className="language-select-content">
      <h2> Change you language</h2>
      <div>
      <label className="cursor-pointer">
        <div className="login-align-items" >
          <input
          type="radio"
          className="cursor-pointer"
          name="English"
          value="en-US"
          checked
          /> English
        </div>
      </label>
      <div className="button-padding">
        <button type="submit" className="signup-form-button">Confirm Choice</button>
      </div>
      </div>
      </div>
    </div>
    </>
  )
}

export default LanguageSelectChoice;
