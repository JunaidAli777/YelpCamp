const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
const User = require('../models/user');
const users = require('../controllers/users');
const user = require('../models/user');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),users.login)

router.get('/logout', users.logout);


//router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),  (req, res) => {
//    req.flash('success', 'welcome back');
//    res.redirect('/campgrounds');    
//})

/*router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    users.login); */
    
module.exports = router;