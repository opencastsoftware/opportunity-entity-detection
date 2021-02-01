
const graphUtils = require('./helpers/graphUtils');
const essentialSkillsModule = require('./helpers/getEssentialSkills');
const niceToHaveSkillsModule = require('./helpers/getNiceToHaveSkills');
const entitiesModule = require('./helpers/getEntities');
const datesModules = require('./helpers/getOpportunityDates');
const neo4jUtils = require('./helpers/neo4jUtils')

async function handler(event) {
    const baseUrl = 'https://www.digitalmarketplace.service.gov.uk';

    try {
        await Promise.allSettled(event.Records.map(async (record) => {
            const url = baseUrl + record.messageAttributes.Link.stringValue;
            const {
                Organisation: { stringValue: organisation },
                Location: { stringValue: location },
                Title: { stringValue: title },
                Type: { stringValue: type },
                ID: { stringValue: id }
            } = record.messageAttributes;

            console.log('getting opportunity dates');
            const { publishedDate, questionsDeadlineDate, closingDate } = await datesModules.getDates(url);

            console.log('creating organisation, location and opportunity vertex');


            await neo4jUtils.createOrganisation(organisation);
            await neo4jUtils.createLocation(location);
            await neo4jUtils.createOpportunity({
                id,
                title,
                type,
                publishedDate,
                questionsDeadlineDate,
                closingDate
            });

            console.log('creating opportunity > organisation relationship');
            await neo4jUtils.createAdvertisesEdge(organisation, id);

            console.log('creating opportunity > location edge')
            await neo4jUtils.createIsInEdge(id, location);

            const eSkills = await essentialSkillsModule.getEssentialSkills(url);
            console.log(eSkills);
            const { Entities: eSkillEntities } = await entitiesModule.getEntities(eSkills.text);

            console.log(eSkillEntities);

            // only interested in TITLE entities
            const keyEssentialEntities = eSkillEntities.filter(entity => entity.Type === 'TITLE');
            if (keyEssentialEntities.length) {
                console.log('Adding key essential entities', keyEssentialEntities);
                await Promise.all(keyEssentialEntities.map(async ({ Text: entityName }) => {
                    await neo4jUtils.createEntity(entityName);
                    await neo4jUtils.createEssentialEdge(entityName, id);
                }));
            }


            const niceSkills = await niceToHaveSkillsModule.getNiceToHaveSkills(url);
            console.log(niceSkills);
            const { Entities: niceToHaveSkillEntities } = await entitiesModule.getEntities(niceSkills.text);

            console.log(niceToHaveSkillEntities);
            // only interested in TITLE entities
            const keyNiceToHaveEntities = niceToHaveSkillEntities.filter(entity => entity.Type === 'TITLE');
            if (keyNiceToHaveEntities.length) {
                console.log('Adding key NiceToHave entities', keyNiceToHaveEntities);
                await Promise.all(keyNiceToHaveEntities.map(async ({ Text: entityName }) => {
                    await neo4jUtils.createEntity(entityName);
                    await neo4jUtils.createOptionalEdge(entityName, id)
                }));
            };

        }));

        console.log("OUTTA LOOP");
        return {
            statusCode: 201,
            body: JSON.stringify("Proccessed the new opportunities!"),
        };
    } catch (e) {
        console.log(e)
        return {
            statusCode: 500,
            body: JSON.stringify("Something went wrong!"),
        };
    }


}

const someRecords = {
    "Records": [
        {
            "messageId": "aef4f313-ee56-4acc-aeab-6025c4796470",
            "receiptHandle": "AQEBkTBwdnjSxWWHtci89o2CElBf2Kzp1drkOBC8nv6JR6aBjxppaLB51d3ZeYrzvnAckFlz5x+/qAbEoY+1/5I+QUZF46Sl3pZid/loRb/MNJrAVzWxhC8g0hPP++rok0qoQfEQ/t6I+aa0X1dRKkq+yntf1dKWWvKpEjhDW7GnYNVj5YMIO1L9M0foEp2HS4qn9N/T4UcGfLxfr1S6slRIxybc6Mz4mkRNii21ymEfkh3LaA2KBGFHTzi1VGCFKKXIpZnW/twpR7ma5B90K2zXJqv2jnh10bkC72tCwKYkZk125o4Bt0Sbh3ITrO1MGP4rB6VDVRx3iRvKPaR25Tq7gd3Tjs938JLffwQVfH9RnDOawTEa02BbOtU9rxXYrzLDMef4p+LdHw3f9It071opcQ==",
            "body": "User Research Capability - North West",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1610456853814",
                "SenderId": "AROA3PVFFJZWZLBI5QQUC:findNewDigiMarketOpportunities",
                "ApproximateFirstReceiveTimestamp": "1610456863814"
            },
            "messageAttributes": {
                "Type": {
                    "stringValue": "Digital outcomes",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "Organisation": {
                    "stringValue": "Department for Education",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "Title": {
                    "stringValue": "User Research Capability - North West",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "ID": {
                    "stringValue": "13979",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "Number"
                },
                "Link": {
                    "stringValue": "/digital-outcomes-and-specialists/opportunities/13979",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "Location": {
                    "stringValue": "North West England",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                }
            },
            "md5OfMessageAttributes": "931268682e21b44a0e631daebc2d2170",
            "md5OfBody": "e546116f7fbbdb52e1ab7107b99c2f4a",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:eu-west-2:789546618477:NewOpportunities",
            "awsRegion": "eu-west-2"
        }
    ]
}

//handler(someRecords);

module.exports = {
    handler
};
