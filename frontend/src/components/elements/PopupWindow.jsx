import PropTypes from 'prop-types';
import InputField from './InputField.jsx'
import { useState } from 'react';
import { containsNumber } from '../validations.jsx'
import axios from 'axios';
import ErrorPopup from './ErrorPopup.jsx';
import { useEffect } from 'react';



const PopupWindow = ({ onClick, userDetails, gigDetails, addRemove }) => {
    const [title, setTitle] = useState('');
    const [_id, set_id] = useState('');
    const [description, setDescription] = useState('');
    const [rate, setRate] = useState(userDetails.rate);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [showError, setShowError] = useState(false);
    const [isGIG, setIsGIG] = useState(false);



    useEffect(() => {
        if (Object.keys(gigDetails).length !== 0) {
            setIsGIG(true);
            set_id(gigDetails._id)
            setTitle(gigDetails.title);
            setDescription(gigDetails.description)
            setRate(parseFloat(gigDetails.rate));
        }
    }, [gigDetails])


    const handleShowError = () => {
        setShowError(true);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const validateForm = () => {
        const errors = {}
        if (title.length <= 5) errors.title = "Title length must be greater than 5"
        if (description.length <= 10) errors.description = "Description length must be greater than 10"
        if (!containsNumber(rate)) errors.rate = "Rate must be a number"

        return errors
    }


    const addJob = async (e) => {
        e.preventDefault();
        setErrors(validateForm);

        try {
            const url = `http://localhost:3005/job`;

            let data = {
                title: title,
                description: description,
                email: userDetails.email,
                price: rate
            }
            const response = await axios.post(url, JSON.stringify(data), {
                headers: { "Content-Type": "application/json" },
            });


            console.log(response);

            if (response.status === 200) {
                // Handle successful response
                const data = await response.data;
                console.log('Response:', data);
                addRemove();
                onClick();
            }
            else if (response.status === 404) {
                setErrorMsg('Provider not found')
                handleShowError();
            }
        } catch (error) {
            console.error(error);
        }

    }

    const updateJob = async () => {
        if (_id) {
            try {
                const url = `http://localhost:3005/job/${_id}`;

                let data = {
                    title: title,
                    description: description,
                    email: userDetails.email,
                    price: rate
                }
                const response = await axios.put(url, JSON.stringify(data), {
                    headers: { "Content-Type": "application/json" },
                });


                console.log(response);

                if (response.status === 200) {
                    // Handle successful response
                    const data = await response.data;
                    console.log('Response:', data);
                    addRemove();
                    onClick();
                }
                else if (response.status === 404) {
                    setErrorMsg('Provider not found')
                    handleShowError();
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setErrorMsg('Job Id not found')
            handleShowError()
        }
    }
    const deleteJob = async () => {
        try {
            const url = `http://localhost:3005/job/${_id}`;
            const response = await axios.delete(url, {
                headers: { "Content-Type": "application/json" },
            });


            console.log(response);

            if (response.status === 200) {
                // Handle successful response
                const data = await response.data;
                console.log('Response:', data);
                addRemove();
                onClick();
            }
            else if (response.status === 500) {
                setErrorMsg('An unexpected error occurred.')
                handleShowError();
            }
        } catch (error) {
            console.error(error);
        }
    }




    return (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50' >
            <form onSubmit={addJob} className='max-sm:w-fit sm:w-[550px] h-fit flex flex-col bg-black bg-opacity-60 rounded-lg shadow-md p-10 '>
                <div>
                    <h1 className='text-center mb-4 font-bold text-lg text-blue-300'> GIG</h1>

                    <InputField
                        label="Title"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        important={true}
                        error={errors.title}
                    />
                    <InputField
                        label="Description"
                        type="textField"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        important={true}
                        error={errors.description}
                    />

                    <InputField
                        label="Rate ($/hr)"
                        type="number"
                        placeholder="0"
                        numValue={parseFloat(rate)}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        error={errors.rate}
                        important={true}
                    />
                </div>
                <div className='flex justify-between mt-4'>
                    {isGIG ?
                        <>
                            <button type="button" className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300' onClick={() => deleteJob(_id)}>Delete</button>
                            <button type="button" className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300' onClick={() => updateJob(_id)}>Update</button>
                        </>
                        :
                        <button type="submit" className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300'>Submit</button>
                    }
                    <button type="button" className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300' onClick={onClick}>Close</button>
                </div>
            </form>
            {showError && (
                <ErrorPopup
                    errorMessage={errorMsg}
                    onClose={handleCloseError}
                />
            )}
        </div>
    )
}

PopupWindow.propTypes = {
    onClick: PropTypes.func.isRequired,
    userDetails: PropTypes.object.isRequired,
    gigDetails: PropTypes.object,
    addRemove: PropTypes.func
}

export default PopupWindow;