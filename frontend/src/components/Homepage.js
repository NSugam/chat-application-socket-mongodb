import React, { useContext, useEffect, useState } from 'react'
import ActiveUsers from './ActiveUsers'
import axios from 'axios'
import { Context } from '../context/SharedState'
import { Link } from 'react-router-dom'
import Loader from './Loader'
import Groups from './Groups'

export default function Homepage() {
    const states = useContext(Context)

    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        states.setLoading(true)
        axios.get(states.hostname + '/api/auth/all').then((res) => {
            setAllUsers(res.data.allUsers)
            states.setLoading(false)

        }).catch((error) => {
            console.log(error.response)
        })
    }, [states.isConnected])

    if (states.loading) return <Loader />

    return (
        <>
            <h2 className='text-center text-light mb-3'>Welcome to Public Chat Application</h2>
            <h4 className='text-center text-secondary'>- Socket.io -</h4>
            <ActiveUsers />
            <Groups />
            <div className="container text- mt-3 col-lg-4">
                <h5 className="text-secondary mb-3">All Users: {allUsers?.length - 1}</h5>
                <ul className="list-group rounded rounded-4">
                    {allUsers
                        .filter(user => user.username !== states.user?.username)
                        .map((user) => (
                            <li key={user.username} className="list-group-item d-flex">
                                <span class="material-symbols-outlined me-1">
                                    account_circle
                                </span>
                                <Link to={`/chat/${user.username}`} className="text-dark fw-bold text-decoration-none">
                                    {user.username}
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>

        </>
    )
}
