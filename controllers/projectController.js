const Project = require('../models/project.model');
const PageMeta = require('../models/pageMeta.model');

// --- GET ALL PROJECTS (LIST VIEW) ---
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.render('projects', { 
            title: res.locals.pageMeta.title, 
            projects: projects 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// --- GET A SINGLE PROJECT (DETAIL VIEW) ---
exports.getSingleProject = async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug });
        if (!project) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        
        // Fetch the parent page's meta to get the correct hero BACKGROUND IMAGE
        const parentPageMeta = await PageMeta.findOne({ pageIdentifier: '/projects' });
        
        res.render('project-detail', { 
            title: project.name, // This will be used for the hero title
            project: project,
            fullUrl,
            // Pass ONLY the hero image, not the whole pageMeta object
            heroImage: parentPageMeta ? parentPageMeta.heroImage : '/images/default-hero.jpg'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};