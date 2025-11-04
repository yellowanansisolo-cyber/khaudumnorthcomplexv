const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// Import all models
const Project = require('../models/project.model');
const News = require('../models/news.model');
const User = require('../models/user.model');
const Gallery = require('../models/gallery.model');
const Document = require('../models/document.model');
const TeamMember = require('../models/teamMember.model');
const Partner = require('../models/partner.model');
const Subscriber = require('../models/subscriber.model');
const Donation = require('../models/donation.model');
const Event = require('../models/event.model');
const Job = require('../models/job.model');
const Application = require('../models/application.model');
const YouthInitiative = require('../models/youthInitiative.model');
const NaturalResource = require('../models/naturalResource.model');
const PageMeta = require('../models/pageMeta.model');
const Testimonial = require('../models/testimonial.model');
const ContentBlock = require('../models/contentBlock.model');
const ConservancyPage = require('../models/conservancyPage.model');


// --- Dashboard ---
exports.getDashboard = (req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard' });
};

// --- Homepage Content Management ---
exports.getHomePageContentAdmin = async (req, res) => {
    try {
        const blocks = await ContentBlock.find({ pageIdentifier: 'home' });
        const content = blocks.reduce((obj, item) => {
            obj[item.sectionIdentifier] = item.content;
            return obj;
        }, {});
        res.render('admin/edit-home-content', { title: 'Manage Homepage Content', content });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateHomePageContent = async (req, res) => {
    try {
        const textContentData = req.body;
        for (const [key, value] of Object.entries(textContentData)) {
            await ContentBlock.findOneAndUpdate(
                { pageIdentifier: 'home', sectionIdentifier: key },
                { content: value },
                { upsert: true }
            );
        }

        if (req.files) {
            for (const [fieldName, fileArray] of Object.entries(req.files)) {
                if (fileArray && fileArray.length > 0) {
                    const file = fileArray[0];
                    const newImagePath = `/uploads/images/${file.filename}`;
                    
                    const oldBlock = await ContentBlock.findOne({
                        pageIdentifier: 'home',
                        sectionIdentifier: fieldName
                    });

                    if (oldBlock && oldBlock.content && oldBlock.content.startsWith('/uploads/')) {
                        const oldPath = path.join(__dirname, '..', 'public', oldBlock.content);
                        fs.unlink(oldPath, err => {
                            if (err) console.error(`Failed to delete old image: ${oldPath}`, err);
                        });
                    }
                    
                    await ContentBlock.findOneAndUpdate(
                        { pageIdentifier: 'home', sectionIdentifier: fieldName },
                        { content: newImagePath },
                        { upsert: true }
                    );
                }
            }
        }
        
        res.redirect('/admin/content/homepage');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating homepage content');
    }
};


// --- Page Meta / Banners Management ---
exports.getPagesAdmin = async (req, res) => {
    try {
        const pages = await PageMeta.find().sort({ pageIdentifier: 1 });
        res.render('admin/manage-pages', { title: 'Manage Page Banners', pages });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getEditPageForm = async (req, res) => {
    try {
        const page = await PageMeta.findById(req.params.id);
        if (!page) {
            return res.redirect('/admin/pages');
        }
        res.render('admin/edit-page', { title: `Edit Page: ${page.pageIdentifier}`, page });
    } catch (err) {
        res.redirect('/admin/pages');
    }
};

exports.updatePage = async (req, res) => {
    try {
        const page = await PageMeta.findById(req.params.id);
        if (!page) {
            return res.status(404).send('Page metadata not found');
        }

        page.title = req.body.title;
        page.metaDescription = req.body.metaDescription;

        if (req.file) {
            if (page.heroImage && !page.heroImage.includes('default')) {
                const oldPath = path.join(__dirname, '..', 'public', page.heroImage);
                fs.unlink(oldPath, err => {
                    if (err) console.error("Could not delete old hero image:", err);
                });
            }
            page.heroImage = `/uploads/images/${req.file.filename}`;
        }

        await page.save();
        res.redirect('/admin/pages');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating page details');
    }
};


// --- Project Management ---
exports.getProjectsAdmin = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.render('admin/manage-projects', { title: 'Manage Projects', projects });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.getAddProjectForm = (req, res) => {
    res.render('admin/edit-project', { title: 'Add New Project', project: {} });
};

exports.createProject = async (req, res) => {
    try {
        const { name, description, purpose, status, metaDescription } = req.body;
        const newProject = new Project({
            name, description, purpose, status, metaDescription,
            slug: slugify(name, { lower: true, strict: true }),
            coverImage: req.file ? `/uploads/images/${req.file.filename}` : '/images/default.jpg'
        });
        await newProject.save();
        res.redirect('/admin/projects');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating project");
    }
};

exports.getEditProjectForm = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.redirect('/admin/projects');
        }
        res.render('admin/edit-project', { title: `Edit Project: ${project.name}`, project });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/projects');
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send('Project not found');
        }

        project.name = req.body.name;
        project.description = req.body.description;
        project.purpose = req.body.purpose;
        project.status = req.body.status;
        project.metaDescription = req.body.metaDescription;
        project.slug = slugify(req.body.name, { lower: true, strict: true });

        if (req.file) {
            if (project.coverImage && project.coverImage !== '/images/default.jpg') {
                const oldPath = path.join(__dirname, '..', 'public', project.coverImage);
                fs.unlink(oldPath, err => {
                    if (err) console.error("Could not delete old project image:", err);
                });
            }
            project.coverImage = `/uploads/images/${req.file.filename}`;
        }

        await project.save();
        res.redirect('/admin/projects');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating project');
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project && project.coverImage && project.coverImage !== '/images/default.jpg') {
            const fullFilePath = path.join(__dirname, '..', 'public', project.coverImage);
            fs.unlink(fullFilePath, err => {
                if (err) console.error("Error deleting project image file:", err);
            });
        }
        await Project.findByIdAndDelete(req.params.id);
        res.redirect('/admin/projects');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting project');
    }
};

