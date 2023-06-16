const fs = require('fs');
const { addPadding, randInt, dateToTimestamp } = require('../helpers/utils');
const filename = '/Users/alexanderkrivorotko/Downloads/generated-data/HOST-S3-5mil-data.csv';
const fileStream = fs.createWriteStream(filename);

function writeData(data, cb) {
	if (!fileStream.write(data)) {
		fileStream.once('drain', cb);
	} else {
		process.nextTick(cb);
	}
}

async function generateHostData(maxNumEvents) {
	let event = 1;
	for (let year = 2023; year > 1000; year--) {
		for (let month = 1; month <= 12; month++) {
			for (let day = 1; day < 28; day++) {
				for (let hour = 9; hour < 18; hour++) {
					for (let min = 0; min < 59; min++) {
						const user = randInt(0, 15);
						const loginId = randInt(0, 99999);
						const data = `{"UserName": "Comp3234${user}", "EventID": ${event}, "LogHost": "Comp323437", "LogonID": "${addPadding(loginId)}", "DomainName": "Domain001", "ParentProcessName": "svchost", "ParentProcessID": "${addPadding(loginId)}", "ProcessName": "dllhost.exe", "Time": ${dateToTimestamp(`${addPadding(month)}/${addPadding(day)}/${year} ${addPadding(hour)}:${addPadding(min)}:00`)}, "ProcessID": "${addPadding(loginId)}"}\n`;
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

generateHostData(6000000).then(() => {}).catch((error) => {
	throw new Error(error);
});
