import './LogIn.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import MyAccount from './MyAccount.jsx'


export default function Login(props) { 
    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSignup = () => {
         navigate('/signup'); 
    }
   
    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError("");
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setPasswordError("");
    }


    async function validateForm(e) {
        e.preventDefault();

        let hasError = false;

        const emailReg = /^(.+)@([^\.].*)\.([a-z]{2,})$/;
        const passReg = /^[a-zA-Z]\w{8,16}$/;

        if (!emailReg.test(email)) {
            {/*if pattern does not match */ }
            setEmailError("Enter a valid email");
            hasError = true;
        }

        if (!passReg.test(password)) {
            setPasswordError("Enter a password between 9 and 17 characters");
            hasError = true;
        }

        if (hasError) return; 

        console.log("information loading");
    

        try { 
        const response = await fetch("http://localhost:3000/api/sessions/login", { 
              method: "POST", 
              headers: { 
              "Content-Type": "application/json"
              },
            body: JSON.stringify({
                credential: email,
                password_plaintext: password,
            })
     })

       const data = await response.json(); 
            
            if(!response.ok) { 
                throw new Error("Invalid credentials")
            } else { 
                alert("login successful");
                localStorage.setItem('token', data.token)
                navigate('/myaccount'); 
            }

        }   catch(error) { 
                console.error("Network or server error", error)
            }
    }


    return (
        <>
        <div className = "window" onClick = {props.toggle}>
            <button className = "close" onClick = {props.toggle}>Close</button>
          <div className = "overlay" onClick = {(e) => e.stopPropagation()}>
            <form className = "content" onSubmit={validateForm}>
              <h2 className="title">LOG IN</h2>
              <div className = {emailError ? "control error" : "control"}>
                  <label htmlFor = "email">EMAIL</label> 
                  <input 
                    type ="text" 
                    name = "email" 
                    id = "email" 
                    placeholder = "Enter an email"
                    value={email}
                    onChange={handleEmailChange}>
                    </input>
                    <span>{emailError}</span>
                </div>

                <div className ={passwordError ? "control error" : "control"}>
                  <label htmlFor = "Password">PASSWORD</label> 
                  <input 
                    type ="password" 
                    name = "password" 
                    id = "password" 
                    placeholder = "Enter a password"
                    value={password}
                    onChange= {handlePasswordChange}>
                    </input> 
                    <span>{passwordError}</span>
                </div>
                  <button className = "submit" type = "submit">Submit</button>
                  <p id = "response" style = {{marginLeft: "20px"}}></p>
             </form>
             </div>
             <p>No Account?</p>
             <p>{emailError}</p>
             <button onClick={handleSignup}>Signup</button>
        </div>
        </>
    );
}
