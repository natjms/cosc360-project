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
        <h3 style = {{color: "white"}}>About</h3>
        <h1 style = {{color: "white"}}>CONNECT, LEARN, TRADE</h1>
      </div>

      <div> 
        <img src = {hammock} alt = "Hammock photo" className = "hammock-img" />
      </div>

      <div className = "blurb">
        <h3>OUR VISION IS TO ALLOW USERS TO EXCHANGE BOOKS AMONGST EACH OTHER, SPREADING KNOWLEDGE</h3>
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
        <h3 className = "aboutpara">We are a group of people who love books. Our mission is to spread books
          with other people. We are a group of people who love books. Our mission is to spread books
          with other people. We are a group of people who love books. Our mission is to spread books
          with other people. We are a group of people who love books. Our mission is to spread books
          with other people. We are a group of people who love books. Our mission is to spread books
          with other people. We are a group of people who love books. Our mission is to spread books
          with other people. We are a group of people who love books. Our mission is to spread books
          with other people. We are a group of people who love books. Our mission is to spread books
          with other people.</h3>
      </div>

      </>
    );
}


export default About;
