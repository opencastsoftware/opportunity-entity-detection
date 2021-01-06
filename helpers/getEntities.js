
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });
const comprehend = new AWS.Comprehend({ apiVersion: '2017-11-27' });

module.exports.getEntities = async (text) => {
    const params = {
        Text: text,
        LanguageCode: 'en'
    }
    return comprehend.detectEntities(params).promise();
}
