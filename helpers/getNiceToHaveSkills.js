const osmosis = require("osmosis");

module.exports.getNiceToHaveSkills = async (url) => {
    let text;
    return new Promise((resolve, reject) => {
        osmosis
            .get(url)
            .find('//*[@id="main-content"]/div/div/dl[6]/div[2]/dd/ul')
            .set('text')
            .data(data => text = data)
            .error((err)=>reject(err))
            .done(() => resolve(text));
    });
};
