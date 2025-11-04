const Project = require('../models/project.model');
const News = require('../models/news.model');
const Testimonial = require('../models/testimonial.model');
const Gallery = require('../models/gallery.model');
const Document = require('../models/document.model');
const NaturalResource = require('../models/naturalResource.model');
const YouthInitiative = require('../models/youthInitiative.model');
const TeamMember = require('../models/teamMember.model');
const Partner = require('../models/partner.model');
const Subscriber = require('../models/subscriber.model');
const Donation = require('../models/donation.model');
const Event = require('../models/event.model');
const Job = require('../models/job.model');
const Application = require('../models/application.model');
const PageMeta = require('../models/pageMeta.model');
const ContentBlock = require('../models/contentBlock.model');
const ConservancyPage = require('../models/conservancyPage.model');

// --- HOME PAGE ---
exports.getHomePage = async (req, res) => {
    try {
        const featuredProjects = await Project.find().sort({ createdAt: -1 }).limit(3);
        const latestNews = await News.find().sort({ createdAt: -1 }).limit(3);
        const testimonials = await Testimonial.find({ isActive: true }).sort({ displayOrder: 1 }).limit(3);

        const contentBlocks = await ContentBlock.find({ pageIdentifier: 'home' });
        const homeContent = contentBlocks.reduce((obj, item) => {
            obj[item.sectionIdentifier] = item.content;
            return obj;
        }, {});

        res.render('index', {
            title: 'Home',
            projects: featuredProjects,
            news: latestNews,
            testimonials,
            homeContent
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// --- STATIC PAGES ---
exports.getAboutPage = async (req, res) => {
    try {
        const teamMembers = await TeamMember.find().sort({ displayOrder: 1 });
        const partners = await Partner.find().sort({ displayOrder: 1 });
        res.render('about', { 
            title: res.locals.pageMeta.title,
            teamMembers, 
            partners 
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getContactPage = (req, res) => res.render('contact', { title: res.locals.pageMeta.title });
exports.getDonationPage = (req, res) => res.render('donation', { title: res.locals.pageMeta.title });

exports.postDonation = async (req, res) => {
    try {
        const { amount, donorName, donorEmail } = req.body;
        await Donation.create({ amount, donorName, donorEmail });
        res.render('donation-success', { title: 'Thank You!' });
    } catch (err) {
        res.status(500).send('Error processing donation.');
    }
};

// --- GALLERY PAGE ---
exports.getGalleryPage = async (req, res) => {
    try {
        const galleryData = await Gallery.find().sort({ createdAt: -1 });
        res.render('gallery', { 
            title: res.locals.pageMeta.title,
            mediaItems: galleryData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// --- RESOURCES PAGE ---
exports.getResourcesPage = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.render('resources', {
            title: res.locals.pageMeta.title,
            documents: documents
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// --- CONTACT FORM ---
exports.postContactForm = (req, res) => {
    const { name, email, message } = req.body;
    console.log(`New message from ${name} (${email}): ${message}`);
    res.redirect('/contact?status=success');
};

// --- NEWS PAGES ---
exports.getNewsPage = async (req, res) => {
    try {
        const articles = await News.find().sort({ createdAt: -1 });
        res.render('news', { title: res.locals.pageMeta.title, articles });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.getSingleNews = async (req, res, next) => {
    try {
        const article = await News.findOne({ slug: req.params.slug });
        if (!article) return next();
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        
        const parentPageMeta = await PageMeta.findOne({ pageIdentifier: '/news' });

        res.render('news-detail', { 
            title: article.title, 
            article,
            metaDescription: article.metaDescription,
            fullUrl,
            heroImage: parentPageMeta ? parentPageMeta.heroImage : '/images/default-hero.jpg'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// --- NEWSLETTER ---
exports.subscribeNewsletter = async (req, res) => {
    try {
        await Subscriber.create({ email: req.body.email });
        res.redirect('/?subscribe=success');
    } catch (err) {
        console.error(err);
        res.redirect('/?subscribe=fail');
    }
};

// --- EVENTS ---
exports.getEventsPage = async (req, res) => {
    try {
        const events = await Event.find({ startDate: { $gte: new Date() } }).sort({ startDate: 1 });
        res.render('events', { title: res.locals.pageMeta.title, events });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// --- JOBS ---
exports.getJobsPage = async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true, closingDate: { $gte: new Date() } }).sort({ closingDate: 1 });
        res.render('jobs', { title: res.locals.pageMeta.title, jobs });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getSingleJob = async (req, res, next) => {
    try {
        const job = await Job.findOne({ slug: req.params.slug, isActive: true });
        if (!job) return next();
        
        const parentPageMeta = await PageMeta.findOne({ pageIdentifier: '/jobs' });

        res.render('job-detail', { 
            title: job.title, 
            job, 
            heroImage: parentPageMeta ? parentPageMeta.heroImage : '/images/default-hero.jpg'
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.submitApplication = async (req, res) => {
    try {
        const job = await Job.findOne({ slug: req.params.slug });
        if (!job) return res.status(404).send('Job not found.');
        if (!req.file) return res.status(400).send('CV file is required.');

        await Application.create({
            job: job._id,
            applicantName: req.body.applicantName,
            applicantEmail: req.body.applicantEmail,
            coverLetter: req.body.coverLetter,
            cvPath: req.file.path
        });

        res.render('application-success', { title: 'Application Submitted' });
    } catch(err) {
        console.error(err);
        res.status(500).send('Error submitting application');
    }
};

// --- DYNAMIC CONSERVANCY PAGE ---
exports.getConservancyPage = async (req, res, next) => {
    try {
        const conservancy = await ConservancyPage.findOne({ identifier: req.params.slug });
        if (!conservancy) {
            return next(); // Goes to 404 handler
        }
        res.render('conservancy-detail', {
            title: conservancy.name,
            conservancy
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// --- YOUTH FORUM PAGE ---
exports.getYouthForumPage = async (req, res) => {
    try {
        const initiatives = await YouthInitiative.find().sort({ createdAt: -1 });
        res.render('youth-forum', {
            title: res.locals.pageMeta.title,
            initiatives: initiatives
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// --- NATURAL RESOURCES PAGE ---
exports.getNaturalResourcesPage = async (req, res) => {
    try {
        const resources = await NaturalResource.find().sort({ createdAt: -1 });
        res.render('natural-resources', {
            title: res.locals.pageMeta.title,
            resources: resources
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};