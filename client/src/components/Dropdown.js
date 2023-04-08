import React, { useState } from 'react';

function Dropdown(props) {
    const [selectedValue, setSelectedValue] = useState(props.options[2]);

    function handleChange(event) {
        setSelectedValue(event.target.value);
        props.onSelect(event.target.value);
    }

    return (
        <select value={selectedValue} onChange={handleChange} style={{height: '50px',width:'150px'}}>
            {props.options.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default Dropdown;