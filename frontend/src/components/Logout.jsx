import { useNavigate } from 'react-router-dom';
import { useState } from 'react'


export async function Logout(navigate) { 

    try {
        const response = await fetch("http://localhost:3000/api/sessions/logout", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to logout");

        alert("Logout successful");
        localStorage.removeItem('token');
        navigate('/homeUser');

    } catch (error) {
        console.error("Network or server error", error);
    }
}

export default Logout;