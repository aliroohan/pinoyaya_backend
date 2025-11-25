const reportService = require("../services/reports");

exports.createReport = async (req, res) => {
    try {
        const report = await reportService.createReport(req.body);
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await reportService.getAllReports();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
    

exports.getReportById = async (req, res) => {
    try {
        const report = await reportService.getReportById(req.params.id);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReportsByStatus = async (req, res) => {
    try {
        const reports = await reportService.getReportsByStatus(req.params.status);
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.updateReport = async (req, res) => {
    try {
        const report = await reportService.updateReport(req.params.id, req.body);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteReport = async (req, res) => {
    try {
        const report = await reportService.deleteReport(req.params.id);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}