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
  const [visibleBox, setVisibleBox] = useState(false)

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

      const token = localStorage.getItem('token');

       if (!token || token.trim() === '') {
        setError("Not logged in");
        setLoading(false);
        return;
      }

      try { 
      const res = await fetch('/api/accounts/current-user', {
        method: "GET",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`
        }
      });

      const data =  await res.json();
      console.log("data", data);
      setUser(data); 

      if (!res.ok) {
        setError(data.error || 'Failed to get user');
        return;
      }
    } catch(error) { 
        console.error("Network or server error", error)
      }
    
    }
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
        navigate('/profile')
      } else { 
        return;
      }
    }


async function validateForm(e) {
    e.preventDefault()

  try { 
  const response = await fetch(`/api/accounts/${user._id}`, {
        method: "PATCH",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic ${localStorage.getItem('token')}`,
        
          },
          body: JSON.stringify({
                    email: email,
                    username: username, 
                    city: city,
                    country: country,
                    password_plaintext: password_plaintext
                  }),
        })
          
            if(!response.ok) { 
                throw new Error("invalid email")
            } else { 
            
            const data = await response.json(); 
            
            alert("successfully updated")
            navigate('/profile')
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
      <h2>IMAGE HERE</h2>
    </div>

    <div className = "editAccount">
      <button className = "deleteButton" onClick = {handleDelete} type="button">Delete Account</button>
      <button className = "updateButton" onClick={updateInfo} type = "button">Edit Profile</button>
    </div>

    </div>
  
  <div className = "profileContainer">

  <form className="accountForm" action="#">


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

  <button
    onClick={validateForm}
    className="submit"
    style={{ marginLeft: "200px", width: "100px", height: "40px" }}> Submit </button>

</form>

<div>
    <h2 style = {{marginLeft: "40px", marginRight: "40px"}}>COULD DISPLAY STATS IF TIME PERMITS</h2>
</div>

</div>

</>

  );

  }




export default MyAccount;