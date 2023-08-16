import PropTypes from 'prop-types';

const InputField = ({ label, type, placeholder, value, numValue, onChange, options, important, error }) => {

    let inputField;
    if (type === 'dropdown')
        inputField = (
            <select
                id={label}
                name={label}
                value={value}
                onChange={onChange}
                className="mt-1 py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 
                    bg-slate-400 text-black
                    focus:border-indigo-500 border border-gray-300 rounded-md"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        )

    else if (type === 'number') {
        inputField = (
            <input
                id={label}
                name={label}
                type={type}
                placeholder={placeholder}
                value={numValue}
                onChange={onChange}
                className="mt-1 py-2 px-6 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border
                    bg-slate-400 text-black
                     border-gray-300 rounded-md"
            />
        )
    }

    else if (type === 'file') {
        inputField = (
            <input
                id={label}
                name={label}
                type={type}
                value={value}
                onChange={onChange}
                accept='.jpeg, .png, .jpg'
                className="mt-1 py-2 px-6 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border
                    bg-slate-400 text-black
                     border-gray-300 rounded-md"
            />
        )
    }
    else if (type === 'textField') {
        inputField = (
            <textarea
                id={label}
                name={label}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="mt-1 py-2 px-6 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border
                        bg-slate-400 text-black
                        border-gray-300 rounded-md"
                rows={4} // Adjust the number of rows to control the height
            />
        );
    }

    else {

        inputField = (
            <input
                id={label}
                name={label}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="mt-1 py-2 px-6 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border
                    bg-slate-400 text-black
                     border-gray-300 rounded-md"
            />
        )
    }


    return (
        <div>
            <label htmlFor={label} className="block text-sm font-medium text-neutral-300">
                {label} <span className='text-red-500'>{important ? "*" : ""}</span>
            </label>
            {inputField}
            <p className='h-2 text-red-500 text-center text-sm mb-4'>{error}</p>
        </div>
    );
};

// Add PropTypes validation for the component props
InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    important: PropTypes.bool,
    error: PropTypes.string,
    numValue: PropTypes.number
}
export default InputField;
