import axios from 'axios';
import { useEffect, useState } from 'react';
import { createContext } from "react";
import { initializeSocket, socket } from '../components/socket';
import { Slide, toast } from 'react-toastify';

const Context = createContext();

const SharedState = (props) => {

    const hostname = process.env.REACT_APP_HOSTNAME

    const [loading, setLoading] = useState()

    // Storing user details
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    //Storing Socket connection
    const [isConnected, setIsConnected] = useState(socket.connected)

    //Storing list of active users
    const [onlineUsers, setOnlineUsers] = useState([]);

    //Storing list of available groups
    const [groupList, setGroupList] = useState([]);

    //Fetch list of active users
    useEffect(() => {
        initializeSocket(user?.username, setOnlineUsers);
    }, [isAuthenticated]);

    //Fetch loggedIn user profile details
    useEffect(() => {
        const fetchuser = async () => {
            setLoading(true)
            await axios.get(hostname + '/api/auth/profile').then((res) => {
                if (res.data.success) {
                    setIsAuthenticated(res.data.success);
                    setUser(res.data.user);
                    initializeSocket(res.data.user.username, setOnlineUsers)
                    setLoading(false)
                }

            }).catch((error) => {
                toast.error(error.response?.data.message, {
                    position: "bottom-right",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Slide
                });
                console.error('Error backend response:', error);
            });
        };

        fetchuser()
    }, [isConnected])

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }
    }, [])

    return (
        <Context.Provider value={{
            hostname,
            user, setUser,
            isConnected, setIsConnected,
            onlineUsers, setOnlineUsers,
            groupList, setGroupList,
            isAuthenticated, setIsAuthenticated,
        }}>

            {props.children}

        </Context.Provider>
    );
};

export { Context, SharedState };
