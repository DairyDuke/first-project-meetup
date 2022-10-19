import {
  chatting,
  datingGroup,
  handsUp,
  hiking,
  joinGroup,
  laptopSmile,
  meetGroup,
  online_events,
  pencilGroup,
  taxesGroup,
  ticket
} from '../../assets/images/index.js'
import './HomePage.css'
const HomePage = ()=> {

  return (
    <>
    <div className="homepage-container">
      <div className="block">
        <div className="homepage-leftside">
        <h1>Celebrating 20 years of real connections on Meetup</h1>
        <p>Whatever you’re looking to do this year, Meetup can help. For 20 years, people have turned to Meetup to meet people, make friends, find support, grow a business, and explore their interests. Thousands of events are happening every day—join the fun.</p>
        </div>
        <div className="homepage-rightside"><img src={(online_events).default} alt="Online Events" /></div>
      </div>
      <div  className="homepage-points-of-interest">

        <div className="option-card" >
          <img src={(laptopSmile)} alt={(laptopSmile)} className="image-resizing"/>
          <button className="option-card-button" >Make new friends -></button>
        </div>

        <div className="option-card" >
          <img src={(pencilGroup)} alt={(hiking)} className="image-resizing"/>
          <button className="option-card-button">Explore the outdoors -></button>
        </div>

        <div className="option-card" >
          <img src={(chatting)} alt={(chatting)} className="image-resizing"/>
          <button className="option-card-button">Connect over tect -></button>
          </div>
      </div>
        <span>"How Groupup Works"</span>
      <div  className="homepage-points-of-interest">

        <div className="option-card-navigation" >
          <img src={(handsUp).default} alt={(handsUp).default} />
          <div>
          <button className="option-card-navigation-button">Join a group(link)</button>
          </div>
          <div>
          Do what you love, meet others who love it, find your community. The rest is history!
          </div>
        </div>

        <div className="option-card-navigation" >
          <img src={(ticket).default} alt={(ticket).default} />
          <div>
          <button className="option-card-navigation-button"> , Find an event(link)</button>
          </div>
          <div>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</div>
        </div>

        <div className="option-card-navigation" >
          <img src={(joinGroup).default} alt={(joinGroup).default} />
          <div>
          <button className="option-card-navigation-button"> , Start a group(link)</button>
          </div>
        <div>
        You don’t have to be an expert to gather people together and explore shared interests.
        </div>
        </div>
        <div>
           <button>Join Meetup</button>
        </div>
      </div>

      <div>
        Upcoming online events (link- Explore More Events)
        <div>Event Blurb(link) date, name, group, members count, link (etc)</div>
        <div>Event Blurb(link)</div>
        <div>Event Blurb(link)</div>
        <div>Event Blurb(link)</div>
      </div>

      <div>
        Popular groups --- (link, Explore more groups)
        <div>Group card - Image, name, upcoming event? New/old</div>
        <div>""</div>
        <div>""</div>
      </div>

      <div>
        <div>image of phone</div>
        <div>
        Stay Connected - Use Groupup on your Mobile browser
        </div>
        <div>image of phone with browser</div>
      </div>
    </div>
    </>
  )
}

export default HomePage;
