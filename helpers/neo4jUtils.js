const neo4j = require('neo4j-driver');

const uri = "bolt://ec2-3-8-148-29.eu-west-2.compute.amazonaws.com:7687";
const user = "neo4j";
const password = "neo4jpassword";
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function createOrganisation(organisationName) {
    const session = driver.session();
    const cypher = 'MERGE (a:Organisation {name: $name}) RETURN a';
    const params = { name: organisationName };
    return session.run(cypher, params).then(() => session.close());
}

async function createLocation(locationName) {
    const session = driver.session();
    const cypher = 'MERGE (a:Location {name: $name}) RETURN a';
    const params = { name: locationName };
    return session.run(cypher, params).then(() => session.close());
}

async function createOpportunity(opp) {
    const session = driver.session();
    const { id, title, type, publishedDate, questionsDeadlineDate, closingDate } = opp;
    const cypher = 'MERGE (a:Opportunity {oppId: $id, name: $title, type: $type, publishedDate: $publishedDate, questionsDeadlineDate: $questionsDeadlineDate, closingDate: $closingDate}) RETURN a';
    const params = { id: id, title: title, type: type, publishedDate: publishedDate, questionsDeadlineDate: questionsDeadlineDate, closingDate: closingDate };
    return session.run(cypher, params).then(() => session.close());
}

async function createEntity(entityName) {
    const session = driver.session();
    const cypher = 'MERGE (a:Entity {name: $name}) RETURN a';
    const params = { name: entityName };
    return session.run(cypher, params).then(() => session.close());
}

async function createIsInEdge(opportunityId, locationName) {
    const session = driver.session();
    const cypher = "MATCH (a:Opportunity{oppId:$opportunityId}),(b:Location{name:$locationName}) MERGE (a)-[r:IS_IN]->(b) RETURN r"
    const params = { opportunityId: opportunityId, locationName: locationName };
    return session.run(cypher, params).then(() => session.close());
}

async function createEssentialEdge(entityName, opportunityId) {
    const session = driver.session();
    const cypher = "MATCH (a:Entity{name:$entityName}),(b:Opportunity{oppId:$opportunityId}) MERGE (a)-[r:ESSENTIAL_TO]->(b) RETURN r"
    const params = { entityName: entityName, opportunityId: opportunityId };
    return session.run(cypher, params).then(() => session.close);
}

async function createOptionalEdge(entityName, opportunityId) {
    const session = driver.session();
    const cypher = "MATCH (a:Entity{name:$entityName}),(b:Opportunity{oppId:$opportunityId}) MERGE (a)-[r:OPTIONAL_FOR]->(b) RETURN r"
    const params = { entityName: entityName, opportunityId: opportunityId };
    return session.run(cypher, params).then(() => session.close());
}

async function createAdvertisesEdge(organisationName, opportunityId) {
    const session = driver.session();
    const cypher = "MATCH (a:Organisation{name:$organisationName}),(b:Opportunity{oppId:$opportunityId}) MERGE (a)-[r:ADVERTISES]->(b) RETURN r"
    const params = { organisationName: organisationName, opportunityId: opportunityId };
    return session.run(cypher, params).then(() => session.close());
}

module.exports = {
    createOrganisation,
    createLocation,
    createOpportunity,
    createEntity,
    createEssentialEdge,
    createIsInEdge,
    createOptionalEdge,
    createAdvertisesEdge
}