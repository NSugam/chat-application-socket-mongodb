import React from 'react'
import '../css/Loader.css'

export default function Loader() {
    return (
        <div className='container text-center mt-5'>
            <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    )
}
