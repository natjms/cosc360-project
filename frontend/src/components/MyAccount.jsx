import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyAccount() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [username, setUsername] = useState("");
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

    function updateInfo() { 
        setVisibleBox(true)
    }

    function handleBack() { 
      navigate('/profile')
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
  fetch(`/api/accounts/${user._id}`, {
        method: "DELETE",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic ${localStorage.getItem('token')}`,
          },
        })

        alert("Account has been deleted")
        navigate('/profile')
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
                    city: city
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
    <button onClick = {handleBack}>Back</button>
    <h2>My Account</h2> 
    <button onClick = {handleDelete} type="button">Delete Account</button>
    <br></br>
    <button onClick={updateInfo} className = "button" style = {{marginLeft: "0"}}>Update Information</button>

    <form action='#'>
    <div>
      <p><strong>Current Username:</strong> {user?.username}</p>

       {visibleBox &&
      <>
      <p><strong>Update Username:</strong></p>
      <input type="text" placeholder = "Enter new username if applicable" value = {username} onChange = {handleUsernameChange} style = {{width: "200px"}}/>    
      </>
      }
      
      <hr></hr>
      
      <p><strong>Current Email:</strong> {user?.email}</p>
      
      {visibleBox &&
      <>
      <p><strong>Update Email:</strong></p>
      <input type="text" placeholder = "Enter new email if applicable" value = {email} onChange = {handleEmailChange} style = {{width: "200px"}}/>    
      </>
      }
      <hr></hr>
      <p><strong>Current City:</strong> {user?.city}</p>

       {visibleBox &&
      <>
      <p><strong>Update City:</strong></p>
      <input type="text" placeholder = "Enter new city if applicable" value = {city} onChange = {handleCityChange} style = {{width: "200px"}}/>    
      </>
      }
    </div>
     
    <br></br>
    <button onClick={validateForm} className = "submit" style = {{marginLeft: 0, width: "100px", height: "40px"}}>Submit</button>
    </form>
    </>
  );

}

export default MyAccount;