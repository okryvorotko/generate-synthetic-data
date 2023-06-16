const fs = require('fs');
const clarinet = require('clarinet');
const filePath = '/Users/alexanderkrivorotko/Downloads/generated-data/AWS-online-5-mil-data.json';

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

isValidJSONFile(filePath, (isValid, error) => {
	if (isValid) {
		console.log(`The JSON file ${filePath} is valid!`);
	} else {
		console.log(`The JSON file ${filePath} is invalid:`, error.message);
	}
});
