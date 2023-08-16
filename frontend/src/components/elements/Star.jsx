import PropTypes from 'prop-types';


const Star = ({ selected, onSelect }) => {
    return (
        <span onClick={onSelect}>
            {selected ?
                <span className='text-yellow-400'>★</span>
                :
                <span className='text-yellow-400 font-thin'>☆</span>
            }
        </span>
    );
};

Star.propTypes = {
    selected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default Star;
