import ProHome from './ProHome.jsx';
import ConsHome from './ConsHome.jsx';
import NavigationBar from "./elements/Navigation.jsx";
import PropTypes from 'prop-types'

const Home = ({ userDetails, setUserDetails }) => {

    return (
        <div className="flex flex-col justify-start items-center">
            <NavigationBar userType={userDetails.userType} userDetails={userDetails} setUserDetails={setUserDetails} />

            {
                userDetails.userType === 'provider' ? (
                    <ProHome userDetails={userDetails} />
                ) : (
                    <ConsHome userDetails={userDetails} />
                )

            }
        </div>
    );
}

Home.propTypes = {
    userDetails: PropTypes.object.isRequired,
    setUserDetails: PropTypes.func.isRequired
}

export default Home;

