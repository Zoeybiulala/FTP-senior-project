const csv = require('csv-parser');
const fs = require('fs');
const confirmedUrl = './covid_cases_confirmed.csv';
const deadUrl = './covid_cases_dead.csv';


export class UseData {

    constructor() {
        this.confirmedTotalUSA = [];
        this.deathTotalUSA = [];
    }
    async getData(){
        fs.createReadStream(confirmedUrl)
            .pipe(csv())
            .on('data', (data) => {
                this.confirmedTotalUSA.push(data["2/19/23"]);
            })
            .on('end', () => {
                console.log(this.confirmedTotalUSA);
            });

        fs.createReadStream(deadUrl)
            .pipe(csv())
            .on('data', (data) => {
                this.deathTotalUSA.push(data["2/19/23"]);
            })
            .on('end', () => {
                console.log(this.deathTotalUSA);
            })
    }
}