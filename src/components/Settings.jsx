import '../css/card.css';
import { Link } from 'react-router-dom';

function Settings() {
    return (
        <>
            <div className="card">
                <div className="display">00:00:00:00</div>
                <div className="controls">
                    <Link to="/">
                        <button>
                            Save
                        </button>
                    </Link>
                    <button>
                        Clear
                    </button>
                </div>
            </div>
        </>
    )
}

export default Settings;