export async function Logout(navigate) { 

    try {
        const response = await fetch("/api/sessions/logout", {
            method: "GET",
            headers: {
                "Authorization": `Basic ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Failed to logout");
        }

        localStorage.removeItem('token');
        localStorage.removeItem('account_id');
        localStorage.removeItem('username');

        clearInterval(localStorage.getItem('notification_interval'));
        localStorage.removeItem('notification_interval');

        navigate('/');
        return true;

    } catch (error) {
        console.error("Network or server error", error);
        return false;
    }
}

export default Logout;

