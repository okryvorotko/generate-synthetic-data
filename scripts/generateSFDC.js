const fs = require('fs');
const { addPadding, randInt, dateToTimestamp } = require('../helpers/utils');
const filename = '/Users/alexanderkrivorotko/Downloads/generated-data/SFDC-S3-5mil-data.csv';
const header = '"EVENT_TYPE","TIMESTAMP","REQUEST_ID","ORGANIZATION_ID","USER_ID","RUN_TIME","CPU_TIME","URI","SESSION_KEY","LOGIN_KEY","CLIENT_ID","OPERATION","API_VERSION","TIMESTAMP_DERIVED","USER_ID_DERIVED","CLIENT_IP","URI_ID_DERIVED"\n';
const fileStream = fs.createWriteStream(filename);

function writeData(data, cb) {
	if (!fileStream.write(data)) {
		fileStream.once('drain', cb);
	} else {
		process.nextTick(cb);
	}
}

async function generateSFDCData(maxNumEvents) {
	await new Promise((resolve) => writeData(header, resolve));
	let event = 1;
	for (let year = 2023; year > 1000; year--) {
		for (let month = 1; month <= 12; month++) {
			for (let day = 1; day < 28; day++) {
				for (let hour = 9; hour <= 18; hour++) {
					for (let min = 0; min <= 59; min++) {
						const user = randInt(0, 15);
						const data = `"OperationType","${dateToTimestamp(`${addPadding(month)}/${addPadding(day)}/${year} ${addPadding(hour)}:${addPadding(min)}:00`)}.000","TID:118064766000007cbc","orgId${user}","userId${user}","","","","9Q/JYWqdAuUlRIW8","efoFb0ptK3Qbz+rV","SfdcInternalAPI/","insert","52.0","${year}-${addPadding(month)}-${addPadding(day)}T${addPadding(hour)}:${addPadding(min)}:00.000Z","0054L000000uoiTQAQ","77.124.80.161",""\n`;
						event++;
						if (event % 100000 === 0) console.log(`${event} events written`);
						if (event === maxNumEvents) {
							fileStream.end();
							process.exit(0);
						}
						await new Promise((resolve) => writeData(data, resolve));
					}
				}
			}
		}
	}
}

generateSFDCData(6000000).then(() => {}).catch((error) => {
	throw new Error(error);
});
