const fs = require("fs");
const { join } = require("path");
const nock = require("nock");

const essentialSkillsModule = require('../getEssentialSkills');

describe("get opportunity essential skill", () => {
    const fixture = fs
    .readFileSync(join(__dirname, "../../fixtures/test.html"), "utf-8")
    .toString();

    const url = "https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities/13237"

    nock("https://www.digitalmarketplace.service.gov.uk")
        .get("/digital-outcomes-and-specialists/opportunities/13237")
        .reply(200, fixture);

    it("should return the essential skills text", async () => {
        const skillsText = await essentialSkillsModule.getEssentialSkills(url);
        expect(skillsText.text).toEqual('Have experience of developing and establishing enterprise analytics and data innovation strategies, along with associated implementation plans;\n' +
            '          Have experience providing subject matter expertise across a wide range of internally and externally facing projects to conceptualize, design and deliver data analytics and insight projects;\n' +
            '          Demonstrable experience supporting agile delivery team’s application of data science, statistical analysis and geospatial mapping whilst seamlessly integrating into client teams;\n' +
            '          Experience of eliciting analytical requirements from a range of stakeholders, understand user needs and communicating technical/data principles, tools, techniques and requirements between non-technical business audiences and technical specialists;\n' +
            '          Practical experience identifying business problems and datasets suitable for data science and the development of new products/services, as well as prioritising, planning and executing Research & Development activities;\n' +
            '          Experience designing and deliver engaging data stories using effective data visualisation supporting analysis communication. Demonstrate a range of techniques, including dashboarding, in open source and enterprise reporting tools (e.g. PowerBI);\n' +
            '          Have experience of delivering performance analysis for digital services including use of A/B testing, Google Analytics and querying relational databases to gather data for analysis;\n' +
            '          Evidence of ability to discover and assess data for development of new products/services, including objective determination of data quality/‘fit for purpose’, understanding caveats and limitations, relationships and linkages;\n' +
            '          Delivery of geospatial analysis, visualisation and services to support digital transformation programmes (using tools like ArcGIS Enterprise / Pro / FME / QGIS);\n' +
            '          Demonstrable practical experience in delivering high value end-to-end data science projects in production environments, using modern architectures, cloud compute platforms and both open source and enterprise tools;\n' +
            '          Significant practical experience in leading edge data science and machine learning techniques applied at scale, particularly in the fields of NLP, geospatial, computer vision and knowledge graphs/mining;\n' +
            '          Practical experience of operating and maintaining end-to-end platforms for robust, low latency production data science, with associated monitoring, assurance and governance.');
    });
});
