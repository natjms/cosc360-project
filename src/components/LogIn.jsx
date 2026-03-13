import './Login.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

function Login(props) { 
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

         setIsSubmitting(true)
         try { 
            await createLoginForm(content)
            setPassword("")
            setEmail()
            onCreate(); 
         } catch { 

         } finally { 
            setIsSubmitting(false)
         }

    };

    return (
        <>
        <div className = "window" onClick = {props.toggle}>
            <button className = "close" onClick = {props.toggle}>Close</button>
          <div className = "overlay" onClick = {(e) => e.stopPropagation()}>
            <div className = "content">
              <h2 className="title">LOG IN</h2>
                  <label htmlFor = "email">EMAIL</label> 
                  <input 
                    type ="text" 
                    name = "email" 
                    id = "email" 
                    placeholder = "Enter an email"
                    value={password}
                    onChange={(e) => setEmail(e.target.value)}
                    ></input>

                  <label htmlFor = "Password">PASSWORD</label> 
                  <input 
                    type ="text" 
                    name = "password" 
                    id = "password" 
                    placeholder = "Enter a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    ></input> 
                  <button className = "submit" onClick ={handleSubmit}>Submit</button>
              </div>
             </div>
             <p>No Account?</p>
             <button onClick={handleSignup}>Signup</button>
        </div>
        </>
    );
}

export default Login;
