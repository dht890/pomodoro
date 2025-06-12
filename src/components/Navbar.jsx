import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import clockIcon from '../assets/clock.svg';
import hourglassIcon from '../assets/hourglass.svg';
import stopwatchIcon from '../assets/stopwatch.svg';
import settingsIcon from '../assets/gear.svg';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <img src={clockIcon} alt="Clock" className="brand-icon" />
                    Productivity Timer
                </Link>
            </div>
            <div className="navbar-links">
                <Link to="/timer" className="nav-link">
                    <img src={hourglassIcon} alt="Timer" className="nav-icon" />
                    Timer
                </Link>
                <Link to="/stopwatch" className="nav-link">
                    <img src={stopwatchIcon} alt="Stopwatch" className="nav-icon" />
                    Stopwatch
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
