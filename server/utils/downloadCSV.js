const https = require('https');
const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');

const deadURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv';
const confirmURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv';

const deadFileName = 'covid_cases_dead.csv';
const confirmedFileName = 'covid_cases_confirmed.csv';
const outputDirectory = '../data';
const deadFilePath = `${outputDirectory}/${deadFileName}`;
const confirmedFilePath = `${outputDirectory}/${confirmedFileName}`;

const deadFile = fs.createWriteStream(deadFilePath);
https.get(deadURL, (res) => {
    res.on('data', (data) => {
        deadFile.write(data);
    });

    res.on('end', () => {
        deadFile.end();
        console.log('CSV file has been successfully downloaded and saved.');
    });
}).on('error', (err) => {
    console.log('Error while downloading CSV file:', err);
});

const confirmedFile = fs.createWriteStream(confirmedFilePath);
https.get(confirmURL, (res) => {
    res.on('data', (data) => {
        confirmedFile.write(data);
    });

    res.on('end', () => {
        confirmedFile.end();
        console.log('CSV file has been successfully downloaded and saved.');
    });
}).on('error', (err) => {
    console.log('Error while downloading CSV file:', err);
});




