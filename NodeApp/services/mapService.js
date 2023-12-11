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

router.get('/get-h3-blocks', async (req, res) => {
    try {
        const cachedData = cache.get('h3_blocks');
        if (cachedData) {
            return res.json(cachedData);
        }

        const filePath = 's3files/sr_hex.csv';

        const csvData = await readCsvData(filePath);

        const h3Blocks = csvData.map(({ latitude, longitude, h3_level8_index }) => ({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            coordinates: [parseFloat(latitude), parseFloat(longitude)],
            h3_level8_index: h3_level8_index
        }));

        // Cache the data for future requests
        cache.set('h3_blocks', h3Blocks);

        // Send the data to the client
        res.json(h3Blocks);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
