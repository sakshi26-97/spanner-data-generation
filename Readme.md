## Schema Generation Demonstration for Cloud Spanner
- This is node.js application which creates a Cloud Spanner Database, generates and inserts random data using faker package in table.
- The schema of the table is defined in [schema.js](schema.js) file

### Prerequisites
- Create a new Google Cloud Project or open an existing one
- Fetch project_id from GCP dashboard and use this as value of **PROJECT_ID** in [config.json](config.json)
- Create Spanner instance, fetch instance_id and use this as value of **INSTANCE_ID** in [config.json](config.json)
- Add any database name you want to create and use this as value of **DATABASE** key in [config.json](config.json)


### Setup

Clone this repository and run the following commands
```
npm install
```

### Running Locally
```
node index.js
```
