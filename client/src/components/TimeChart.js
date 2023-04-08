import React, { useState, useEffect} from "react";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Brush,
} from 'recharts';
import data from '../data/mergedData.json';

function TimeChart (props) {
    const [brushData, setBrushData] = useState(data);
    // const region = props.region;

    const onBrushChange = (value) => {
        const startIndex = value && value[0] ? value[0] : 0;
        const endIndex = value && value[1] ? value[1] : brushData.length - 1;
        const newData = data.slice(startIndex, endIndex + 1);
        setBrushData(newData);
    };

    return (
        <ResponsiveContainer  width="100%" height={300}>
            <ComposedChart data={data} margin={{top:40, left: 40, right: 40}}>
                <CartesianGrid stroke="#f5f5f5"/>
                <XAxis dataKey="date" />
                <YAxis yAxisId="right"
                       label={{
                           value: 'Confirmed Cases',
                           angle: -90,
                           position: 'outsideLeft',
                           dx: -50
                       }}
                />
                <YAxis yAxisId="left"
                       label={{
                           value: 'Cancelled Flights',
                           angle: -90,
                           position: 'outsideRight' ,
                           dx:50
                       }}
                       orientation="right"
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="right" dataKey="confirmedCases" fill="#8884d8" barSize={20} />
                <Line yAxisId="left" type="monotone" dataKey="cancelledFlights" stroke="#82ca9d" />
                <Brush dataKey="date" height={30} onChange={onBrushChange}>
                    <rect x="0" y="0" width="100%" height="100%" fill="#8884d8" opacity="0.5" />
                </Brush>
            </ComposedChart>
        </ResponsiveContainer>
    )
};

export default TimeChart;
