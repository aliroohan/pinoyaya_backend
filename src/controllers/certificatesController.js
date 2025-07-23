const { createCertificate } = require('../services/certificate');
const multer = require('multer');
const upload = multer();

exports.create = [
    upload.single('file'),
    async (req, res) => {
        try {
            const { type } = req.body;
            const babysitterId = req.user._id;
            if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
            if (!type) return res.status(400).json({ error: 'Certificate type is required' });
            const certificate = await createCertificate({
                babysitterId,
                type,
                fileBuffer: req.file.buffer,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype
            });
            res.status(201).json(certificate);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];
exports.getByBabysitter = async (req, res) =>{
    try {
        const { babysitterId } = req.params;
        const certificates = await getCertificatesByBabysitter(babysitterId);
        res.status(200).json(certificates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteCertificate(id);
        res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}