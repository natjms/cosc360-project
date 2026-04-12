import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyAccount.css'

function MyAccount() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [password_plaintext, setPassword_plaintext] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleBox, setVisibleBox] = useState(false);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    city: "",
    country: "",
    email: "",
    password: "",
    confirm: "",
    image: ""
});

   function handleEmailChange(e) {
    if(e != null)
        setEmail(e.target.value); 
    }

    function handleUsernameChange(e) {
      if(e != null)
        setUsername(e.target.value); 
    }

    function handleCityChange(e) {
      if(e != null)
        setCity(e.target.value); 
    }

    function handleCountryChange(e) {
      if(e != null)
        setCountry(e.target.value); 
    }

    function handlePasswordChange(e) {
      if(e != null)
        setPassword_plaintext(e.target.value); 
    }

    function updateInfo() { 
        setVisibleBox(true)
    }

 useEffect(() => {

    const getUserInfo = async () => { 

       const token = localStorage.getItem("token");

       if (!token || token.trim() === '') {
        setError("Not logged in");
        setLoading(false);
        return;
      }
    		
      
    try {
    
      const res = await fetch("/api/accounts/current-user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      const data = await res.json();
    
      if (!res.ok) {
        setError(data.error || "Failed to get user");
        return;
      }

      setUser(data);

      if (data.imagePath) {
        const imageData = data.imagePath
        setImage(`/api${imageData}`);
        setImage(`/api${data.imagePath}`);
      }

    } catch (error) {
      console.error("Network or server error", error);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  getUserInfo();
}, []);


async function handleDelete() { 
  if(confirm("Are you sure you want to delete your account? This can not be undone")) { 
    fetch(`/api/accounts/${user._id}`, {
        method: "DELETE",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic ${localStorage.getItem('token')}`,
          },
        })

        alert("Account has been deleted")
        navigate('/logout')
      } else { 
        return;
      }
    }


async function validateForm(e) {
    e.preventDefault()

    let hasError = false;

        const usernameReg = /^[a-zA-Z][a-zA-Z0-9_.]+$/; 
        const emailReg = /^(.+)@([^\.].*)\.([a-z]{2,})$/;
        const lengthReg = /^.{9,17}$/;
        const digitReg = /[0-9]/;
        const specialCharReg = /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=;]/;
        const uppercaseReg = /[A-Z]/;

        const newErrors = {
            username: "",
            email: "",
            password: "",
            image: ""
        };


        if (username !== "" && !usernameReg.test(username)) {
		        newErrors.username = ("Must start with a letter and contain two characters. No spaces or special characters allowed");
            hasError = true;
	    }

        if (email !== "" && !emailReg.test(email)) {
            newErrors.email = ("Enter a valid email format: example@gmail.com");
            hasError = true;
        }

        if ( password_plaintext !== "" && ( !lengthReg.test(password_plaintext) || !digitReg.test(password_plaintext) ||!uppercaseReg.test(password_plaintext) || !specialCharReg.test(password_plaintext)))      
           
        { newErrors.password = "Needs 7-19 characters, at least one digit, one uppercase, one special character";
          hasError = true;
        }

        setErrors(newErrors);

        if(hasError) { 
            return;
        }

        const payload = {};
          if (username) payload.username = username;
          if (email) payload.email = email;
          if (city) payload.city = city;
          if (country) payload.country = country;
          if (password_plaintext) payload.password_plaintext = password_plaintext;

     try {
        const response = await fetch(`/api/accounts/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${localStorage.getItem('token')}`,
      },
        body: JSON.stringify(payload),
    });
          
          if (!response.ok) {
            if (response.status === 409) {
            setMessage(data.error || "The email or username is taken");
           }
            
            const data = await response.json(); 
            
            alert("successfully updated")
            navigate(`/user/${payload.username}`);
            }
          }catch(error) { 
            console.log("error")
          }
  
  }

  return (
    <>

    <div className = "header">

    <div className = "bio">
      <h2>{user?.username} </h2>
      <img className='profileImg' src={image}></img>
    </div>

    <div className = "editAccount">
      <button className = "deleteButton" onClick = {handleDelete} type="button">Delete Account</button>
      <button className = "updateButton" onClick={updateInfo} type = "button">Edit Profile</button>
    </div>

    </div>
  
  <div className = "profileContainer">

  <form className="accountForm" action="#">


<div className={errors.username ? "control error" : "control"}> 
  
  <div className="username">
  <div className="fillRow">
    <div>
      <p><strong>Current username</strong> {user?.username}</p>
    </div>

    {visibleBox && (
      <div>
        <span><strong>Update Username:</strong></span>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          style={{ width: "200px" }}
        />
      </div>
    )}
  </div>
  </div>
   <span className = "errorMessage">{errors.username}</span>
</div>


<div className={errors.email ? "control error" : "control"}>  

<div className="email">

  <div className="fillRow">
    <div>
      <p><strong>Current Email:</strong> {user?.email}</p>
    </div>

    {visibleBox && (
      <div>
        <span><strong>Update Email:</strong></span>
        <input
          type="text"
          value={email}
          onChange={handleEmailChange}
          style={{ width: "200px" }}
        />
      </div>
    )}
  </div>
</div>
<span className = "errorMessage">{errors.email}</span>
</div>



 <div className="city">

  <div className="fillRow">
    <div>
      <p><strong>Current City:</strong> {user?.city}</p>
    </div>

    {visibleBox && (
      <div>
        <span><strong>Update City:</strong></span>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          style={{ width: "200px" }}
        />
      </div>
    )}
  </div>

</div>

 <div className="country">

  <div className="fillRow">
    <div>
      <p><strong>Current Country:</strong> {user?.country}</p>
    </div>

    {visibleBox && (
      <div>
        <span><strong>Update Country:</strong></span>
        <input
          type="text"
          value={country}
          onChange={handleCountryChange}
          style={{ width: "200px" }}
        />
      </div>
    )}
  </div>

</div>

<div className={errors.password ? "control error" : "control"}> 
 <div className="password">

  <div className="fillRow">
    <div>
      <p><strong>Current Password is hidden for security:</strong></p>
    </div>

    {visibleBox && (
      <div>
        <span><strong>Update Password:</strong></span>
        <input
          type="password"
          value={password_plaintext}
          onChange={handlePasswordChange}
          style={{ width: "200px" }}
        />
      </div>
    )}
  </div>
</div>
<span className = "errorMessage">{errors.password}</span>
</div>

  <button
    onClick={validateForm}
    className="submit"
    style={{ marginLeft: "200px", width: "100px", height: "40px" }}> Submit </button>

</form>

</div>

</>

  );

  }




export default MyAccount;
