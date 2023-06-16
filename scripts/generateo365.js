const fs = require('fs');
const { addPadding, randInt, dateToTimestamp } = require('../helpers/utils');
const filename = '/Users/alexanderkrivorotko/Downloads/generated-data/O365-S3-5mil-data';
const fileStream = fs.createWriteStream(filename);

function writeData(data, cb) {
	if (!fileStream.write(data)) {
		fileStream.once('drain', cb);
	} else {
		process.nextTick(cb);
	}
}

async function generateO365Data(maxNumEvents) {
	let event = 1;
	for (let year = 2023; year > 1000; year--) {
		for (let month = 1; month <= 12; month++) {
			for (let day = 1; day < 28; day++) {
				for (let hour = 9; hour < 18; hour++) {
					for (let min = 0; min < 59; min++) {
						const user = randInt(0, 15);
						const device = randInt(0, 2);
						const data = `{"CreationTime":"${year}-${addPadding(month)}-${addPadding(day)}T${addPadding(hour)}:${addPadding(min)}:00","Id":"${event}","FieldInAppUser1":"UserValue1-${user}","FieldInAppUser2":"UserValue2-${user}","FieldInLocation1":"LocationValue1-${randInt(0, 5)}","FieldInLocation2":"LocationValue2-${randInt(0, 5)}","FieldInAnnotation1":"AnnotationValue1-${randInt(0, 5)}","FieldInAnnotation2":"AnnotationValue2-${randInt(0, 5)}","FieldInDevice1":"DeviceValue1-${device}","FieldInDevice2":"DeviceValue2-${device}","FilteringField1":"100${randInt(0, 99)}","FilteringField2":"10${randInt(0, 99)}"}\n`;
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

generateO365Data(100).then(() => {}).catch((error) => {
	throw new Error(error);
});
