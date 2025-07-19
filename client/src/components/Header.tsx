import "../styles/header.css";
import { useAuth } from "../context/AuthContext";

function Header({ username}: {username: string}) {

    const { logout } = useAuth();

    return (
        <header className="main-header">
            <div className="left-section">
                <span className="logo">📋</span>
                <span className="brand-name">TaskManager</span>
            </div>

            <div className="right-section">
                <span className="welcome">Welcome, {username}</span>
                <button className="logout-button" onClick={logout}>Logout</button>
            </div>
        </header>
    );
}

export default Header;
