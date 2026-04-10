import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import logo from "../assets/logo.jpg";
import './Collections.css'
import { useState } from 'react'
import { useEffect } from 'react'


function Collections() {

  const [book, getBook] = useState([]); 

  useEffect(() => { 
    books()
  }, [])

  const books = async () => { 
    
  }

    return (
      <>
      <div className = "about">
        <h1 style = {{color: "white"}}>CONNECT, DISCOVER, IMAGINE</h1>
      </div>
	<div className='btnholder'>
	         <button><h1><a className="lnk" href="/AddCollection">Add new collection</a></h1></button>
	    
	</div>
        <div className = "home1">
        <div style = {{backgroundColor: "#CD9D65",
            width: "100%", 
            height: "100px"
        }}>
        <ul className = "optionsList">
            <li className = "option">By most borrowed</li>
            <li className = "option">By the newest posted</li>
            <li className = "option">By the oldest posted</li>
            <li className = "option">By release date</li>
        </ul>
        </div>
        </div>


      </>
    );
}


export default Collections;
