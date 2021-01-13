
const graphUtils = require('./helpers/graphUtils');
const essentialSkillsModule = require('./helpers/getEssentialSkills');
const niceToHaveSkillsModule = require('./helpers/getNiceToHaveSkills');
const entitiesModule = require('./helpers/getEntities');
const datesModules = require('./helpers/getOpportunityDates');

async function handler(event) {
    const baseUrl = 'https://www.digitalmarketplace.service.gov.uk';

    try {
        await Promise.all(event.Records.map(async (record) => {
            console.log(record);
            console.log(record.messageAttributes.Link);
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
            const organisationV = await graphUtils.createOrganisation(organisation);
            const locationV = await graphUtils.createLocation(location);
            const opportunityV = await graphUtils.createOpportunity({
                id,
                title,
                type,
                publishedDate,
                questionsDeadlineDate,
                closingDate
            });

            await graphUtils.createOpprtunityLocationEdge(opportunityV, locationV);

            const eSkills = await essentialSkillsModule.getEssentialSkills(url);
            const { Entities: eSkillEntities } = await entitiesModule.getEntities(eSkills.text);


            // only interested in TITLE entities
            const keyEssentialEntities = eSkillEntities.filter(entity => entity.Type === 'TITLE');
            if (keyEssentialEntities.length) {
                console.log('Adding key essential entities', keyEssentialEntities);
                await Promise.all(keyEssentialEntities.map(async ({ Text: entityName }) => {
                    // Add the entity
                    const entityV = await graphUtils.createEntity(entityName);
                    // Add the "ESSENTIAL" edge to the vertex
                    await graphUtils.createEssentialEdge(entityV, opportunityV);
                }));
            }

            const niceSkills = await niceToHaveSkillsModule.getNiceToHaveSkills(url);
            const { Entities: niceToHaveSkillEntities } = await entitiesModule.getEntities(niceSkills.text);

            // only interested in TITLE entities
            const keyNiceToHaveEntities = niceToHaveSkillEntities.filter(entity => entity.Type === 'TITLE');
            if (keyNiceToHaveEntities.length) {
                console.log('Adding key NiceToHave entities', keyNiceToHaveEntities);
                await Promise.all(keyNiceToHaveEntities.map(async ({ Text: entityName }) => {
                    await graphUtils.createEntity(entityName);
                }));
            }

        }));

        console.log('saving to neptune');
        //await graphUtils.save();

        const organisations = await graphUtils.getOrganisations();
        console.log('organisations', organisations);
        const locations = await graphUtils.getLocations();
        console.log('locations', locations);
        const opportunities = await graphUtils.getOpportunities();
        console.log('opportunities', opportunities);

        console.log('saving to neptune');
        await graphUtils.save();

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

module.exports = {
    handler
};
