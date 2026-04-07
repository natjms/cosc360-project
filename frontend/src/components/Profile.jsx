import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import logo from "../assets/logo.jpg";
import exchange from "../assets/exchange.jpg"
import stacked from "../assets/stacked-books.jpg"
import { useNavigate } from 'react-router-dom';
import read from "../assets/read.jpg"; 
import './Profile.css'; 
import { useState } from 'react'; 
import { useEffect } from 'react'; 

function Profile() {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState("");
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null); 
  const navigate = useNavigate();
   

  const handleAccount = () => { 
    navigate('/MyAccount');
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Not logged in");
        setLoading(false);
        return;
      }

      try {
        let response = await fetch('/api/accounts/current-user', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`
          }
        });

        if (!response.ok) 
          throw new Error("Failed to get current user");
        const currentUser = await response.json();
        setUser(currentUser);

        response = await fetch(`/api/accounts/${currentUser._id}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`
          }
        });

        if (!response.ok) 
          throw new Error("Failed to fetch image");
        const userData = await response.json();
        const imageData = userData.imagePath
        console.log(imageData);
        setImage(`http://localhost:3000${imageData}`);
        setUsername(userData.username); //need to set to uppercase
        setCity(userData.city); //need to set to uppercase
        setCountry(userData.country); //will need to get the actual country  

        /*
        response = await fetch(`/api/${user}/holdings`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`
          }
        });
        if (!response.ok) 
          throw new Error("Failed to fetch holdings");
        
        const holdingsData = await response.json();
        setBooks(holdingsData.books);

        setLoading(false);
        */

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    

    fetchUserData();
  }, []);


    return (
      <>

              <div style = {{alignItems: "center", margin: "20px"}}>
        <a href = "/myaccount" onClick = {handleAccount} style = {{textAlign: "center", backgroundColor: "#B45253", color: "white", textDecoration: "none"}}>Edit Account</a>
        </div>

      <div className = "blip">
        <img src={image} alt="Profile" className = "profileImg" ></img> 
         <h2 style = {{color: "white"}}>{username}</h2>
         <h2 style = {{color: "white"}}>{city}, {country}</h2>
         <h2 style = {{color: "white"}}>JOINED</h2>
      </div>
     

    <h1>Available Books</h1>

    <p>{books}</p>

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
