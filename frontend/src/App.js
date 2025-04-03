import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Login from './components/Login';
import Signup from './components/SIgnup';
import { SharedState } from './context/SharedState';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Chat from './components/Chat';
import GroupChat from './components/GroupChat';
import CreateGroup from './components/CreateGroup';

axios.defaults.withCredentials = true

function App() {
  return (

    <>

      <SharedState>
        <Router>
          <Navbar/>
          <ToastContainer />
          <>
            <Routes>
              <Route exact path="/" element={<Homepage />} />
              <Route exact path="/chat/:username" element={<Chat />} />
              <Route exact path="/group-chat/:groupName" element={<GroupChat />} />

              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/create-group" element={<CreateGroup />} />

            </Routes>
          </>
        </Router>
      </SharedState>

    </>

  );
}

export default App;
