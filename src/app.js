const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes');
const multer = require('multer');
const connectDB = require('./config/mongoose');
const upload = multer();
const { uploadImage } = require('./services/s3Service');

dotenv.config();

connectDB();

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/api/test-upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const url = await uploadImage(req.file.buffer, req.file.originalname, req.file.mimetype);
        res.json({ url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/api', routes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});