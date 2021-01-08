const osmosis = require("osmosis");

module.exports.getEssentialSkills = async (url) => {
    console.log("getting skills for: " + url);
    let text;

    return new Promise((resolve, reject) => {
        osmosis
            .get(url)
            .log(console.log)
            .find('//*[@id="main-content"]/div/div/dl[6]/div[1]/dd/ul')
            .set('text')
            .data(data => {
                text = data;
            })
            .debug(console.log)
            .error((err) => reject(err))
            .done(() => resolve(text));
    });
};
