function Register(){
	return (
	<div>
		<form>

		<div>
		<h3>First Name</h3>
		<input type="text" id="first" placeholder="John" />
		</div>

		<div>
		<h3>Last Name</h3>
		<input type="text" id="Last" placeholder="Doe" />
		</div>

		<div>
		<h3>Email Address</h3>
		<input type="text" id="email" placeholder="mail@example.com" />
		</div>

		<div>
		<h3>Password</h3>
		<input type="password" id="password"/>
		</div>
		
		
		<div>
		<h3>Address</h3>
		<input type="text" id="address1" placeholder="3333 University Way"/>
		<input type="text" id="address2" placeholder="Kelowna"/>
		</div>

		</form>
	</div>
	)
}
export default Register
