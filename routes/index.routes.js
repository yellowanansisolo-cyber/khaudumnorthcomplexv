const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const cvUpload = require('../middleware/cvUpload');
const fetchPageMeta = require('../middleware/fetchPageMeta');

// Defines the routes for the main pages of the website
router.get('/', pageController.getHomePage); // Homepage doesn't use the banner, so no middleware needed

// --- APPLY THE MIDDLEWARE to all routes that use the standard page hero ---
router.get('/about', fetchPageMeta, pageController.getAboutPage);
router.get('/contact', fetchPageMeta, pageController.getContactPage);
router.get('/gallery', fetchPageMeta, pageController.getGalleryPage);
router.get('/news', fetchPageMeta, pageController.getNewsPage);
router.get('/resources', fetchPageMeta, pageController.getResourcesPage);
router.get('/donation', fetchPageMeta, pageController.getDonationPage);
router.get('/natural-resources', fetchPageMeta, pageController.getNaturalResourcesPage);
router.get('/youth-forum', fetchPageMeta, pageController.getYouthForumPage);
router.get('/events', fetchPageMeta, pageController.getEventsPage);
router.get('/jobs', fetchPageMeta, pageController.getJobsPage);

// --- Dynamic Conservancy Pages ---
// This regex ensures this route only matches 'gmc' or 'mnc'
router.get('/:slug(gmc|mnc)', pageController.getConservancyPage);

// --- Routes that don't need it or handle it manually ---
router.post('/contact', pageController.postContactForm);
router.get('/news/:slug', pageController.getSingleNews); // Handles meta manually
router.post('/donation', pageController.postDonation);
router.post('/subscribe', pageController.subscribeNewsletter);
router.get('/jobs/:slug', pageController.getSingleJob); // Handles meta manually
router.post('/jobs/:slug', cvUpload.single('cv'), pageController.submitApplication);


module.exports = router;