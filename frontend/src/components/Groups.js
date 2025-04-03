import React, { useContext, useEffect } from 'react'
import { Context } from '../context/SharedState';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

export default function Groups() {
    const states = useContext(Context)

    useEffect(() => {
        axios.get(states.hostname + '/api/groups/all').then((res) => {
            states.setGroupList(res.data.allGroups)
            states.setLoading(false)

        }).catch((error) => {
            console.log(error.response)
        })
    }, [])

    if (states.Loading) return <Loader />

    return (
        <>
            <div className="container text-center mt-5 col-lg-4">

                <h5 className="text-success mb-3 d-flex justify-content-around align-items-center">
                    <Link className='btn btn-outline-primary text-light rounded-5' to='/create-group'>Create Group +
                    </Link>
                    Available Groups: {states.groupList.length}
                </h5>
                <ul className="list-group">
                    {states.groupList?.map((group) => (
                        <div className="mb-2" key={group._id}>
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
                </ul>
            </div>
        </>
    );
}
