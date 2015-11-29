var gutil = require('gulp-util');

exports.paths = {
    scss: 'scss',
    server: 'server',
    src: 'server/app',
    tools: 'tools',
};


exports.errorHandler = (title) => {
    return (err) => {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());

        this.emit('end');
    };
};
