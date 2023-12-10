const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 30 * 60 }); // 30 minutes

// Function to read CSV data from a local file
function readCsvData(filePath) {
    const csvData = [];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const rows = fileContent.split('\n');
    const header = rows[0].split(',');

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        const rowData = {};

        for (let j = 0; j < header.length; j++) {
            rowData[header[j]] = row[j];
        }

        csvData.push(rowData);
    }

    return csvData;
}

// Endpoint to get unique values by column name from a local CSV file
/**
 * @swagger
 * tags:
 *   name: Dashboard Queries
 *   description: Endpoints for Service Request Dashboard Queries
 */

/**
 * @swagger
 * /unique-by-column/{columnName}:
 *   get:
 *     summary: Get unique values for a specific column from a local CSV file
 *     tags: [CSV Operations]
 *     parameters:
 *       - in: path
 *         name: columnName
 *         schema:
 *           type: string
 *         required: true
 *         example: notification_number
 *         enum:
 *           - notification_number
 *           - reference_number
 *           - creation_timestamp
 *           - completion_timestamp
 *           - directorate
 *           - department
 *           - branch
 *           - section
 *           - code_group
 *           - code
 *           - cause_code_group
 *           - cause_code
 *           - official_suburb
 *           - latitude
 *           - longitude
 *           - h3_level8_index
 *         description: The name of the column to retrieve unique values from
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Invalid column name parameter or file path not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/unique-by-column/:columnName', async (req, res) => {
    try {
        const filePath = 's3files/sr_hex.csv';
        const columnName = req.params.columnName;

        // Check the cache first
        const cacheKey = `uniqueValues:${columnName}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        // Read CSV data from the local file
        const data = readCsvData(filePath);

        // Ensure the column name is valid
        if (!columnName || !data[0].hasOwnProperty(columnName)) {
            return res.status(400).json({ error: 'Invalid column name parameter' });
        }

        // Extract the unique values from the column
        const uniqueValues = [...new Set(data.map(row => row[columnName]))].filter(value => value !== "" && value !== null && value !== undefined);

        uniqueValues.sort();

        // Cache the result
        cache.set(cacheKey, uniqueValues);

        res.json(uniqueValues);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search CSV data based on query parameters
 *     tags: [CSV Operations]
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *         description: Start date for date range filtering
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *         description: End date for date range filtering
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: User latitude for geospatial filtering
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: User longitude for geospatial filtering
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: Radius (in kilometers) for geospatial filtering
 *       - in: query
 *         name: field_name
 *         schema:
 *           type: string
 *         description: Field name for additional field-based filtering
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *         description: Number of items per page for pagination
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/search', (req, res) => {
    try {
        const filePath = 's3files/sr_hex.csv';
        const searchData = readCsvData(filePath);

        // Apply filters based on query parameters
        const filteredData = searchData.filter((item) => {
            // Date range filtering for creation_timestamp
            const creationTimestamp = new Date(item.creation_timestamp);
            const startDate = new Date(req.query.start_date);
            const endDate = new Date(req.query.end_date);
            if (
                !isNaN(creationTimestamp.getTime()) &&
                !isNaN(startDate.getTime()) &&
                !isNaN(endDate.getTime()) &&
                (creationTimestamp >= startDate && creationTimestamp <= endDate)
            ) {
                return false;
            }

            // Date range filtering for completion_timestamp
            const completionTimestamp = new Date(item.completion_timestamp);
            if (
                !isNaN(completionTimestamp.getTime()) &&
                !isNaN(startDate.getTime()) &&
                !isNaN(endDate.getTime()) &&
                (completionTimestamp >= startDate && completionTimestamp <= endDate)
            ) {
                return false;
            }

            // Geospatial filtering for gps (within specified radius)
            const userLatitude = parseFloat(req.query.latitude);
            const userLongitude = parseFloat(req.query.longitude);
            const itemLatitude = parseFloat(item.latitude);
            const itemLongitude = parseFloat(item.longitude);
            const radius = parseFloat(req.query.radius) || 2; // Default radius is 2km

            if (
                !isNaN(userLatitude) &&
                !isNaN(userLongitude) &&
                !isNaN(itemLatitude) &&
                !isNaN(itemLongitude)
            ) {
                const distance = calculateDistance(
                    userLatitude,
                    userLongitude,
                    itemLatitude,
                    itemLongitude
                );
                if (distance > radius) {
                    return false;
                }
            }

            // Additional field-based filtering (example: search by 'field_name')
            if (
                req.query.field_name &&
                item.field_name !== req.query.field_name
            ) {
                return false;
            }

            // Add more field-based filters as needed

            return true;
        });

        // Pagination
        const pageSize = parseInt(req.query.page_size) || 100;
        const page = parseInt(req.query.page) || 1;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        res.json(paginatedData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;