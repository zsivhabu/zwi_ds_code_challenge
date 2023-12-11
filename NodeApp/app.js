const express = require('express');
const { getObject } = require('./services/s3Service');
const apiRoutes = require('./services/apiService');
const chartRoutes = require('./services/chartService');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const dotenv = require('dotenv').config()

const app = express();
const port = 3000;
const filePath = 'sr_hex.csv.gz';
const filesFolder = './s3files';
const localFilePath = path.join(filesFolder, 'sr_hex.csv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions');

if (!fs.existsSync(filesFolder)) {
    fs.mkdirSync(filesFolder);
}

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api', apiRoutes);
app.use('/api', chartRoutes);

downloadAndUnzipFile().then(() => {
    app.listen(port, () => {
        console.log(`App listening at  ${process.env.API_BASE_URL}`);

    });
});

async function downloadAndUnzipFile() {
    try {
        // Check if the local file already exists
        if (!fs.existsSync(localFilePath)) {
            const s3Object = await getObject(filePath);

            // Access the S3 object content as a readable stream
            const gzippedContent = s3Object.Body;

            // Ensure the download folder exists
            if (!fs.existsSync(filesFolder)) {
                fs.mkdirSync(filesFolder);
            }

            // Create a writable stream to save the gzipped file locally
            const fileStream = fs.createWriteStream(localFilePath + '.gz');
            gzippedContent.pipe(fileStream);

            await new Promise((resolve, reject) => {
                fileStream.on('finish', resolve);
                fileStream.on('error', reject);
            });

            console.log(`Gzipped file downloaded and saved locally to: ${localFilePath}.gz`);

            // Unzip the downloaded gzipped file
            const gzippedContentBuffer = fs.readFileSync(localFilePath + '.gz');
            const unzippedContent = zlib.gunzipSync(gzippedContentBuffer);

            // Save the unzipped content to the final local file
            fs.writeFileSync(localFilePath, unzippedContent);

            // Remove the downloaded gzipped file
            fs.unlinkSync(localFilePath + '.gz');

            console.log(`File unzipped and saved locally to: ${localFilePath}`);
        } else {
            console.log(`Local file already exists at: ${localFilePath}`);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}