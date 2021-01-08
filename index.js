const osmosis = require("osmosis");

const AWS = require("aws-sdk");
const fetch = require('node-fetch');

AWS.config.update({ region: "eu-west-2" });
// const comprehend = new AWS.Comprehend({ apiVersion: '2017-11-27' });

// const graphUtils = require('./helpers/graphUtils');
// const essentialSkillsModule  = require('./helpers/getEssentialSkills');
// const niceToHaveSkillsModule  = require('./helpers/getNiceToHaveSkills');
// const entitiesModule = require('./helpers/getEntities');

const baseUrl = 'https://www.digitalmarketplace.service.gov.uk';


async function getEssentialSkills(url) {
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
            })
            .debug(console.log)
            .error((err) => console.log(err))
            .done(() => resolve(text));
    });
}

const handler = async (event) => {
    try{
        await Promise.all(event.Records.map(async (record) => {
            const url = baseUrl + record.messageAttributes.Link.stringValue;
            // const {
            //     Organisation: {stringValue: organisation}, 
            //     Location: {stringValue:location},
            //     Title: {stringValue:title},
            //     Type: {stringValue: type},
            //     ClosingDate: {stringValue:closingDate},
            //     ID: {stringValue:id}
            // } = record.messageAttributes;

            //console.log('creating organisation, location and opportunity vertex');
            // await graphUtils.createOrganisation(organisation);
            // await graphUtils.createLocation(location);
            // await graphUtils.createOpportunity({id, title, date: closingDate, type});

            const eSkills = await getEssentialSkills(url);
            console.log("eSkills:", eSkills);

            // console.log('calling get entities for eskills:', eSkills.text);
            // const { Entities: eSkillEntities } = await entitiesModule.getEntities(eSkills.text);
            // console.log("Essential Entities", eSkillEntities);

            // only interested in TITLE entities
            // const keyEssentialEntities = eSkillEntities.filter(entity => entity.Type === 'TITLE');
            // console.log('keyEssentialEntities', keyEssentialEntities);  
            // if(keyEssentialEntities.length){
            //     console.log('adding skills to graphdb using gremlin');
            // }

            // console.log('calling get nice to have skills for url', url);
            // const niceSkills = await niceToHaveSkillsModule.getNiceToHaveSkills(url);
            // console.log("niceSkills:", niceSkills);

            // console.log('calling get entities for nice to haves:', niceSkills.text);
            // const { Entities: niceToHaveSkillEntities } = await entitiesModule.getEntities(niceSkills.text);
            // console.log("niceToHaveSkillEntities", niceToHaveSkillEntities);
        
            // only interested in TITLE entities
            // const keyNiceToHaveEntities = niceToHaveSkillEntities.filter(entity => entity.Type === 'TITLE');
            // console.log('keyNiceToHaveEntities', keyNiceToHaveEntities);  
            // if(keyNiceToHaveEntities.length){
            //     console.log('adding skills to graphdb using gremlin');
            // }

        }));

        // const organisations = await graphUtils.getOrganisations();
        // console.log('organisations', organisations);
        // const locations = await graphUtils.getLocations();
        // console.log('locations', locations);
        // const opportunities = await graphUtils.getOpportunities();
        // console.log('opportunities', opportunities);
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
}
