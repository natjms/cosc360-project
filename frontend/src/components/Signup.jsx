import './Signup.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  

  const [usernameError, setUsernameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  

  const handleClose = () => {
         navigate('/'); 
    };

  function handleChangeUsername(e) {
        setUsername(e.target.value);
        setFirstNameError("");
    }

    function handleCityChange(e) {
        setCity(e.target.value);
        setCityError("");
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

        if (username === "") {
            setFirstNameError("Fill in username");
            hasError = true;
        }

        if (city === "") {
            setCityError("Fill in city");
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
            fetch("http://localhost:3000/api/accounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password_plaintext: password,
                    country: country,
                    city: city,
                    image: image
                })
            })
                .then(async(response) => { 
                    const data = await response.json();
                    navigate('/')
                
                    if(!response.ok) { 
                        console.error(data);
			alert("Submission error: server returned response " + response.status)
                        return;
                    }
                    console.log(data);
                });
        }
    }

    return (
        <div className = "window">
          <button className = "close" onClick ={handleClose}>Close</button>
          <div className = "overlay" onClick = {(e) => e.stopPropagation()}>
            <form onSubmit={validateForm}>
              <h2 className="title">SIGN UP</h2>
            <div className = "content">
                <div className="control">  
                  <h3> <label htmlFor = "username">Username</label> </h3>
                  <input type ="text" name = "username" id = "username" placeholder = "Username" onChange = {handleChangeUsername}></input> 
                </div> 

                <div className="control"> 

                  <h3> <label htmlFor = "City">City</label> </h3>
                  <input type ="text" name = "city" id = "city" placeholder = "Kelowna" onChange = {handleCityChange}></input> 
                </div>    
                  
                  <div className={countryError ? "control error" : "control"}>
                    <h3><label>Country:</label></h3>
                    <select value={country} onChange={handleCountryChange}>
                        <option value="">Select a country</option>
                        <option value="1">Canada</option>
                        <option value="2">USA</option>
                        <option value="3">UK</option>
                        <option value="4">Other</option>
                    </select>
                    <span className = "errorMsg">{countryError}</span>
                </div>

                <div className={emailError ? "control error" : "control"}>
                    <h3><label>Email:</label></h3>
                    <input
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
	    		placeholder="johndoe@example.com"
                    />
                    <span className = "errorMsg">{emailError}</span>
                </div>

                <div className={passwordError ? "control error" : "control"}>
                    <h3><label>Password:</label></h3>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <span className = "errorMsg">{passwordError}</span>
                </div>


        <div>
	    <h3><label>Profile Picture</label></h3>
	    {image === null ? "" : <img src = "src/user.png" className = "profileImage"></img>}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} 
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
