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

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
     const handleSubmit = async(e) => {
         e.preventDefault() 

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

        if (!hasError) {
            alert("Form submitted successfully");
        }

        if(!hasError) { 
            fetch("http://localhost:3000/api/user", { 
              method: "POST", 
              headers: { 
              "Content-Type": "application/json"
              },
            body: JSON.stringify({email, password})
     })

            .then((response) => response.json())
            .then((data) => { 
                console.log(data); 
            })
            .catch((error) => { 
                console.log(error)
            })   

    }
     }

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
             <p>{emailError}</p>
             <button onClick={handleSignup}>Signup</button>
        </div>
        </>
    );
}
