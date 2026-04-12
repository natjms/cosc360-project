import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import logo from "../assets/logo.jpg";
import "../App.css";

function Header() {
    return (
        <header className="site-header" style={{ borderBottom: '1px dotted #CCC' }}>
            <div className="logo">
                <img  src={logo} alt="Library logo" className="logo-img" />
                <h1 className="title">Virtual Library</h1>
            </div>

            <div className="header-right">
                <SearchBarNavigator className="search"/>
                <Navbar />
            </div>
        </header>
    );
}

export default Header;
