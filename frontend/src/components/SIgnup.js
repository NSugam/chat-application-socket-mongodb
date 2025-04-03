import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Bounce, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../context/SharedState';

export default function Signup() {
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

    const handleSignup = (e) => {
        e.preventDefault();
        axios.post(states.hostname+'/api/auth/register', userInput).then((res)=> {
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
                navigate('/login')

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
            <div className='container col-lg-4 mt-5'>
                <h2 className='text-center text-light mb-3'>Welcome to Public Chat Application</h2>
                <h4 className='text-center text-secondary'>- Socket.io -</h4>
                <form onSubmit={handleSignup} className='text-light'>
                    <div class="mb-2">
                        <label class="form-label">Username</label>
                        <input type="text" class="form-control" name='username' onChange={handleInput} required />
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Email address</label>
                        <input type="email" class="form-control" name='email' onChange={handleInput} required />
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control" name='password' onChange={handleInput} required />
                    </div>
                    <hr/>
                    <div className='text-end mt-4'>
                        <button type='submit' class="btn btn-danger w-100">Signup</button>
                        <Link class="btn btn-success w-100 mt-3" to='/login'>Already have a account?</Link>
                    </div>
                </form>
            </div>
        </>
    )
}
