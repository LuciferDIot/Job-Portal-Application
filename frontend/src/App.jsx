import Register from './components/Register.jsx';
import Home from './components/Home.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JobRequest from './components/JobRequest.jsx';
import Login from './components/Login.jsx';
import { useState } from 'react';

export default function App() {
    const [userDetails, setUserDetails] = useState(null);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ // Use 'element' instead of 'Component'
                    userDetails ? <Home userDetails={userDetails} setUserDetails={setUserDetails} /> : <Login setUserDetails={setUserDetails} />
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/jobrequest" element={
                    userDetails ? <JobRequest userType={userDetails.userType} userDetails={userDetails} setUserDetails={setUserDetails} /> : <Login setUserDetails={setUserDetails} />
                } />
            </Routes>
        </BrowserRouter>
    );
}
