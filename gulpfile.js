const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const cssMinify = require("gulp-clean-css");
const jsMinify = require("gulp-terser");
const scss = require("gulp-sass")(require("sass"));
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const jshint = require("gulp-jshint");
const livereload = require("gulp-livereload");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const del = require("del");
const groupCssMediaQueries = require('gulp-group-css-media-queries')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify-es').default

let projectFolder = "dist";
let sourceFolder = "src";

let path = {
	build: {
		html: projectFolder + "/",
		css: projectFolder + "/css/",
		js: projectFolder + "/js/",
		img: projectFolder + "/img/",
		fonts: projectFolder + "/fonts/",
	},
	src: {
		html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
		css: sourceFolder + "/scss/style.scss",
		js: sourceFolder + "/js/script.js",
		img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		fonts: sourceFolder + "/fonts/*.ttf",
	},
	watch: {
		html: sourceFolder + "/**/*.html",
		css: sourceFolder + "/scss/**/*.scss",
		js: sourceFolder + "/js/**/*.js",
		img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
	},
	clean: "./" + projectFolder + "/",
};

function browserSync(params) {
	browsersync.init({
		port: 3000,
		notify: false,
		server: {
			baseDir: "./" + projectFolder + "/",
		},
	});
}

function html() {
	return gulp
		.src(path.src.html)
		.pipe(fileinclude())
		.pipe(gulp.dest(path.build.html))
		.pipe(browsersync.stream());
}

function css() {
	return gulp
		.src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded",
			})
		)
		.pipe(groupCssMediaQueries())
		.pipe(autoPrefixer({
			cascade: true,
			overrideBrowserslist: ["last 5 version"]
		}))
		// .pipe(gulp.dest(path.build.css))
		.pipe(cleanCss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(path.build.css))
		.pipe(browsersync.stream());
}

function js(){
	return gulp.src(path.src.js)
		.pipe(fileinclude())
		// .pipe(gulp.dest(path.build.js))
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(path.build.js))
		.pipe(browsersync.stream());
}

function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js],js)
}

function clean(params) {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html,js));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.js=js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

// gulp.task("styles", function () {
// 	gulp
// 		.src("./src/styles/**/*.scss")
// 		.pipe(watch())
// 		.pipe(uglify())
// 		.pipe(autoPrefixer("last 2 versions"))
// 		.pipe(concat("styles.css"))
// 		.pipe(cssMinify())
// 		.pipe(dest("./public/styles"))
// 		.pipe(livereload());
// });

// gulp.task("scripts", function () {
// 	gulp
// 		.src("./src/scripts/**/*.js")
// 		.pipe(watch())
// 		.pipe(jshint())
// 		.pipe(jshint.reporter("default"))
// 		.pipe(babel())
// 		.pipe(uglify())
// 		.pipe(concat("scripts.js"))
// 		.pipe(jsMinify())
// 		.pipe(dest("./public/"))
// 		.pipe(livereload());
// });

// gulp.task("browser-sync", function () {
// 	let files = ["./src/styles/**/*.scss", "./src/scripts/**/*.js"];

// 	browserSync.init(files, {
// 		server: {
// 			baseDir: "./src",
// 		},
// 	});
// });

// gulp.task("watch", () => {
// 	gulp.watch("./src/styles/**/*.scss", ["styles"]);
// 	gulp.watch("./src/scripts/**/*.js", ["scripts"]);
// });

// gulp.task("default", (callback) => {
// 	runSequence(["styles", "scripts"], "watch", callback);
// });

// const styles = () =>
// 	src("./src/styles/**/*.scss")
// 		.pipe(scss())
// 		.pipe(autoPrefixer("last 2 versions"))
// 		.pipe(cssMinify())
// 		.pipe(dest("./public/styles"));

// const scripts = () =>
// 	src("./src/scripts/**/*.js")
// 		.pipe(babel())
// 		.pipe(uglify())
// 		.pipe(jsMinify())
// 		.pipe(dest("./public/scripts"));

// const watchTasks = () => {
// 	watch(
// 		["./src/styles/**/*.scss", "./src/scripts/**/*.js"],
// 		series(styles, scripts)
// 	);
// };

// exports.default = series(styles, scripts, watchTasks);
