const express = require('express');
const router = express.Router();

// --- Import Controllers and Middleware ---
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/multer');
const documentUpload = require('../middleware/documentUpload');
const videoUpload = require('../middleware/videoUpload');

// --- Auth Routes (Public) ---
router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// --- Middleware Guard ---
router.use(protect);

// --- Main Admin Routes ---
router.get('/dashboard', adminController.getDashboard);

// --- Page Meta & Content Management Routes ---
const techManagerOnly = restrictTo('Technical Manager');

router.get('/content/homepage', techManagerOnly, adminController.getHomePageContentAdmin);
router.post(
    '/content/homepage', 
    techManagerOnly, 
    upload.fields([
        { name: 'home_about_image_1', maxCount: 1 },
        { name: 'home_about_image_2', maxCount: 1 }
    ]), 
    adminController.updateHomePageContent
);

router.get('/pages', techManagerOnly, adminController.getPagesAdmin);
router.get('/pages/edit/:id', techManagerOnly, adminController.getEditPageForm);
router.post('/pages/edit/:id', techManagerOnly, upload.single('heroImage'), adminController.updatePage);

// --- Project Management Routes ---
router.get('/projects', techManagerOnly, adminController.getProjectsAdmin);
router.get('/projects/add', techManagerOnly, adminController.getAddProjectForm);
router.post('/projects/add', techManagerOnly, upload.single('coverImage'), adminController.createProject);
router.get('/projects/edit/:id', techManagerOnly, adminController.getEditProjectForm);
router.post('/projects/edit/:id', techManagerOnly, upload.single('coverImage'), adminController.updateProject);
router.get('/projects/delete/:id', techManagerOnly, adminController.deleteProject);

// --- News Management Routes ---
const newsPermissions = restrictTo('Technical Manager', 'Manager', 'Chairperson');
router.get('/news', newsPermissions, adminController.getNewsAdmin);
router.get('/news/add', newsPermissions, adminController.getAddNewsForm);
router.post('/news/add', newsPermissions, upload.single('featuredImage'), adminController.createNews);
router.get('/news/edit/:id', newsPermissions, adminController.getEditNewsForm);
router.post('/news/edit/:id', newsPermissions, upload.single('featuredImage'), adminController.updateNews);
router.get('/news/delete/:id', newsPermissions, adminController.deleteNews);

// --- Testimonial Management ---
router.get('/testimonials', techManagerOnly, adminController.getTestimonialsAdmin);
router.get('/testimonials/add', techManagerOnly, adminController.getAddTestimonialForm);
router.post('/testimonials/add', techManagerOnly, adminController.createTestimonial);
router.get('/testimonials/edit/:id', techManagerOnly, adminController.getEditTestimonialForm);
router.post('/testimonials/edit/:id', techManagerOnly, adminController.updateTestimonial);
router.get('/testimonials/delete/:id', techManagerOnly, adminController.deleteTestimonial);

// --- User Management Route ---
router.get('/users', techManagerOnly, adminController.getUsersAdmin);
router.get('/users/add', techManagerOnly, adminController.getAddUserForm);
router.post('/users/add', techManagerOnly, adminController.createUser);
router.get('/users/edit/:id', techManagerOnly, adminController.getEditUserForm);
router.post('/users/edit/:id', techManagerOnly, adminController.updateUser);
router.get('/users/delete/:id', techManagerOnly, adminController.deleteUser);

// --- Gallery Management Routes ---
router.get('/gallery', adminController.getGalleryAdmin);
router.post('/gallery/upload-image', upload.single('mediaFile'), adminController.uploadGalleryMedia);
router.post('/gallery/upload-video', videoUpload.single('mediaFile'), adminController.uploadGalleryMedia);
router.get('/gallery/delete/:id', adminController.deleteGalleryMedia);
router.get('/gallery/edit/:id', adminController.getEditGalleryItemForm);
router.post('/gallery/edit/:id', adminController.updateGalleryItem);

