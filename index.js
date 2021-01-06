// const gremlin = require('gremlin');
const essentialSkillsModule  = require('./helpers/getEssentialSkills');
const niceToHaveSkillsModule  = require('./helpers/getNiceToHaveSkills');
const entitiesModule = require('./helpers/getEntities');

const baseUrl = 'https://www.digitalmarketplace.service.gov.uk';

// const traversal = gremlin.process.AnonymousTraversalSource.traversal;
// const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
// const g = traversal().withRemote(new DriverRemoteConnection('ws://localhost:8182/gremlin'));


const handler = async (event) => {
    await Promise.all(event.Records.map(async (record) => {
        const url = baseUrl + record.messageAttributes.Link.stringValue;
        console.log(url);

        console.log('calling get essential skills for url', url);
        const eSkills = await essentialSkillsModule.getEssentialSkills(url);
        console.log("eSkills:", eSkills);

        console.log('calling get nice to have skills for url', url);
        const niceSkills = await niceToHaveSkillsModule.getNiceToHaveSkills(url);
        console.log("niceSkills:", niceSkills);

        console.log('calling get entities for eskills:', eSkills.text);
        const { Entities: entities } = await entitiesModule.getEntities(eSkills.text);
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

// const testEvent = {
//     "Records": [
//         {
//             "messageId": "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
//             "receiptHandle": "MessageReceiptHandle",
//             "body": "Hello from SQS!",
//             "attributes": {
//                 "ApproximateReceiveCount": "1",
//                 "SentTimestamp": "1523232000000",
//                 "SenderId": "123456789012",
//                 "ApproximateFirstReceiveTimestamp": "1523232000001"
//             },
//             "messageAttributes": {
//                 "Link": "https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities/13237"
//             },
//             "md5OfBody": "{{{md5_of_body}}}",
//             "eventSource": "aws:sqs",
//             "eventSourceARN": "arn:aws:sqs:eu-west-2:123456789012:MyQueue",
//             "awsRegion": "eu-west-2"
//         }
//     ]
// }

// handler(testEvent);

module.exports = {
    handler
}
