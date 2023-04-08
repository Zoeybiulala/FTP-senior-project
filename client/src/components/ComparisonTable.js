import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function ComparisonTable({ selectedStates, selectedMonth }) {
    const [data, setData] = useState([]);

    // Simulate API call to fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = [];
                for (const state of selectedStates) {
                    const response = await fetch(`http://localhost:8080/covid/confirm?month=${selectedMonth}&region=${state}`);
                    const confirmedCasesData = await response.json();

                    const response2 = await fetch(`http://localhost:8080/covid/death?month=${selectedMonth}&region=${state}`);
                    const deathsData = await response2.json();

                    const response3 = await fetch(`http://localhost:8080/fly?month=${selectedMonth}&region=${state}`);
                    const flightData = await response3.json();

                    data.push({
                        state: state,
                        covidCases: confirmedCasesData['total number'],
                        deaths: deathsData['total number'],
                        flightCancellation: flightData['cancel'],
                    });
                }
                setData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [selectedStates, selectedMonth]);

    const classes = useStyles();

    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell align="right">Covid Cases</TableCell>
                    <TableCell align="right">Deaths</TableCell>
                    <TableCell align="right">Flight Cancellation</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(item => (
                    <TableRow key={item.state}>
                        <TableCell component="th" scope="row">{item.state}</TableCell>
                        <TableCell align="right">{item.covidCases}</TableCell>
                        <TableCell align="right">{item.deaths}</TableCell>
                        <TableCell align="right">{item.flightCancellation}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default ComparisonTable;
