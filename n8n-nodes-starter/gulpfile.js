const { src, dest } = require('gulp');

function buildIcons() {
	// Copy any icon files from nodes to dist
	// In this starter template, we're using FontAwesome icons,
	// but you can add custom SVG icons here
	return src('nodes/**/*.svg')
		.pipe(dest('dist/nodes/'));
}

exports['build:icons'] = buildIcons;
exports.default = buildIcons;
