const express = require('express');
const { addSalary, updateSalary, listSalaries,deleteSalary } = require('../controllers/salaryController');
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// POST: Add a salary record
router.post("/", authMiddleware, addSalary);

// PUT: Update a salary record
router.put("/:id", authMiddleware, updateSalary);

// GET: List salary records
router.get("/", authMiddleware, listSalaries);

router.delete('/:id', authMiddleware, deleteSalary);

module.exports = router;
