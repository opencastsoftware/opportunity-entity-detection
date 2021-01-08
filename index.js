
const graphUtils = require('./helpers/graphUtils');
const essentialSkillsModule  = require('./helpers/getEssentialSkills');
const niceToHaveSkillsModule  = require('./helpers/getNiceToHaveSkills');
const entitiesModule = require('./helpers/getEntities');


async function handler(event) {
    const baseUrl = 'https://www.digitalmarketplace.service.gov.uk';

    try{
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

            const eSkills = await essentialSkillsModule.getEssentialSkills(url);
            const { Entities: eSkillEntities } = await entitiesModule.getEntities(eSkills.text);
            console.log("Essential Entities", eSkillEntities);

            // only interested in TITLE entities
            // const keyEssentialEntities = eSkillEntities.filter(entity => entity.Type === 'TITLE');
            // console.log('keyEssentialEntities', keyEssentialEntities);  
            // if(keyEssentialEntities.length){
            //     console.log('adding skills to graphdb using gremlin');
            // }

            const niceSkills = await niceToHaveSkillsModule.getNiceToHaveSkills(url);
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

    }catch(e){
        console.log(e)
    }

    return {
        statusCode: 201,
        body: JSON.stringify("Proccessed the new opportunities!"),
      };

}

module.exports = {
    handler
};
