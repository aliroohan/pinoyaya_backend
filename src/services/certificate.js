const certificate = require('../models/certificate');
const { uploadImage, deleteImage, getAccountUrl } = require('./s3Service');

exports.createCertificate = async ({ babysitterId, type, fileBuffer, originalName, mimetype }) => {
    const certUrl = await uploadImage(fileBuffer, originalName, mimetype);
    const certificate = new certificate({ babysitterId, type, certUrl });
    await certificate.save();
    return certificate;
}

exports.getCertificatesByBabysitter = async (babysitterId) => {
    const certificates = await certificate.find({ babysitterId });
    return certificates;
}

exports.deleteCertificate = async (certificateId) => {
    await certificate.findByIdAndDelete(certificateId);
    const certificate = await certificate.findById(certificateId);
    let key = certificate.certUrl.split('/').pop();
    const s3url = await getAccountUrl();
    key = key.replace(s3url, '');
    await deleteImage(key);
    return { message: 'Certificate deleted successfully' };
}