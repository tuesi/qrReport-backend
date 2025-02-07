const mongoose = require('mongoose');

const databaseChangeListener = (io) => {
    mongoose.connection.once("open", () => {
        console.log("🔄 Listening for database changes...");

        const tables = ["devices", "parts", "reports"];

        tables.forEach((table) => {
            const changeStream = mongoose.connection.collection(table).watch();

            changeStream.on("change", (change) => {
                console.log(`📢 Change detected in ${table}:`, change);

                //Emit changes to the frontend with the collection name
                io.emit(`update-${table}`, change);
            });
        });
    });
}

module.exports = databaseChangeListener;