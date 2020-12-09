const { get } = require("osmosis");
const osmosis = require("osmosis");
const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const comprehend = new AWS.Comprehend({ apiVersion: '2017-11-27' });

function getEssentialSkills(url) {
    let text;
    return new Promise((resolve) => {
        osmosis
            .get(url)
            .find('//*[@id="main-content"]/div/div/dl[6]/div[1]/dd/ul')
            .set('text')
            .data(data => text = data)
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
        LanguageCode: en
    }
    comprehend.detectEntities(params).promise();
}

const handler = async (event) => {
    const promises = [];
    event.Records.forEach(async (record) => {
        const url = record.messageAttributes.Link;
        console.log(url);
        const eSkills = await getEssentialSkills(url);
        console.log("ESKILLS: " + eSkills);
        promises.push(getNiceToHaveSkills(url).promise());
        promises.push(getEssentialSkills(url).promise());
    });
    Promise.allSettled(promises).then((results) =>
        results.forEach((result) => console.log("RES", result))
    );
    return {};
}

module.exports = {
    getEssentialSkills,
    getNiceToHaveSkills,
    handler
}