const osmosis = require("osmosis");
const AWS = require("aws-sdk");
const fetch = require('node-fetch');
AWS.config.update({ region: "eu-west-2" });
const comprehend = new AWS.Comprehend({ apiVersion: '2017-11-27' });

function getEssentialSkills(url) {
    console.log("getting skills for: " + url);
    let text;

    return new Promise((resolve) => {
        osmosis
            .get(url)
            .log(console.log)
            .find('//*[@id="main-content"]/div/div/dl[6]/div[1]/dd/ul')
            .set('text')
            .data(data => {
                text = data;
                console.log(data);
            })
            .debug(console.log)
            .error((err) => console.log(err))
            .done(() => resolve(text));
    });
}

function getNiceToHaveSkills(url) {
    let text;
    return new Promise((resolve) => {
        osmosis
            .get(url)
            .find('//*[@id="main-content"]/div/div/dl[6]/div[2]/dd/ul')
            .set('text')
            .data(data => text = data)
            .done(() => resolve(text));
    });
}

async function getEntities(text) {
    const params = {
        Text: text,
        LanguageCode: 'en'
    }
    return comprehend.detectEntities(params).promise();
}

const handler = async (event) => {

    const promises = []

    event.Records.forEach(async (record) => {
        const url = record.messageAttributes.Link;
        console.log(url);

        promises.push(new Promise(async (resolve) => {
            const eSkills = await getEssentialSkills(url);
            console.log(eSkills);
            const entities = await getEntities(eSkills.text);
            console.log(entities);
            resolve();
        }))
    });

    return Promise.all(promises);
}

const testEvent = {
    "Records": [
        {
            "messageId": "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
            "receiptHandle": "MessageReceiptHandle",
            "body": "Hello from SQS!",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1523232000000",
                "SenderId": "123456789012",
                "ApproximateFirstReceiveTimestamp": "1523232000001"
            },
            "messageAttributes": {
                "Link": "https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities/13237"
            },
            "md5OfBody": "{{{md5_of_body}}}",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:eu-west-2:123456789012:MyQueue",
            "awsRegion": "eu-west-2"
        }
    ]
}

// handler(testEvent);

module.exports = {
    getEssentialSkills,
    getNiceToHaveSkills,
    handler
}