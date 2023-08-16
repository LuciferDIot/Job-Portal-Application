import PropTypes from 'prop-types';

const ErrorPopup = ({ errorMessage, onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-md shadow-md px-10 py-5 flex justify-center flex-col items-center">
                <p className="text-red-600 font-bold">{errorMessage}</p>
                <button
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};
// Add PropTypes validation for the component props
ErrorPopup.propTypes = {
    errorMessage: PropTypes.string,
    onClose: PropTypes.func.isRequired
}

export default ErrorPopup;
