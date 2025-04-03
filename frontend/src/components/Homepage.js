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
            <div className="container text- mt-5 col-lg-4">
                <h5 className="text-secondary mb-3">All Users: {allUsers?.length - 1}</h5>
                <div className="row">
                    {allUsers
                        .filter(user => user.username !== states.user?.username)
                        .map((user) => (
                            <div className="col-md-6 mb-2" key={user.username}>
                                <div className="list-group">
                                    <Link to={`/chat/${user.username}`} className="d-flex fw-bold list-group-item list-group-item-action list-group-item-light">
                                        <span className="material-symbols-outlined me-2">
                                            account_circle
                                        </span>
                                        {user.username}
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>

            </div>

        </>
    )
}
