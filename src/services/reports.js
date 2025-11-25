const Reports = require("../models/reports");

exports.createReport = async (report) => {
    const newReport = new Reports(report);
    return await newReport.save();
}

exports.getAllReports = async () => {
    return await Reports.find();
}

exports.getReportById = async (id) => {
    return await Reports.findById(id);
}

exports.getReportsByStatus = async (status) => {
    return await Reports.find({ status: status });
}

exports.updateReport = async (id, report) => {
    return await Reports.findByIdAndUpdate(id, report, { new: true });
}

exports.deleteReport = async (id) => {
    return await Reports.findByIdAndDelete(id);
}
