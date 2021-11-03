import fs from 'fs';
import path from 'path';

import gulp from 'gulp';

// Load all gulp plugins automatically
// and attach them to the `plugins` object
import plugins from 'gulp-load-plugins';

import archiver from 'archiver';
import glob from 'glob';
import del from 'del';

import pkg from './package.json';

const dirs = pkg['h5bp-configs'].directories;


// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('archive:create_archive_dir', (done) => {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
    done();
});

gulp.task('archive:zip', (done) => {

    const archiveName = path.resolve(dirs.archive, `${pkg.name}_v${pkg.version}.zip`);
    const zip = archiver('zip');
    const files = glob.sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    const output = fs.createWriteStream(archiveName);

    zip.on('error', (error) => {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach( (file) => {

        const filePath = path.resolve(dirs.dist, file);

        // `zip.bulk` does not maintain the file
        // permissions, so we need to add files individually
        zip.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath).mode
        });

    });

    zip.pipe(output);
    zip.finalize();

});

gulp.task('compress', function() {
    return gulp.src(`${dirs.src}/js/*`)
        .pipe(plugins().concat('concat.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins().rename('main.js'))
        .pipe(plugins().uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', (done) => {
    del([
        dirs.archive,
        dirs.dist
    ]).then( () => {
        done();
    });
});

gulp.task('copy:index.html', () =>
    gulp.src(`${dirs.src}/index.html`)
        .pipe(plugins().replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
        .pipe(gulp.dest(dirs.dist))
);

gulp.task('copy:jquery', () =>
    gulp.src(['node_modules/jquery/dist/jquery.min.js'])
        .pipe(plugins().rename(`jquery-${pkg.devDependencies.jquery}.min.js`))
        .pipe(gulp.dest(`${dirs.dist}/js/vendor`))
);

gulp.task('copy:license', () =>
    gulp.src('LICENSE.txt')
        .pipe(gulp.dest(dirs.dist))
);

gulp.task('copy:main.css', (done) => {

    const banner = `/*! HTML5 Boilerplate v${pkg.version} | ${pkg.license.type} License | ${pkg.homepage} */\n\n`;

    gulp.src(`${dirs.src}/css/main.css`)
        .pipe(plugins().header(banner))
        .pipe(gulp.dest(`${dirs.dist}/css`));
    done()
});

gulp.task('copy:misc', () =>
    gulp.src([

        // Copy all files
        `${dirs.src}/**/*`,

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        `!${dirs.src}/js/*`,
        `!${dirs.src}/css/main.css`,
        `!${dirs.src}/index.html`

    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist))
);

gulp.task('copy:normalize', () =>
    gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(gulp.dest(`${dirs.dist}/css`))
);

gulp.task('lint:js', () =>
    gulp.src([
        `${dirs.src}/js/*.js`,
        `${dirs.test}/*.js`
    ]).pipe(plugins().jscs())
      .pipe(plugins().jshint())
      .pipe(plugins().jshint.reporter('jshint-stylish'))
      .pipe(plugins().jshint.reporter('fail'))
);

gulp.task('copy', gulp.series(
    'copy:index.html',
    'copy:jquery',
    'copy:license',
    'copy:main.css',
    'copy:misc',
    'copy:normalize',
    'compress')
);


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('build', gulp.series(
    ['clean', 'lint:js'],
    'copy')
);

gulp.task('archive', gulp.series(
        'build',
        'archive:create_archive_dir',
        'archive:zip')
);

gulp.task('default', gulp.series('build'));
