import './Signup.css'
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const handleClose = () => {
         navigate('/'); 
    };

    return (
        <div className = "window">
          <button className = "close" onClick ={handleClose}>Close</button>
          <div className = "overlay" onClick = {(e) => e.stopPropagation()}>
            <div className = "content">
              <h2 className="title">SIGN UP</h2>
                  <label htmlFor = "lastName">LAST NAME</label> 
                  <input type ="text" name = "lastName" id = "lastName" placeholder = "Enter last name"></input> 
                  <label htmlFor = "firstName">FIRST NAME</label> 
                  <input type ="text" name = "firstName" id = "firstName" placeholder = "Enter first name"></input> 
                  <label htmlFor = "Address">Address</label> 
                  <input type ="text" name = "address" id = "address" placeholder = "Address, Postal Code"></input> 
                  <input type ="text" name = "address" id = "address1" placeholder = "Secondary address"></input> 
                  <img src = "src/user.png" alt = "user" className = "profileImage"></img>
                  <button className = "profileButton">Add Profile Image</button>
                  <button className = "submit">Submit</button>
              </div>
             </div>
             
        </div>
    );
}

export default Signup;