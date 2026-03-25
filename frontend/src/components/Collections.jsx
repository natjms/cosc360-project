import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import logo from "../assets/logo.jpg";
import './Collections.css'
import { useCallback } from "react";


function Collections() {


    return (
      <>
        <header className="site-header">
            <div className="logo">
                <img src={logo} alt="Library logo" className="logo-img" />
                <h1>Virtual Library</h1>
            </div>

            <div className="header-right">
                <SearchBarNavigator />
                <Navbar />
            </div>
        </header>

      <div className = "about">
        <h1 style = {{color: "white"}}>CONNECT, DISCOVER, IMAGINE</h1>
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