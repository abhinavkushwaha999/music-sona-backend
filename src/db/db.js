const mongoose = require("mongoose");

async function connectDB() {

    try{

        await mongoose.connect(process.env.MONGO_URI)

        console.log("Database is Connected Successfully");

    }
    catch (error) {
        console.log('Database Connection Error:',error);
    }
}

module.exports = connectDB;