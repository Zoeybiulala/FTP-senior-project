import React, {useState, useEffect, PureComponent} from "react";
import {
    Annotation,
    ComposableMap,
    Geographies,
    Geography, Graticule, Marker,
    ZoomableGroup
} from "react-simple-maps";
import geoUrl from '../data/statesMap.json';
import allStates from '../data/allStates.json';
import stateNames from '../data/stateNames.json';
import { geoCentroid } from 'd3-geo';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import '../style/Maps.css';
import TimeChart from "./TimeChart";

const offsets = {
    VT: [50, -8],
    NH: [34, 2],
    MA: [30, -1],
    RI: [28, 2],
    CT: [35, 10],
    NJ: [34, 1],
    DE: [33, 0],
    MD: [47, 10],
    DC: [49, 21],
};

function CovidMap (props) {
    const [confirmedCases, setConfirmedCases] = useState(''); //default total
    const [deaths, setDeaths] = useState('');
    const [region, setRegion]  = useState('All');
    const [cancel, setCancel] = useState('');
    const [flight, setFlight] = useState('-');
    const [delay, setDelay] = useState('-');
    const mortalityRate = deaths / confirmedCases;
    const mortalityRateString = mortalityRate.toLocaleString(undefined, {style: 'percent'});
    const month = props.selectedMonth;

    useEffect(() => {
        fetch(`https://ftp-server.vercel.app/covid/confirm?month=${month}&region=${region}`)
            .then(res => res.json())
            .then(resJson => {
                setConfirmedCases(resJson['total number']);
            })
        fetch(`https://ftp-server.vercel.app/covid/death?month=${month}&region=${region}`)
            .then(res => res.json())
            .then(resJson => {
                setDeaths(resJson['total number']);
            })
        fetch(`https://ftp-server.vercel.app/fly?month=${month}&region=${region}`)
            .then(res => res.json())
            .then(resJson => {
                setCancel(resJson['cancel']);
                setFlight(resJson['flight']);
                setDelay(resJson['delay']);
            })
    }, [month, region]);


    const onChange = (id) => {
        const suoxie = allStates.find((s) => s.val === id);
        if(!suoxie) return null;
        setRegion(stateNames[suoxie.id.toString()]);
        console.log(region);
    }

    return (
        <div>
            <div className="Tables">
                <TableContainer className="covid-table" component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>State</TableCell>
                                <TableCell>Confirmed Cases</TableCell>
                                <TableCell>Deaths</TableCell>
                                <TableCell>Mortality Rate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{region}</TableCell>
                                <TableCell>{confirmedCases}</TableCell>
                                <TableCell>{deaths}</TableCell>
                                <TableCell>{mortalityRateString}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer className="fly-table" component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>State</TableCell>
                                <TableCell>Flights</TableCell>
                                <TableCell>Cancellations</TableCell>
                                <TableCell>Total Delay Time (mins)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{region}</TableCell>
                                <TableCell>{flight}</TableCell>
                                <TableCell>{cancel}</TableCell>
                                <TableCell>{delay}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="Maps">
                {/*covid map*/}
                <div className="CovidMap" style={{width: "600px", border:"double"}}>
                    <ComposableMap projection='geoAlbersUsa' data-tip=''>
                        {/*<Graticule stroke='#D4D5D6' strokeWidth={0.5} />*/}
                        {/*<Fade in={dataStore.ready} timeout={1000}>*/}
                        <Geographies geography={geoUrl}>
                            {({ geographies }) => (
                                <>
                                    {geographies.map((geo) => {
                                        // const stateKey = getMatchingStateKey(dataStore, geo);
                                        // if (!stateKey) {
                                        //     return null;
                                        // }
                                        // const d = dataStore.getRegionData(stateKey);
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onMouseEnter={() => {
                                                }}
                                                onMouseLeave={() => {
                                                }}
                                                onClick={() => {
                                                    //should display the corresponding state stats
                                                    onChange(geo.id);
                                                }}
                                                style={{
                                                    default: {
                                                        transition: 'fill 0.6s linear',
                                                        fill: '#FA4590',
                                                        outline: 'none',
                                                    },
                                                    hover: {
                                                        fill: '#F2EAEA',
                                                        outline: 'none',
                                                        cursor: 'pointer',
                                                    },
                                                    pressed: {
                                                        fill: '#F2EAEA',
                                                        outline: 'none',
                                                    },
                                                }}
                                            />
                                        );
                                    })}
                                    {geographies.map((geo) => {
                                        const centroid = geoCentroid(geo);
                                        const cur = allStates.find((s) => s.val === geo.id);
                                        return (
                                            <g key={geo.rsmKey + '-name'}>
                                                {cur &&
                                                    centroid[0] > -160 &&
                                                    centroid[0] < -67 &&
                                                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                                                        <Marker coordinates={centroid}>
                                                            <text y='2' fontSize={14} textAnchor='middle'>
                                                                {cur.id}
                                                            </text>
                                                        </Marker>
                                                    ) : (
                                                        <Annotation
                                                            subject={centroid}
                                                            dx={offsets[cur.id][0]}
                                                            dy={offsets[cur.id][1]}
                                                        >
                                                            <text x={4} fontSize={14} alignmentBaseline='middle'>
                                                                {cur.id}
                                                            </text>
                                                        </Annotation>
                                                    ))}
                                            </g>
                                        );
                                    })}
                                </>
                            )}
                        </Geographies>
                    </ComposableMap>
                </div>

                {/*fly map*/}
                <div className="FlyMap" style={{width: "600px", border:"double"}}>
                    <ComposableMap projection='geoAlbersUsa' data-tip=''>
                        {/*<Graticule stroke='#D4D5D6' strokeWidth={0.5} />*/}
                        {/*<Fade in={dataStore.ready} timeout={1000}>*/}
                        <Geographies geography={geoUrl}>
                            {({ geographies }) => (
                                <>
                                    {geographies.map((geo) => {
                                        // const stateKey = getMatchingStateKey(dataStore, geo);
                                        // if (!stateKey) {
                                        //     return null;
                                        // }
                                        // const d = dataStore.getRegionData(stateKey);
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onMouseEnter={() => {
                                                }}
                                                onMouseLeave={() => {
                                                }}
                                                onClick={() => {
                                                    //should display the corresponding state stats
                                                    onChange(geo.id);
                                                }}
                                                style={{
                                                    default: {
                                                        transition: 'fill 0.6s linear',
                                                        fill: '#FFCC66',
                                                        outline: 'none',
                                                    },
                                                    hover: {
                                                        fill: '#F2EAEA',
                                                        outline: 'none',
                                                        cursor: 'pointer',
                                                    },
                                                    pressed: {
                                                        fill: '#F2EAEA',
                                                        outline: 'none',
                                                    },
                                                }}
                                            />
                                        );
                                    })}
                                    {geographies.map((geo) => {
                                        const centroid = geoCentroid(geo);
                                        const cur = allStates.find((s) => s.val === geo.id);
                                        return (
                                            <g key={geo.rsmKey + '-name'}>
                                                {cur &&
                                                    centroid[0] > -160 &&
                                                    centroid[0] < -67 &&
                                                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                                                        <Marker coordinates={centroid}>
                                                            <text y='2' fontSize={14} textAnchor='middle'>
                                                                {cur.id}
                                                            </text>
                                                        </Marker>
                                                    ) : (
                                                        <Annotation
                                                            subject={centroid}
                                                            dx={offsets[cur.id][0]}
                                                            dy={offsets[cur.id][1]}
                                                        >
                                                            <text x={4} fontSize={14} alignmentBaseline='middle'>
                                                                {cur.id}
                                                            </text>
                                                        </Annotation>
                                                    ))}
                                            </g>
                                        );
                                    })}
                                </>
                            )}
                        </Geographies>
                    </ComposableMap>
                </div>
            </div>

            <TimeChart region={region} month={month}/>
        </div>


    )
}

export default CovidMap;
