const fs = require('fs');
const csv = require('csv-parser');
const confirmedUrl = './data/covid_cases_confirmed.csv';
const deathUrl = './data/covid_cases_dead.csv';
const flightsUrl = './data/flightByStatebyMonth.csv';
/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- (Dashboard) ---- */
// const axios = require("axios");
const confirmedCache = {};
const deathCache = {};
const flightCache = {};

function getTotalCase(req, res) {
    let results = 0;
    const month = req.query.month;
    const region = req.query.region;
    if (confirmedCache[region + month]) {
        res.json({'total number': confirmedCache[region + month]});
    } else {
        fs.createReadStream(confirmedUrl)
            .pipe(csv())
            .on('data', (row) => {
                if (region != "All") {
                    if (row['Province_State'] === region) {
                        if (month === "2") {
                            results += (parseInt(row[month + "/29/20"]) - parseInt(row[month + "/1/20"]));
                        } else if ([4, 6, 9, 11].includes(parseInt(month))) {
                            results += (parseInt(row[month + '/30/20']) - parseInt(row[month + '/1/20']));
                        } else {
                            results += (parseInt(row[month + '/31/20']) - parseInt(row[month + '/1/20']));
                        }
                    }
                } else {
                    if (month === "2") {
                        results += (parseInt(row[month + "/29/20"]) - parseInt(row[month + "/1/20"]));
                    } else if ([4, 6, 9, 11].includes(parseInt(month))) {
                        results += (parseInt(row[month + '/30/20']) - parseInt(row[month + '/1/20']));
                    } else {
                        results += (parseInt(row[month + '/31/20']) - parseInt(row[month + '/1/20']));
                    }
                }
            })
            .on('end', () => {
                confirmedCache[region+month] = results;
                res.json({'total number': results});
                console.log(results);
            });
    }
};

function getTotalDeath(req, res) {
    let results = 0;
    const month = req.query.month;
    const region = req.query.region;

    if(deathCache[region + month]) {
        res.json({'total number': deathCache[region + month]});
    } else {
        fs.createReadStream(deathUrl)
            .pipe(csv())
            .on('data', (row) => {
                if (region != "All") {
                    if (row['Province_State'] === region) {
                        if (month === "2") {
                            results += (parseInt(row[month + "/29/20"]) - parseInt(row[month + "/1/20"]));
                        } else if ([4, 6, 9, 11].includes(parseInt(month))) {
                            results += (parseInt(row[month + '/30/20']) - parseInt(row[month + '/1/20']));
                        } else {
                            results += (parseInt(row[month + '/31/20']) - parseInt(row[month + '/1/20']));
                        }
                    }
                } else {
                    if (month === "2") {
                        results += (parseInt(row[month + "/29/20"]) - parseInt(row[month + "/1/20"]));
                    } else if ([4, 6, 9, 11].includes(parseInt(month))) {
                        results += (parseInt(row[month + '/30/20']) - parseInt(row[month + '/1/20']));
                    } else {
                        results += (parseInt(row[month + '/31/20']) - parseInt(row[month + '/1/20']));
                    }
                }
            })
            .on('end', () => {
                deathCache[region+month] = results;
                res.json({'total number': results});
                console.log(results);
            });
    }
}

function getFlightInfo(req, res) {
    let cancels = 0;
    let flight = 0;
    let delay = 0;
    const month = req.query.month;
    const region = req.query.region;

    if(flightCache[month+region]) {
        res.json(flightCache[month+region]);
    } else {
        fs.createReadStream(flightsUrl)
            .pipe(csv())
            .on('data', (row) => {
                if (region != "All") { //for specific state
                    if (row['State'] === region && row['Month'] === month) {
                        cancels = parseInt(row['Cancellation']);
                        flight = parseInt(row['Departure']);
                        delay = parseInt(row['Total Delay Time']);
                    }

                } else {
                    if (row['Month'] === month) {
                        console.log("here");
                        cancels += parseInt(row['Cancellation']);
                        flight += parseInt(row['Departure']);
                        delay += parseInt(row['Total Delay Time']);
                    }
                }

            })
            .on('end', () => {
                res.json({
                    'cancel': cancels,
                    'flight': flight,
                    'delay': delay
                });
            });
    }
}

// The exported functions, which can be accessed in index.js.
module.exports = {
    getTotalCase: getTotalCase,
    getTotalDeath: getTotalDeath,
    getFlightInfo: getFlightInfo
}