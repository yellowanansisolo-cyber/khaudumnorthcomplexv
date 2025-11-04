require('dotenv').config();
const mongoose = require('mongoose');
const ConservancyPage = require('./models/conservancyPage.model');

const conservancies = [
    {
        name: 'George Mukoya Conservancy',
        identifier: 'gmc',
        mainContent: 'Initial placeholder content for the George Mukoya Conservancy. Describe the history, landscape, and community here.',
        vision: 'A prosperous community living in harmony with wildlife and the natural environment.',
        mission: 'To sustainably manage and conserve natural resources for the social and economic benefit of our members.',
        achievements: ['Gazetted in 2005', 'Re-introduction of key wildlife species', 'Development of community campsites'],
        heroImage: '/images/gmc-hero-default.jpg'
    },
    {
        name: 'Muduva Nyangana Conservancy',
        identifier: 'mnc',
        mainContent: 'Initial placeholder content for the Muduva Nyangana Conservancy. Describe its unique characteristics and goals.',
        vision: 'To be a leading example of community-based conservation and sustainable development in Namibia.',
        mission: 'To empower our community through the effective management of wildlife and other natural resources.',
        achievements: ['Established community game guard program', 'Successful human-wildlife conflict mitigation strategies', 'Increased tourism revenue'],
        heroImage: '/images/mnc-hero-default.jpg'
    }
];

const seedDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined.');
        process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log('DB connected for conservancy seeding...');
    
    await ConservancyPage.deleteMany({});
    console.log('Cleared existing ConservancyPage data.');

    await ConservancyPage.insertMany(conservancies);
    console.log('Successfully seeded ConservancyPage data!');
    
    mongoose.connection.close();
};

seedDB().catch(err => {
    console.error(err);
    mongoose.connection.close();
});