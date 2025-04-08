import React from 'react'
import ActiveUsers from './ActiveUsers'
import Groups from './Groups'
import AllUsers from './AllUsers'

export default function Homepage() {

    return (
        <div className="container m-auto col-lg-10">
            <h2 className="text-center text-light mb- mt-4">Welcome to Public Chat Application</h2>
            <h4 className="text-center text-secondary">- Socket.io -</h4>

            <div className="row g-5">
                <div className="col-md-8">
                    <ActiveUsers />
                    <Groups />
                </div>

                <div className="col-md-1 m-0"></div>

                <div className="col-md-3">
                    <AllUsers />
                </div>
            </div>
        </div>
    );

}
