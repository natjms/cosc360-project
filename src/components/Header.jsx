import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import logo from "../assets/logo.jpg";
import "../App.css";

function Header() {
    return (
        <header className="site-header">
            <div className="logo">
                <img src={logo} alt="Library logo" className="logo-img" />
                <h1>Virtual Library</h1>
            </div>

            <div className="header-right">
                <SearchBarNavigator />
                <Navbar />
            </div>
        </header>
    );
}

export default Header;
