import PropTypes from 'prop-types'

const GigCards = ({ arrayOfGigs, userDetails, openGig }) => {


    return (
        <>
            {
                arrayOfGigs.map((item, index) => {

                    return (
                        <div key={index} className="bg-white rounded-lg shadow-md p-4 w-[260px] h-[260px] flex 
                        justify-between flex-col hover:border-gray-300 hover:border-4 " onClick={() => { openGig(item) }}>
                            <h2 className="text-xl font-bold">{item.title}</h2>
                            <p className={`text-gray-600 h-[100px] overflow-hidden`}>{item.description}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium text-gray-700 mr-2">Rating:</span>
                                <span className="text-sm font-semibold text-blue-600">{userDetails.rating}</span>
                            </div>
                            <div className="flex items-center mt-1">
                                <span className="text-sm font-medium text-gray-700 mr-2">Experience Level:</span>
                                <span className="text-sm font-semibold text-green-600">{userDetails.experience}</span>
                            </div>
                            <div className="flex items-center mt-1">
                                <span className="text-sm font-medium text-gray-700 mr-2">Rate:</span>
                                <span className="text-sm font-semibold text-indigo-600">${item.price}/hr</span>
                            </div>
                        </div>)
                })
            }
        </>
    )
}

GigCards.propTypes = {
    arrayOfGigs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            rating: PropTypes.string,
            experience: PropTypes.string,
            rate: PropTypes.string
        })
    ),
    userDetails: PropTypes.object.isRequired,
    openGig: PropTypes.func.isRequired
}

export default GigCards;