// --- News Management ---
exports.getNewsAdmin = async (req, res) => {
    try {
        const articles = await News.find().sort({ createdAt: -1 });
        res.render('admin/manage-news', { title: 'Manage News', articles });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.getAddNewsForm = (req, res) => {
    res.render('admin/edit-news', { title: 'Add New Article', article: {} });
};

exports.createNews = async (req, res) => {
    try {
        const { title, content, category, author, metaDescription } = req.body;
        const newArticle = new News({
            title, content, category, author, metaDescription,
            slug: slugify(title, { lower: true, strict: true }),
            featuredImage: req.file ? `/uploads/images/${req.file.filename}` : '/images/default-news.jpg'
        });
        await newArticle.save();
        res.redirect('/admin/news');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating article");
    }
};

exports.getEditNewsForm = async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) {
            return res.redirect('/admin/news');
        }
        res.render('admin/edit-news', { title: `Edit Article: ${article.title}`, article });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/news');
    }
};

exports.updateNews = async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }

        article.title = req.body.title;
        article.content = req.body.content;
        article.category = req.body.category;
        article.author = req.body.author;
        article.metaDescription = req.body.metaDescription;
        article.slug = slugify(req.body.title, { lower: true, strict: true });

        if (req.file) {
            if (article.featuredImage && article.featuredImage !== '/images/default-news.jpg') {
                const oldPath = path.join(__dirname, '..', 'public', article.featuredImage);
                fs.unlink(oldPath, err => {
                    if (err) console.error("Could not delete old news image:", err);
                });
            }
            article.featuredImage = `/uploads/images/${req.file.filename}`;
        }

        await article.save();
        res.redirect('/admin/news');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating article');
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (article && article.featuredImage && article.featuredImage !== '/images/default-news.jpg') {
            const fullFilePath = path.join(__dirname, '..', 'public', article.featuredImage);
            fs.unlink(fullFilePath, err => {
                if (err) console.error("Error deleting news image file:", err);
            });
        }
        await News.findByIdAndDelete(req.params.id);
        res.redirect('/admin/news');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting article');
    }
};


// --- Testimonial Management ---
exports.getTestimonialsAdmin = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ displayOrder: 1 });
        res.render('admin/manage-testimonials', { title: 'Manage Testimonials', testimonials });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
