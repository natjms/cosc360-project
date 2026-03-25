import './Signup.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("")
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  

  const handleClose = () => {
         navigate('/'); 
    };

  function handleFirstNameChange(e) {
        setEmail(e.target.value);
        setEmailError("");
    }

    function handleLastNameChange(e) {
        setPassword(e.target.value);
        setPasswordError("");
    }

    function handleAddressChange(e) {
        setCountry(e.target.value);
        setCountryError("");
    }

    function handleCountryChange(e) {
        setCountry(e.target.value);
        setCountryError("");
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError("");
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setPasswordError("");
    }

    function validateForm(e) {
        e.preventDefault();

        let hasError = false;

        const emailReg = /^(.+)@([^\.].*)\.([a-z]{2,})$/;
        const passReg = /^[a-zA-Z]\w{8,16}$/;

        if (firstName === "") {
            setCountryError("Select a country");
            hasError = true;
        }

        if (lastName === "") {
            setCountryError("Select a country");
            hasError = true;
        }

        if (address === "") {
            setCountryError("Select a country");
            hasError = true;
        }

        if (country === "") {
            setCountryError("Select a country");
            hasError = true;
        }

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

        if (!hasError) {
            fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    country: country
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    return (
        <div className = "window">
          <button className = "close" onClick ={handleClose}>Close</button>
          <div className = "overlay" onClick = {(e) => e.stopPropagation()}>
            <div className = "content">
              <h2 className="title">SIGN UP</h2>
                <div>
                  <label htmlFor = "lastName">LAST NAME</label> 
                  <input type ="text" name = "lastName" id = "lastName" placeholder = "Enter last name" onChange = {handleLastNameChange}></input> 
                </div>   

                <div>  
                  <label htmlFor = "firstName">FIRST NAME</label> 
                  <input type ="text" name = "firstName" id = "firstName" placeholder = "Enter first name" onChange = {handleFirstNameChange}></input> 
                </div> 

                <div> 
                  <label htmlFor = "Address">Address</label> 
                  <input type ="text" name = "address" id = "address" placeholder = "Address, Postal Code" onChange = {handleAddressChange}></input> 
                </div>    
                  
                  <div className={countryError ? "control error" : "control"}>
                    <label>Country:</label>
                    <select value={country} onChange={handleCountryChange}>
                        <option value="">Select a country</option>
                        <option value="1">Canada</option>
                        <option value="2">USA</option>
                        <option value="3">UK</option>
                        <option value="4">Nigeria</option>
                    </select>
                    <span>{countryError}</span>
                </div>

                <div className={emailError ? "control error" : "control"}>
                    <label>Email:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <span>{emailError}</span>
                </div>

                <div className={passwordError ? "control error" : "control"}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <span>{passwordError}</span>
                </div>

                  <img src = "src/user.png" alt = "user" className = "profileImage"></img>
                  <button className = "profileButton">Add Profile Image</button>
                  <button className = "submit">Submit</button>
              </div>
             </div>
             
        </div>
    );
}

export default Signup;