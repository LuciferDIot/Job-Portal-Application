import PropTypes from 'prop-types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PopupWindow from './elements/PopupWindow.jsx';
import addButtonImage from '../assets/addButton.webp';
import GigCards from './elements/GigCards.jsx';

const ProHome = ({ userDetails }) => {
    userDetails.userType = 'provider';

    const [showPopup, setShowPopup] = useState(false);
    const [allJobs, setAllJobs] = useState([]);
    const [gigDetails, setGigDetails] = useState({});
    const [isUpdated, setUpdated] = useState(false);


    useEffect(() => {
        // Fetch data from the backend API
        try {
            if (userDetails.email) {

                axios.get(`http://localhost:3005/job/provider/${userDetails.email}`)
                    .then((response) => {
                        if (response.status === 200) return response.data;
                        else return null;
                    })
                    .then((jobs) => {
                        if (jobs !== null) setAllJobs(jobs);
                    })

                setUpdated(false)
            } else {
                console.error('userDetails.email is not available');
            }


        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [isUpdated, userDetails.email]);



    if (userDetails) {
        const address =
            (userDetails.street ? userDetails.street : '') +
            (userDetails.city ? ', ' + userDetails.city : '') +
            (userDetails.state ? ', ' + userDetails.state : '') +
            (userDetails.country ? ', ' + userDetails.country : '') +
            (userDetails.zip ? ' ' + userDetails.zip : '');


        const handleButtonClick = () => {
            setShowPopup(true);
        };

        const handlePopupClose = () => {
            setShowPopup(false);
            setGigDetails({})
        };


        const openGig = (item) => {
            setGigDetails(item)
            handleButtonClick();
        }


        const addOrRemoveGig = () => {
            setUpdated(true)
        }


        return (
            <>

                <div className="h-screen w-screen overflow-x-hidden  bg-gray-100 rounded-lg shadow-2xl">
                    <div className='sm:mt-8 max-sm:mt-4 w-screen h-fit flex max-lg:flex-row max-sm:p-2 max-sm:flex-wrap max-sm:justify-center'>
                        <div className='sticky sm:top-40 left-2 w-fit h-fit'>
                            <div className=" bg-white rounded-lg shadow-md p-8 my-6 mx-2 w-[300px] h-[600px] text-center flex justify-center flex-col 
                child:w-full child:p-1 child:flex child:justify-between">

                                <div className="text-xl font-bold mb-2 flex justify-between items-center space-x-4 flex-4 max-md:w-full">
                                    <img
                                        src={userDetails.photo || 'path_to_default_photo'}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full"
                                    />
                                    {userDetails.firstName} {userDetails.lastName}
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-md font-semibold mb-1 flex">Email:</h2>
                                    <p className="text-sm text-gray-600">{userDetails.email}</p>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-md font-semibold mb-1 flex">Qualification:</h2>
                                    <p className="text-sm text-gray-600">{userDetails.qualification.name}</p>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-md font-semibold mb-1 flex">Experience:</h2>
                                    <p className="text-sm text-gray-600">{userDetails.experience}</p>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-md font-semibold mb-1 flex">Availability:</h2>
                                    <p className="text-sm text-gray-600">{userDetails.availability}</p>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-md font-semibold mb-1 flex">Rate:</h2>
                                    <p className="text-sm text-gray-600">{userDetails.rate}</p>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-md font-semibold mb-1 flex">Rating:</h2>
                                    <p className="text-sm text-gray-600">{userDetails.rating}</p>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-md font-semibold mb-1 flex">Address:</h2>
                                    <p className="text-sm text-gray-600 text-right">{address}</p>
                                </div>
                            </div>
                        </div>

                        <div className='w-fit h-max overflow-y-scroll'>
                            <div className='flex max-md:w-fit h-full flex-wrap mt-6 mx-2 p-2 child:mx-4 child:mb-6 justify-center'>
                                <div className="bg-white rounded-lg shadow-md p-4 w-[260px] h-[260px] hover:border-gray-300 hover:border-4">
                                    <button onClick={handleButtonClick} className="focus:outline-none">
                                        <img src={addButtonImage} alt="Add Button" className="w-full h-full p-10" />
                                    </button>
                                </div>

                                {allJobs.length > 0 ? <GigCards arrayOfGigs={allJobs} userDetails={userDetails} openGig={openGig} /> : console.error("don't have any job")}


                            </div>
                        </div>
                    </div>

                </div>
                {showPopup && <PopupWindow onClick={handlePopupClose} userDetails={userDetails} gigDetails={gigDetails} addRemove={addOrRemoveGig} />}

            </>
        )
    }
    else {
        return <div>...Loading</div>
    }

}

ProHome.propTypes = {
    userDetails: PropTypes.object.isRequired
}

export default ProHome;