exports.getAddTestimonialForm = (req, res) => {
    res.render('admin/edit-testimonial', { title: 'Add New Testimonial', testimonial: {} });
};
exports.createTestimonial = async (req, res) => {
    try {
        await Testimonial.create(req.body);
        res.redirect('/admin/testimonials');
    } catch (err) {
        res.status(500).send('Error creating testimonial.');
    }
};
exports.getEditTestimonialForm = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.redirect('/admin/testimonials');
        }
        res.render('admin/edit-testimonial', { title: `Edit Testimonial`, testimonial });
    } catch (err) {
        res.redirect('/admin/testimonials');
    }
};
exports.updateTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/testimonials');
    } catch (err) {
        res.status(500).send('Error updating testimonial.');
    }
};
exports.deleteTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.redirect('/admin/testimonials');
    } catch (err) {
        res.status(500).send('Error deleting testimonial.');
    }
};


// --- User Management ---
exports.getUsersAdmin = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } });
        res.render('admin/manage-users', {
            title: 'Manage Users',
            users: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.getAddUserForm = (req, res) => {
    res.render('admin/edit-user', { title: 'Add New User', userToEdit: {} });
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        await User.create({ username, password, role });
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating user. Username might already be taken.");
    }
};

exports.getEditUserForm = async (req, res) => {
    try {
        const userToEdit = await User.findById(req.params.id);
        if (!userToEdit) {
            return res.redirect('/admin/users');
        }
        res.render('admin/edit-user', { title: `Edit User: ${userToEdit.username}`, userToEdit });
    } catch (err) {
        res.redirect('/admin/users');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userToEdit = await User.findById(req.params.id);
        if (!userToEdit) {
            return res.status(404).send('User not found');
        }

        userToEdit.username = req.body.username;
        userToEdit.role = req.body.role;

        if (req.body.password) {
            userToEdit.password = req.body.password;
        }

        await userToEdit.save();
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user.');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).send("You cannot delete your own account.");
        }

        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            return res.redirect('/admin/users');
        }

        if (userToDelete.isProtected) {
            return res.status(403).send("This master user is protected and cannot be deleted.");
        }

        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user.');
    }
};

// --- Conservancy Page Management ---
exports.getConservanciesAdmin = async (req, res) => {
    try {
        const conservancies = await ConservancyPage.find().sort({ name: 1 });
        res.render('admin/manage-conservancies', { title: 'Manage Conservancies', conservancies });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

exports.getEditConservancyForm = async (req, res) => {
    try {
        const conservancy = await ConservancyPage.findById(req.params.id);
        if (!conservancy) {
            return res.redirect('/admin/conservancies');
        }
        res.render('admin/edit-conservancy', { title: `Edit: ${conservancy.name}`, conservancy });
    } catch (err) {
        res.redirect('/admin/conservancies');
    }
};

exports.updateConservancy = async (req, res) => {
    try {
        const conservancy = await ConservancyPage.findById(req.params.id);
        if (!conservancy) {
            return res.status(404).send('Conservancy not found');
        }

        conservancy.mainContent = req.body.mainContent;
        conservancy.vision = req.body.vision;
        conservancy.mission = req.body.mission;
        conservancy.achievements = req.body.achievements.filter(ach => ach.trim() !== '');

        if (req.files && req.files.heroImage) {
            const file = req.files.heroImage[0];
            if (conservancy.heroImage && !conservancy.heroImage.includes('default')) {
                const oldPath = path.join(__dirname, '..', 'public', conservancy.heroImage);
                fs.unlink(oldPath, err => { if (err) console.error(err); });
            }
            conservancy.heroImage = `/uploads/images/${file.filename}`;
        }

        if (req.files && req.files.galleryImages) {
            const files = req.files.galleryImages;
            for (const file of files) {
                conservancy.gallery.push({
                    url: `/uploads/images/${file.filename}`,
                    cloudinaryId: file.filename // Re-using field for local filename tracking
                });
            }
        }

        await conservancy.save();
        res.redirect(`/admin/conservancies/edit/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating conservancy page.');
    }
};

exports.deleteConservancyGalleryImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;
        const conservancy = await ConservancyPage.findById(id);
        if (!conservancy) {
            return res.status(404).send('Conservancy not found');
        }

        const image = conservancy.gallery.id(imageId);
        if (!image) {
            return res.status(404).send('Image not found');
        }
        
        const imagePath = path.join(__dirname, '..', 'public', image.url);
        fs.unlink(imagePath, err => { if(err) console.error("Error deleting gallery image file:", err); });
        
        image.remove();
        
        await conservancy.save();
        res.redirect(`/admin/conservancies/edit/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting gallery image.');
    }
};

// --- Gallery Management ---
exports.getGalleryAdmin = async (req, res) => {
    try {
        const mediaItems = await Gallery.find().sort({ createdAt: -1 });
        res.render('admin/manage-gallery', {
            title: 'Manage Gallery',
            mediaItems: mediaItems
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};
exports.uploadGalleryMedia = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }

        const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
        
        const newMedia = new Gallery({
            title,
            description,
            filePath: `/uploads/${fileType}s/${req.file.filename}`,
            fileType
        });
        await newMedia.save();
        res.redirect('/admin/gallery');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error uploading media.");
    }
};
exports.getEditGalleryItemForm = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) {
            return res.redirect('/admin/gallery');
        }
        res.render('admin/edit-gallery-item', { title: 'Edit Gallery Item', item });
    } catch (err) {
        res.redirect('/admin/gallery');
    }
};
exports.updateGalleryItem = async (req, res) => {
    try {
        const { title, description } = req.body;
        await Gallery.findByIdAndUpdate(req.params.id, { title, description });
        res.redirect('/admin/gallery');
    } catch (err) {
        res.status(500).send('Error updating gallery item.');
    }
};
exports.deleteGalleryMedia = async (req, res) => {
    try {
        const mediaItem = await Gallery.findById(req.params.id);
        if (!mediaItem) {
            return res.redirect('/admin/gallery');
        }
        const fullFilePath = path.join(__dirname, '..', 'public', mediaItem.filePath);
        fs.unlink(fullFilePath, (err) => {
            if (err) console.error("Failed to delete file from server:", err);
        });
        await Gallery.findByIdAndDelete(req.params.id);
        res.redirect('/admin/gallery');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting media.");
    }
};

