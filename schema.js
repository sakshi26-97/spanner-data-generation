const schema = [
    `CREATE TABLE retailer (
        retailer_id     STRING(36) NOT NULL,
        title           STRING(255) NOT NULL,
        description     STRING(1024),
        website         STRING(255),
        photo_url       STRING(1024)
    ) PRIMARY KEY (retailer_id)`,

    `CREATE TABLE store (
        store_id        STRING(36) NOT NULL,
        retailer_id     STRING(36) NOT NULL,
        title           STRING(255) NOT NULL,
        location        ARRAY<FLOAT64>
    ) PRIMARY KEY (retailer_id, store_id),
    INTERLEAVE IN PARENT retailer ON DELETE CASCADE`,

    `CREATE TABLE sku (
        sku_id          STRING(36) NOT NULL,
        retailer_id     STRING(36) NOT NULL,
        title           STRING(255) NOT NULL,
        price           FLOAT64 NOT NULL,
        description     STRING(1024),
        category        STRING(255),
        sub_category    STRING(255),
        photo_url       STRING(1024),
        tags            ARRAY<STRING(255)>
    ) PRIMARY KEY (retailer_id, sku_id),
    INTERLEAVE IN PARENT retailer ON DELETE CASCADE`,

    `CREATE TABLE sku_store(
        sku_store_id  STRING(36) NOT NULL,
        sku_id          STRING(36) NOT NULL,
        store_id        STRING(36) NOT NULL,
        quantity        INT64 NOT NULL
    ) PRIMARY KEY (sku_store_id)`,

    `CREATE UNIQUE INDEX sku_store_idx_sku_id_store_id ON sku_store(sku_id, store_id)`
]

module.exports = ({$instance}) => {

    return {
        createDB : async ($databaseId) => {
            let [database, operation] = await $instance.createDatabase($databaseId, {
                schema : schema
            });
            console.log(`Waiting for operation on ${database.id} to complete...`);
            return operation.promise();
        }
    }
}