const fs = require("fs");
const { join } = require("path");
const nock = require("nock");

const niceSkillsModule = require('../getNiceToHaveSkills');

const fixture = fs
    .readFileSync(join(__dirname, "../../fixtures/test.html"), "utf-8")
    .toString();

const url = "https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities/13237"

nock("https://www.digitalmarketplace.service.gov.uk")
    .persist()
    .get("/digital-outcomes-and-specialists/opportunities/13237")
    .reply(200, fixture);


describe("get opportunity nice-to-have skill", () => {
    it("should return the nice-to-have skills text", async () => {
        const skillsText = await niceSkillsModule.getNiceToHaveSkills(url);
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
