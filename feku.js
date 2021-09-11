const faker = require('faker');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

var retailers = ['49131768-3c51-496b-8980-d463a54719b9'];
var stores = [ '93f3ade1-25f8-4656-9660-aa201a066830',
'373b071f-7f87-42e6-baf9-e022796808e1',
'42f3292a-0fb7-4c88-8c43-69e168f682b8',
'1d8caa8e-5a56-4117-8db2-6f4e6264d460',
'd0467524-3fa7-4cbd-b588-46ef2708c9b0',
'755e607d-54a7-4dc1-87b8-1e2faa5f3705',
'6614acdd-b648-40e7-a1f5-33d7637402bf',
'86f8e7ac-ec74-40c7-9e71-90d48aca218c',
'c7c1a9b7-a334-426d-b877-a88b0707e0aa',
'66a0f416-9135-487e-8e5a-732a1456e00f' ];
var skus = require('./skuList.json');

let getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}
let generateRetailers = (count, database) => {
    console.log(`Generating ${count} Retailers`);
    let availableNames = [
        "Global Fresh Market",
        "Budget Foods",
        "Dollar Pantry",
        "Food Festive",
        "Fresh Food Marketplace",
        "Rancher’s Grocery",
        "Freshmart Co-op",
        "Better Bites Deli ",
        "Jamboree Marketplace",
        "The Stocked Pantry Market",
        "Convenience Snack Paradise",
        "Quick Fare Foods",
        "Fleet Market",
        "Apples to Ziti",
        "Food to Fly",
        "Nature Cart",
        "Organic Orchard",
        "The Papaya Exotic Eats"
    ]
    let generatedRetailers = [];
    for (let i = 0; i < count; i++) {
        let retailerId = uuidv4();
        let retailerSplice = {
            retailerId: retailerId,
            title: getRandomItem(availableNames),
            description: "",
            website: faker.internet.url(),
            photoUrl: faker.image.imageUrl()
        }
        retailers.push(retailerId);
        generatedRetailers.push(retailerSplice);
    }
    console.log(generateRetailers);
    return generatedRetailers;
}

let generateStores = (count, database) => {
    console.log(`Generating ${count} Stores`);
    let dmlQuery = `INSERT store (store_id, retailer_id, title, location) VALUES`;
    let generatedStores = [];
    for (let i = 0; i < count; i++) {
        let storeId = uuidv4();
        dmlQuery += `('${storeId}', '${getRandomItem(retailers)}', 'store-00${i}', ['${faker.address.latitude()}', '${faker.address.longitude()}']),`
        let storeSplice = {
            storeId: storeId,
            retailerId: getRandomItem(retailers),
            title: `store-00${i}`,
            location: faker.address.city(),
        }
        stores.push(storeId);
        generatedStores.push(storeSplice);
    }
    console.log(dmlQuery);
    console.log(stores)
    return generatedStores;
}

let generateSkusStores = (count, database) => {
    console.log(`Generating ${count} Skus Stores`);
    let dmlQuery = `INSERT sku_store (sku_store_id, sku_id, store_id, quantity) VALUES`;
    skus.forEach(sku => {
        generatedSkusStores = [];
        for (let i = 0; i < count; i++) {
            let skusStoresId = uuidv4();
            let store = getRandomItem(stores);

            if(!generatedSkusStores.includes(store)) {
                dmlQuery += `('${skusStoresId}', '${sku}', '${store}', ${Math.floor((Math.random() * 100) + 1)}),`;
                generatedSkusStores.push(store);
            }
            let ssSplice = {
                skusStoresId: skusStoresId,
                skuId: getRandomItem(skus),
                storeId: getRandomItem(stores),
                quantity: faker.random.number()
            }
            generatedSkusStores.push(ssSplice)
        }
    })
    fs.writeFile('./skuStoreInsert.sql', dmlQuery, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The query file was saved!");
    })
    fs.writeFile('./skuList.json', JSON.stringify(skus), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The json file was saved!");
    })
    return generateSkusStores;
}

let generateSkus = (count, database) => {
    console.log(`Generating ${count} SKUS`);
    
    database.runTransaction(async (err, transaction) => {
        if (err) {
            console.error(err);
            return;
        }
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: dmlQuery,
            });

            console.log(
                `Successfully inserted ${rowCount} record into the Singers table.`
            );
            await transaction.commit();
        } catch (err) {
            console.error('ERROR:', err);
        } finally {
            // Close the database when finished.
            // database.close();
        }
    });
    let dmlQuery = `INSERT sku (sku_id, retailer_id, title, price, description, category, sub_category, photo_url, tags) VALUES`;
    for (let i = 0; i < count; i++) {
        let skuId = uuidv4();

        dmlQuery += `('${skuId}', '${getRandomItem(retailers)}', '${faker.commerce.productName()}', ${faker.commerce.price()}, '', '${faker.commerce.department()}', '${faker.commerce.department()}', '${faker.image.imageUrl()}', 
            ['${faker.random.word()}', '${faker.random.word()}', '${faker.random.word()}', '${faker.random.word()}', '${faker.random.word()}', '${faker.random.word()}']),`
        let skuSplice = {
            skuId: skuId,
            retailerId: getRandomItem(retailers),
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: "",
            category: faker.commerce.department(),
            subCategory: faker.commerce.department(),
            photoUrl: faker.image.imageUrl(),
            tags: [
                faker.random.word(),
                faker.random.word(),
                faker.random.word(),
                faker.random.word(),
                faker.random.word(),
                faker.random.word()
            ]
        }
        skus.push(skuId);
    }

    fs.writeFile('./skuInsert.sql', dmlQuery, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The query file was saved!");
    })
    fs.writeFile('./skuList.json', JSON.stringify(skus), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The json file was saved!");
    })
    console.log(dmlQuery);
    console.log(skus);
    return null;
}

let generateData = (database) => {
    return {
        retailers: generateRetailers(1, database),
        stores: generateStores(5, database),
        skus: generateSkus(500, database),
        skusStores: generateSkusStores(3, database)
    }
}
module.exports = { generateData }