// --- Resource (Download) Management Routes ---
const resourcePermissions = restrictTo('Technical Manager', 'Manager');
router.get('/resources', resourcePermissions, adminController.getResourcesAdmin);
router.post('/resources/upload', resourcePermissions, documentUpload.single('documentFile'), adminController.uploadResource);
router.get('/resources/delete/:id', resourcePermissions, adminController.deleteResource);
router.get('/resources/edit/:id', resourcePermissions, adminController.getEditResourceForm);
router.post('/resources/edit/:id', resourcePermissions, adminController.updateResource);

// --- Youth Initiative Management Routes ---
const youthPermissions = restrictTo('Technical Manager', 'Manager');
router.get('/youth', youthPermissions, adminController.getYouthAdmin);
router.get('/youth/add', youthPermissions, adminController.getAddYouthForm);
router.post('/youth/add', youthPermissions, upload.single('coverImage'), adminController.createYouthInitiative);
router.get('/youth/edit/:id', youthPermissions, adminController.getEditYouthForm);
router.post('/youth/edit/:id', youthPermissions, upload.single('coverImage'), adminController.updateYouthInitiative);
router.get('/youth/delete/:id', youthPermissions, adminController.deleteYouthInitiative);

// --- Natural Resource Management Routes ---
router.get('/natural-resources', techManagerOnly, adminController.getNaturalResourcesAdmin);
router.get('/natural-resources/add', techManagerOnly, adminController.getAddNaturalResourceForm);
router.post('/natural-resources/add', techManagerOnly, upload.single('coverImage'), adminController.createNaturalResource);
router.get('/natural-resources/edit/:id', techManagerOnly, adminController.getEditNaturalResourceForm);
router.post('/natural-resources/edit/:id', techManagerOnly, upload.single('coverImage'), adminController.updateNaturalResource);
router.get('/natural-resources/delete/:id', techManagerOnly, adminController.deleteNaturalResource);


// --- Team & Partner Management ---
router.get('/team', techManagerOnly, adminController.getTeamAdmin);
router.get('/team/add', techManagerOnly, adminController.getAddTeamMemberForm);
router.post('/team/add', techManagerOnly, upload.single('photo'), adminController.createTeamMember);
router.get('/team/edit/:id', techManagerOnly, adminController.getEditTeamMemberForm);
router.post('/team/edit/:id', techManagerOnly, upload.single('photo'), adminController.updateTeamMember);
router.get('/team/delete/:id', techManagerOnly, adminController.deleteTeamMember);

router.get('/partners', techManagerOnly, adminController.getPartnersAdmin);
router.get('/partners/add', techManagerOnly, adminController.getAddPartnerForm);
router.post('/partners/add', techManagerOnly, upload.single('logo'), adminController.createPartner);
router.get('/partners/edit/:id', techManagerOnly, adminController.getEditPartnerForm);
router.post('/partners/edit/:id', techManagerOnly, upload.single('logo'), adminController.updatePartner);
router.get('/partners/delete/:id', techManagerOnly, adminController.deletePartner);

// --- Conservancy Page Management ---
router.get('/conservancies', techManagerOnly, adminController.getConservanciesAdmin);
router.get('/conservancies/edit/:id', techManagerOnly, adminController.getEditConservancyForm);
router.post(
    '/conservancies/edit/:id', 
    techManagerOnly, 
    upload.fields([
        { name: 'heroImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 5 } // Allow uploading up to 5 gallery images at once
    ]), 
    adminController.updateConservancy
);
router.post('/conservancies/:id/delete-image/:imageId', techManagerOnly, adminController.deleteConservancyGalleryImage);

// --- Job & Application Management ---
const jobPermissions = restrictTo('Technical Manager', 'Manager');
router.get('/jobs', jobPermissions, adminController.getJobsAdmin);
router.get('/jobs/add', jobPermissions, adminController.getAddJobForm);
router.post('/jobs/add', jobPermissions, adminController.createJob);
router.get('/jobs/applications/:jobId', jobPermissions, adminController.getJobApplications);
router.get('/applications/:id/download', jobPermissions, adminController.downloadCV);

// --- Export the router ---
module.exports = router;