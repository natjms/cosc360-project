import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import logo from "../assets/logo.jpg";
import hammock from "../assets/cozy-hammock.jpeg"
import exchange from "../assets/exchange.jpg"
import stacked from "../assets/stacked-books.jpg"
import read from "../assets/read.jpg"
import './About.css'

function About() {
    return (
      <>
      <div className = "about">
        <h1><small>About</small><br/>CONNECT, LEARN, TRADE</h1>
      </div>

      <div>
        <img src = {hammock} alt = "Hammock photo" className = "hammock-img" />
      </div>

      <div className = "blurb">
        <p>Our vision is to allow people to exchange books amongst each other, spreading knowledge</p>
      </div>

      <div className = "images">

      <div className = "wrapper one">
      <img src = {stacked} alt = "Stacked books photo" className = "stacked-img" />
      <p className = "words">LOOKING TO BUY MORE USED BOOKS <br></br>OVER NEW ONES?</p>
      </div>

      <div className = "wrapper two">
      <p className = "words">TRADE WITH OTHERS.<br></br> MEET NEW PEOPLE</p>
      <img src = {exchange} alt = "Exchange book photo" className = "exchange-img" />
      </div>

      <div className = "wrapper three">
      <img src = {read} alt = "Read book" className = "read-img" />
      <p className = "words">INTERESTED IN WHAT OTHER PEOPLE <br></br> IN YOUR COMMUNITY ARE READING?</p>
      </div>

      </div>

      <div className = "paragraph">
        <h1>MORE ABOUT US</h1>
        <p className = "aboutpara">We are a collection of people who believe books are meant to be shared. 
          What started out as a small group of readers exchanging books with each
          other has grown into a community of sharing and discovering new books.
          Whether you are looking to free space on a shelf or are searching 
          for something new to dive into, this is the perfect place to do so. 
          Thank you for being apart of our book exchange. This community would
          not be what it is without you</p>
      </div>
      </>
    );
}


export default About;
