const osmosis = require('osmosis');

async function getEssentialSkills() {
    const url = 'https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities/13586';
    console.log("getting skills for: " + url);
    let text;

    return new Promise((resolve,reject) => {
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
}

const handler = async ()=>{
    try {
        const result = await getEssentialSkills();
        console.log(result);
    }
    catch(e){
        console.log(e);
    }
};

handler();


