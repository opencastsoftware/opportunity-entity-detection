const osmosis = require("osmosis");

module.exports.getNiceToHaveSkills = (url) => {
    let text;
    return new Promise((resolve) => {
        osmosis
            .get(url)
            .find('//*[@id="main-content"]/div/div/dl[6]/div[2]/dd/ul')
            .set('text')
            .data(data => text = data)
            .done(() => resolve(text));
    });
};
