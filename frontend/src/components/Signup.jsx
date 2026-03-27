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
  const [image, setImage] = useState(null);
  

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
        setFirstName(e.target.value);
        setFirstNameError("");
    }

    function handleLastNameChange(e) {
        setLastName(e.target.value);
        setLastNameError("");
    }

    function handleAddressChange(e) {
        setAddress(e.target.value);
        setAddressError("");
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
            setFirstNameError("Fill in first name");
            hasError = true;
        }

        if (lastName === "") {
            setLastNameError("Fill in last name");
            hasError = true;
        }

        if (address === "") {
            setAddressError("Fill in address");
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
                    name: firstName,
                    last: lastName,
                    country: country,
                    address: address,
                    email: email,
                    password: password,
                    image: image
                    
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
            <form onSubmit={validateForm}>
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


        <div>
          
          <img src = "src/user.png" alt = "user" className = "profileImage"></img>
          <button className = "profileButton">Add Profile Image</button>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} 
            required
          />
        </div>

                  
                 
                  
                  <button className = "submit">Submit</button>
              </div>
            </form>
             </div>
             
        </div>
        
    );
}

export default Signup;