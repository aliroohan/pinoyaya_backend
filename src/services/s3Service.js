const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();
const BUCKET = process.env.AWS_S3_BUCKET;
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`,
    forcePathStyle: false
});


/**
 * Uploads an image buffer to S3 and returns the file URL
 * @param {Buffer} buffer - The file buffer
 * @param {string} originalName - The original file name
 * @param {string} mimetype - The file mimetype
 * @returns {Promise<string>} - The S3 file URL
 */
async function uploadImage(buffer, originalName, mimetype) {
    const key = `${uuidv4()}-${originalName}`;
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read',
    });
    await s3.send(command);
    return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

async function deleteImage(key) {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
    });
    await s3.send(command);
}

async function getAccountUrl() {
    return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
}

module.exports = { uploadImage, deleteImage, getAccountUrl }; 