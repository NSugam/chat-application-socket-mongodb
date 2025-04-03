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
                        <li key={group._id} className="list-group-item d-flex">
                            <span class="material-symbols-outlined me-2 text-success">
                                groups
                            </span>
                            <Link to={`/group-chat/${group.group_name}`} className="text-success fw-bold text-decoration-none">
                                {group.group_name} group
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