// --- Resource/Document Management ---
exports.getResourcesAdmin = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.render('admin/manage-resources', {
            title: 'Manage Resources',
            documents: documents
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};
exports.uploadResource = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }
        const newDocument = new Document({
            title, description, category,
            filePath: `/uploads/documents/${req.file.filename}`
        });
        await newDocument.save();
        res.redirect('/admin/resources');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error uploading resource.");
    }
};
exports.getEditResourceForm = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.redirect('/admin/resources');
        }
        res.render('admin/edit-resource', { title: 'Edit Resource', doc });
    } catch (err) {
        res.redirect('/admin/resources');
    }
};
exports.updateResource = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        await Document.findByIdAndUpdate(req.params.id, { title, description, category });
        res.redirect('/admin/resources');
    } catch (err) {
        res.status(500).send('Error updating resource.');
    }
};
exports.deleteResource = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.redirect('/admin/resources');
        }
        const fullFilePath = path.join(__dirname, '..', 'public', doc.filePath);
        fs.unlink(fullFilePath, (err) => {
            if (err) console.error("Failed to delete file:", err);
        });
        await Document.findByIdAndDelete(req.params.id);
        res.redirect('/admin/resources');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting resource.");
    }
};

// --- Youth Initiative Management ---
exports.getYouthAdmin = async (req, res) => {
    try {
        const initiatives = await YouthInitiative.find().sort({ createdAt: -1 });
        res.render('admin/manage-youth', { title: 'Manage Youth Initiatives', initiatives });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};
exports.getAddYouthForm = (req, res) => {
    res.render('admin/edit-youth', { title: 'Add New Youth Initiative', initiative: {} });
};
exports.createYouthInitiative = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const newInitiative = new YouthInitiative({
            title,
            description,
            status,
            slug: slugify(title, { lower: true, strict: true }),
            coverImage: req.file ? `/uploads/images/${req.file.filename}` : '/images/default-youth.jpg'
        });
        await newInitiative.save();
        res.redirect('/admin/youth');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating youth initiative");
    }
};
exports.getEditYouthForm = async (req, res) => {
    try {
        const initiative = await YouthInitiative.findById(req.params.id);
        if (!initiative) {
            return res.redirect('/admin/youth');
        }
        res.render('admin/edit-youth', { title: `Edit Initiative: ${initiative.title}`, initiative });
    } catch (err) {
        res.redirect('/admin/youth');
    }
};
exports.updateYouthInitiative = async (req, res) => {
    try {
        const initiative = await YouthInitiative.findById(req.params.id);
        if (!initiative) {
            return res.status(404).send('Initiative not found');
        }

        initiative.title = req.body.title;
        initiative.description = req.body.description;
        initiative.status = req.body.status;
        initiative.slug = slugify(req.body.title, { lower: true, strict: true });

        if (req.file) {
            if (initiative.coverImage && initiative.coverImage !== '/images/default-youth.jpg') {
                const oldPath = path.join(__dirname, '..', 'public', initiative.coverImage);
                fs.unlink(oldPath, err => { if (err) console.error(err); });
            }
            initiative.coverImage = `/uploads/images/${req.file.filename}`;
        }

        await initiative.save();
        res.redirect('/admin/youth');
    } catch (err) {
        res.status(500).send('Error updating initiative.');
    }
};
exports.deleteYouthInitiative = async (req, res) => {
    try {
        const initiative = await YouthInitiative.findById(req.params.id);
        if (initiative && initiative.coverImage !== '/images/default-youth.jpg') {
            const fullFilePath = path.join(__dirname, '..', 'public', initiative.coverImage);
            fs.unlink(fullFilePath, err => {
                if (err) console.error("Error deleting initiative image file:", err);
            });
        }
        await YouthInitiative.findByIdAndDelete(req.params.id);
        res.redirect('/admin/youth');
    } catch (err) {
        res.status(500).send('Error deleting initiative.');
    }
};

