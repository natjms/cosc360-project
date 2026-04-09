import './LogIn.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'


export default function Login(props) { 
    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("");
    const [login_error, setLoginError] = useState(null);

    const handleSignup = () => {
         navigate('/signup'); 
    }
   
    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError("");
        setLoginError(null);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setLoginError(null);
    }


    async function validateForm(e) {
        e.preventDefault();

        let hasError = false;

        const emailReg = /^(.+)@([^\.].*)\.([a-z]{2,})$/;

        if (!emailReg.test(email)) {
            {/*if pattern does not match */ }
            setEmailError("Enter a valid email");
            hasError = true;
        }

        if (hasError) return; 

        console.log("information loading");
    

        try { 
        const response = await fetch("/api/sessions/login", {
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
                setLoginError(data.error);
            } else { 
                alert("login successful");
                localStorage.setItem('token', data.token);
                localStorage.setItem('account_id', data.account_id);
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
                  <h3> <label htmlFor = "email">EMAIL</label> </h3>
                  <input 
                    type ="text" 
                    name = "email" 
                    id = "email" 
                    placeholder = "Enter an email"
                    value={email}
                    onChange={handleEmailChange}>
                    </input>
                    <p className='login-error'>{emailError}</p>
                </div>

                <div className="control">
                  <h3><label htmlFor = "Password">PASSWORD</label> </h3>
                  <input 
                    type ="password" 
                    name = "password" 
                    id = "password" 
                    placeholder = "Enter a password"
                    value={password}
                    onChange= {handlePasswordChange}>
                    </input> 
                </div>
                  { login_error &&
                    <p className='login-error'>{login_error}</p>
				  }
                  <button className = "submit" type = "submit">Submit</button>
                  <p id = "response"></p>
             </form>
             </div>
             <h3>No Account?</h3>
             <button onClick={handleSignup}>Signup</button>
        </div>
        </>
    );
}
