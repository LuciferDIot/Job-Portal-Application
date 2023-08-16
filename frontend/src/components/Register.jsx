// src/components/Register.js
import { useState, useEffect } from 'react';
import InputField from './elements/InputField.jsx';
import { Link } from 'react-router-dom';
import {
    isEmail, containsNumber,
    convertToBase64
} from './validations.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from './elements/ErrorPopup.jsx'
import profilePhoto from '../assets/profile-photo.png';



const Register = () => {
    const navigate = useNavigate();
    // State to hold the selected type (provider or consumer)
    const [userType, setUserType] = useState('');

    const [jobTypes, setJobTypes] = useState([]);
    useEffect(() => {
        // Fetch data from the backend API
        axios.get('http://localhost:3005/jobTypes')
            .then((response) => {
                return response.data;
            })
            .then((jobTypes) => {
                const modifiedArray = jobTypes.map((obj) => {
                    // Extract the values of _id and name properties
                    const { _id, name } = obj;

                    // Create a new object with the desired property names and values
                    return {
                        value: _id,
                        label: name,
                    };
                });
                setJobTypes(modifiedArray)
                setQualification(modifiedArray[0].value)
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // States to hold the input values for the registration form
    const [password, setPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [street, setStreet] = useState('');
    const [country, setCountry] = useState('');
    const [zip, setZip] = useState('');
    const [rate, setRate] = useState(0);
    const [errors, setErrors] = useState({});
    const [qualification, setQualification] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showError, setShowError] = useState(false);



    // Define the options for the dropdown
    const availabilityOptions = [
        { label: 'Full time', value: 'Full time' },
        { label: 'Part time', value: 'Part time' },
    ];
    const experienceOptions = [
        { label: '0 - 1 Years', value: '0 - 1 years' },
        { label: '1 - 2 Years', value: '1 - 2 years' },
        { label: '2 - 3 Years', value: '2 - 3 years' },
        { label: '3+ Years', value: '3+ years' },
    ];

    const [availability, setAvailability] = useState(availabilityOptions[0].value);
    const [experience, setExperience] = useState(experienceOptions[0].value);


    const handleShowError = () => {
        setShowError(true);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const validateForm = async () => {
        const errors = {};

        // Validate first name and last name (Check if they contain digits)
        if (containsNumber(firstname) || firstname === '') {
            errors.firstName = 'First name cannot contain digits.';
        }
        if (containsNumber(lastname) || lastname === '') {
            errors.lastName = 'Last name cannot contain digits.';
        }
        if (!isEmail(email) || email === '') {
            errors.email = "email isn't correct.";
        }
        if (password === '' && password.length < 5) {
            errors.password = "password length must be greater than 5.";
        }
        if (city === '') {
            errors.city = "city isn't correct.";
        }
        if (country === '') {
            errors.country = "country isn't correct.";
        }
        if (zip === '') {
            errors.zip = "zip isn't correct.";
        }
        if (rate === '0' || rate === 0 || containsNumber(lastname)) {
            errors.rate = "rate isn't correct.";
        }
        if (photo === '') {
            const response = await fetch(profilePhoto);
            const blob = await response.blob();
            const base64String = await convertToBase64(blob);
            setPhoto(base64String);
        }

        return errors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        setErrors(formErrors);


        // If no errors, submit the form
        if (Object.keys(formErrors).length === 0) {
            try {

                const isActive = false
                const userTypeString = userType == 'provider' ? 'provider' : 'consumer';
                const url = `http://localhost:3005/signup/${userTypeString}`;
                const data = {
                    firstname,
                    lastname,
                    availability,
                    password,
                    email,
                    photo,
                    city,
                    state,
                    street,
                    country,
                    zip,
                    experience,
                    rate,
                    qualification,
                    isActive
                };
                console.log(data);
                const response = await axios.post(url, JSON.stringify(data), {
                    headers: { "Content-Type": "application/json" },
                });


                console.log(response);

                if (response.status === 200) {
                    // Handle successful response
                    const data = await response.data;
                    console.log('Response:', data);

                    navigate('/');
                }
            } catch (error) {
                console.error(error);
                if (error.response.status === 409) {
                    setErrorMsg('This email is already exists as a User')
                    handleShowError();
                }
            }
        }

    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setPhoto(base64);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-950 to-purple-900 py-12 sm:px-6 lg:px-8">
            <div className="lg:w-1/2 md:w-3/5 max-md:w-5/6 space-y-8 max-sm:w-full max-sm:mx-2 bg-blue-400 bg-opacity-25 shadow-md rounded-lg p-8 transition duration-300 ease-in-out transform hover:scale-105">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create an account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    {/* Select Provider/Consumer */}
                    <div className="max-sm:flex-col flex justify-center items-center sm:space-x-10 max-sm:space-y-6 max-sm:child:w-2/3">
                        <button
                            type="button"
                            onClick={() => setUserType('provider')}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register as Provider
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('consumer')}
                            className="max-sm:ml-0 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register as Consumer
                        </button>
                    </div>

                    <div className="text-center font-bold flex w-full items-center justify-center space-x-10 max-md:space-x-2 flex-wrap">
                        <p className='text-white'>Already have an account?</p> <Link to="/" className="text-cyan-300 text-sm">Login here</Link>
                    </div>
                    {/* Render dynamic input fields based on selected type */}
                    {userType === 'provider' && (
                        <div className="flex justify-between child:w-1/3 child:m-2 flex-wrap max-lg:flex-col max-lg:child:w-full max-lg:child:mx-0">
                            < InputField
                                label="FirstName"
                                type="text"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                                important={true}
                                error={errors.firstName}
                            />

                            <InputField
                                label="LastName"
                                type="text"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e) => setLastName(e.target.value)}
                                important={true}
                                error={errors.lastName}
                            />

                            <InputField
                                label="Availability"
                                type="dropdown"
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                options={availabilityOptions}
                            />

                            <InputField
                                label="Password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                important={true}
                                error={errors.password}
                            />
                            <InputField
                                label="Email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                important={true}
                                error={errors.email}
                            />
                            <InputField
                                id='file-upload'
                                label="Photo"
                                type="file"
                                onChange={(e) => handleFileUpload(e)}
                            />
                            <InputField
                                label="City"
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                important={true}
                                error={errors.city}
                            />
                            <InputField
                                label="State"
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                            <InputField
                                label="Street"
                                type="text"
                                placeholder="Street"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                            />
                            <InputField
                                label="Country"
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                important={true}
                                error={errors.country}
                            />
                            <InputField
                                label="Zip"
                                type="text"
                                placeholder="ZIP"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                important={true}
                                error={errors.zip}
                            />

                            <InputField
                                label="Experience"
                                type="dropdown"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                options={experienceOptions}
                            />

                            <InputField
                                label="Rate"
                                type="number"
                                placeholder="0"
                                numValue={parseFloat(rate)}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                error={errors.rate}
                                important={true}
                            />

                            <InputField
                                label="Qualification"
                                type="dropdown"
                                value={qualification}
                                onChange={(e) => { setQualification(e.target.value) }}
                                options={jobTypes}
                            />
                        </div>
                    )}
                    {userType === 'consumer' && (
                        <div className="flex justify-between child:w-1/3 child:m-2 flex-wrap max-lg:flex-col max-lg:child:w-full max-lg:child:mx-0">

                            <InputField
                                label="FirstName"
                                type="text"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                                error={errors.firstName}
                                important={true}
                            />
                            <InputField
                                label="LastName"
                                type="text"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e) => setLastName(e.target.value)}
                                error={errors.lastName}
                                important={true}
                            />
                            <InputField
                                label="Password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.password}
                                important={true}
                            />
                            <InputField
                                label="Email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email}
                                important={true}
                            />
                            <InputField
                                label="City"
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                error={errors.city}
                                important={true}
                            />
                            <InputField
                                label="State"
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                            <InputField
                                label="Street"
                                type="text"
                                placeholder="Street"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                            />
                            <InputField
                                label="Country"
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                error={errors.country}
                                important={true}
                            />
                            <InputField
                                label="Zip"
                                type="text"
                                placeholder="ZIP"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                error={errors.zip}
                                important={true}
                            />
                        </div>
                    )}
                    {userType !== '' && <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>}
                </form>
            </div>
            {showError && (
                <ErrorPopup
                    errorMessage={errorMsg}
                    onClose={handleCloseError}
                />
            )}
        </div >
    );
};

export default Register;


