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

/**
 * @swagger
 *  /api/unique-by-column/{columnName}:
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
 * /api/search:
 *   get:
 *     summary: Search CSV data based on query parameters
 *     tags: [CSV Operations]
 *     parameters:
 *       - in: query
 *         name: notificationNumber
 *         schema:
 *           type: string
 *         description: Notification number for filtering
 *       - in: query
 *         name: referenceNumber
 *         schema:
 *           type: string
 *         description: Reference number for filtering
 *       - in: query
 *         name: directorate
 *         schema:
 *           type: string
 *         description: Directorate for filtering
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Branch for filtering
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department for filtering
 *       - in: query
 *         name: causeCode
 *         schema:
 *           type: string
 *         description: Cause code for filtering
 *       - in: query
 *         name: causeCodeGroup
 *         schema:
 *           type: string
 *         description: Cause code group for filtering
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Code for filtering
 *       - in: query
 *         name: hexId
 *         schema:
 *           type: string
 *         description: Hex ID for filtering
 *       - in: query
 *         name: officialSuburb
 *         schema:
 *           type: string
 *         description: Official suburb for filtering
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *         description: Section for filtering
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
 *         name: creation_start_date
 *         schema:
 *           type: string
 *         description: Start date for creation date range filtering
 *       - in: query
 *         name: creation_end_date
 *         schema:
 *           type: string
 *         description: End date for creation date range filtering
 *       - in: query
 *         name: completion_start_date
 *         schema:
 *           type: string
 *         description: Start date for completion date range filtering
 *       - in: query
 *         name: completion_end_date
 *         schema:
 *           type: string
 *         description: End date for completion date range filtering
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *         description: Number of items per page for pagination
 *       - in: query
 *         name: page_number
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

        const filteredData = searchData.filter((item) => {
            // Date range filtering for creation_timestamp
            const creationTimestamp = new Date(item.creation_timestamp);
            const startDateCreation = new Date(req.query.creation_start_date);
            const endDateCreation = new Date(req.query.creation_end_date);
            if (
                !isNaN(creationTimestamp.getTime()) &&
                !isNaN(startDateCreation.getTime()) &&
                !isNaN(endDateCreation.getTime()) &&
                (creationTimestamp < startDateCreation || creationTimestamp > endDateCreation)
            ) {
                return false;
            }

            // Date range filtering for completion_timestamp
            const completionTimestamp = new Date(item.completion_timestamp);
            const startDateCompletion = new Date(req.query.completion_start_date);
            const endDateCompletion = new Date(req.query.completion_end_date);
            if (
                !isNaN(completionTimestamp.getTime()) &&
                !isNaN(startDateCompletion.getTime()) &&
                !isNaN(endDateCompletion.getTime()) &&
                (completionTimestamp < startDateCompletion || completionTimestamp > endDateCompletion)
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

            // Additional field-based filtering
            if (req.query.notificationNumber && item.notification_number !== req.query.notificationNumber) {
                return false;
            }
            if (req.query.referenceNumber && item.reference_number !== req.query.referenceNumber) {
                return false;
            }
            if (req.query.directorate && item.directorate !== req.query.directorate) {
                return false;
            }
            if (req.query.branch && item.branch !== req.query.branch) {
                return false;
            }
            if (req.query.department && item.department !== req.query.department) {
                return false;
            }
            if (req.query.causeCode && item.cause_code !== req.query.causeCode) {
                return false;
            }
            if (req.query.causeCodeGroup && item.cause_code_group !== req.query.causeCodeGroup) {
                return false;
            }
            if (req.query.code && item.code !== req.query.code) {
                return false;
            }
            if (req.query.hexId && item.h3_level8_index !== req.query.hexId) {
                return false;
            }
            if (req.query.officialSuburb && item.official_suburb !== req.query.officialSuburb) {
                return false;
            }
            if (req.query.section && item.section !== req.query.section) {
                return false;
            }

            return true;
        });

        // Pagination
        const pageSize = parseInt(req.query.page_size) || 100;
        const page = parseInt(req.query.page_number) || 1;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        res.json(paginatedData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}



module.exports = router;