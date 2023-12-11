const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 30 * 60 }); // 30 minutes

function readCsvData(filePath) {
    return new Promise((resolve, reject) => {
        const csvData = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const hasNullValues = Object.values(row).some(value => value === null || value === '');
                if (!hasNullValues) {
                    csvData.push(row);
                }
            })
            .on('end', () => {
                resolve(csvData);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function getSuburbsAndIncidentsByDirectorate(data) {
    const result = {};

    data.forEach(row => {
        const suburb = row.official_suburb;
        const directorate = row.directorate;

        if (!result[suburb]) {
            result[suburb] = {};
        }

        if (!result[suburb][directorate]) {
            result[suburb][directorate] = 1;
        } else {
            result[suburb][directorate] += 1;
        }
    });

    // Convert the result object to an array of objects
    const dataArray = Object.keys(result).map(suburb => ({
        suburb: suburb,
        data: Object.keys(result[suburb]).map(directorate => ({
            name: directorate,
            count: result[suburb][directorate],
        })),
    }));

    return dataArray;
}

router.get('/suburbs-incidents-by-directorate', async (req, res) => {
    try {
        const cacheKey = 'suburbsIncidentsByDirectorate';
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await readCsvData('s3files/sr_hex.csv');

        const suburbsIncidentsByDirectorate = getSuburbsAndIncidentsByDirectorate(data);

        // Handle null values gracefully
        const chartData = {
            labels: suburbsIncidentsByDirectorate.map(entry => entry.suburb),
            datasets: [
                {
                    label: 'Incidents',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    data: suburbsIncidentsByDirectorate.map(entry => entry.data.reduce((acc, dir) => acc + dir.count, 0) || 0),
                },
            ],
        };

        cache.set(cacheKey, chartData);

        res.json(chartData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


function getSuburbsAndIncidentsByDirectorate2(data, targetDirectorate) {
    const result = {};

    data.forEach(row => {
        const suburb = row.official_suburb;
        const directorate = row.directorate;

        if (!result[suburb]) {
            result[suburb] = {};
        }

        if (!result[suburb][directorate]) {
            result[suburb][directorate] = 1;
        } else {
            result[suburb][directorate] += 1;
        }
    });

    // Convert the result object to an array of objects
    const dataArray = Object.keys(result).map(suburb => ({
        suburb: suburb,
        count: Object.values(result[suburb]).reduce((acc, count) => acc + count, 0),
    }));

    return dataArray;
}

router.get('/suburbs-incidents', async (req, res) => {
    try {
        const { directorate } = req.query;

        if (!directorate) {
            return res.status(400).json({ error: 'Directorate parameter is required' });
        }

        const cacheKey = `suburbsIncidentsByDirectorate_${directorate}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await readCsvData('s3files/sr_hex.csv');
        const suburbsIncidentsByDirectorate = getSuburbsAndIncidentsByDirectorate2(data, directorate);

        if (suburbsIncidentsByDirectorate.length === 0) {
            return res.status(404).json({ error: 'No data found for the specified directorate' });
        }

        const chartData = {
            labels: suburbsIncidentsByDirectorate.map(entry => entry.suburb),
            datasets: [
                {
                    label: `Incidents for ${directorate}`,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    data: suburbsIncidentsByDirectorate.map(entry => entry.count || 0),
                },
            ],
        };

        cache.set(cacheKey, chartData);

        res.json(chartData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
