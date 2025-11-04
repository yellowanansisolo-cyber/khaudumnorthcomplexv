const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).redirect('/admin/dashboard');
};

exports.getLoginPage = (req, res) => {
    res.render('admin/login', { title: 'Admin Login', error: null });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).render('admin/login', { title: 'Admin Login', error: 'Please provide username and password' });
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).render('admin/login', { title: 'Admin Login', error: 'Incorrect username or password' });
    }

    createSendToken(user, 200, res);
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).redirect('/');
};