import React, { useContext } from 'react'
import { Context } from '../context/SharedState'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { socket } from './socket'
import axios from 'axios'
import { Slide, toast } from 'react-toastify'

export default function Navbar() {
    const states = useContext(Context)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        const logoutRequest = axios.get(states.hostname + '/api/auth/logout');

        toast.promise(
            logoutRequest, {
            pending: 'Logging out...',
            error: 'Network Error',
            success: "Account Logged out."
        }, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
        });

        logoutRequest.then(async (res) => {
            if (res.data.success) {
                socket.disconnect();
                states.setUser(null)
                states.setIsAuthenticated(false);
                navigate('/login')
            } else {
                toast.error(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                    transition: Slide
                });
            }
        });
    };

    return (
        <>
            <div className='container-fluid p-3 text-light'>
                <div className='d-flex flex-column flex-md-row justify-content-around align-items-center gap-3'>

                    <div>
                        {location.pathname.includes('/chat/') || location.pathname.includes('/group-chat/') ? (
                            <Link to='/' className='btn btn-outline-success'>{"<="} Back to home</Link>
                        ) : (
                            <Link to='/' className='btn btn-success'>Home</Link>
                        )}
                    </div>

                    <div className='d-flex align-items-center'>
                        {states.isConnected ? (
                            <span className="me-1" style={{ fontSize: '13px' }}>🟢</span>
                        ) : (
                            <span className="me-1" style={{ fontSize: '13px' }}>🔴</span>
                        )}
                        <span className='text-secondary'>{states.user?.username || 'Login to continue'}</span>
                    </div>

                    <div className='d-flex flex-wrap justify-content-center justify-content-md-end gap-2'>
                        {states.isAuthenticated ? (
                            <button type="button" onClick={handleLogout} className="btn btn-danger">Logout</button>
                        ) : (
                            <>
                                <Link to='/signup' className="btn btn-info">Create account</Link>
                                <Link to='/login' className="btn btn-success">Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <hr className='text-light w-75 m-auto' />
        </>
    );

}
