const graphUtils = require('./helpers/graphUtils');
const essentialSkillsModule  = require('./helpers/getEssentialSkills');
const niceToHaveSkillsModule  = require('./helpers/getNiceToHaveSkills');
const entitiesModule = require('./helpers/getEntities');

const baseUrl = 'https://www.digitalmarketplace.service.gov.uk';


const handler = async (event) => {
    await Promise.all(event.Records.map(async (record) => {
        const url = baseUrl + record.messageAttributes.Link.stringValue;
        const {
            Organisation: {stringValue: organisation}, 
            Location: {stringValue:location},
            Title: {stringValue:title},
            Type: {stringValue: type},
            ClosingDate: {stringValue:closingDate},
            ID: {stringValue:id}
        } = record.messageAttributes;

        console.log('creating organisation, location and opportunity vertex');
        await graphUtils.createOrganisation(organisation);
        await graphUtils.createLocation(location);
        await graphUtils.createOpportunity({id, title, date: closingDate, type});

        console.log('calling get essential skills for url', url);
        const eSkills = await essentialSkillsModule.getEssentialSkills(url);
        console.log("eSkills:", eSkills);

        console.log('calling get entities for eskills:', eSkills.text);
        const { Entities: eSkillEntities } = await entitiesModule.getEntities(eSkills.text);
        console.log("Essential Entities", eSkillEntities);

        // only interested in TITLE entities
        // const keyEssentialEntities = eSkillEntities.filter(entity => entity.Type === 'TITLE');
        // console.log('keyEssentialEntities', keyEssentialEntities);  
        // if(keyEssentialEntities.length){
        //     console.log('adding skills to graphdb using gremlin');
        // }

        console.log('calling get nice to have skills for url', url);
        const niceSkills = await niceToHaveSkillsModule.getNiceToHaveSkills(url);
        console.log("niceSkills:", niceSkills);

        console.log('calling get entities for nice to haves:', niceSkills.text);
        const { Entities: niceToHaveSkillEntities } = await entitiesModule.getEntities(niceSkills.text);
        console.log("niceToHaveSkillEntities", niceToHaveSkillEntities);
      
        // only interested in TITLE entities
        // const keyNiceToHaveEntities = niceToHaveSkillEntities.filter(entity => entity.Type === 'TITLE');
        // console.log('keyNiceToHaveEntities', keyNiceToHaveEntities);  
        // if(keyNiceToHaveEntities.length){
        //     console.log('adding skills to graphdb using gremlin');
        // }

    }));

    const organisations = await graphUtils.getOrganisations();
    console.log('organisations', organisations);
    const locations = await graphUtils.getLocations();
    console.log('locations', locations);
    const opportunities = await graphUtils.getOpportunities();
    console.log('opportunities', opportunities);


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
