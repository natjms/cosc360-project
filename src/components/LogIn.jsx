import './Login.css'
import { useNavigate } from 'react-router-dom';

function Login(props) { 
    const navigate = useNavigate();

     const handleSignup = () => {
         navigate('/signup'); 
    };

    return (
        <>
        <div className = "window" onClick = {props.toggle}>
            <button className = "close" onClick = {props.toggle}>Close</button>
          <div className = "overlay" onClick = {(e) => e.stopPropagation()}>
            <div className = "content">
              <h2 className="title">LOG IN</h2>
                  <label htmlFor = "email">EMAIL</label> 
                  <input type ="text" name = "email" id = "email" placeholder = "Enter an email"></input> 
                  <label htmlFor = "Password">PASSWORD</label> 
                  <input type ="text" name = "password" id = "password" placeholder = "Enter a password"></input> 
                  <button className = "submit" onClick ={(e) => e.preventDefault}>Submit</button>
              </div>
             </div>
             <p>No Account?</p>
             <button onClick={handleSignup}>Signup</button>
        </div>
        </>
    );
}

export default Login;
