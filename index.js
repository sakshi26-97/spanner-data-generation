// Imports the Google Cloud client library
const { Spanner } = require('@google-cloud/spanner');
const feku = require('./feku.js');
const config = require('./config.json');

// Creates a client with given project id and service account json file to be used for auth
const spanner = new Spanner({
    projectId: config['PROJECT_ID'],
    keyFile: './serviceAccount.json'
});

// Gets a reference to a Cloud Spanner instance and database
const instance = spanner.instance(config['INSTANCE_ID']);
const database = instance.database(config['DATABASE']);

const init = async () => {
    const dbCreationObj = require('./schema')({ $instance: instance });
    try {
        // creates database
        let dbStatus = await dbCreationObj.createDB(config['DATABASE']);
        console.log(dbStatus);
        console.log("Generating SKUs");

        // generates random data using faker package for the schema defined in schema.js
        let data = feku.generateData(database);
        console.log(data);
        
    } catch (error) {
        console.log(error);
    }
}

init();