// --- Natural Resource Management ---
exports.getNaturalResourcesAdmin = async (req, res) => {
    try {
        const resources = await NaturalResource.find().sort({ createdAt: -1 });
        res.render('admin/manage-natural-resources', { title: 'Manage Natural Resources', resources });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.getAddNaturalResourceForm = (req, res) => {
    res.render('admin/edit-natural-resource', { title: 'Add New Natural Resource', resource: {} });
};

exports.createNaturalResource = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newResource = new NaturalResource({
            name,
            description,
            coverImage: req.file ? `/uploads/images/${req.file.filename}` : '/images/default-resource.jpg'
        });
        await newResource.save();
        res.redirect('/admin/natural-resources');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating natural resource");
    }
};

exports.getEditNaturalResourceForm = async (req, res) => {
    try {
        const resource = await NaturalResource.findById(req.params.id);
        if (!resource) {
            return res.redirect('/admin/natural-resources');
        }
        res.render('admin/edit-natural-resource', { title: `Edit Resource: ${resource.name}`, resource });
    } catch (err) {
        res.redirect('/admin/natural-resources');
    }
};

exports.updateNaturalResource = async (req, res) => {
    try {
        const resource = await NaturalResource.findById(req.params.id);
        if (!resource) {
            return res.status(404).send('Resource not found');
        }

        resource.name = req.body.name;
        resource.description = req.body.description;

        if (req.file) {
            if (resource.coverImage && resource.coverImage !== '/images/default-resource.jpg') {
                const oldPath = path.join(__dirname, '..', 'public', resource.coverImage);
                fs.unlink(oldPath, err => { if (err) console.error(err); });
            }
            resource.coverImage = `/uploads/images/${req.file.filename}`;
        }

        await resource.save();
        res.redirect('/admin/natural-resources');
    } catch (err) {
        res.status(500).send('Error updating resource.');
    }
};

exports.deleteNaturalResource = async (req, res) => {
    try {
        const resource = await NaturalResource.findById(req.params.id);
        if (resource && resource.coverImage !== '/images/default-resource.jpg') {
            const fullFilePath = path.join(__dirname, '..', 'public', resource.coverImage);
            fs.unlink(fullFilePath, err => {
                if (err) console.error("Error deleting resource image file:", err);
            });
        }
        await NaturalResource.findByIdAndDelete(req.params.id);
        res.redirect('/admin/natural-resources');
    } catch (err) {
        res.status(500).send('Error deleting resource.');
    }
};

