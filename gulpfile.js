"use strict";

let gulp = require("gulp"),
	sass = require("gulp-sass"),
	uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
	cleanCSS = require("gulp-clean-css"),
	sourcemaps = require("gulp-sourcemaps"),
	babel = require("gulp-babel");

let browserSync = require('browser-sync').create();
var config = require('./.gulpconfig.json');

const paths = {
	source: {
		scripts: "assets/src/scripts/",
		sass: "assets/src/styles/"
	},
	destination: {
		scripts: "assets/dist/scripts/",
		css: "assets/dist/styles/"
	}
};

gulp.task("sass", function() {
	return gulp
	.src(paths.source.sass + '**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on("error", sass.logError))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(paths.destination.css))
	.pipe(browserSync.stream({ match: '**/*.css' }))
	;
});

gulp.task("cssmin", function() {
	return gulp
	.src(paths.destination.css + 'main.css')
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(rename({ suffix: ".min" }))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(paths.destination.css))
	.pipe(browserSync.stream({ match: '**/*.css' }))
});

gulp.task("watch", function() {

	browserSync.init({
		proxy: {
			target: config.localhostURL
		}
	});
	gulp.watch(paths.source.sass + "**/*.scss", gulp.series("sass"));
	gulp.watch(paths.source.scripts + "**/*.js", gulp.series("minifyScripts"));
	gulp.watch("**/*.php").on('change', browserSync.reload);
	gulp.watch(paths.destination.css + 'main.css', gulp.series("cssmin"));
});

gulp.task("moveScripts", function() {
	return gulp
	.src([
		paths.source.scripts + "**/*.js",
	])
	.pipe(babel({
		presets: ['@babel/preset-env']
	}))
	.pipe(uglify())
	.pipe(gulp.dest(paths.destination.scripts));
});

gulp.task("minifyScripts", function() {

	return gulp
	.src([
		paths.destination.scripts + "**/*.js",
	])
	.pipe(babel({
		presets: ['@babel/preset-env']
	}))
	.pipe(uglify())
	.pipe(gulp.dest(paths.destination.scripts));
});

gulp.task("default", 
	gulp.series("sass",
		gulp.parallel(
			"moveScripts",
			"minifyScripts",
			"cssmin"
		),
		"watch"	
	)
);
