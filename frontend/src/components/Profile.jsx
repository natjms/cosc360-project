import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import logo from "../assets/logo.jpg";
import exchange from "../assets/exchange.jpg"
import stacked from "../assets/stacked-books.jpg"
import read from "../assets/read.jpg"
import './Profile.css'

function Profile() {

     const handleAccount = () => { 
        navigate('/MyAccount')
        navigate('/')
    }

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
    
        <div style = {{alignItems: "center", margin: "20px"}}>
        <a href = "/myaccount" onClick = {handleAccount}>Edit Account</a>
        </div>

      <div className = "blip">
        <h3>OUR VISION IS TO ALLOW USERS TO EXCHANGE BOOKS AMONGST EACH OTHER, SPREADING KNOWLEDGE</h3>
      </div>

    <h1>Available Books</h1>

      <div className = "images">

      <div className = "wrapper one">
      <img src = {stacked} alt = "Stacked books photo" className = "stacked-img" />
      </div>

      <div className = "wrapper two">
      <img src = {exchange} alt = "Exchange book photo" className = "exchange-img" />
      </div>

      <div className = "wrapper three">
      <img src = {read} alt = "Read book" className = "read-img" />
      </div>

      </div>

    <h1>Activity</h1>

      </>
    );
}


export default Profile;