// --- Team Management ---
exports.getTeamAdmin = async (req, res) => {
    try {
        const teamMembers = await TeamMember.find().sort({ displayOrder: 1 });
        res.render('admin/manage-team', { title: 'Manage Team', teamMembers });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
exports.getAddTeamMemberForm = (req, res) => {
    res.render('admin/edit-team', { title: 'Add Team Member', member: {} });
};
exports.createTeamMember = async (req, res) => {
    try {
        const { name, title, displayOrder } = req.body;
        const newMember = new TeamMember({
            name,
            title,
            displayOrder,
            photo: req.file ? `/uploads/images/${req.file.filename}` : '/images/default-avatar.png'
        });
        await newMember.save();
        res.redirect('/admin/team');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating team member");
    }
};
exports.getEditTeamMemberForm = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.redirect('/admin/team');
        }
        res.render('admin/edit-team', { title: `Edit Member: ${member.name}`, member });
    } catch (err) {
        res.redirect('/admin/team');
    }
};
exports.updateTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).send('Team member not found');
        }

        member.name = req.body.name;
        member.title = req.body.title;
        member.displayOrder = req.body.displayOrder;

        if (req.file) {
            if (member.photo && member.photo !== '/images/default-avatar.png') {
                const oldPath = path.join(__dirname, '..', 'public', member.photo);
                fs.unlink(oldPath, err => {
                    if (err) console.error("Could not delete old member photo:", err);
                });
            }
            member.photo = `/uploads/images/${req.file.filename}`;
        }

        await member.save();
        res.redirect('/admin/team');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating team member');
    }
};
exports.deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (member && member.photo && member.photo !== '/images/default-avatar.png') {
            const fullFilePath = path.join(__dirname, '..', 'public', member.photo);
            fs.unlink(fullFilePath, err => {
                if (err) console.error("Error deleting member photo file:", err);
            });
        }
        await TeamMember.findByIdAndDelete(req.params.id);
        res.redirect('/admin/team');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting team member');
    }
};

// --- Partner Management ---
exports.getPartnersAdmin = async (req, res) => {
    try {
        const partners = await Partner.find().sort({ displayOrder: 1 });
        res.render('admin/manage-partners', { title: 'Manage Partners', partners });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
exports.getAddPartnerForm = (req, res) => {
    res.render('admin/edit-partner', { title: 'Add New Partner', partner: {} });
};
exports.createPartner = async (req, res) => {
    try {
        const { name, websiteUrl, displayOrder } = req.body;
        if (!req.file) {
            return res.status(400).send("Partner logo is required.");
        }
        const newPartner = new Partner({
            name,
            websiteUrl,
            displayOrder,
            logo: `/uploads/images/${req.file.filename}`
        });
        await newPartner.save();
        res.redirect('/admin/partners');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating partner");
    }
};
exports.getEditPartnerForm = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) {
            return res.redirect('/admin/partners');
        }
        res.render('admin/edit-partner', { title: `Edit Partner: ${partner.name}`, partner });
    } catch (err) {
        res.redirect('/admin/partners');
    }
};
exports.updatePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) {
            return res.status(404).send('Partner not found');
        }
        partner.name = req.body.name;
        partner.websiteUrl = req.body.websiteUrl;
        partner.displayOrder = req.body.displayOrder;

        if (req.file) {
            if (partner.logo) {
                const oldPath = path.join(__dirname, '..', 'public', partner.logo);
                fs.unlink(oldPath, err => {
                    if (err) console.error("Could not delete old partner logo:", err);
                });
            }
            partner.logo = `/uploads/images/${req.file.filename}`;
        }

        await partner.save();
        res.redirect('/admin/partners');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating partner');
    }
};
exports.deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (partner && partner.logo) {
            const fullFilePath = path.join(__dirname, '..', 'public', partner.logo);
            fs.unlink(fullFilePath, err => {
                if (err) console.error("Error deleting partner logo file:", err);
            });
        }
        await Partner.findByIdAndDelete(req.params.id);
        res.redirect('/admin/partners');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting partner');
    }
};

// --- Job Management ---
exports.getJobsAdmin = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.render('admin/manage-jobs', { title: 'Manage Jobs', jobs });
    } catch(err) {
        res.status(500).send('Server Error');
    }
};
exports.getAddJobForm = (req, res) => {
    res.render('admin/edit-job', { title: 'Add New Job', job: {} });
};
exports.createJob = async (req, res) => {
    try {
        await Job.create(req.body);
        res.redirect('/admin/jobs');
    } catch(err) {
        res.status(500).send('Error creating job');
    }
};
exports.getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        const applications = await Application.find({ job: req.params.jobId }).sort({ createdAt: -1 });
        res.render('admin/view-applications', { title: `Apps for ${job.title}`, applications, job });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
exports.downloadCV = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).send('Application not found');
        
        const filePath = path.join(__dirname, '..', application.cvPath);
        res.download(filePath);
    } catch(err) {
        res.status(500).send('Could not download file');
    }
};