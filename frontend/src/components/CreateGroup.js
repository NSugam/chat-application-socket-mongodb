import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Bounce, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../context/SharedState';

export default function CreateGroup() {
    const states = useContext(Context)
    const navigate = useNavigate()

    const [userInput, setUserInput] = useState({})
    const handleInput = (e) => {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    const handleCreate = (e) => {
        e.preventDefault();
        axios.post(states.hostname + '/api/groups/add', userInput).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                navigate('/group-chat/' + userInput.group_name)

            } else {
                toast.error(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            }
        })
    }
    return (
        <>
            <div className='container col-sm-4 mt-5'>
                <h2 className='text-center text-light mb-3'>Welcome to Public Chat Application</h2>
                <h4 className='text-center text-secondary'>Create New Group</h4>

                <form onSubmit={handleCreate} className='text-light'>
                    <div class="mb-2">
                        <label class="form-label">Group Name</label>
                        <input type="text" class="form-control" name='group_name' onChange={handleInput} required />
                    </div>

                    <hr />
                    <div className='text-end mt-4'>
                        <button type='submit' class="btn btn-danger w-100">Create group +</button>
                        <Link class="btn btn-success w-100 mt-3" to='/'>Back to homepage</Link>
                    </div>
                </form>
            </div>
        </>
    )
}
