const fs = require('fs');
const { addPadding, randInt } = require('../helpers/utils');

async function generateO365Data() {
	let data = 'time,appuser,location,device,annotation\n';
	for (let year = 2013; year <= 2016; year++) {
		for (let month = 1; month <= 12; month++) {
			for (let day = 1; day < 28; day++) {
				for (let hour = 1; hour <= 23; hour++) {
					for (let min = 0; min <= 59; min++) {
						data += `${year}-${addPadding(month)}-${addPadding(day)}T${addPadding(hour)}:${addPadding(min)}:00.000Z,email=bigbigbigbigbigbigbigbigbigbig@trackerdetect.com,applicationName=admin\teventType=EMAIL_SETTINGS\teventName=EMAIL_LOG_SEARCH,bigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbiglocation,bigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigbigannotation\n`;
					}
				}
			}
		}
	}



	fs.writeFileSync('generated-data/big-file3.csv', data);
}

generateO365Data().then(() => {}).catch((error) => {
	throw new Error(error);
});
