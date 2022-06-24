const { src, dest, series, watch } = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const cssMinify = require("gulp-clean-css");
const jsMinify = require("gulp-terser");
const scss = require("gulp-sass")(require('sass'));


const styles = () =>
	src("./src/styles/**/*.scss")
		.pipe(scss())
		.pipe(autoPrefixer("last 2 versions"))
		.pipe(cssMinify())
		.pipe(dest("./public/styles"));

const scripts = () =>
	src("./src/scripts/**/*.js").pipe(jsMinify()).pipe(dest("./public/scripts"));

const watchTasks = () => {
	watch(
		["./src/styles/**/*.scss", "./src/scripts/**/*.js"],
		series(styles, scripts)
	);
};

exports.default = series(styles, scripts, watchTasks);
