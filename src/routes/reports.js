const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const reportsController = require("../controllers/reportsController");

router.post("/", reportsController.createReport);
router.get("/", adminAuth, reportsController.getAllReports);
router.get("/status/:status", adminAuth, reportsController.getReportsByStatus);
router.get("/:id", reportsController.getReportById);
router.put("/:id", reportsController.updateReport);
router.delete("/:id", reportsController.deleteReport);

module.exports = router;