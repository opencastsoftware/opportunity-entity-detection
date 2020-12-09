const entityDetection = require("./index")
const fs = require("fs");
const { join } = require("path");
const nock = require("nock");

describe("get opportunity essential skill", () => {

    const fixture = fs
        .readFileSync(join(__dirname, "fixtures/test.html"), "utf-8")
        .toString();

    const url = "https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities/13237"

    nock("https://www.digitalmarketplace.service.gov.uk")
        .get("/digital-outcomes-and-specialists/opportunities/13237")
        .reply(200, fixture);

    it("should return the essential skills text", async () => {
        const skillsText = await entityDetection.getEssentialSkills(url);
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

describe("get opportunity nice-to-have skill", () => {

    const fixture = fs
        .readFileSync(join(__dirname, "fixtures/test.html"), "utf-8")
        .toString();

    const url = "https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities/13237"

    nock("https://www.digitalmarketplace.service.gov.uk")
        .get("/digital-outcomes-and-specialists/opportunities/13237")
        .reply(200, fixture);

    it("should return the nice-to-have skills text", async () => {
        const skillsText = await entityDetection.getNiceToHaveSkills(url);
        expect(skillsText.text).toEqual('Experience of evaluating the impact of service delivery, including approaches set out in the Magenta Book (https://www.gov.uk/government/publications/the-magenta-book);\n' +
            '          Experience creating using and interpreting data specifications and standards;\n' +
            '          Experience identifying interactions and interdependencies across data sets to enable integration of data to support new services;\n' +
            '          Ability to objectively demonstrate how previous collaborative experiences have measurably grown organisational capability through knowledge exchange;\n' +
            '          Demonstrable experience of promoting a collaborative culture and data curiosity organisations, particularly when working in partnership with customers and as part of a multi-supplier teams;\n' +
            '          Practical experience of establishing and executing processes to take analytics from exploratory/development environments into production;\n' +
            '          Practical experience developing and maintaining reproducible data science pipelines using distributed compute over multi-cloud environments;\n' +
            '          Experience deploying and operating enterprise-level, analytics platforms on premises and in-cloud;\n' +
            '          Experience of writing and presenting engaging, clear and effective technical documentation, reports, papers, scientific manuscripts and presentations (and coaching others to do the same);\n' +
            '          Experience building services to Government ethics guidance, data security best practice and using privacy preserving methodologies in analytics;\n' +
            '          Practical analytics/data engineering with (or Accredited training in):   ArcGIS/QGIS,   Python (scientific/geospatial/ML stacks) and/or Scala,   Distributed compute (Dask/Spark),   Deep Learning frameworks (Tensorflow, PyTorch etc.),   Graph databases,   Linked open data (RDF, SPARQL).');
    });

});