import './LogIn.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

export default function Login(props) { 
    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

     const handleSignup = () => {
         navigate('/signup'); 
    };

     const handleSubmit = async(e) => {
         e.preventDefault() 
         if(!email.trim() || !password.trim()) return; 

         try { 
          const response = await fetch("http://localhost:3000/api/user", { 
            method: "POST", 
            headers: { 
              "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
     })


        if(!response.ok) { 
          throw new Error("Error"); 
        }
          const data = await response.json(); 
          console.log(data)
          const stat = document.getElementById("response")

          if(data.success) { 
            setIsSubmitting(true);
            console.log("Login successful")
            navigate('/');
          } else { 
            console.log("Login unsuccessful")
            stat.textContent = "Successful"
          }
        } catch(error) { 
            console.log("error logging in")
          } finally { 
            setIsSubmitting(false); 
          }

    };


    return (
        <>
        <div className = "window" onClick = {props.toggle}>
            <button className = "close" onClick = {props.toggle}>Close</button>
          <div className = "overlay" onClick = {(e) => e.stopPropagation()}>
            <form className = "content" onSubmit ={handleSubmit}>
              <h2 className="title">LOG IN</h2>
                  <label htmlFor = "email">EMAIL</label> 
                  <input 
                    type ="text" 
                    name = "email" 
                    id = "email" 
                    placeholder = "Enter an email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>
                    </input>

                  <label htmlFor = "Password">PASSWORD</label> 
                  <input 
                    type ="password" 
                    name = "password" 
                    id = "password" 
                    placeholder = "Enter a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                    </input> 
                  <button className = "submit" type = "submit">Submit</button>
                  <p id = "response" style = {{marginLeft: "20px"}}></p>
             </form>
             </div>
             <p>No Account?</p>
             <button onClick={handleSignup}>Signup</button>
        </div>
        </>
    );
}
