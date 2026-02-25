// src/LogIn.jsx
import "./LogIn.css";

function LogIn() {

  function handleSubmit() { 
    return alert ('LogIn successful')
  }

  return (
    <>
      <div className="header">
        <div className="title">LOG IN</div>
        <label for = "email">Email</label> <br></br>
        <input type ="text" name = "email" id = "email"></input> <br></br>
        <label for = "Password">Password</label> <br></br>
        <input type ="text" name = "password" id = "password"></input> <br></br>
        <button type = "submit" onClick = {handleSubmit}>Submit</button>
      </div>

    </>
  );
}

export default LogIn;
