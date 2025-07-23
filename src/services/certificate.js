const Certificate = require('../models/Certificate');
const { uploadImage, deleteImage, getAccountUrl } = require('./s3Service');

exports.createCertificate = async ({ babysitterId, type, fileBuffer, originalName, mimetype }) => {
    const certUrl = await uploadImage(fileBuffer, originalName, mimetype);
    const certificate = new Certificate({ babysitterId, type, certUrl });
    await certificate.save();
    return certificate;
}

exports.getCertificatesByBabysitter = async (babysitterId) => {
    const certificates = await Certificate.find({ babysitterId });
    return certificates;
}

exports.deleteCertificate = async (certificateId) => {
    await Certificate.findByIdAndDelete(certificateId);
    const certificate = await Certificate.findById(certificateId);
    let key = certificate.certUrl.split('/').pop();
    const s3url = await getAccountUrl();
    key = key.replace(s3url, '');
    await deleteImage(key);
    return { message: 'Certificate deleted successfully' };
}