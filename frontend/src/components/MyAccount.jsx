import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyAccount() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState("");


  useEffect(() => {
    
    async function getUserInfo() {
      const token = localStorage.getItem('token');

       if (!token || token.trim() === '') {
        setError("Not logged in");
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:3000/api/accounts/current-user', {
        method: "GET",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic $(token)`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to get user');
        return;
      }

      setUser(data);
    }

    getUserInfo();
  }, []);


  return (
    <>
    <form>
    <div>
      <h2>My Account</h2>
      <p><strong>Username:</strong> {user?.username}</p>
      <input type = "text" placeholder = "ailishc8"></input>
      <p><strong>Email:</strong> {user?.email}</p>
      <input type="text" placeholder = "ailishc8@gmail.com" />
                
      <p><strong>City:</strong> {user?.city}</p>
      <input type = "text" placeholder = "Kelowna"></input>
    </div>
    <br></br>
    <button className = "submit">Update</button>
    <button type="button" style={{ marginLeft: '10px'}}>
          Delete Account
        </button>
    </form>
    </>
  );
}


export default MyAccount;