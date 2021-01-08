const osmosis = require('osmosis');

function getEssentialSkills() {
    const url = 'https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities/13586';
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
                console.log(data);
            })
            .debug(console.log)
            .error((err) => console.log(err))
            .done(() => resolve(text));
    });
}

const handler = async ()=>{
    const result = getEssentialSkills();
    console.log(result);
};

handler();


