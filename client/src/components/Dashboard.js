import React, { useState, useEffect } from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import CovidMap from './CovidMap';
import Dropdown from './Dropdown';
import {Paper} from "@material-ui/core";

export default function Dashboard(props) {

  // The state maintained by this React Component.
    const [selectedValue, setSelectedValue] = useState('3');
    const options = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

    useEffect(() =>{

    }, [selectedValue]); //

    function handleChange(option) {
      setSelectedValue(option);
    }
    return (
    <div className='Dashboard'>
      <PageNavbar active='Dashboard' />
      <div className='container people-container'>
        <br></br>

          <Paper className="Month-paper" style={{ height: 60}}>
              <div className="dropdown-container">
                  <h2 className="left"> Data Displayed for Month: </h2>
                  <Dropdown className="middle" options={options} onSelect={handleChange} />
                  <h2 className="right"> in 2020</h2>
              </div>
          </Paper>
            <div>
              <CovidMap selectedMonth={selectedValue}/>
              {/*<TimeChart />*/}
            </div>

      </div>
    </div>
  );

}
