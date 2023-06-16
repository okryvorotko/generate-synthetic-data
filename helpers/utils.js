const { createReadStream, createWriteStream } = require("fs");
const { createGzip } = require('zlib');
const clarinet = require('clarinet');
const fs = require('fs');

function addPadding(num, padding = 2) {
	return String(num).padStart(padding, 0);
}

/**
 * Generates random int in string format, any number between min and max
 * Supplied with padding, meaning if the number has one digit, and max number has two digits
 * and random is one digit, it will add 0 in front of it
 * Example: min = 0, max = 99, example outputs: 03, 15, 45
 * Example 2: min = 0, max = 9999, example outputs: 0003, 0315, 4545
 * Example 3: min = 0, max = 9999, padding = false, example outputs: 3, 315, 4545
 */
function randInt(min, max, padding = true) {
	min = Math.ceil(min);
	max = Math.floor(max);
	const random = Math.floor(Math.random() * (max - min + 1) + min);
	if (!padding) return String(random);
	return String(random).padStart(max.toString().length, 0);
}

/**
 * @param strDate in format 02/13/2009 23:31:30
 * @returns {number}
 */
function dateToTimestamp(strDate){
	let datum = Date.parse(strDate);
	return datum/1000;
}

function compressFile(inputPath, outputPath) {
	const readStream = createReadStream(inputPath);
	const writeStream = createWriteStream(outputPath);

	readStream
		.pipe(createGzip())
		.pipe(writeStream)
		.on('finish', () => {
			console.log(`Compression process done: ${outputPath}`);
		});
}

function sleep(ms) {
	console.log(`Sleeping for ${ms}ms...`);
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function isValidJSONFile(filePath, callback) {
	const stream = clarinet.createStream();
	const fileStream = fs.createReadStream(filePath);

	stream.on('error', (error) => {
		callback(false, error);
	});

	stream.on('end', () => {
		callback(true);
	});

	fileStream.pipe(stream);
}

module.exports = {
	randInt,
	addPadding,
	dateToTimestamp,
	compressFile,
	sleep,
	isValidJSONFile
}
