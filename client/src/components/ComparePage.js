import React, { useState } from 'react';
import PageNavbar from "./PageNavbar";
import Dropdown from "./Dropdown";
import ComparisonTable from "./ComparisonTable";

const allStates = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
const allMonths = Array.from({ length: 12 }, (_, i) => (i + 1).toString());


export default function ComparePage() {
    const [selectedStates, setSelectedStates] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('3');

    function handleSelectState(state) {
        // Add selected state to the array of selected states
        setSelectedStates([...selectedStates, state]);
    }

    function handleSelectMonth(month) {
        setSelectedMonth(month);
    }

    function handleRemoveState(state) {
        // Remove deselected state from the array of selected states
        setSelectedStates(selectedStates.filter(s => s !== state));
    }
    return (
        <div className="Compare-page">
            <PageNavbar active="Comparison" />
            <div className="container recommendations-container">
                <br></br>
                <div className="jumbotron findFriend-headspace">
                    <em>Choose the states you want to compare:     </em>
                    {/*<br></br>*/}
                    <Dropdown options={allStates} onSelect={handleSelectState} />
                    <em>     Choose the month:  </em>
                    <Dropdown options={allMonths} onSelect={handleSelectMonth} />
                    <br></br><br></br>
                    <div>
                        {selectedStates.map(state => (
                            <button key={state} onClick={() => handleRemoveState(state)}>
                                {state} &times;
                            </button>
                        ))}
                    </div>
                    <ComparisonTable selectedStates={selectedStates} selectedMonth={selectedMonth} />

                </div>
            </div>
        </div>
    );
};