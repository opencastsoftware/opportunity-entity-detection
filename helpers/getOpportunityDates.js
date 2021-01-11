const osmosis = require("osmosis");

module.exports.getDates = async (url) => {
    let dates = {};
    return new Promise((resolve) => {
        osmosis
            .get(url)
            .find('//*[@id="opportunity-important-dates"]')
            .set({
                publishedDate: "div[1]/dd",
                questionsDeadlineDate: "div[2]/dd",
                closingDate: "div[3]/dd"
            })
            .data(x => {
                dates.publishedDate = Date.parse(x.publishedDate.match(/\d+ \w+ \d+/));
                dates.questionsDeadlineDate = Date.parse(
                    x.questionsDeadlineDate.match(/\d+ \w+ \d+/)
                );
                dates.closingDate = Date.parse(x.closingDate.match(/\d+ \w+ \d+/));
            })
            .error((err) => console.log(err))
            .done(() => resolve(dates));
    });
};