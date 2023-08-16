import Star from './Star';
import { useState } from 'react';
import PropTypes from 'prop-types'

const StarRating = ({ originalRating, setNewRating }) => {
    const [rating, setRating] = useState(originalRating);

    const handleSelect = (index) => {
        setRating(index + 1);
        setNewRating(rating);
    };

    return (
        <div className='flex cursor-pointer'>
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    selected={index < rating}
                    onSelect={() => handleSelect(index)}
                />
            ))}
        </div>
    );
};

StarRating.propTypes = {
    originalRating: PropTypes.number,
    setNewRating: PropTypes.func
}

export default StarRating;
