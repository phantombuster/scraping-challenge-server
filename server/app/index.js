'use strict';

const Router = require('koa-router');


module.exports = (config) => {
    const router = new Router();

    // Redirect
    router.redirect('/ch0', '/csv');
    router.redirect('/ch1', '/onepage');
    router.redirect('/ch2', '/pagination');
    router.redirect('/ch3', '/useragent');
    router.get('/ch4', function * () {
        this.cookies.set('token', 'wrong token');

        return this.redirect('/login');
    });
    router.get('/ch5', function * () {
        this.cookies.set('token', 'wrong token');

        return this.redirect('/captcha');
    });
    router.get('/ch6', function * () {
        this.cookies.set('myCookie', '');

        return this.redirect('/cookies');
    });

    // CSV
    router.use('/csv', require('./csv')(config));

    // Onepage
    router.use('/onepage', require('./onepage')(config));

    // Pagination
    router.use('/pagination', require('./pagination')(config));

    // User agent
    router.use('/useragent', require('./useragent')(config));

    // Login
    router.use('/login', require('./login')(config));

    // Captcha
    router.use('/captcha', require('./captcha')(config));

    // Cookies
    router.use('/cookies', require('./cookies')(config));

    // Get
    router.get('/', function * (next) {
        yield this.render('index', {
            title: 'Home'
        });

        yield next;
    });

    return router.routes();
};
