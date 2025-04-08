import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/SharedState'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Loader from './Loader'

export default function AllUsers() {
    const states = useContext(Context)
    const [loading, setLoading] = useState()
    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        setLoading(true)
        axios.get(states.hostname + '/api/auth/all').then((res) => {
            setAllUsers(res.data.allUsers)
            setLoading(false)

        }).catch((error) => {
            console.log(error.response)
        })
    }, [states.isConnected])

    if (loading) return <Loader />

    return (
        <>
            <div>
                <h5 className="text-secondary mb-3 mt-3">All Users: {allUsers?.length - 1}</h5>
                {allUsers
                    .filter(user => user.username !== states.user?.username)
                    .map((user) => (
                        <div className="mb-2" key={user.username}>
                            <div className="list-group" style={{overflow: 'hidden'}}>
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
        </>
    )
}
