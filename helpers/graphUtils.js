const gremlin = require('gremlin');

const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;

const conn = createRemoteConnection();
const g = createGraphTraversalSource(conn);
const __ = gremlin.process.statics;


async function createOrganisation(organisationName) {
    return g.V().has('organisation', 'name', organisationName).fold().coalesce(
        __.unfold(),
        __.addV('organisation').property('name', organisationName)
    ).next();
}

async function createLocation(locName) {
    return g.V().has('location', 'name', locName).fold().coalesce(
        __.unfold(),
        __.addV('location').property('name', locName)
    ).next();
}

async function createOpportunity(opp) {
    const { id, title, date, type, publishedDate, questionsDeadlineDate, closingDate } = opp;

    return g.V().has('opportunity', 'id', id).fold().coalesce(
        __.unfold(),
        __.addV('opportunity')
            .property('name', title)
            .property('id', id)
            .property('type', type)
            .property('publishedDate', publishedDate)
            .property('questionsDeadlineDate', questionsDeadlineDate)
            .property('closingDate', closingDate)
    ).next();
}

async function createEntity(entity) {
    return g.V().has('entity', 'name', entity).fold().coalesce(
        __.unfold(),
        __.addV('entity')
            .property('name', entity)
    ).next();

}

async function save() {
    return g.V().iterate();
}

async function createOpprtunityLocationEdge(opportunityV, locationV) {
    console.log(opportunityV);
    console.log(typeof opportunityV);
    //return opportunityV.addE('IS_IN').to(locationV).next();
    return g.V().addE("IS_IN").from('opportunity', 'id', opportunityV.id).to('location', 'id', locationV.id).next();
}

async function createEssentialEdge(entityV, opportunityV) {
    return entityV.addE("ESSENTIAL_TO").to(opportunityV).next();
}

async function getLocations() {
    return g.V().hasLabel('location').values('name').toList();
}

async function getOrganisations() {
    return g.V().hasLabel('organisation').values('name').toList();
}

async function getOpportunities() {
    return g.V().hasLabel('opportunity').valueMap().toList();
}

function createRemoteConnection() {
    return new DriverRemoteConnection(
        connectionString(),
        {
            mimeType: 'application/vnd.gremlin-v2.0+json',
            pingEnabled: false
        });
}

function createGraphTraversalSource(conn) {
    return traversal().withRemote(conn);
}

function connectionString() {
    return 'wss://oc-market-intel-db.cluster-cweufkjloils.eu-west-2.neptune.amazonaws.com:8182/gremlin';
}


module.exports = {
    createOrganisation,
    createLocation,
    createOpportunity,
    createEntity,
    createEssentialEdge,
    getLocations,
    getOpportunities,
    getOrganisations,
    save,
    createOpprtunityLocationEdge
}
