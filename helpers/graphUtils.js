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

async function createOpportunity(opp){
    const { id, title, date, type } = opp;

    return g.V().has('opportunity', 'id', id).fold().coalesce(
                __.unfold(), 
                __.addV('opportunity')
                    .property('name', title)
                    .property('id', id)
                    .property('date', date)
                    .property('type', type)
             ).next();

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
    createOpportunity
}
