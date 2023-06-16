const filename = '/Users/alexanderkrivorotko/Downloads/generated-data/AWS-online-5-mil-data.json';
const { compressFile } = require('./utils');

compressFile(filename, `${filename}.gz`);
