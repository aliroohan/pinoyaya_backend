const certificateModel = require('../models/certificate');
const { uploadImage, deleteImage, getAccountUrl } = require('./s3Service');

exports.createCertificate = async ({ babysitterId, type, fileBuffer, originalName, mimetype }) => {
    const certUrl = await uploadImage(fileBuffer, originalName, mimetype);
    const certificate = new certificateModel({ babysitterId, type, certUrl });
    await certificate.save();
    return certificate;
}

exports.getCertificatesByBabysitter = async (babysitterId) => {
    const certificates = await certificateModel.find({ babysitterId });
    return certificates;
}

exports.deleteCertificate = async (certificateId) => {
    await certificateModel.findByIdAndDelete(certificateId);
    const certificate = await certificateModel.findById(certificateId);
    let key = certificate.certUrl.split('/').pop();
    const s3url = await getAccountUrl();
    key = key.replace(s3url, '');
    await deleteImage(key);
    return { message: 'Certificate deleted successfully' };
}