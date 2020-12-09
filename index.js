const { get } = require("osmosis");
const osmosis = require("osmosis");
//const AWS = require("aws-sdk");
//AWS.config.update({ region: "eu-west-2" });

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
handler = async function (event, context) {
    event.Records.forEach(record => {
        const url = record.MessageAttributes.Link;
        const eSkills = await getEssentialSkills(url);
        const nthSkills = await getNiceToHaveSkills(url);
    });
    return {};
}

module.exports = {
    getEssentialSkills,
    getNiceToHaveSkills
}