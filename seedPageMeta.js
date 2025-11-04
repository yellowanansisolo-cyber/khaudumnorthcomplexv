require('dotenv').config();
const mongoose = require('mongoose');
const PageMeta = require('./models/pageMeta.model');

const pages = [
    { pageIdentifier: '/about', title: 'About Us', heroImage: '/images/about-hero.jpg' },
    { pageIdentifier: '/projects', title: 'Our Projects', heroImage: '/images/projects-hero.jpg' },
    { pageIdentifier: '/news', title: 'News & Updates', heroImage: '/images/news-hero.jpg' },
    { pageIdentifier: '/gallery', title: 'Gallery', heroImage: '/images/gallery-hero.jpg' },
    { pageIdentifier: '/contact', title: 'Contact Us', heroImage: '/images/contact-hero.jpg' },
    { pageIdentifier: '/donation', title: 'Support Our Work', heroImage: '/images/donation-hero.jpg' },
    { pageIdentifier: '/resources', title: 'Resources', heroImage: '/images/resources-hero.jpg' },
    { pageIdentifier: '/youth-forum', title: 'Youth Forum', heroImage: '/images/youth-hero.jpg' },
    { pageIdentifier: '/natural-resources', title: 'Natural Resources', heroImage: '/images/natural-resources-hero.jpg' },
    { pageIdentifier: '/events', title: 'Events Calendar', heroImage: '/images/events-hero.jpg' },
    { pageIdentifier: '/jobs', title: 'Jobs & Opportunities', heroImage: '/images/jobs-hero.jpg' }
];

const seedDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB connected for seeding...');
    
    await PageMeta.deleteMany({});
    console.log('Cleared existing PageMeta data.');

    await PageMeta.insertMany(pages);
    console.log('Successfully seeded PageMeta data with correct titles!');
    
    mongoose.connection.close();
};

seedDB().catch(err => {
    console.error(err);
    mongoose.connection.close();
});