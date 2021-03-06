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

    return g.V().has('opportunity', 'oppId', id).fold().coalesce(
        __.unfold(),
        __.addV('opportunity')
            .property('name', title)
            .property('oppId', id)
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

async function createOpprtunityLocationEdge(opportunityId, locationName) {
    console.log('adding IS_IN edge: ' + opportunityId + " -> " + locationName)
    return g.V().has('opportunity', 'oppId', opportunityId).out('IS_IN').has('location', 'name', locationName).fold()
        .coalesce(
            __.unfold(),
            g.V().has('oppportunity', 'oppId', opportunityId).as('a').
                V().has('location', 'name', locationName).as('b')
                .addE('IS_IN')
                .from_('a').to('b')).next();
}

async function createEssentialEdge(entityName, opportunityId) {
    console.log('adding ESSENTIAL_TO edge: ' + entityName + " -> " + opportunityId)
    return g.V().has('entity', 'name', entityName).out('ESSENTIAL_TO').has('opportunity', 'oppId', opportunityId).fold()
        .coalesce(
            __.unfold(),
            g.V().has('entity', 'name', entityName).as('a').
                V().has('opportunity', 'oppId', opportunityId).as('b')
                .addE('ESSENTIAL_TO')
                .from_('a').to('b')).next();
}

async function createNiceToHaveEdge(entityName, opportunityId) {
    console.log('adding OPTIONAL_FOR edge: ' + entityName + " -> " + opportunityId)
    return g.V().has('entity', 'name', entityName).out('OPTIONAL_FOR').has('opportunity', 'oppId', opportunityId).fold()
        .coalesce(
            __.unfold(),
            g.V().has('entity', 'name', entityName).as('a').
                V().has('opportunity', 'oppId', opportunityId).as('b')
                .addE('OPTIONAL_FOR')
                .from_('a').to('b')).next();
}

async function createOpprtunityOrganisationEdge(opportunityId, organisation) {
    console.log('adding ADVERTISES edge: ' + opportunityId + " -> " + organisation)
    return g.V().has('organisation', 'name', organisation).out('ADVERTISES').has('opportunity', 'oppId', opportunityId).fold()
        .coalesce(
            __.unfold(),
            g.V().has('organisation', 'name', organisation).as('a').
                V().has('opportunity', 'oppId', opportunityId).as('b')
                .addE('ADVERTISES')
                .from_('a').to('b')).next();
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
    createOpprtunityLocationEdge,
    createNiceToHaveEdge,
    createOpprtunityOrganisationEdge
}
