const fs = require("fs");
const { join } = require("path");
const nock = require("nock");

const essentialSkillsModule = require('./helpers/getEssentialSkills');
const niceSkillsModule = require('./helpers/getNiceToHaveSkills');
const entityModule = require('./helpers/getEntities');
const entityDetection = require("./index")



// const essentialSkillSpy = jest.spyOn(essentialSkillsModule, 'getEssentialSkills');
const niceSkillSpy = jest.spyOn(niceSkillsModule, 'getNiceToHaveSkills');
const entitySpy = jest.spyOn(entityModule, 'getEntities');

jest.mock('./helpers/getEssentialSkills', ()=>{
    return{
        getEssentialSkills: jest.fn().mockReturnValue({text:'found essential skills'})
    }
});

describe('handler', ()=>{
    let event;
    beforeEach(()=>{
        niceSkillSpy.mockClear();
        event = {
            Records: [
                {
                    body: 'User Centred Design Partner',
                    messageAttributes:{
                        Link:{
                            stringValue: '/some/url'
                        }
                    }
                },
            ],
        };

        const fixture = fs
        .readFileSync(join(__dirname, "fixtures/test.html"), "utf-8")
        .toString();


        nock("https://www.digitalmarketplace.service.gov.uk")
            .get("/some/url")
            .reply(200, fixture);
    });

    it('should call getEssentialSkills with the correct url for each message', async ()=>{ 
        const result = await entityDetection.handler(event);
        expect(essentialSkillsModule.getEssentialSkills).toHaveBeenCalledWith('https://www.digitalmarketplace.service.gov.uk/some/url');
        expect(result).toEqual({"body": "\"Proccessed the new opportunities!\"", "statusCode": 201});
    })

    it('should call getNiceToHaveSkills with the correct url for each message', async ()=>{ 
        const result = await entityDetection.handler(event);
        expect(niceSkillSpy).toHaveBeenCalledWith('https://www.digitalmarketplace.service.gov.uk/some/url');
        expect(result).toEqual({"body": "\"Proccessed the new opportunities!\"", "statusCode": 201});
    })


    it('should call getEntities with the correct url for each message', async ()=>{ 
        const result = await entityDetection.handler(event);
        expect(entitySpy).toHaveBeenCalledWith('found essential skills');
        expect(result).toEqual({"body": "\"Proccessed the new opportunities!\"", "statusCode": 201});
    })
})
