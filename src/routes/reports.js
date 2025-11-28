const express = require("express");
const router = express.Router();
const {adminAuth, checkRole} = require("../middleware/adminAuth");
const reportsController = require("../controllers/reportsController");

router.post("/", reportsController.createReport);
router.get("/", adminAuth, checkRole(['admin', "reports"]), reportsController.getAllReports);
router.get("/status/:status", adminAuth, checkRole(['admin', "reports"]), reportsController.getReportsByStatus);
router.get("/:id", adminAuth, checkRole(['admin', "reports"]), reportsController.getReportById);
router.put("/:id", adminAuth, checkRole(['admin', "reports"]), reportsController.updateReport);
router.delete("/:id", adminAuth, checkRole(['admin', "reports"]), reportsController.deleteReport);

module.exports = router;