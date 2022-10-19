import './LanguageSelectChoice.css'
const LanguageSelectChoice = ()=>{

  return (
    <>
    <div className="language-select-container">
      <div className="language-select-content">
      <h2> Change you language</h2>
      <div>
      <label className="cursor-pointer">
        <div>
          <input
          type="radio"
          className="cursor-pointer"
          name="English"
          value="en-US"
          checked
          >
          </input>
        </div>
      </label>
      </div>
      </div>
    </div>
    </>
  )
}

export default LanguageSelectChoice;
