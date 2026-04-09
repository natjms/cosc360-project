import Login from './components/LogIn.jsx'
import { useNavigate } from 'react-router-dom';

export default function LoginPage(props) {
    const navigate = useNavigate();
	return <Login toggle={() => navigate('/')}/>
}
