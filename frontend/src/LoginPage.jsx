import Login from './components/LogIn.jsx'
import { useNavigate } from 'react-router-dom';

export default function LoginPage(props) {
    const navigate = useNavigate();
    return (
        <div style={{
                backgroundColor: 'white',
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100vh',
            }}>
            <Login toggle={() => navigate('/')}/>
        </div>
	);
}
