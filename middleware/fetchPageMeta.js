const PageMeta = require('../models/pageMeta.model');

const fetchPageMeta = async (req, res, next) => {
    try {
        // Use req.path to get the URL path (e.g., '/about', '/projects')
        const pageMeta = await PageMeta.findOne({ pageIdentifier: req.path });
        
        // Make the pageMeta object available to all downstream middleware and templates
        if (pageMeta) {
            res.locals.pageMeta = pageMeta;
        } else {
            // Provide a fallback object to prevent errors on pages without meta entries
            res.locals.pageMeta = {
                title: 'Khaudum North Complex',
                heroImage: '/images/default-hero.jpg',
                metaDescription: 'Digital Platform for the Khaudum North Complex Conservancies.'
            };
        }
    } catch (error) {
        console.error("Error fetching page metadata:", error);
        // Still provide a fallback on error
        res.locals.pageMeta = {
            title: 'Error',
            heroImage: '/images/default-hero.jpg',
        };
    }
    next(); // Move on to the next function in the chain (the actual controller)
};

module.exports = fetchPageMeta;