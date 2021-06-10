const { Spanner } = require('@google-cloud/spanner');
const feku = require('./feku.js');
const config = require('./config.json');

const spanner = new Spanner({
    projectId: config['PROJECT_ID'],
    keyFile: './serviceAccount.json'
});
const instance = spanner.instance(config['INSTANCE_ID']);
const database = instance.database(config['DATABASE']);

const init = async () => {
    // const dbCreationObj = require('./schema')({ $instance: instance });
    try {
        // let dbStatus = await dbCreationObj.createDB(config['DATABASE']);
        // console.log(dbStatus);
        console.log("Generating SKUs");
        let data = feku.generateData(database);
        console.log(data);
        
    } catch (error) {
        console.log(error);
    }
}

init();