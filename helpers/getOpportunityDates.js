const osmosis = require("osmosis");

module.exports.getDates = async (url) => {
    console.log("in get date function");
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
                console.log(x);
                dates.publishedDate = Date.parse(x.publishedDate.match(/\d+ \w+ \d+/) + " UTC");
                dates.questionsDeadlineDate = Date.parse(
                    x.questionsDeadlineDate.match(/\d+ \w+ \d+/) + " UTC"
                );
                dates.closingDate = Date.parse(x.closingDate.match(/\d+ \w+ \d+/) + " UTC");
            })
            .error((err) => console.log(err))
            .done(() => resolve(dates));
    });
};