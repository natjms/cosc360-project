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
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [image, setImage] = useState(null);
  
  const [errors, setErrors] = useState({
    username: "",
    city: "",
    country: "",
    email: "",
    password: "",
    confirm: "",
    image: ""
}); 
  

  const handleClose = () => {
         navigate('/'); 
    };

  function handleUsernameChange(e) {
        setUsername(e.target.value);
        setErrors(prev => ({ ...prev, username: "" }));
    }

    function handleCityChange(e) {
        setCity(e.target.value);
        setErrors(prev => ({ ...prev, city: "" }));
    }

    function handleCountryChange(e) {
        setCountry(e.target.value);
        setErrors(prev => ({ ...prev, country: "" }));
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setErrors(prev => ({ ...prev, email: "" }));
    }
        
    function handlePasswordChange(e) {
        setPassword(e.target.value); 
        setErrors(prev => ({
        ...prev,
        password: "",
        confirm: ""
    }));
    }

    function handlePasswordConfirm(e) {
        setConfirmPassword(e.target.value);
        setErrors(prev => ({ ...prev, confirm: "" }));
    }

    function handleImageChange(e) {
        setImage(e.target.files[0]) 
        setErrors(prev => ({ ...prev, image: "" }));
    }


    
    async function handleSignIn(e) {
        e.preventDefault();

        let hasError = false;

        const emailReg = /^(.+)@([^\.].*)\.([a-z]{2,})$/;
        const lengthReg = /^.{9,17}$/;
        const digitReg = /[0-9]/;
        const specialCharReg = /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=;]/;
        const uppercaseReg = /[A-Z]/;

        const newErrors = {
            username: "",
            city: "",
            country: "",
            email: "",
            password: "",
            confirm: "",
            image: ""
        };

        if (username === "") {
            newErrors.username = ("Fill in a username, you can change it later");
            hasError = true;
        }

        if (city === "") {
            newErrors.city = ("Fill in the city you live in");
            hasError = true;
        }

        if (country === "") {
            newErrors.country = ("Select a country of where you currently reside");
            hasError = true;
        }

        if (!emailReg.test(email)) {
            newErrors.email = ("Enter a valid email format: example@gmail.com");
            hasError = true;
        }

        if (!lengthReg.test(password) || !digitReg.test(password) || !uppercaseReg.test(password) || !specialCharReg.test(password)) {
            newErrors.password = ("Needs 7-19 characters, at least one digit, one uppercase, one special character");
            hasError = true;
        }

         if (password !== confirmPassword) { 
            newErrors.confirm = ("Passwords do not match");
            hasError = true; 
        }
        
        if (!image) {
            newErrors.image = ("No image selected");
            hasError = true; 
        }

        setErrors(newErrors);

        if(hasError) { 
            return;
        }

    const formData = new FormData();

    try {
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password_plaintext", password);
        formData.append("city", city);
        formData.append("country", country);
        formData.append("image", image);

        const response = await fetch("/api/accounts", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Account created successfully!");
            navigate('/login');
        }
 
        setMessage(data.message);
    }   catch (error) {
        console.error("Fetch error:", error);
        setMessage("Error submitting form");
    }
};

   return (
        <>
        
        <div className = "window">
          <button className = "close" onClick ={handleClose}>Close</button>
          <div className = "overlay" onClick = {(e) => e.stopPropagation()}>
            
            <form onSubmit={handleSignIn}>
              <h2 className="title">SIGN UP</h2>
            <div className = "content">
                
                <div className={errors.username ? "control error" : "control"}>  
                  <h3> <label htmlFor = "username">Username</label> </h3>
                  <input type ="text" 
                        value={username}
                        name = "username" 
                        id = "username" 
                        placeholder = "Username" 
                        onChange = {handleUsernameChange} />
                    <span className = "errorMsg">{errors.username}</span>
                </div> 

                <div className={errors.city ? "control error" : "control"}>
                  <h3> <label htmlFor = "City">City</label> </h3>
                  <input type ="text" 
                  value={city}
                  name = "city" 
                  id = "city" 
                  placeholder = "Kelowna" 
                  onChange = {handleCityChange} />
                <span className = "errorMsg">{errors.city}</span>
                </div>    
                  
                  <div className={errors.country ? "control error" : "control"}>
                    <h3><label>Country:</label></h3>
                    <select value={country} onChange={handleCountryChange}>
                        <option value="">Select a country</option>
                        <option value="Canada">Canada</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Other">Other</option>
                    </select>
                    <span className = "errorMsg">{errors.country}</span>
                </div>

                <div className={errors.email ? "control error" : "control"}>
                    <h3><label htmlFor = "Email">Email:</label></h3>
                    <input
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
	    		        placeholder="johndoe@example.com"/>
                    <span className = "errorMsg">{errors.email}</span>
                </div>

                <div className={errors.password ? "control error" : "control"}>
                    <h3><label htmlFor = "Password">Password:</label></h3>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange} />
                    <span className = "errorMsg">{errors.password}</span>

                </div>

                <div className={errors.confirm ? "control error" : "control"}>
                    <h3><label>Confirm Password:</label></h3>
                    <input 
                        type="password" 
                        value = {confirmPassword} 
                        onChange = {handlePasswordConfirm} /> 
                    <span className = "errorMsg">{errors.confirm}</span>
                </div>
        
                <div className={errors.image ? "control error" : "control"}>
                    <h3><label>Profile Picture</label></h3>
                <input type="file" accept="image/*" onChange={handleImageChange}/>
                <span className = "errorMsg">{errors.image}</span>
                <p>{message}</p>
                </div>

                  <button type="submit" className = "submit">Submit</button>
              </div>
            </form>
             </div>
        
    </div>
    </>
    );
}

export default Signup;
