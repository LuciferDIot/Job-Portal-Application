import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NavigationBar = ({ userType, userDetails, setUserDetails }) => {
    userDetails.userType = userType;

    const signOut = async () => {
        if (userDetails && userDetails._id) {
            try {
                await axios.put(`http://localhost:3005/${userType}/${userDetails._id}/123?isActive=false`, {})
                    .then((response) => {
                        if (response.status === 200) {
                            setUserDetails(null);
                            return response.data;
                        }
                        else return null;
                    });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    return (
        <nav className='sticky top-4 z-10 mt-4 w-3/4 bg-black bg-opacity-70 text-white rounded-lg shadow-2xl p-4'>
            <ul className='flex justify-around w-full child:font-extrabold'>
                <li>
                    <Link
                        to={{
                            pathname: '/',
                            search: `?userDetailsProp=${encodeURIComponent(JSON.stringify(userDetails))}`
                        }}
                        className='hover:font-bold'
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to={{
                            pathname: '/jobrequest',
                            search: `?userDetailsProp=${encodeURIComponent(JSON.stringify(userDetails))}`
                        }}
                        className='hover:font-bold'
                    >
                        Job Request
                    </Link>
                </li>
                <li>
                    <Link to='/' onClick={signOut} className='hover:font-bold'>
                        Sign out
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

NavigationBar.propTypes = {
    userType: PropTypes.string.isRequired,
    userDetails: PropTypes.object,
    setUserDetails: PropTypes.func
};

export default NavigationBar;
