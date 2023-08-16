import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isEmail } from './validations.jsx'
import axios from 'axios';
import InputField from './elements/InputField.jsx';
import PropTypes from 'prop-types';

const Login = ({ setUserDetails }) => {

    // States to hold the input values
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [displayUserNameError, setUserNameError] = useState('');
    const [displayPasswordError, setPasswordError] = useState('');
    const [isProvider, setIsProvider] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isEmail(userName) && password.length >= 5) {
            try {

                const userType = isProvider ? 'provider' : 'consumer';
                const url = `http://localhost:3005/login/${userType}`;
                const data = {
                    email: userName,
                    password: password
                };
                const response = await axios.post(url, JSON.stringify(data), {
                    headers: { "Content-Type": "application/json" },
                });

                if (response.status === 200) {
                    // Handle successful response
                    const data = await response.data;
                    data.userType = userType
                    console.log('Response:', data);
                    setUserDetails(data);

                } else if (response.status === 404) {
                    // Handle error response
                    setUserNameError('User not found')
                } else if (response.status === 401) {
                    setPasswordError('Password Incorrect')
                }
            } catch (error) {
                console.error(error.message);
            }
        }

        if (!isEmail(userName)) {
            setUserNameError('Please give your email as the UserName')
        }
        if (password.length < 5) {
            setPasswordError('Password length cannot be less than 5')
        }

        setTimeout(() => {
            setUserNameError('');
            setPasswordError('');
        }, 5000);
    }

    return (
        <div className='min-h-screen w-screen bg-gradient-to-r from-indigo-950 to-purple-900 flex justify-center items-center'>
            <div className="w-max h-max ">
                <div className="bg-blue-400 bg-opacity-25 shadow-md rounded-lg p-8 transition duration-300 ease-in-out transform hover:scale-105">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Login to your account</h2>
                    </div>
                    <form className="mt-6 space-y-6" onSubmit={handleLogin}>
                        <div className='flex flex-col'>

                            < InputField
                                label="Username"
                                type="text"
                                placeholder="Username"
                                value={userName}
                                onChange={(e) => setUsername(e.target.value)}
                                important={true}
                                error={displayUserNameError}
                            />

                        </div>
                        <div className='flex flex-col'>
                            < InputField
                                label="Password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                important={true}
                                error={displayPasswordError}
                            />

                        </div>
                        <div className=" flex justify-between">
                            <button type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setIsProvider(true)}
                            >
                                Provider Login
                            </button>
                            <button type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setIsProvider(false)}
                            >
                                Consumer Login
                            </button>
                        </div>
                    </form>
                    <div className="text-center font-bold pt-4 flex justify-between">
                        <p className='text-white'>Don&#39;t have an account?</p> <Link to="/register" className="text-cyan-300 text-sm">Register here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
    setUserDetails: PropTypes.func.isRequired,
}

export default Login;
