'use strict';

const Person = require('../../model/person.model'),
    Router = require('koa-router');

module.exports = (config) => {
    const router = new Router();

    // Get
    router.get('/', function * (next) {
        const page = parseInt(this.query.page || 0),
            num = page * config.pagination.size;

        const count = yield Person.count();

        if (num < 0 || num >= count) {
            this.body = 'Out of range';
            this.status = 404;
            return;
        }

        const persons = yield Person
            .find()
            .sort({
                given_name: 1,
                family_name: 1,
            })
            .skip(num)
            .limit(config.pagination.size);

        const opts = {
            title: 'Pagination',
            persons: persons,
            min: page * config.pagination.size,
            max: Math.min(count, (page + 1) * config.pagination.size),
            count: count,
        };

        const pageMax = Math.floor(count / config.pagination.size) - 1;

        if (page > 0) {
            opts.pageMin = (page - 1).toString();
        }

        if (page < pageMax) {
            opts.pagePlus = (page + 1).toString();
        }

        yield this.render('pagination/index', opts);

        yield next;
    });

    return router.routes();
};
