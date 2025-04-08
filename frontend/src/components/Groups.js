import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/SharedState';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

export default function Groups() {
    const states = useContext(Context)

    const [loading, setLoading] = useState()

    useEffect(() => {
        setLoading(true)
        axios.get(states.hostname + '/api/groups/all').then((res) => {
            states.setGroupList(res.data.allGroups)
            setLoading(false)

        }).catch((error) => {
            console.log(error.response)
        })
    }, [])

    if (loading) return <Loader />

    return (
        <>

            <h5 className="text-secondary mb-3 d-flex justify-content-between align-items-center">
                <Link className='btn btn-outline-primary text-light rounded-5' to='/create-group'>Create Group +
                </Link>
                Available Groups: {states.groupList.length}
            </h5>
            <ul className="list-group">
                <div className='row'>
                    {states.groupList?.map((group) => (
                        <div className="col-sm-4 mb-2" key={group._id}>
                            <div className="list-group">
                                <Link to={`/group-chat/${group.group_name}`} className="d-flex fw-bold list-group-item list-group-item-action list-group-item-warning">
                                    <span className="material-symbols-outlined me-2">
                                        groups
                                    </span>
                                    {group.group_name} group
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </ul>
        </>
    );
}
