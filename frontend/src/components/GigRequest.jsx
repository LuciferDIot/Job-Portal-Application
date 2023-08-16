

import PropTypes from 'prop-types';
import profile_photo from '../assets/profile-photo.png'
import StarRating from './elements/StarRating';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { isDateValid } from './validations.jsx';
import { Link } from 'react-router-dom';


const GigDetails = ({ job, onClose, isOnlyWatch }) => {

    const [provider, setProvider] = useState(job.provider);
    const [photo] = useState(job.provider.photo);


    const [errors, setErrors] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        // Fetch data from the backend API
        try {
            axios.get(`http://localhost:3005/provider/${provider._id}`)
                .then((response) => {
                    if (response.status === 200) return response.data;
                    else return null;
                })
                .then((provider) => {
                    if (provider !== null) {
                        provider.photo = photo;
                        setProvider(provider);
                    }
                })
            setIsAccepted(false);

        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [photo, provider._id]);



    const address =
        (provider.street ? provider.street : '') +
        (provider.city ? ', ' + provider.city : '') +
        (provider.state ? ', ' + provider.state : '') +
        (provider.country ? ', ' + provider.country : '') +
        (provider.zip ? ' ' + provider.zip : '');


    const formValidation = async () => {
        const errors = {}

        title <= 3 || title === '' ? errors.title = "Title length must be greater than 3" : errors.title = ""
        description <= 10 || description === '' ? errors.description = "Description length must be greater than 10" : errors.description = ""
        isDateValid(date) ? errors.date = "Selected date must be two days after from now" : errors.date = ""

        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = await formValidation();
        setErrors(error)

        if (Object.keys(error).every(key => error[key] === "")) {
            const url = `http://localhost:3005/jobrequests`;
            const data = {
                description: description,
                job: title,
                date: date,
                consumerId: job.consumer._id,
                providerId: job.provider._id,
                isAccepted: isAccepted
            }

            const response = await axios.post(url, JSON.stringify(data), {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                console.log("successfully submitted");
                <Link to='/jobrequest' userType="consumer" userDetails={job.consumer} />
            }
        } else console.log(error);

    }


    return (
        <div id='gigRequest' className='max-lg:h-fit fixed top-0 left-0 m-0 px-12 py-16 bg-white w-full h-full'>
            <div className=' h-full flex flex-col justify-center items-center'
            >
                <a className=' cursor-pointer w-full text-left font-bold' onClick={onClose}>&lt;- Back</a>
                <div className='flex flex-wrap lg:mt-6'>
                    <div className='lg:w-2/3'>
                        <div className="shadow-lg hover:shadow-xl p-4 text-xl font-bold mb-2 flex items-top space-x-4 flex-4 max-md:w-full">
                            <img
                                src={photo || profile_photo}
                                alt="Profile"
                                className="w-24 h-24 rounded-full"
                            />
                            <div className='flex flex-col'>
                                <h1 className='max-sm:text-lg text-2xl'>{job.title}</h1>
                                <p className='text-lg font-thin max-sm:text-sm'>{provider.firstName} {provider.lastName}</p>
                                <StarRating originalRating={provider.rating} />

                            </div>
                        </div>

                        <div className='flex shadow-lg hover:shadow-xl py-4 pl-6'>

                            <div className='relative w-fit flex flex-col mt-4 lg:pl-10 max-lg:px-4'>

                                <div className='flex flex-wrap max-lg:child:p-2 justify-between lg:child:w-1/3 child:p-4'>
                                    <div className="mt-4">
                                        <h2 className="text-md font-semibold mb-1 flex">Email:</h2>
                                        <p className="text-sm text-gray-600">{provider.email}</p>
                                    </div>

                                    <div className="mt-4">
                                        <h2 className="text-md font-semibold mb-1 flex">Address:</h2>
                                        <p className="text-sm text-gray-600 ">{address}</p>
                                    </div>
                                    <div className="mt-4">
                                        <h2 className="text-md font-semibold mb-1 flex">Qualification:</h2>
                                        <p className="text-sm text-gray-600">{provider.qualification.name}</p>
                                    </div>
                                    <div className="mt-4">
                                        <h2 className="text-md font-semibold mb-1 flex">Experience:</h2>
                                        <p className="text-sm text-gray-600">{provider.experience}</p>
                                    </div>
                                    <div className="mt-4">
                                        <h2 className="text-md font-semibold mb-1 flex">Availability:</h2>
                                        <p className="text-sm text-gray-600">{provider.availability}</p>
                                    </div>
                                    <div className="mt-4">
                                        <h2 className="text-md font-semibold mb-1 flex">Rate:</h2>
                                        <p className="text-sm text-gray-600">${provider.rate}/h </p>
                                    </div>
                                </div>

                                <div className='p-4'>
                                    <h1 className='max-sm:text-lg text-2xl font-bold'>Description</h1>
                                    <p>{job.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-lg:mt-8 rounded-lg border-gray-100 border-2 lg:w-1/3 shadow-lg hover:shadow-xl p-4 flex flex-col items-top space-x-4 flex-4 max-lg:w-full">
                        <h1 className=' w-full max-sm:text-lg text-xl font-bold text-center'>Contact For the Job</h1>
                        <form onSubmit={handleSubmit} className='h-full flex flex-col justify-between'>
                            <div>
                                <label htmlFor='title' className="block text-sm font-medium">
                                    Title: <span className='text-red-500'> *</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 py-2 px-6 block w-full shadow-sm border-gray-300 border-2 rounded-md"
                                />
                                <p className='text-xs text-red-400 h-1'>{errors.title}</p>
                            </div>

                            <div>
                                <label htmlFor='description' className="block text-sm font-medium">
                                    Description: <span className='text-red-500'> *</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    type="text"
                                    rows={6}
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 py-2 px-6 block w-full shadow-sm border-gray-300 border-2 rounded-md"
                                />
                                <p className='text-xs text-red-400 h-1'>{errors.description}</p>

                            </div>

                            <div>
                                <label htmlFor='datetime' className="block text-sm font-medium">
                                    Date and Time: <span className='text-red-500'> *</span>
                                </label>
                                <input
                                    id="datetime"
                                    name="datetime"
                                    type="datetime-local"
                                    placeholder="Enter date"
                                    value={date.toISOString().slice(0, 16)}
                                    onChange={(e) => setDate(new Date(e.target.value))}
                                    className="mt-1 py-2 px-6 block w-full shadow-sm border-gray-300 border-2 rounded-md"
                                />
                                <p className='text-xs text-red-400 h-1'>{errors.date}</p>
                            </div>
                            {
                                isOnlyWatch ?
                                    <button type="submit" disabled>Accepted</button>
                                    :
                                    <button className='w-full bg-blue-500 py-2 mt-1 px-6 border-2 rounded-md hover:bg-blue-400' type="submit">Submit</button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

GigDetails.propTypes = {
    job: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    isOnlyWatch: PropTypes.bool.isRequired
}

export default GigDetails;