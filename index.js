const osmosis = require("osmosis");
const AWS = require("aws-sdk");
const fetch = require('node-fetch');
// const gremlin = require('gremlin');

AWS.config.update({ region: "eu-west-2" });
const comprehend = new AWS.Comprehend({ apiVersion: '2017-11-27' });

const baseUrl = 'https://www.digitalmarketplace.service.gov.uk';

// const traversal = gremlin.process.AnonymousTraversalSource.traversal;
// const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
// const g = traversal().withRemote(new DriverRemoteConnection('ws://localhost:8182/gremlin'));


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
    // const promises = []
    // event.Records.forEach(async (record) => {
    //     const url = baseUrl + record.messageAttributes.Link.stringValue;
    //     console.log(url);

    //     promises.push(new Promise(async (resolve) => {
    //         console.log('calling get essential skills for url', url);
    //         const eSkills = await getEssentialSkills(url);
    //         console.log("eSkills:", eSkills);
    //         console.log('calling get entities for eskills:', eSkills.text);
    //         const { Entities: entities } = await getEntities(eSkills.text);
    //         console.log("entities:", entities);

    //         // only interested in TITLE entities
    //         const keyEntities = entities.filter(entity => entity.Type === 'TITLE');
    //         console.log(keyEntities);
    //         resolve();
    //     }))

        
    // });

    // return Promise.all(promises);
    await Promise.all(event.Records.map(async (record) => {
        const url = baseUrl + record.messageAttributes.Link.stringValue;
        console.log(url);

        console.log('calling get essential skills for url', url);
        const eSkills = await getEssentialSkills(url);
        console.log("eSkills:", eSkills);

        console.log('calling get entities for eskills:', eSkills.text);
        const { Entities: entities } = await getEntities(eSkills.text);
        console.log("entities:", entities);

        // only interested in TITLE entities
        const keyEntities = entities.filter(entity => entity.Type === 'TITLE');
        console.log('keyEntities = ', keyEntities);  
        if(keyEntities.length){
            console.log('adding vertex to graphdb using gremlin');
        }
    }));

    return {
        statusCode: 201,
        body: JSON.stringify("Proccessed the new opportunities!"),
      };

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
