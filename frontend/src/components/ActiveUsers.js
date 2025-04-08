import { useContext } from "react";
import { Context } from "../context/SharedState";
import { Link } from "react-router-dom";

export default function ActiveUsers() {
    const states = useContext(Context)

    return (
        <>
            <div className="container mt-3 mb-5">
            <h5 className="text-secondary mb-3">Active Users: {states.onlineUsers?.length}</h5>
                <ul className="list-group">
                    {states.onlineUsers.map((username) => (
                        <li key={username} className="list-group-item rounded rounded-5 mb-1">
                            <Link to={`/chat/${username}`} className="text-success text-decoration-none d-flex align-items-center">
                            <span className="me-2" style={{fontSize:'12px'}}>🟢</span> {username} (Online)
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
