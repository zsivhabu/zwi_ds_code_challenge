const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv').config()

const credentials = {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
};


const s3Client = new S3Client({ credentials, region:  process.env.AWS_S3_REGION});
const bucketName =  process.env.AWS_S3_BUCKET_NAME;

async function getObject(key) {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    try {
        return await s3Client.send(command);
    } catch (err) {
        console.error('Error getting object from S3:', err);
        throw err;
    }
}

module.exports = { getObject };

