const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const fetchPageMeta = require('../middleware/fetchPageMeta'); // <-- 1. IMPORT

// --- 2. APPLY THE MIDDLEWARE to the main projects listing page ---
router.get('/', fetchPageMeta, projectController.getAllProjects);
router.get('/:slug', projectController.getSingleProject); // Detail page handles meta manually

module.exports = router;