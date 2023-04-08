const csv = require('csv-parser');
const fs = require('fs');

const flightByDateFile = '../data/cancelled_flights_by_date.csv';
const covidByDateFile = '../data/confirmed_cases_by_date.csv';
const outputFile = '../data/mergedData.json'

const cancelledData = {};
const covidData = {};

function formatDate(dateString) {
    const parts = dateString.split('/');
    const month = parseInt(parts[0]); // months are zero-indexed
    const day = parts[1]; // days are also zero-indexed
    const year = parseInt(parts[2], 10);
    return `${month.toString()}/${day.toString().padStart(2,'0')}/${year.toString()}`;
}

function getPreviousDay(dateString) {
    const parts = dateString.split('/');
    const month = parts[0] - 1; // months are zero-indexed
    const day = parts[1]; // days are also zero-indexed
    const year = parseInt(parts[2], 10);
    const currentDate = new Date(year, month, day);
    const previousDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
    const previousMonth = previousDate.getMonth() + 1; // add 1 to get the correct month
    const previousDay = previousDate.getDate();
    const previousYear = previousDate.getFullYear();
    return `${previousMonth.toString()}/${previousDay.toString()}/${previousYear.toString().substring(2)}`;
}

// Read the cancelled data CSV file
fs.createReadStream(flightByDateFile)
    .pipe(csv())
    .on('data', (row) => {
        // Loop through each date column in the row and add the value to the cancelledData object
        Object.keys(row).forEach((key) => {
            if (key !== 'date') {
                cancelledData[formatDate(key.substring(0,key.length-2))] = Number(row[key]);
            }
        });
    })
    .on('end', () => {
        // Read the covid data CSV file
        fs.createReadStream(covidByDateFile)
            .pipe(csv())
            .on('data', (row) => {
                // Loop through each date column in the row and add the value to the covidData object
                Object.keys(row).forEach((key) => {
                    if (key !== 'date') {
                        let prevKey = getPreviousDay(key);
                        covidData[formatDate(key)] = Number(row[key]) - Number(row[prevKey]);

                    }
                });
            })
            .on('end', () => {
                // Combine the data for each date and create a JSON object
                const result = Object.keys(cancelledData).map((date) => ({
                    date,
                    confirmedCases: covidData[date],
                    cancelledFlights: cancelledData[date]
                }));

                result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                fs.writeFileSync(outputFile, JSON.stringify(result));
            });


    });