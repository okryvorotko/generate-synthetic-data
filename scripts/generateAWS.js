const fs = require('fs');
const { addPadding, randInt, compressFile, isValidJSONFile } = require('../helpers/utils');
const filename = '/Users/alexanderkrivorotko/Downloads/generated-data/aws/AWS-online-5-mil-data';
let fileStream;
let yearMonthFileName;

function writeData(data, isStreamOpened, cb) {
	if (isStreamOpened) {
		if (!fileStream.write(data)) {
			fileStream.once('drain', cb);
		} else {
			process.nextTick(cb);
		}
	}
}

async function generateAWSData(maxNumEvents) {
	let event = 1;
	for (let year = 2023; year > 1000; year--) {
		for (let month = 1; month <= 12; month++) {
			yearMonthFileName = `${filename}-${year}-${addPadding(month)}.json`;
			fileStream = fs.createWriteStream(yearMonthFileName);
			let isStreamOpened = true;
			await new Promise((resolve) => writeData('{"Records":[', isStreamOpened, resolve));
			for (let day = 1; day < 28; day++) {
				for (let hour = 9; hour < 18; hour++) {
					for (let min = 0; min < 59; min++) {
						const user = randInt(0, 15, true);
						const device = randInt(0, 5, true);
						const data = `{"eventVersion":"1.08","userIdentity":{"type":"AssumedRole","principalId":"AROAU37CNSUYSUSBZ6K2L:i-07b5e96ee6f17fb${user}","arn":"arn:aws:sts::334945424689:assumed-role/NodeInstanceRole/i-07b5e96ee6f17fb92","accountId":"3349454246${user}","accessKeyId":"ASIAI5MMT3XT7YIVCNXQ","sessionContext":{"sessionIssuer":{"type":"Role","principalId":"AROAU37CNSUYSUSBZ6K${randInt(1, 99, true)}","arn":"arn:aws:iam::334945424689:role/NodeInstanceRole","accountId":"3349454246${user}","userName":"NodeInstanceRole${user}"},"webIdFederationData":{},"attributes":{"creationDate":"${year}-${addPadding(month)}-${addPadding(day)}T${addPadding(hour)}:${addPadding(min)}:00Z","mfaAuthenticated":"false"},"ec2RoleDelivery":"2.0"},"invokedBy":"AWSInternal"},"eventTime":"2023-02-${addPadding(day)}T${addPadding(hour)}:${addPadding(min)}:00Z","eventSource":"ecr.amazonaws.com","eventName":"BatchGetImage${device}","awsRegion":"us-east-2","sourceIPAddress":"AWSInternal","userAgent":"AWSInternal","requestParameters":{"registryId":"602401143452","repositoryName":"eks/pause","imageIds":[{"imageDigest":"sha256:1cb4ab85a3480446f9243178395e6bee7350f0d71296daeb6a9fdd221e23aea6"}],"acceptedMediaTypes":["application/vnd.docker.distribution.manifest.v1+prettyjws","application/json","application/vnd.oci.image.manifest.v1+json","application/vnd.docker.distribution.manifest.v2+json","application/vnd.docker.distribution.manifest.list.v2+json","application/vnd.oci.image.index.v1+json"]},"responseElements":null,"requestID":"fccccbda-5b64-4680-a1e0-cc6d96d74f8f","eventID":"2a14ec6d-7fd8-40b2-a203-84f7499d0fd4","readOnly":true,"resources":[{"accountId":"602401143452","ARN":"arn:aws:ecr:us-east-2:602401143452:repository/eks/pause"}],"eventType":"AwsApiCall","managementEvent":true,"recipientAccountId":"334945424689","sharedEventID":"92c913ac-1bc1-4e17-9d99-f08a2567c20f","eventCategory":"Management"},`;
						event++;
						if (event % 100000 === 0) console.log(`${event} events written`);
						if (event === maxNumEvents) {
							await new Promise((resolve) => writeData(data.slice(0, -1), isStreamOpened, resolve));
							await new Promise((resolve) => writeData(']}', isStreamOpened, resolve));
							fileStream.end();
							isStreamOpened = false;
						}

						if (day === 27 && hour === 17 && min === 58) {
							await new Promise((resolve) => writeData(data.slice(0, -1), isStreamOpened, resolve));
							await new Promise((resolve) => writeData(']}', isStreamOpened, resolve));
							compressFile(yearMonthFileName, `${yearMonthFileName}.gz`);
							fileStream.end();
							isValidJSONFile(yearMonthFileName, (isValid, error) => {
								if (isValid) {
									console.log(`The JSON file ${yearMonthFileName} is valid!`);
								} else {
									console.log(`The JSON file ${yearMonthFileName} is invalid:`, error.message);
								}
							});
							break;
						}
						await new Promise((resolve) => writeData(data, isStreamOpened, resolve));
					}
				}
			}
		}
	}
}

generateAWSData(6000000).then(() => {}).catch((error) => {
	throw new Error(error);
});
