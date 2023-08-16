import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import GigCards from './elements/GigCards';
import GigRequest from './GigRequest.jsx';
import { document } from 'postcss';



const ConsHome = ({ userDetails }) => {
    userDetails.userType = 'consumer';

    const [openPage, setOpenPage] = useState(false);
    const gigRequestRef = useRef(null);
    const [allJobs, setAllJobs] = useState([]);
    const [gigDetails, setGigDetails] = useState({});
    const [filteredGigs, setFilteredGigs] = useState([]);
    const [rating, setRating] = useState(0);
    const [showFilter, setShowFilter] = useState(false);

    const [qualification, setQualification] = useState(null);
    const [jobTypes, setJobTypes] = useState([]);

    const [availability, setAvailability] = useState('');

    const [minRate, setMinRate] = useState(0);
    const [maxRate, setMaxRate] = useState(5);


    useEffect(() => {
        // Fetch data from the backend API
        try {
            axios.get(`http://localhost:3005/job`)
                .then((response) => {
                    if (response.status === 200) return response.data;
                    else return null;
                })
                .then((jobs) => {
                    if (jobs !== null) {
                        setAllJobs(jobs);
                        setFilteredGigs(jobs);
                    }
                })

            if (window.innerWidth > 640) setShowFilter(true);


        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, []);


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

                const allQualificationsOption = {
                    value: "null",
                    label: "All Qualifications",
                };
                modifiedArray.unshift(allQualificationsOption);

                setJobTypes(modifiedArray)
                setQualification(modifiedArray[0].value)
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);



    const handleButtonClick = () => {
        setOpenPage(true);
    };

    const handlePopupClose = () => {
        try {
            document.getElementById('consumerJobViews').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.log('gig element still not loaded');
        }
        setOpenPage(false);
        setGigDetails({})
    };



    const openGig = (item) => {

        setGigDetails(item)
        handleButtonClick();

        try {
            if (gigRequestRef.current) {
                gigRequestRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.log(error);
            console.log('gig element still not loaded');
        }
    }


    const filterPanelChanger = () => {
        if (showFilter) setShowFilter(false);
        else setShowFilter(true)
    }







    const filterByRating = (e) => {
        const value = Number(e.target.value);
        console.log('Selected Value:', e.target.value);
        console.log('Converted Rating:', value);

        setRating(value);

        const jobs = filteredGigs.length === 0 ? allJobs : filteredGigs;

        if (isNaN(value)) {
            setFilteredGigs(jobs);
        } else {
            const filtered = jobs.filter((job) => {
                console.log('Provider Rating:', job.provider.rating);
                if (job.provider.rating <= value) {
                    return job
                }
            });

            setFilteredGigs(filtered);
        }

    };

    const filterByRate = () => {
        const jobs = filteredGigs.length === 0 ? allJobs : filteredGigs;
        console.log('Selected MinValue:', minRate);
        console.log('Selected MaxValue:', maxRate);

        const filtered = jobs.filter((job) => {
            console.log(job.price);
            return job.price >= minRate && job.price <= maxRate;
        });

        setFilteredGigs(filtered);
    };




    const filterByQualification = (e) => {
        const value = e.target.value;
        const jobs = filteredGigs.length === 0 ? allJobs : filteredGigs;

        const filtered = jobs.filter((job) => {
            if (job.provider.qualification === value) {
                return job
            }
        });

        if (filtered.length === 0 && value === 'null') setFilteredGigs(jobs)
        else setFilteredGigs(filtered);

        setQualification(value);

    }


    const filterByAvailability = (e) => {
        const value = e.target.value;
        setAvailability(value)
        const jobs = filteredGigs.length === 0 ? allJobs : filteredGigs;


        if (value === 'true') {
            const filteredFull = jobs.filter((job) => {
                if (job.provider.availability === "Full time") {
                    return job
                }
            });

            setFilteredGigs(filteredFull);
        }
        else if (value === 'false') {

            const filteredPart = jobs.filter((job) => {
                if (job.provider.availability === "Part time") {
                    return job
                }
            });

            setFilteredGigs(filteredPart);
        }
        else {
            setFilteredGigs(jobs)
        }
    }

    const resetAll = () => {
        setFilteredGigs(allJobs);
        setMaxRate(0);
        setMinRate(0);
        setAvailability(null);
        setQualification(null);
        setRating(null);

        // Call filterByRate to reset rate filtering
        filterByRate({ target: { value: '' } });

        // Call filterByRating to reset rating filtering
        filterByRating({ target: { value: '' } });

        // Call filterByQualification to reset qualification filtering
        filterByQualification({ target: { value: 'null' } });

        // Call filterByAvailability to reset availability filtering
        filterByAvailability({ target: { value: 'null' } });
    };








    return (

        <div id='consumerJobViews' className="h-screen w-screen overflow-x-hidden  bg-gray-100 rounded-lg shadow-2xl">


            <div className='sm:mt-8 sm:justify-between max-sm:mt-4 w-screen h-screen flex max-lg:flex-row max-sm:p-2 max-sm:flex-wrap max-sm:justify-center'>
                <div className='sticky sm:top-1/4 left-2 w-fit h-fit mb-8'>
                    <div className=" bg-white rounded-lg shadow-md p-8 mx-2 w-[300px] h-fit text-center flex-col 
                child:w-full child:p-1 flex ">
                        <button type="button" onClick={filterPanelChanger} className='h-fit font-bold mx-2 px-8 w-full'>- filter -</button>
                        {showFilter &&
                            <div className='child:flex child:justify-between child:flex-col child:mt-4 child-div-p:w-full child-div-p:text-left'>
                                <div className=''>
                                    <p>Rating</p>
                                    <select
                                        className='border-0 px-4 focus:border-0'
                                        value={rating}
                                        onChange={filterByRating}
                                    >
                                        <option value={null}>All Ratings</option>
                                        <option value={1}>1 Star</option>
                                        <option value={2}>2 Stars</option>
                                        <option value={3}>3 Stars</option>
                                        <option value={4}>4 Stars</option>
                                        <option value={5}>5 Stars</option>
                                    </select>
                                </div>

                                <div className=''>
                                    <p>Qualification</p>
                                    <select
                                        className='border-0 px-4 focus:border-0'
                                        value={qualification}
                                        onChange={filterByQualification}
                                        defaultValue='null'
                                    >
                                        {jobTypes.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <div className=''>
                                    <p>Availability</p>
                                    <select
                                        className='border-0 px-4 focus:border-0'
                                        value={availability}
                                        onChange={filterByAvailability}
                                    >
                                        <option value={null}>All</option>
                                        <option value={true}>Full time</option>
                                        <option value={false}>Part time</option>
                                    </select>
                                </div>

                                <div className="w-full">
                                    <p>Rate Range</p>
                                    <div className='flex w-full child:text-center border-2 border-gray-400'>
                                        <input
                                            type="number"
                                            className="px-4 focus:border-1 w-2/5"
                                            placeholder="Min Rate"
                                            value={minRate}
                                            onChange={(e) => {
                                                const newMinRate = Number(e.target.value);
                                                setMinRate(newMinRate);
                                                if (newMinRate <= maxRate) {
                                                    filterByRate();
                                                }
                                            }}
                                        />
                                        <p className='w-1/5'>-</p>
                                        <input
                                            type="number"
                                            className="px-4 focus:border-0  w-2/5"
                                            placeholder="Max Rate"
                                            value={maxRate}
                                            onChange={(e) => {
                                                const newMaxRate = Number(e.target.value);
                                                setMaxRate(newMaxRate);
                                                if (newMaxRate >= minRate) {
                                                    filterByRate();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='flex justify-center'>
                                    <button
                                        type="button"
                                        className='bg-red-500 text-white rounded-md'
                                        onClick={resetAll}
                                    >
                                        Reset
                                    </button>
                                </div>

                            </div>

                        }
                        <div>

                        </div>
                    </div>

                </div>


                {
                    allJobs.length > 0 ?
                        <div className='w-max h-screen overflow-y-scroll'>
                            <div className='flex max-md:w-fit md:w-max h-full flex-wrap mt-6 mx-2 p-2 child:mx-4 child:mb-6 justify-center'>

                                {filteredGigs.length > 0 && <GigCards arrayOfGigs={filteredGigs} userDetails={userDetails} openGig={openGig} />}


                            </div>
                        </div> : "no jobs found"}
            </div>

            {openPage &&
                <div ref={gigRequestRef} id="gigRequest">
                    <GigRequest job={{ ...gigDetails, consumer: userDetails }} onClose={handlePopupClose} isOnlyWatch={false} />
                </div>}
        </div>
    )
}

ConsHome.propTypes = {
    userDetails: PropTypes.object.isRequired
}

export default ConsHome;