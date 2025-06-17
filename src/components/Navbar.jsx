import { Link } from 'react-router-dom';
import clockIcon from '../assets/clock.svg';
import hourglassIcon from '../assets/hourglass.svg';
import stopwatchIcon from '../assets/stopwatch.svg';
import reactIcon from '../assets/react.svg'
import { useTheme } from '../contexts/ThemeContext';
import '../css/Navbar.css';

function Navbar() {
    const { themeColor } = useTheme();
    
    return (
        <nav className={`navbar ${themeColor}`}>
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
            <div className='credits'>
                <div className='inputs'>
                    <p>arrow keys - navigate</p>
                    <p>space/enter - confirm</p>
                </div>
                Created with React
                <img src={reactIcon} />
            </div>
        </nav>
    );
}

export default Navbar;
