var exports = module.exports;
var fs = require('fs');

exports.readJSON = filename => {
	var raw = fs.readFileSync(filename);
	return JSON.parse(raw);
}
